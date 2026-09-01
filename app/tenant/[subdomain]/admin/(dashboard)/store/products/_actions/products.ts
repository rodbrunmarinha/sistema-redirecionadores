"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStoreCategories(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("store_categories")
    .select("id, name")
    .eq("tenant_id", tenantId)
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export async function createStoreCategory(tenantId: string, name: string) {
  const supabase = await createClient();
  
  if (!name || name.trim() === "") {
    return { error: "Nome da categoria é obrigatório." };
  }

  const { data, error } = await supabase
    .from("store_categories")
    .insert({
      tenant_id: tenantId,
      name: name.trim()
    })
    .select("id, name")
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return { error: "Erro ao criar categoria." };
  }

  revalidatePath("/tenant/[subdomain]/admin/store/products/create", "page");
  return { data };
}

export async function createStoreProduct(tenantId: string, productData: any) {
  const supabase = await createClient();
  
  // Basic validation
  if (!productData.name || productData.name.trim() === "") {
    return { error: "O nome do produto é obrigatório." };
  }
  if (productData.price === undefined || productData.price < 0) {
    return { error: "O preço deve ser maior ou igual a zero." };
  }

  const insertData = {
    tenant_id: tenantId,
    category_id: productData.category_id || null,
    name: productData.name,
    sku: productData.sku || null,
    short_description: productData.short_description || null,
    full_description: productData.full_description || null,
    price: productData.price,
    compare_at_price: productData.compare_at_price || null,
    cost: productData.cost || null,
    stock_quantity: productData.stock_quantity || 0,
    max_per_customer: productData.max_per_customer || null,
    weight_kg: productData.weight_kg || 0,
    sort_order: productData.sort_order || 0,
    is_active: productData.is_active,
    is_featured: productData.is_featured,
    track_stock: productData.track_stock,
    allow_backorders: productData.allow_backorders,
    has_variations: productData.has_variations,
    // main_image and gallery_images will be handled later when we implement upload
    main_image: null,
    gallery_images: []
  };

  const { data: product, error: productError } = await supabase
    .from("store_products")
    .insert(insertData)
    .select("id")
    .single();

  if (productError) {
    console.error("Error creating product:", productError);
    return { error: "Erro ao criar produto." };
  }

  // Handle variations if any
  if (productData.has_variations && productData.variations && productData.variations.length > 0) {
    const variationsToInsert = productData.variations.map((v: any) => ({
      tenant_id: tenantId,
      product_id: product.id,
      name: v.name,
      sku: v.sku || null,
      stock_quantity: v.stock || 0,
      price: v.price ? parseFloat(v.price) : null
    }));

    const { error: varError } = await supabase
      .from("store_product_variations")
      .insert(variationsToInsert);

    if (varError) {
      console.error("Error creating variations:", varError);
      // We don't fail the whole request, but log it
    }
  }

  revalidatePath("/tenant/[subdomain]/admin/store/products", "page");
  return { success: true, productId: product.id };
}


export async function getStoreProducts(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('store_products')
    .select('*, store_categories(name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export async function getStoreProductById(tenantId: string, productId: string) {
  const supabase = await createClient();
  
  // Need session check for security if it's admin route, but maybe it's fine since it just reads
  
  const { data: product, error: productError } = await supabase
    .from("store_products")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", productId)
    .single();

  if (productError || !product) {
    console.error("Error fetching product:", productError);
    return null;
  }

  const { data: variations, error: varError } = await supabase
    .from("store_product_variations")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("product_id", productId);
    
  if (varError) {
    console.error("Error fetching variations:", varError);
  }

  return {
    ...product,
    variations: variations || [],
    stats: { sales: 0, views: 0 } // Mock stats for now
  };
}

export async function updateStoreProduct(tenantId: string, productId: string, productData: any) {
  const supabase = await createClient();
  
  // Ensure user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Não autorizado." };
  }
  
  // Basic validation (ideally with Zod in a real app, but doing manually to ensure it works without knowing if zod is installed)
  if (!productData.name || productData.name.trim() === "") {
    return { error: "O nome do produto é obrigatório." };
  }
  if (productData.price === undefined || productData.price < 0) {
    return { error: "O preço deve ser maior ou igual a zero." };
  }

  const updateData = {
    category_id: productData.category_id || null,
    name: productData.name,
    sku: productData.sku || null,
    short_description: productData.short_description || null,
    full_description: productData.full_description || null,
    price: productData.price,
    compare_at_price: productData.compare_at_price || null,
    cost: productData.cost || null,
    stock_quantity: productData.stock_quantity || 0,
    max_per_customer: productData.max_per_customer || null,
    weight_kg: productData.weight_kg || 0,
    sort_order: productData.sort_order || 0,
    is_active: productData.is_active,
    is_featured: productData.is_featured,
    track_stock: productData.track_stock,
    allow_backorders: productData.allow_backorders,
    has_variations: productData.has_variations,
    updated_at: new Date().toISOString(),
  };

  const { error: productError } = await supabase
    .from("store_products")
    .update(updateData)
    .eq("id", productId)
    .eq("tenant_id", tenantId);

  if (productError) {
    console.error("Error updating product:", productError);
    return { error: "Erro ao atualizar produto." };
  }

  // Handle variations: Simple approach is to delete existing and insert new ones
  // In production, we might want to update existing by ID, but this is simpler
  if (productData.has_variations) {
    // Delete existing
    await supabase
      .from("store_product_variations")
      .delete()
      .eq("product_id", productId)
      .eq("tenant_id", tenantId);
      
    // Insert new
    if (productData.variations && productData.variations.length > 0) {
      const variationsToInsert = productData.variations.map((v: any) => ({
        tenant_id: tenantId,
        product_id: productId,
        name: v.name,
        sku: v.sku || null,
        stock_quantity: v.stock_quantity || 0,
        price: v.price ? parseFloat(v.price) : null
      }));

      const { error: varError } = await supabase
        .from("store_product_variations")
        .insert(variationsToInsert);

      if (varError) {
        console.error("Error updating variations:", varError);
      }
    }
  }

  revalidatePath(`/tenant/[subdomain]/admin/store/products`, "page");
  revalidatePath(`/tenant/[subdomain]/admin/store/products`, "page");
  revalidatePath(`/tenant/[subdomain]/admin/store/products/${productId}/edit`, "page");
  return { success: true };
}

export async function deleteStoreProduct(tenantId: string, productId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("store_products")
    .delete()
    .eq("id", productId)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: "Erro ao excluir produto." };
  }

  revalidatePath(`/tenant/[subdomain]/admin/store/products`, "page");
  return { success: true };
}
