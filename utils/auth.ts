import { createClient } from "@/utils/supabase/server";

export async function requirePermission(permission: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile) throw new Error("Perfil não encontrado");
  if (profile.role === 'SUPER_ADMIN') return { user, profile };

  const { data: tenant } = await supabase
    .from('tenants')
    .select('role_permissions')
    .eq('id', profile.tenant_id)
    .single();

  if (!tenant) throw new Error("Tenant não encontrado");

  const perms = tenant.role_permissions?.[profile.role] || [];
  if (!perms.includes(permission)) {
    throw new Error(`Acesso negado. Requer permissão: ${permission}`);
  }

  return { user, profile, tenant };
}
