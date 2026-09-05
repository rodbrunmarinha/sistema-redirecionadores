import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientDetailClient from './ClientDetailClient';

export default async function AdminClientDetailPage(props: { params: Promise<{ subdomain: string, id: string }> }) {
  const params = await props.params;
  const { subdomain, id } = params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', tenant.id)
    .single();

  if (!profile) redirect("/admin/clients");

  // 2. Fetch Wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('customer_id', id)
    .eq('tenant_id', tenant.id)
    .single();

  // 3. Fetch Wallet Transactions for debits and total moved
  let wallet_credits = 0;
  let wallet_debits = 0;
  if (wallet) {
    const { data: txs } = await supabase
      .from('wallet_transactions')
      .select('amount, type')
      .eq('wallet_id', wallet.id)
      .eq('status', 'COMPLETED');
      
    if (txs) {
      txs.forEach(tx => {
        const amt = Number(tx.amount);
        if (amt > 0) {
          wallet_credits += amt;
        } else {
          wallet_debits += Math.abs(amt);
        }
      });
    }
  }

  

  // 4. Fetch Boxes for weight
  const { data: boxes } = await supabase
    .from('boxes')
    .select('weight')
    .eq('customer_id', id)
    .eq('tenant_id', tenant.id)
    .eq('status', 'RECEIVED')
    .is('deleted_at', null);

  const available_weight = (boxes || []).reduce((sum, b) => sum + (Number(b.weight) || 0), 0);

  // 5. Fetch Products for items count
  const { data: products } = await supabase
    .from('products')
    .select('quantity, box_id')
    .eq('customer_id', id)
    .eq('tenant_id', tenant.id)
    .is('deleted_at', null);

  const available_items = (products || []).reduce((sum, p) => sum + (Number(p.quantity) || 1), 0);

  // 6. Fetch Totals for the right panel
  const { data: storeOrders } = await supabase.from('store_orders').select('total_amount').eq('customer_id', id).eq('tenant_id', tenant.id);
  const total_store = (storeOrders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const { data: shipments } = await supabase.from('shipments').select('total_amount').eq('customer_id', id).eq('tenant_id', tenant.id);
  const total_shipments = (shipments || []).reduce((sum, s) => sum + Number(s.total_amount || 0), 0);

  const { data: assistedPurchases } = await supabase.from('assisted_purchases').select('total_paid').eq('user_id', id).eq('tenant_id', tenant.id);
  const total_assisted = (assistedPurchases || []).reduce((sum, a) => sum + Number(a.total_paid || 0), 0);

  const { data: purchaseGroups } = await supabase.from('purchase_group_orders').select('total_amount').eq('customer_id', id).eq('tenant_id', tenant.id);
  const total_groups = (purchaseGroups || []).reduce((sum, g) => sum + Number(g.total_amount || 0), 0);

  const total_moved = total_store + total_shipments + total_assisted + total_groups;

  // 7. Fetch Recent Activities (max 3 each)
  const { data: recent_assisted } = await supabase.from('assisted_purchases')
    .select('id, product_name, total_paid, status, created_at')
    .eq('user_id', id).eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(3);

  const { data: recent_shipments } = await supabase.from('shipments')
    .select('id, tracking_number, total_amount, status, created_at')
    .eq('customer_id', id).eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(3);

  const { data: recent_groups } = await supabase.from('purchase_group_orders')
    .select('id, total_amount, status, created_at')
    .eq('customer_id', id).eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(3);

  const { data: recent_store } = await supabase.from('store_orders')
    .select('id, total_amount, status, created_at')
    .eq('customer_id', id).eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(3);

  const { data: recent_boxes } = await supabase.from('boxes')
    .select('id, tracking_number, status, created_at')
    .eq('customer_id', id).eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(3);

  const { data: recent_wallet } = wallet ? await supabase.from('wallet_transactions')
    .select('id, description, amount, type, created_at')
    .eq('wallet_id', wallet.id).order('created_at', { ascending: false }).limit(3) : { data: [] };

  const clientData = {
    id: profile.id,
    name: profile.full_name || 'Sem nome',
    email: profile.email,
    status: profile.is_active ? 'active' : 'inactive',
    suite: profile.suite_number || 'N/A',
    phone: profile.phone || '',
    document: profile.cpf || '',
    created_at: profile.created_at,
    vip_status: 'none',
    wallet_balance: wallet?.balance || 0,
    wallet_credits,
    wallet_debits,
    total_moved,
    total_store,
    total_shipments,
    total_assisted,
    total_groups,
    open_demands: 0,
    available_weight,
    available_items,
    boxes_count: boxes?.length || 0,
    products_count: products?.length || 0,
    store_count: storeOrders?.length || 0,
    shipments_count: shipments?.length || 0,
    assisted_count: assistedPurchases?.length || 0,
    groups_count: purchaseGroups?.length || 0,
    recent_assisted: recent_assisted || [],
    recent_shipments: recent_shipments || [],
    recent_groups: recent_groups || [],
    recent_store: recent_store || [],
    recent_boxes: recent_boxes || [],
    recent_wallet: recent_wallet || []
  };

  return (
    <ClientDetailClient 
      tenant={tenant}
      subdomain={subdomain}
      clientData={clientData}
    />
  );
}
