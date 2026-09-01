"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function updateRolePermissions(
  tenantId: string,
  role: string,
  permissions: string[]
) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autorizado.");

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, owner_email, role_permissions')
      .eq('id', tenantId)
      .single();

    if (!tenant) throw new Error("Loja não encontrada.");

    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    // Apenas OWNER pode alterar
    if (profile?.email !== tenant.owner_email) {
      throw new Error("Apenas o proprietário pode alterar permissões.");
    }

    const currentPermissions = tenant.role_permissions || {};
    
    // Atualiza a chave específica do role
    const updatedPermissions = {
      ...currentPermissions,
      [role]: permissions,
    };

    const supabaseAdmin = createAdminClient();
    const { error: updateError } = await supabaseAdmin
      .from("tenants")
      .update({ role_permissions: updatedPermissions })
      .eq("id", tenant.id);

    if (updateError) throw new Error("Erro ao salvar permissões no banco.");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
