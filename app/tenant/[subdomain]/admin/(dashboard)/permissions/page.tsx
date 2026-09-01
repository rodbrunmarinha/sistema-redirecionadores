import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import PermissionsClient from "./PermissionsClient";

export default async function PermissionsPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) notFound();

  // Apenas o OWNER (proprietário) ou ADMIN podem acessar essa página? 
  // O HTML diz que proprietário pode alterar. Mas normalmente o SUPER_ADMIN que faz isso.
  // Vamos verificar se o usuario atual é um admin deste tenant
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();
    
  if (!profile || profile.role !== 'SUPER_ADMIN' && profile.role !== 'ADMIN') {
      // Se tivermos um controle rígido de SUPER_ADMIN:
      // if (profile.email !== tenant.owner_email) redirect("/admin");
      // Vou permitir Admin acessar mas a view pode restringir (ou só o Owner mesmo)
  }

  // Mas como a regra de negócios pede: proprietario é o lojista criador (owner_email)
  if (profile?.email !== tenant.owner_email) {
      redirect("/admin"); // Só o dono altera permissões globais
  }

  return (
    <PermissionsClient
      tenant={tenant}
      rolePermissions={tenant.role_permissions || {}}
    />
  );
}
