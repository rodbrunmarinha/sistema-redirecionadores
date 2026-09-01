"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function deleteLocationAction(id: string) {
  try {
    await requirePermission("packages.create");

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

    const supabaseAdmin = createAdminClient();
    
    // Check ownership
    const { data: location } = await supabaseAdmin
      .from("warehouse_locations")
      .select("tenant_id")
      .eq("id", id)
      .single();
      
    if (!location || location.tenant_id !== profile.tenant_id) {
      throw new Error("Localização não encontrada");
    }

    const { error } = await supabaseAdmin
      .from("warehouse_locations")
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/warehouse/locations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
