"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCoupons(subdomain: string) {
  const supabase = await createClient();
  const { data: tenantData, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (tenantError || !tenantData) throw new Error("Tenant not found");

  const { data, error } = await supabase
    .from("store_coupons")
    .select("*")
    .eq("tenant_id", tenantData.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }

  return data;
}

export async function createCoupon(subdomain: string, formData: any) {
  const supabase = await createClient();
  
  const { data: tenantData } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenantData) throw new Error("Tenant not found");

  const { error } = await supabase
    .from("store_coupons")
    .insert([{ ...formData, tenant_id: tenantData.id }]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/tenant/${subdomain}/admin/coupons`);
}

export async function updateCoupon(subdomain: string, id: string, formData: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("store_coupons")
    .update(formData)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/tenant/${subdomain}/admin/coupons`);
}

export async function deleteCoupon(subdomain: string, id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("store_coupons")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/tenant/${subdomain}/admin/coupons`);
}

export async function toggleCouponStatus(subdomain: string, id: string, newStatus: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("store_coupons")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/tenant/${subdomain}/admin/coupons`);
}
