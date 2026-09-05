import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage(props: { params: Promise<{ subdomain: string, id: string }> }) {
  const params = await props.params;
  const { subdomain, id } = params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/app/login");

  // Fetch product
  const { data: product } = await supabase
    .from('store_products')
    .select('*, store_categories(name)')
    .eq('tenant_id', tenant.id)
    .eq('id', id)
    .single();

  if (!product) notFound();

  // Parse gallery images
  const galleryImages = product.gallery_images || [];
  const images = galleryImages.map((url: string, index: number) => ({
    id: `gallery-${index}`,
    image_url: url
  }));

  return (
    <ProductDetailClient 
      tenant={tenant}
      subdomain={subdomain} 
      product={product}
      images={images}
    />
  );
}
