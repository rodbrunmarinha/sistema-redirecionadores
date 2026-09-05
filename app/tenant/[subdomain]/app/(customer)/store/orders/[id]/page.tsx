import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OrderDetailClient from './OrderDetailClient';

export default async function CustomerOrderDetailPage(props: { params: Promise<{ subdomain: string, id: string }> }) {
  const params = await props.params;
  const { subdomain, id } = params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  // Fetch tenant settings to get currency
  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('operations')
    .eq('tenant_id', tenant.id)
    .single();

  const currency = settings?.operations?.currency || 'USD';

  // Fetch real order data USING STANDARD AUTHENTICATED CLIENT (RLS Enforced)
  const { data: order, error: orderError } = await supabase
    .from('store_orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      payment_transaction_id,
      store_order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price,
        product_id,
        store_products ( main_image )
      )
    `)
    .eq('tenant_id', tenant.id)
    .eq('id', id)
    .single();

  if (orderError || !order) {
    // If order not found or user doesn't own it (RLS)
    redirect(`/app/store/orders`);
  }

  // Find the box created for this order
  const trackingNumber = `LOJA-${order.id.split('-')[0].toUpperCase()}`;
  const { data: box } = await supabase
    .from('boxes')
    .select('id, tracking_number')
    .eq('tracking_number', trackingNumber)
    .eq('customer_id', user.id)
    .single();

  // Format order to match Client component expectations (or close to it)
  // Our Client component uses `total`, `subtotal`, etc.
  const formattedOrder = {
    id: order.id,
    reference: `ORD-${order.id.split('-')[0].toUpperCase()}`,
    created_at: order.created_at,
    status: order.status === 'COMPLETED' ? 'delivered' : order.status.toLowerCase(), // Maps DB status to UI status
    total: order.total_amount,
    subtotal: order.total_amount,
    delivery_fee: 0,
    payment_method: 'wallet',
    payment_status: 'paid',
    box: box ? box : null,
    items: order.store_order_items.map((item: any) => ({
      id: item.id,
      name: item.product_name,
      quantity: item.quantity,
      price: item.unit_price,
      // We don't have images in order_items yet, so we use a fallback or try to fetch from store_products
      image_url: item.store_products?.main_image || '' 
    }))
  };

  return (
    <OrderDetailClient 
      tenant={tenant}
      subdomain={subdomain} 
      order={formattedOrder}
      currency={currency}
    />
  );
}
