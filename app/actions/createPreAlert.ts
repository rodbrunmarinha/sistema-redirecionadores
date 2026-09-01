"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPreAlertAction(payload: any, subdomain: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!profile) return { success: false, error: "Perfil não encontrado." };

  const insertData = {
    tenant_id: profile.tenant_id,
    customer_id: user.id,
    tracking_number: payload.tracking_number,
    store_name: payload.store_name || null,
    order_number: payload.order_number || null,
    carrier: payload.carrier || null,
    receiving_code: payload.receiving_code || null,
    description: payload.description,
    volumes_qty: parseInt(payload.volumes_qty || "1", 10),
    declared_value: payload.declared_value ? parseFloat(payload.declared_value) : null,
    estimated_arrival: payload.estimated_arrival || null,
    notes: payload.notes || null,
    status: 'pending',
  };

  const { error } = await supabase.from("pre_alerts").insert(insertData);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/tenant/${subdomain}/app/pre-alerts`);
  return { success: true };
}
