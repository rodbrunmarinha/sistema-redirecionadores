import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "available";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  // get products
  const { data: products, error } = await supabase
    .from('products')
    .select('*, boxes(status, id)')
    .eq('customer_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  console.log("Products page error?", error);
  console.log("Products fetch count:", products?.length);
  if (products && products.length > 0) {
    console.log("First product boxes relation:", products[0].boxes);
  }

  return <ProductsClient initialProducts={products || []} initialTab={tab} />;
}
