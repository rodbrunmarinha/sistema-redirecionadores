// @ts-nocheck
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage({
  params,
  searchParams
}: {
  params: { subdomain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  await requirePermission("packages.view");
  
  const resolvedParams = await searchParams;
  const resolvedRouteParams = await params;
  
  const supabase = await createClient();
  
  // Basic query
  let query = supabase
    .from("products")
    .select(`
      *,
      customer:customer_id ( full_name, suite_number )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  // Add filters if needed based on resolvedParams
    if (resolvedParams.name) query = query.ilike('name', `%${resolvedParams.name}%`);
  if (resolvedParams.barcode) query = query.eq('code', resolvedParams.barcode);

  const { data: products, error } = await query;
  
  if (error) {
    console.error("Products fetch error:", error);
  }

  // Fetch tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', resolvedRouteParams.subdomain)
    .single();

  // Fetch tenant settings
  let tenantSettings = {};
  if (tenant?.id) {
    const { data: settingsData } = await supabase
      .from('tenant_settings')
      .select('*')
      .eq('tenant_id', tenant.id)
      .single();
    if (settingsData) {
      tenantSettings = settingsData;
    }
  }


  return <ProductsClient initialProducts={products || []} tenantSettings={tenantSettings} />;
}
