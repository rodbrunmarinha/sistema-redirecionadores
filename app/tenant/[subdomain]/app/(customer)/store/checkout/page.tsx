import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const { subdomain } = params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('operations')
    .eq('tenant_id', tenant.id)
    .single();

  const currency = settings?.operations?.currency || 'USD';

  return (
    <CheckoutClient 
      tenant={tenant}
      subdomain={subdomain} 
      currency={currency}
    />
  );
}
