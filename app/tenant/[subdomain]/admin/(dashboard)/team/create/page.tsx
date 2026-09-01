import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CreateTeamClient from "./CreateTeamClient";

export default async function CreateTeamPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const { subdomain } = params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id)
    .neq('role', 'CUSTOMER');

  if (count !== null && count >= 3) {
    redirect("/admin/team");
  }
  
  return <CreateTeamClient subdomain={subdomain} />;
}
