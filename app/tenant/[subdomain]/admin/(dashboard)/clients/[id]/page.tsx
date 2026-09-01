import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientDetailClient from './ClientDetailClient';

export default async function AdminClientDetailPage(props: { params: Promise<{ subdomain: string, id: string }> }) {
  const params = await props.params;
  const { subdomain, id } = params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  // In the future, fetch the real client data from DB using the `id`
  const mockClient = {
    id: id,
    name: 'Bruno de Souza',
    email: 'rodbrun_dragon@hotmail.com',
    status: 'active',
    suite: '1001',
    phone: '+5515997649450',
    document: '172.178.637-67',
    created_at: '2026-08-23',
    vip_status: 'none',
    wallet_balance: 2000,
    wallet_debits: 18000,
    total_moved: 18000,
    open_demands: 0,
    available_weight: 4.980,
    available_items: 39,
  };

  return (
    <ClientDetailClient 
      tenant={tenant}
      subdomain={subdomain}
      clientData={mockClient}
    />
  );
}
