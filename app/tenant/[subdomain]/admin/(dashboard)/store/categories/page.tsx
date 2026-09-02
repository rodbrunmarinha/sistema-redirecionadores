import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CategoryListClient from './CategoryListClient';

export default async function StoreCategoriesPage(props: { params: Promise<{ subdomain: string }> }) {
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

  // Fetch categories with products
  const { data: categories, error } = await supabase
    .from('store_categories')
    .select(`
      id,
      name,
      created_at,
      store_products (
        id,
        name,
        main_image,
        price,
        is_active
      )
    `)
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  // Format the counts and products
  const formattedCategories = categories?.map(cat => ({
    ...cat,
    products_count: cat.store_products?.length || 0,
    products: cat.store_products || [],
    is_active: true, // mock
    sort_order: 0, // mock
    parent_id: null, // mock
    slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  })) || [];

  return (
    <CategoryListClient 
      tenantId={tenant.id} 
      subdomain={subdomain} 
      initialCategories={formattedCategories}
    />
  );
}
