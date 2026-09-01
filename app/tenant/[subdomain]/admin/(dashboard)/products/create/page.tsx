import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/utils/auth";
import CreateProductClient from "./CreateProductClient";

export default async function CreateProductPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  await requirePermission("packages.create");

  const resolvedParams = await searchParams;
  const box_id = resolvedParams.box_id;

  if (!box_id || typeof box_id !== "string") {
    // Should ideally show an error or redirect
    return <div className="p-8 text-white">Box ID é obrigatório. Volte à lista de caixas e tente novamente.</div>;
  }

  const supabase = await createClient();

  const { data: box } = await supabase
    .from("boxes")
    .select(`
      *,
      customer:customer_id ( full_name, suite_number )
    `)
    .eq("id", box_id)
    .is("deleted_at", null)
    .single();

  if (!box) {
    notFound();
  }

  return <CreateProductClient box={box} />;
}
