'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getShippingTerms(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shipping_terms')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shipping terms:', error);
    return [];
  }

  return data;
}

export async function deleteShippingTerm(id: string, subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { error } = await supabase
    .from('shipping_terms')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting shipping term:', error);
    return { success: false, error: 'Falha ao excluir o termo.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/shipping-terms`);
  return { success: true };
}

export async function createShippingTerm(data: { title: string; content: string; is_active: boolean; display_order?: number }, subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return { success: false, error: 'Tenant não encontrado.' };

  const { data: newTerm, error } = await supabase
    .from('shipping_terms')
    .insert({
      tenant_id: tenant.id,
      title: data.title,
      content: data.content,
      is_active: data.is_active, display_order: data.display_order || 0
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating shipping term FULL:', JSON.stringify(error));
    return { success: false, error: `Erro DB: ${error.message || 'Falha ao criar'}` };
  }

  revalidatePath(`/tenant/${subdomain}/admin/shipping-terms`);
  return { success: true, id: newTerm.id };
}

export async function getShippingTermById(id: string, subdomain: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shipping_terms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    return null;
  }
  return data;
}

export async function updateShippingTerm(id: string, data: { title: string; content: string; is_active: boolean; display_order?: number }, subdomain: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { error } = await supabase
    .from('shipping_terms')
    .update({
      title: data.title,
      content: data.content,
      is_active: data.is_active,
      display_order: data.display_order || 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating term:', error);
    return { success: false, error: 'Falha ao atualizar o termo' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/shipping-terms`);
  return { success: true };
}
