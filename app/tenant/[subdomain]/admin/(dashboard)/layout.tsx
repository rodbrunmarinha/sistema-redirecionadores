import Link from "next/link";
import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "../../../../components/admin/Sidebar";
import { PermissionsProvider } from "@/app/providers/PermissionsProvider";
import { getTenantSettings } from "../../app/(customer)/_utils/getTenantSettings";
import { TenantSettingsProvider } from "../../app/(customer)/components/TenantSettingsContext";

export default async function AdminLayout(props: { children: ReactNode, params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const { children } = props;
  const subdomain = params.subdomain;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  // Buscar informações do tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name, role_permissions')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) {
    redirect("/app/login");
  }

  const organizationName = tenant.organization_name || "Cndck Hub";

  const settings = await getTenantSettings(subdomain);
  
  // Buscar o perfil do usuário logado
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, role, tenant_id')
    .eq('id', user.id)
    .single();

  

  // Verifica permissão (deve pertencer ao tenant atual E ter cargo administrativo)
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT'];
  if (!profile || profile.tenant_id !== tenant.id || !allowedRoles.includes(profile.role)) {
    console.log('REDIRECTING TO /app. Reason:', !profile ? 'No profile' : profile.tenant_id !== tenant.id ? 'Tenant mismatch' : 'Not admin role');
    redirect('/app');
  }

  // Obter permissões do tenant para o cargo
  const rolePermissions = tenant.role_permissions || {};
  const userPermissions = profile.role === 'SUPER_ADMIN' ? ['ALL'] : (rolePermissions[profile.role] || []);

  const userName = profile.full_name || "Admin";
  const userRole = profile.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-900 flex text-white font-sans">
      <Sidebar 
        organizationName={organizationName}
        userName={userName}
        userRole={userRole}
        userInitials={userInitials}
        userPermissions={userPermissions}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Top Header */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-zinc-400 text-sm">
            Bem-vindo ao painel de controle
          </div>
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white transition-colors">
              🔔
            </button>
          </div>
        </header>

        {/* Page Content */}
        <TenantSettingsProvider settings={settings}>
        <PermissionsProvider permissions={userPermissions}>
          <div className="p-8">
            {children}
          </div>
        </PermissionsProvider>
        </TenantSettingsProvider>
      </main>
    </div>
  );
}
