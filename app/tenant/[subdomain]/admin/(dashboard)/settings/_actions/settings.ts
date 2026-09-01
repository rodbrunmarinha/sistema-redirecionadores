'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getTenantSettings(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tenant_settings')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching settings (code, message, details, hint):', error.code, error.message, error.details, error.hint);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return null;
  }

  return data;
}

export async function updateTenantSettings(tenantId: string, payload: any, subdomain: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'SUPER_ADMIN' && profile.role !== 'ADMIN')) {
    return { success: false, error: 'Permissão negada. Apenas administradores podem alterar configurações.' };
  }

  const { error } = await supabase
    .from('tenant_settings')
    .upsert({
      tenant_id: tenantId,
      branding: payload.branding || {},
      operations: payload.operations || {},
      address: payload.address || {},
      conversion: payload.conversion || {},
      menu: payload.menu || {},
      quick_links: payload.quick_links || {},
      notifications: payload.notifications || {},
      email_smtp: payload.email_smtp || {},
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'tenant_id'
    });

  if (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/tenant/${subdomain}/admin/settings`);
  
  return { success: true };
}