import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import RegisterClient from "./RegisterClient";

export default async function CustomerRegisterPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;

  const supabase = await createClient();
  
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .maybeSingle();

  if (!tenant) {
    notFound();
  }

  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('landing_page')
    .eq('tenant_id', tenant.id)
    .single();

  const themeColor = settings?.landing_page?.themeColor || "amber";

  return <RegisterClient organizationName={tenant.organization_name} subdomain={subdomain} themeColor={themeColor} />;
}
