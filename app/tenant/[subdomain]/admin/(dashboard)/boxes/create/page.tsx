import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateBoxClient from "./CreateBoxClient";

export default async function CreateBoxPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  // Fetch clients to populate the dropdown
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, suite_number')
    .eq('tenant_id', tenant.id)
    .eq('role', 'CUSTOMER')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  const clients = (profiles || []).map(p => ({
    id: p.id,
    label: `${p.full_name} - Dock #${p.suite_number || 'Sem Dock'}`,
    dock: p.suite_number || ''
  }));

  return <CreateBoxClient clients={clients} />;
}
