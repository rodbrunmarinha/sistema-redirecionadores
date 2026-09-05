import { createClient } from "@/utils/supabase/server";
import ShipmentWizardClient from "./ShipmentWizardClient";
import { redirect } from "next/navigation";
import { Barcode, AlertTriangle } from "lucide-react";
import Link from "next/link";

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
    
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  let hasPendingInvoice = false;
  if (tenant) {
    const { data: pendingInvoice } = await supabase
      .from('service_invoices')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('customer_id', user.id)
      .eq('status', 'PENDING')
      .limit(1)
      .single();
    if (pendingInvoice) {
      hasPendingInvoice = true;
    }
  }

  if (hasPendingInvoice) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-zinc-900 border border-red-500/30 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Envios Bloqueados</h2>
        <p className="text-zinc-400 mb-8 text-lg">
          Você possui faturas de taxa de serviço pendentes de pagamento. Realize o pagamento para liberar novos envios.
        </p>
        <Link
          href="/app/wallet"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
        >
          <Barcode className="w-5 h-5" />
          Acessar Carteira / Faturas
        </Link>
      </div>
    );
  }

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
