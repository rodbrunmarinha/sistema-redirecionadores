"use server";

import { createClient } from "@supabase/supabase-js";

// Usamos o Service Role para poder ignorar RLS e criar usuários e perfis de forma atômica
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function registerCustomerAction(formData: {
  subdomain: string;
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
}) {
  try {
    // 1. Obter o Tenant ID com base no subdomain
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .select("id")
      .eq("subdomain", formData.subdomain)
      .single();

    if (tenantError || !tenant) {
      return { error: "Lojista não encontrado." };
    }

    const tenantId = tenant.id;

    // 2. Criar o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true, // Auto-confirmar para simplificar o fluxo inicial
      user_metadata: {
        full_name: formData.fullName,
        role: 'CUSTOMER'
      }
    });

    if (authError) {
      return { error: authError.message };
    }

    const userId = authData.user.id;

    // 4. Inserir o perfil na tabela Profiles (o suite_number será gerado automaticamente pelo banco de dados)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        tenant_id: tenantId,
        role: "CUSTOMER",
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone || null,
        cpf: formData.cpf || null
      });

    // Se falhar ao criar perfil, faz rollback do usuário
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return { error: `Erro ao criar perfil de cliente: ${profileError.message}` };
    }

    return { success: true };
  } catch (error: any) {
    return { error: "Erro interno no servidor." };
  }
}
