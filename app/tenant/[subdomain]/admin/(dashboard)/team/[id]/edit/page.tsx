import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EditTeamClient from "./EditTeamClient";

export default async function EditTeamPage(props: { params: Promise<{ subdomain: string, id: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const id = params.id;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, owner_email')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  const { data: member } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', tenant.id)
    .single();

  if (!member) redirect("/admin/team");

  return <EditTeamClient member={member} isOwner={member.email === tenant.owner_email} />;
}
