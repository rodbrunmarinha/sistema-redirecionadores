import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProductListClient from './ProductListClient';
import { getStoreCategories, getStoreProducts } from './_actions/products';

export default async function StoreProductsPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  const [categories, products] = await Promise.all([
    getStoreCategories(tenant.id),
    getStoreProducts(tenant.id)
  ]);

  return (
    <ProductListClient 
      tenantId={tenant.id} 
      subdomain={subdomain} 
      initialProducts={products || []}
      categories={categories || []}
    />
  );
}
