"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function createCustomerByAdmin(formData: FormData) {
  try {
    // Verifica permissão (agora nossa regra de ouro)
    await requirePermission("users.create");
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autorizado");

    // Obter o tenant do admin atual
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.tenant_id) {
      throw new Error("Erro ao identificar tenant");
    }

    const tenantId = profile.tenant_id;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const password_confirmation = formData.get("password_confirmation") as string;

    if (!name || !email || !password) {
      return { error: "Nome, e-mail e senha são obrigatórios." };
    }

    if (password !== password_confirmation) {
      return { error: "As senhas não coincidem." };
    }
    if (password.length < 8) {
      return { error: "A senha deve ter no mínimo 8 caracteres." };
    }

    const supabaseAdmin = createAdminClient();

    // 1. Criar o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        role: 'CUSTOMER'
      }
    });

    if (authError) {
      return { error: authError.message };
    }

    const userId = authData.user.id;

    // 2. Inserir o perfil na tabela Profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        tenant_id: tenantId,
        role: "CUSTOMER",
        email: email,
        full_name: name,
        phone: phone || null,
        is_active: true
      });

    // Se falhar ao criar perfil, faz rollback
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return { error: `Erro ao criar perfil de cliente: ${profileError.message}` };
    }

    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro interno no servidor." };
  }
}
