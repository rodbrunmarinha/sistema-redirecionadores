"use server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deletePreAlertAction(id: string, subdomain: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("pre_alerts")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    
    revalidatePath(`/tenant/${subdomain}/admin/pre-alerts`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
