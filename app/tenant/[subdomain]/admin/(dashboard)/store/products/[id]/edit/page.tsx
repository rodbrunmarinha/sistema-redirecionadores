import { Suspense } from "react";
import ProductEditClient from "./ProductEditClient";
import { getStoreProductById, getStoreCategories } from "../../_actions/products";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ProductEditPage(props: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { subdomain, id } = await props.params;

  // Since we might not have getTenantIdBySubdomain imported correctly, we can do it via supabase
  const supabase = await createClient();
  const { data: tenantData } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenantData) {
    return notFound();
  }

  const tenantId = tenantData.id;

  const product = await getStoreProductById(tenantId, id);
  
  if (!product) {
    return notFound();
  }
  
  const categories = await getStoreCategories(tenantId);

  // Map db fields to client expectations
  const formattedProduct = {
    ...product,
    categoryId: product.category_id || "",
    shortDescription: product.short_description || "",
    description: product.full_description || "",
    compareAtPrice: product.compare_at_price,
    stockQuantity: product.stock_quantity,
    maxPerCustomer: product.max_per_customer,
    weight: product.weight_kg,
    sortOrder: product.sort_order,
    isActive: product.is_active,
    isFeatured: product.is_featured,
    trackStock: product.track_stock,
    allowBackorders: product.allow_backorders,
    mainImage: product.main_image || "https://placehold.co/400x400/18181b/52525b?text=Sem+Imagem",
    galleryImages: (product.gallery_images || []).map((url: string, index: number) => ({ id: String(index), url })),
  };

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 flex justify-center items-center h-full">Carregando produto...</div>}>
      <ProductEditClient product={formattedProduct} categories={categories} tenantId={tenantId} subdomain={subdomain} />
    </Suspense>
  );
}
