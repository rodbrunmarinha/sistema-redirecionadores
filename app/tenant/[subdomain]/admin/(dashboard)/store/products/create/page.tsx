import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProductCreateClient from './ProductCreateClient';
import { getStoreCategories } from '../_actions/products';

export default async function CreateProductPage(props: { params: Promise<{ subdomain: string }> }) {
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

  const categories = await getStoreCategories(tenant.id);

  return <ProductCreateClient tenantId={tenant.id} initialCategories={categories || []} />;
}
