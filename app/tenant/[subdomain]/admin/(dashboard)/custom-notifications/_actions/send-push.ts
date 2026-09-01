"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import webpush from "web-push";

// Configura VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:suporte@geekstorm.com.br",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendCustomPushNotification(
  subdomain: string,
  data: {
    title: string;
    message: string;
    recipientType: "all" | "specific";
    selectedClients: string[]; // UUIDs
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Precisamos do Service Role para buscar os push_subscriptions de todos e inserir o histórico
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenant) throw new Error("Tenant not found");

  // Busca quem vai receber
  let query = supabaseAdmin
    .from("push_subscriptions")
    .select("*")
    .eq("tenant_id", tenant.id);

  if (data.recipientType === "specific" && data.selectedClients.length > 0) {
    query = query.in("profile_id", data.selectedClients);
  }

  const { data: subscriptions, error: subsError } = await query;

  if (subsError) {
    console.error("Database error fetching subscriptions:", subsError);
    throw new Error("Failed to fetch subscriptions: " + subsError.message);
  }

  // Se não tem ninguém pra receber, grava no histórico com 0 e retorna
  if (!subscriptions || subscriptions.length === 0) {
    await supabaseAdmin.from("custom_notifications").insert({
      tenant_id: tenant.id,
      created_by: user.id,
      title: data.title,
      message: data.message,
      recipient_type: data.recipientType,
      target_clients: data.selectedClients,
      status: "SENT",
      sent_count: 0,
      failed_count: 0,
      sent_at: new Date().toISOString()
    });
    return { success: true, sent: 0, failed: 0 };
  }

  // Grava notificação no banco PENDING
  const { data: notification, error: notifError } = await supabaseAdmin
    .from("custom_notifications")
    .insert({
      tenant_id: tenant.id,
      created_by: user.id,
      title: data.title,
      message: data.message,
      recipient_type: data.recipientType,
      target_clients: data.selectedClients,
      status: "PENDING"
    })
    .select()
    .single();

  if (notifError || !notification) throw new Error("Failed to create notification record");

  const payload = JSON.stringify({
    title: data.title,
    body: data.message,
    url: `https://${subdomain}.boxsuite.com.br/` // Opcional: url pra abrir quando clicar
  });

  let successCount = 0;
  let failureCount = 0;
  const expiredEndpoints: string[] = [];

  // Dispara em paralelo para ser rápido
  const promises = subscriptions.map(async (sub) => {
    try {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      await webpush.sendNotification(pushSubscription, payload);
      successCount++;
    } catch (error: any) {
      failureCount++;
      // 410 ou 404 significa que o usuário desinstalou o navegador/limpou cookies
      if (error.statusCode === 410 || error.statusCode === 404) {
        expiredEndpoints.push(sub.endpoint);
      }
    }
  });

  await Promise.allSettled(promises);

  // Remove inscrições expiradas (banco de dados)
  if (expiredEndpoints.length > 0) {
    await supabaseAdmin
      .from("push_subscriptions")
      .delete()
      .in("endpoint", expiredEndpoints);
  }

  // Atualiza histórico
  await supabaseAdmin
    .from("custom_notifications")
    .update({
      status: failureCount === 0 ? "SENT" : successCount === 0 ? "FAILED" : "PARTIAL",
      sent_count: successCount,
      failed_count: failureCount,
      sent_at: new Date().toISOString()
    })
    .eq("id", notification.id);

  return { success: true, sent: successCount, failed: failureCount };
}
