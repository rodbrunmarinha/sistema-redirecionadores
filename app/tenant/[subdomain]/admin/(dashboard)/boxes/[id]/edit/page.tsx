import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { requirePermission } from "@/utils/auth";
import EditBoxClient from "./EditBoxClient";

export default async function EditBoxPage({
  params
}: {
  params: Promise<{ subdomain: string; id: string }>
}) {
  const { subdomain, id } = await params;
  await requirePermission("packages.edit");
  const supabase = await createClient();



  

  // Fetch Box
  const { data: box, error } = await supabase
    .from('boxes')
    .select(`
      *,
      customer:customer_id ( full_name, suite_number )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) console.error("Edit Box error:", error.message, error.details, error.hint);
  if (error || !box) {
    notFound();
  }

  // Fetch product count
  const { count: productsCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('box_id', id)
    .is('deleted_at', null);
    
  box.products = new Array(productsCount || 0);

  // Fetch staff who created it (optional, if we use created_by)
  let creatorName = "Desconhecido";
  if (box.created_by) {
    const { data: user } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', box.created_by)
      .single();
    if (user) creatorName = user.full_name;
  }

  return (
    <EditBoxClient 
      box={box}
      creatorName={creatorName}
      subdomain={subdomain}
      
    />
  );
}
