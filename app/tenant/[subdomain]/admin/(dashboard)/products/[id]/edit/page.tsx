
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ProductEditClient from "./ProductEditClient";

export default async function ProductEditPage({ params }: { params: Promise<{ subdomain: string, id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", resolvedParams.subdomain)
    .single();

  if (!tenant) return notFound();

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      customer:customer_id(full_name, suite_number)
    `)
    .eq("id", resolvedParams.id)
    .is("deleted_at", null)
    .single();

  if (!product) return notFound();

  const { data: boxes } = await supabase
    .from("boxes")
    .select("id, customer:customer_id(full_name, suite_number)")
    .eq("tenant_id", tenant.id)
    
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const { data: customers } = await supabase
    .from("customers")
    .select("id, full_name, suite_number")
    .eq("tenant_id", tenant.id)
    .order("full_name", { ascending: true });

  return <ProductEditClient product={product} boxes={boxes || []} customers={customers || []} />;
}
