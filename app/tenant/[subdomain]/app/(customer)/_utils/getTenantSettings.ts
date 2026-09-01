import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';

export const getTenantSettings = cache(async (subdomain: string) => {
  const supabase = await createClient();
  
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return null;

  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('*')
    .eq('tenant_id', tenant.id)
    .single();

  return settings;
});
