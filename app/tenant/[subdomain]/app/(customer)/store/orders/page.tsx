import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OrdersClient from './OrdersClient';

export default async function CustomerOrdersPage(props: { params: Promise<{ subdomain: string }> }) {
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

  // Fetch tenant settings to get currency
  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('operations')
    .eq('tenant_id', tenant.id)
    .single();

  const currency = settings?.operations?.currency || 'USD';

  // Fetch real orders data USING STANDARD AUTHENTICATED CLIENT (RLS Enforced)
  const { data: storeOrders, error } = await supabase
    .from('store_orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      store_order_items (
        id,
        product_name,
        quantity,
        unit_price,
        store_products ( main_image )
      )
    `)
    .eq('tenant_id', tenant.id)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching store_orders:", error);
  }

  // Format orders for the UI
  const formattedOrders = (storeOrders || []).map((order: any) => {
    // Determine how many unique items in the order
    const itemCount = order.store_order_items?.length || 0;
    
    // Get the name of the first item to show in the list, or a generic name
    let mainItemName = 'Pedido';
    if (itemCount === 1) {
      mainItemName = order.store_order_items[0].product_name;
    } else if (itemCount > 1) {
      mainItemName = `${order.store_order_items[0].product_name} e mais ${itemCount - 1} item(ns)`;
    }
    
    // Extract images
    const thumbnails: string[] = order.store_order_items
      .map((item: any) => item.store_products?.main_image)
      .filter((url: any) => typeof url === 'string' && url.length > 0);

    return {
      id: order.id,
      reference: `ORD-${order.id.split('-')[0].toUpperCase()}`,
      created_at: order.created_at,
      status: order.status === 'COMPLETED' ? 'delivered' : order.status.toLowerCase(), // Map DB to UI status
      total: order.total_amount,
      itemCount: itemCount,
      mainItemName: mainItemName,
      thumbnails: thumbnails
    };
  });

  return (
    <OrdersClient 
      tenant={tenant}
      subdomain={subdomain} 
      orders={formattedOrders}
      currency={currency}
      error={error ? error.message : null}
    />
  );
}
