'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getTermsOfService(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('terms_of_service')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching terms of service:', error);
    return [];
  }

  return data;
}

export async function getTermOfServiceById(id: string, subdomain: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('terms_of_service')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    return null;
  }
  return data;
}

export async function createTermOfService(data: { title: string; content: string; is_active: boolean; require_on_signup: boolean; display_order?: number; version: string }, subdomain: string) {
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
    .from('terms_of_service')
    .insert({
      tenant_id: tenant.id,
      title: data.title,
      content: data.content,
      is_active: data.is_active,
      require_on_signup: data.require_on_signup,
      version: data.version,
      display_order: data.display_order || 0
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating term of service FULL:', JSON.stringify(error));
    return { success: false, error: `Erro DB: ${error.message || 'Falha ao criar'}` };
  }

  revalidatePath(`/tenant/${subdomain}/admin/terms-of-service`);
  return { success: true, id: newTerm.id };
}

export async function updateTermOfService(id: string, data: { title: string; content: string; is_active: boolean; require_on_signup: boolean; display_order?: number; version: string }, subdomain: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { error } = await supabase
    .from('terms_of_service')
    .update({
      title: data.title,
      content: data.content,
      is_active: data.is_active,
      require_on_signup: data.require_on_signup,
      display_order: data.display_order || 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating term of service:', error);
    return { success: false, error: 'Falha ao atualizar o termo' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/terms-of-service`);
  return { success: true };
}

export async function deleteTermOfService(id: string, subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { error } = await supabase
    .from('terms_of_service')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting term of service:', error);
    return { success: false, error: 'Falha ao excluir o termo.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/terms-of-service`);
  return { success: true };
}
