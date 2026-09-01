import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MasterSupportClient from "./MasterSupportClient";

export default async function MasterSupportPage(props: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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

  // Fetch tickets opened by this user to the master system (tenant_id != this tenant's ID)
  let query = supabase
    .from('support_tickets')
    .select('id, subject, status, created_at, category, priority')
    .eq('customer_id', user.id)
    .neq('tenant_id', tenant.id)
    .order('created_at', { ascending: false });

  const statusFilter = searchParams.status as string || 'all';
  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: tickets } = await query;
  
  const { data: allTickets } = await supabase
    .from('support_tickets')
    .select('status')
    .eq('customer_id', user.id)
    .neq('tenant_id', tenant.id);

  const stats = {
    open: allTickets?.filter(t => t.status !== 'closed' && t.status !== 'resolved').length || 0,
    total: allTickets?.length || 0,
  };

  return (
    <MasterSupportClient 
      tickets={tickets || []}
      stats={stats}
      subdomain={subdomain}
      initialStatusFilter={statusFilter}
    />
  );
}
