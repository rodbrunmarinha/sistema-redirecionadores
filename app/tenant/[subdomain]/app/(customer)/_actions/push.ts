"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function subscribeToPush(subscription: any, subdomain: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenant) throw new Error("Tenant not found");

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  const endpoint = subscription.endpoint;
  const p256dh = subscription.keys.p256dh;
  const auth = subscription.keys.auth;

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({
      tenant_id: tenant.id,
      profile_id: user.id,
      endpoint,
      p256dh,
      auth,
      user_agent: userAgent
    }, { onConflict: "endpoint" });

  if (error) {
    console.error("Error saving subscription:", error);
    throw new Error("Failed to save subscription");
  }

  return true;
}

export async function unsubscribeFromPush(endpoint: string, subdomain: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("profile_id", user.id);

  return true;
}

export async function checkSubscription(endpoint: string, subdomain: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("push_subscriptions")
    .select("id")
    .eq("endpoint", endpoint)
    .eq("profile_id", user.id)
    .single();

  return !!data;
}
