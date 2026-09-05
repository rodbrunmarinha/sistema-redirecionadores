import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import WalletClient from './WalletClient';

export default async function WalletPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const { subdomain } = params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  // Fetch tenant settings for currency
  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('operations')
    .eq('tenant_id', tenant.id)
    .single();

  const currency = settings?.operations?.currency || 'USD';

  // Fetch Wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('customer_id', user.id)
    .maybeSingle();

  
  const { data: invoices } = await supabase
    .from('service_invoices')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('customer_id', user.id)
    .eq('status', 'PENDING');

  const balance = wallet ? wallet.balance : 0;
  const walletId = wallet ? wallet.id : null;

  // Fetch Transactions if wallet exists
  let transactions = [];
  if (walletId) {
    const { data: txs } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (txs) transactions = txs;
  }

  return (
    <WalletClient 
      tenant={tenant}
      subdomain={subdomain}
      currency={currency}
      initialBalance={balance}
      transactions={transactions}
      pendingInvoices={invoices || []}
      userId={user.id}
    />
  );
}
