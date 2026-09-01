import { createClient } from "@/utils/supabase/server";
import ShipmentWizardClient from "./ShipmentWizardClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CreateShipmentPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  
  const supabase = await createClient();
  
  // Need to get tenantId to fetch extra services
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();
    
  let extraServices = [];
  let shippingTypes = [];
  if (tenant) {
    const { data } = await supabase
      .from('extra_services')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
      
    if (data) {
      extraServices = data;
    }
    
    const { data: stData } = await supabase
      .from('shipping_types')
      .select('*, shipping_rates(*)')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
      
    if (stData) shippingTypes = stData;
  }

  return <ShipmentWizardClient initialExtraServices={extraServices} shippingTypes={shippingTypes} />;
}
