"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updatePersonalData(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const cpf = formData.get("cpf") as string;
  const birth_date = formData.get("birth_date") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ 
      full_name: name,
      phone,
      cpf,
      birth_date: birth_date ? birth_date : null
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/app/profile");
  return { success: true };
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { error: "Não autenticado" };

  const newEmail = formData.get("email") as string;
  const currentPassword = formData.get("current_password") as string;

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  });

  if (signInError) return { error: "Senha atual incorreta" };

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) return { error: error.message };

  revalidatePath("/app/profile");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { error: "Não autenticado" };

  const currentPassword = formData.get("current_password") as string;
  const newPassword = formData.get("password") as string;

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  });

  if (signInError) return { error: "Senha atual incorreta" };

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message };

  return { success: true };
}

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { error: "Não autenticado" };

  const password = formData.get("password") as string;

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: password
  });

  if (signInError) return { error: "Senha incorreta" };

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) return { error: error.message };

  return { success: true };
}
