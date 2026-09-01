import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OrderListClient from './OrderListClient';

export default async function StoreOrdersPage(props: { params: Promise<{ subdomain: string }> }) {
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

  if (!tenant) redirect("/admin/login");

  // TODO: Fetch from store_orders when the table is created
  // const { data: orders } = await supabase.from('store_orders').select('*').eq('tenant_id', tenant.id);
  const orders: any[] = [];

  return (
    <OrderListClient 
      tenantId={tenant.id} 
      subdomain={subdomain} 
      initialOrders={orders}
    />
  );
}
