'use server';

import { createClient } from '@/utils/supabase/server';
import { requirePermission } from '@/utils/auth';
import { revalidatePath } from 'next/cache';

export async function getExtraServices(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('extra_services')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching extra services:', error);
    return [];
  }

  return data;
}

export async function deleteExtraService(id: string, subdomain: string) {
  const supabase = await createClient();

  try {
    await requirePermission('settings.edit');
  } catch (err) {
    return { success: false, error: 'Acesso negado: sem permissão.' };
  }

  const { error } = await supabase
    .from('extra_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting extra service:', error);
    return { success: false, error: 'Falha ao excluir o serviço.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/extra-services`);
  return { success: true };
}

export async function reorderExtraServices(orderedIds: string[], subdomain: string) {
  const supabase = await createClient();

  try {
    await requirePermission('settings.edit');
  } catch (err) {
    return { success: false, error: 'Acesso negado: sem permissão.' };
  }

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from('extra_services')
      .update({ display_order: i })
      .eq('id', orderedIds[i]);
  }

  revalidatePath(`/tenant/${subdomain}/admin/extra-services`);
  return { success: true };
}

export async function createExtraService(data: any, subdomain: string) {
  const supabase = await createClient();

  try {
    await requirePermission('settings.edit');
  } catch (err) {
    return { success: false, error: 'Acesso negado: sem permissão.' };
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return { success: false, error: 'Tenant não encontrado.' };

  const { data: newType, error } = await supabase
    .from('extra_services')
    .insert({
      tenant_id: tenant.id,
      name: data.name,
      description: data.description,
      charge_type: data.charge_type,
      price: data.price || 0,
      percentage_rate: data.percentage_rate || 0,
      extra_weight: data.extra_weight || 0,
      is_active: data.is_active,
      display_order: data.sort_order || 0
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating extra service:', error);
    return { success: false, error: 'Erro ao criar serviço.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/extra-services`);
  return { success: true, id: newType.id };
}

export async function getExtraServiceById(id: string, subdomain: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('extra_services')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error fetching extra service:', error);
    return null;
  }
  return data;
}

export async function updateExtraService(id: string, data: any, subdomain: string) {
  const supabase = await createClient();

  try {
    await requirePermission('settings.edit');
  } catch (err) {
    return { success: false, error: 'Acesso negado: sem permissão.' };
  }

  const { error } = await supabase
    .from('extra_services')
    .update({
      name: data.name,
      description: data.description,
      charge_type: data.charge_type,
      price: data.price || 0,
      percentage_rate: data.percentage_rate || 0,
      extra_weight: data.extra_weight || 0,
      is_active: data.is_active
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating extra service:', error);
    return { success: false, error: 'Erro ao atualizar serviço.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/extra-services`);
  return { success: true };
}
