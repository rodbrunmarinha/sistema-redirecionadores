import { Suspense } from "react";
import BoxDetailsClient from "./BoxDetailsClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function BoxDetailsPage(props: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { id: boxId, subdomain } = await props.params;
  const supabase = await createClient();

  // 1. Fetch tenant ID
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  // 2. Fetch Box with Customer
  const { data: box } = await supabase
    .from("boxes")
    .select(`
      *,
      customer:profiles!boxes_customer_id_fkey (
        id,
        full_name,
        email,
        suite_number
      )
    `)
    .eq("id", boxId)
    .eq("tenant_id", tenant.id)
    .single();

  if (!box) redirect(`/admin/boxes`);

  // 3. Fetch Products in this Box
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("box_id", boxId)
    .eq("tenant_id", tenant.id);

  // 4. Fetch Box Movements (if applicable)
  const { data: movements } = await supabase
    .from("warehouse_movements")
    .select("*")
    .eq("box_id", boxId)
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 flex justify-center items-center h-full">Carregando detalhes da caixa...</div>}>
      <BoxDetailsClient box={box} initialProducts={products || []} initialMovements={movements || []} />
    </Suspense>
  );
}
