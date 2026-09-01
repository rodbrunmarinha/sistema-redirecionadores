import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StoreFrontClient from './StoreFrontClient';

export default async function StoreFrontPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  // Fetch store categories
  const { data: categories } = await supabase
    .from('store_categories')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: true });

  // Fetch active products
  const { data: products } = await supabase
    .from('store_products')
    .select('*, store_categories(name)')
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <StoreFrontClient 
      tenant={tenant}
      subdomain={subdomain} 
      categories={categories || []}
      products={products || []}
    />
  );
}
