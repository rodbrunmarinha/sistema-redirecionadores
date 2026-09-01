import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TicketDetailClient from "./TicketDetailClient";

export default async function TicketDetailPage(props: {
  params: Promise<{ subdomain: string, id: string }>;
}) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const ticketId = params.id;
  
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  // Fetch the ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .select('*, customer:profiles!support_tickets_customer_id_fkey(full_name, email, suite_number)')
    .eq('id', ticketId)
    .eq('tenant_id', tenant.id)
    .single();

  if (ticketError || !ticket) {
    redirect(`/tenant/${subdomain}/admin/support-tickets`);
  }

  // Fetch the messages
  const { data: messages } = await supabase
    .from('support_ticket_messages')
    .select('*, sender:profiles!support_ticket_messages_sender_id_fkey(full_name, email)')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  // Fetch team members (ADMIN, MANAGER, SUPPORT)
  const { data: team } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('tenant_id', tenant.id)
    .in('role', ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <TicketDetailClient 
        subdomain={subdomain} 
        ticket={ticket} 
        messages={messages || []} 
        team={team || []}
      />
    </div>
  );
}
