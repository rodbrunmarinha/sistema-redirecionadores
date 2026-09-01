"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/utils/auth";

export async function editCustomer(formData: FormData) {
  try { await requirePermission("users.edit"); } catch (e: any) { return { error: e.message }; }

  const supabaseAdmin = createAdminClient();
  
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const customFreightRateStr = formData.get("custom_freight_rate") as string;
  const custom_freight_rate = customFreightRateStr ? parseFloat(customFreightRateStr) : null;
  const isActiveStr = formData.get("is_active");
  const is_active = isActiveStr === "1" || isActiveStr === "on";
  
  const password = formData.get("password") as string;
  const password_confirmation = formData.get("password_confirmation") as string;

  if (password && password !== password_confirmation) {
    return { error: "As senhas não coincidem." };
  }

  // 1. Update Auth User if email or password changed
  const updateData: any = {};
  if (email) updateData.email = email;
  if (password) updateData.password = password;

  if (Object.keys(updateData).length > 0) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);
    if (authError) {
      console.error("Auth update error:", authError);
      return { error: `Erro ao atualizar autenticação: ${authError.message}` };
    }
  }

  // 2. Update Profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: name,
      email: email, // sync email in profiles as well
      phone: phone,
      custom_freight_rate,
      is_active
    })
    .eq("id", id);

  if (profileError) {
    console.error("Profile update error:", profileError);
    return { error: `Erro ao atualizar perfil: ${profileError.message}` };
  }

  revalidatePath("/admin/clients");
  return { success: true };
}
