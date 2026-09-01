"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function searchClients(subdomain: string, query: string) {
  if (query.length < 2) return [];

  const supabase = await createClient();
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return [];

    let queryBuilder = supabase
      .from('profiles')
      .select('id, full_name, email, suite_number')
      .eq('tenant_id', tenant.id)
      .eq('role', 'CUSTOMER');

    // If query is purely numeric, we search in suite_number too
    if (/^\d+$/.test(query)) {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,suite_number.eq.${query}`);
    } else {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    const { data: clients, error } = await queryBuilder.limit(10);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return clients.map(c => ({
    id: c.id,
    name: c.full_name || 'Sem nome',
    email: c.email,
    suite_number: c.suite_number
  }));
}

export async function createTicketAction(subdomain: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return { error: 'Tenant not found' };

  const customer_id = formData.get('user_id') as string;
  const subject = formData.get('subject') as string;
  const category = formData.get('category') as string;
  const priority = formData.get('priority') as string;
  const message = formData.get('message') as string;

  if (!customer_id || !subject || !message) {
    return { error: 'Missing required fields' };
  }

  // Create the ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .insert({
      tenant_id: tenant.id,
      customer_id,
      subject,
      category,
      priority,
      status: 'open'
    })
    .select('id')
    .single();

  if (ticketError) {
    console.error("Error creating ticket:", ticketError);
    return { error: ticketError.message };
  }

  // Create the initial message
  const { error: msgError } = await supabase
    .from('support_ticket_messages')
    .insert({
      ticket_id: ticket.id,
      sender_id: user.id,
      message,
      is_internal: false
    });

  if (msgError) {
    console.error("Error creating message:", msgError);
    return { error: msgError.message };
  }

  revalidatePath(`/tenant/${subdomain}/admin/support-tickets`);
  return { success: true, ticketId: ticket.id };
}
// Appended to actions.ts
export async function replyToTicket(subdomain: string, ticketId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const message = formData.get('message') as string;
  const is_internal = formData.get('is_internal') === '1';

  if (!message) return { error: 'Missing message' };

  const { error } = await supabase
    .from('support_ticket_messages')
    .insert({
      ticket_id: ticketId,
      sender_id: user.id,
      message,
      is_internal
    });

  if (error) {
    console.error("Error replying to ticket:", error);
    return { error: error.message };
  }

  // Also update ticket updated_at
  await supabase.from('support_tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticketId);

  revalidatePath(`/tenant/${subdomain}/admin/support-tickets/${ticketId}`);
  return { success: true };
}

export async function updateTicket(subdomain: string, ticketId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const status = formData.get('status') as string;
  const priority = formData.get('priority') as string;
  const category = formData.get('category') as string;
  const assignee_id = formData.get('assignee_id') as string;

  const updates: any = {
    status,
    priority,
    category
  };

  if (assignee_id) {
    updates.assigned_to = assignee_id;
  } else {
    updates.assigned_to = null;
  }

  if (status === 'resolved' || status === 'closed') {
    updates.resolved_at = new Date().toISOString();
  } else {
    updates.resolved_at = null;
  }

  const { error } = await supabase
    .from('support_tickets')
    .update(updates)
    .eq('id', ticketId);

  if (error) {
    console.error("Error updating ticket:", error);
    return { error: error.message };
  }

  revalidatePath(`/tenant/${subdomain}/admin/support-tickets/${ticketId}`);
  return { success: true };
}
