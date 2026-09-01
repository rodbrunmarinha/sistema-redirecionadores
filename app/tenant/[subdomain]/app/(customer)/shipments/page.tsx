import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ShipmentsClient from "./ShipmentsClient";

export default async function ShipmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  // Fetch shipments
  const { data: shipments } = await supabase
    .from('shipments')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch available products
  const { data: products } = await supabase
    .from('products')
    .select('*, boxes(status)')
    .eq('customer_id', user.id)
    .is('deleted_at', null);

  const availableProducts = (products || []).filter(
    (p) => p.boxes?.status === 'RECEIVED'
  );

  return <ShipmentsClient initialShipments={shipments || []} availableProductsCount={availableProducts.length} />;
}
