"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";

export async function getPreAlertByTrackingAction(trackingNumber: string) {
  try {
    await requirePermission("packages.create");
    
    if (!trackingNumber) return { success: false, error: "Tracking number required" };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autorizado");

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.tenant_id) {
      throw new Error("Erro ao identificar tenant");
    }

    const tenantId = profile.tenant_id;
    const supabaseAdmin = createAdminClient();
    
    const { data, error } = await supabaseAdmin
      .from("pre_alerts")
      .select("id, tracking_number, store_name, customer_id")
      .eq("tracking_number", trackingNumber)
      .eq("tenant_id", tenantId)
      .eq("status", "pending")
      .limit(1)
      .single();

    if (error || !data) {
      return { success: false, error: "No pending pre-alert found" };
    }

    return { success: true, preAlert: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
