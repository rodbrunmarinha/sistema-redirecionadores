import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CartClient from './CartClient';

export default async function CartPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const { subdomain } = params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  return (
    <CartClient 
      tenant={tenant}
      subdomain={subdomain} 
    />
  );
}
