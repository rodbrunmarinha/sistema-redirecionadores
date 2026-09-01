'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPaymentSettings(subdomain: string) {
  const supabase = await createClient();
  
  // Get tenant ID
  const { data: tenantData } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();
    
  if (!tenantData) return null;

  const { data } = await supabase
    .from('tenant_settings')
    .select('payments')
    .eq('tenant_id', tenantData.id)
    .single();

  return data?.payments || {};
}

export async function savePaymentSettings(subdomain: string, payments: any) {
  const supabase = await createClient();
  
  // Get tenant ID
  const { data: tenantData } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();
    
  if (!tenantData) return { success: false, error: 'Tenant não encontrado' };

  // Check if settings exist
  const { data: existingSettings } = await supabase
    .from('tenant_settings')
    .select('id')
    .eq('tenant_id', tenantData.id)
    .single();

  let error = null;

  if (existingSettings) {
    const res = await supabase
      .from('tenant_settings')
      .update({ payments })
      .eq('id', existingSettings.id);
    error = res.error;
  } else {
    const res = await supabase
      .from('tenant_settings')
      .insert({ tenant_id: tenantData.id, payments });
    error = res.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/tenant/${subdomain}/admin/integrations/payments`);
  return { success: true };
}
