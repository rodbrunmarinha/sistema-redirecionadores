import { ShippingEditClient } from './ShippingEditClient';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditShippingPage({
  params
}: {
  params: Promise<{ subdomain: string; id: string }>
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', resolvedParams.subdomain)
    .single();

  if (!tenant) return notFound();

  const { data: shippingType } = await supabase
    .from('shipping_types')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('tenant_id', tenant.id)
    .single();

  if (!shippingType) return notFound();

  const { data: rates } = await supabase
    .from('shipping_rates')
    .select('*')
    .eq('type_id', shippingType.id)
    .order('weight_start', { ascending: true });

  return (
    <ShippingEditClient 
      subdomain={resolvedParams.subdomain}
      shippingType={shippingType}
      rates={rates || []}
    />
  );
}
