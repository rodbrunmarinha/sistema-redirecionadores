"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function deleteBoxByAdmin(boxId: string) {
  try {
    await requirePermission("packages.delete");

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

    // The box will be deleted only if it belongs to the same tenant
    const { error: deleteError } = await supabaseAdmin
      .from('boxes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', boxId)
      .eq('tenant_id', profile.tenant_id);

    if (deleteError) {
      return { error: "Erro ao arquivar caixa: " + deleteError.message };
    }

    revalidatePath("/admin/boxes");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro interno no servidor." };
  }
}
