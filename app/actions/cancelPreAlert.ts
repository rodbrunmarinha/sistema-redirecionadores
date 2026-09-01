"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function cancelPreAlertAction(id: string, subdomain: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autenticado");

    const { error } = await supabase
      .from("pre_alerts")
      .update({ status: 'canceled' })
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
