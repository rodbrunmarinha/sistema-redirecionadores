'use server'

import { createAdminClient } from '@/utils/supabase/admin'

export async function registerTenantAction(data: {
  userId: string;
  email: string;
  fullName: string;
  organizationName: string;
  subdomain: string;
  country: string;
  phone: string;
}) {
  const adminAuthClient = createAdminClient()

  try {
    // 1. Inserir o novo Tenant na tabela "tenants"
    // Usamos o Admin Client para ignorar as regras de RLS (já que anonimos não podem inserir tenants)
    const { data: tenant, error: tenantError } = await adminAuthClient
      .from('tenants')
      .insert({
        subdomain: data.subdomain,
        organization_name: data.organizationName,
        owner_name: data.fullName,
        owner_email: data.email
        // country e phone podem ser adicionados à tabela tenants no futuro se desejar
      })
      .select()
      .single()

    if (tenantError) {
      console.error("Erro ao criar tenant:", tenantError)
      
      // ROLLBACK: Apagar o usuário que acabou de ser criado no auth do Supabase
      await adminAuthClient.auth.admin.deleteUser(data.userId);

      return { success: false, error: 'Erro ao criar organização. (Verifique se o Next.js foi reiniciado para ler as chaves de ambiente).' }
    }

    // 2. Inserir o perfil associado ao novo tenant
    // E garantir que ele ganhe a role de "ADMIN" ou "SUPER_ADMIN"
    const { error: profileError } = await adminAuthClient
      .from('profiles')
      .insert({
        id: data.userId, // ID retornado pelo signUp do Supabase Auth
        tenant_id: tenant.id,
        role: 'ADMIN',
        email: data.email,
        full_name: data.fullName
      })

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError)
      
      // ROLLBACK: Reverter tenant e user
      await adminAuthClient.from('tenants').delete().eq('id', tenant.id)
      await adminAuthClient.auth.admin.deleteUser(data.userId)
      
      return { success: false, error: 'Erro ao criar perfil de administrador.' }
    }

    return { success: true, tenant }

  } catch (err) {
    console.error("Exceção inesperada:", err)
    // ROLLBACK fallback just in case
    await adminAuthClient.auth.admin.deleteUser(data.userId)
    return { success: false, error: 'Ocorreu um erro inesperado no servidor.' }
  }
}
