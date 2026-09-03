import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OnlinePurchasesClient from './Client';

export default async function OnlinePurchasesPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  const { data: purchases, error } = await supabase
    .from('assisted_purchases')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching purchases:", error);
  }

  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('tenant_id', tenant.id)
    .eq('customer_id', user.id)
    .single();

  return (
    <OnlinePurchasesClient 
      tenant={tenant} 
      purchases={purchases || []} 
      userId={user.id}
      balance={wallet?.balance || 0}
    />
  );
}
