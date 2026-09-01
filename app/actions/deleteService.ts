"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function deleteServiceAction(id: string) {
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
    
    // Verify tenant ownership
    const { data: service } = await supabaseAdmin
      .from("services")
      .select("tenant_id")
      .eq("id", id)
      .single();
      
    if (!service || service.tenant_id !== profile.tenant_id) {
      throw new Error("Serviço não encontrado");
    }

    // Soft delete
    const { error } = await supabaseAdmin
      .from("services")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/services");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
