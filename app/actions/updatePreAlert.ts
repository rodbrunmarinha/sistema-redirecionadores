"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePreAlertAction(payload: any, id: string, subdomain: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autenticado");

    const updateData = {
      store_name: payload.store_name,
      order_number: payload.order_number || null,
      tracking_number: payload.tracking_number,
      receiving_code: payload.receiving_code || null,
      carrier: payload.carrier || null,
      estimated_arrival: payload.estimated_arrival || null,
      description: payload.description,
      volumes_qty: parseInt(payload.volumes_qty),
      declared_value: parseFloat(payload.declared_value) || 0,
      notes: payload.notes || null,
    };

    const { error } = await supabase
      .from("pre_alerts")
      .update(updateData)
      .eq("id", id)
      .eq("customer_id", user.id);

    if (error) throw error;

    revalidatePath(`/tenant/${subdomain}/app/pre-alerts/${id}`);
    revalidatePath(`/tenant/${subdomain}/app/pre-alerts`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
