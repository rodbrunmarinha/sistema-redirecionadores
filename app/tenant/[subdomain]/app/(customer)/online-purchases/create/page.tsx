import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreatePurchaseClient from './Client';

export default async function CreateOnlinePurchasePage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('tenant_id', tenant.id)
    .eq('customer_id', user.id)
    .single();

  return (
    <CreatePurchaseClient 
      tenantId={tenant.id} 
      userId={user.id}
      balance={wallet?.balance || 0}
    />
  );
}
