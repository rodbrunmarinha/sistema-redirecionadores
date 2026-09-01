"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/utils/auth";

export async function createFinancialTransaction(formData: FormData) {
  try { await requirePermission("financial.manage"); } catch(e:any) { return { error: e.message }; }
  const supabase = await createClient();

  // Get user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Não autorizado" };
  }

  // Get tenant id
  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.tenant_id) {
    return { error: "Tenant não encontrado" };
  }

  const tenant_id = profile.tenant_id;
  
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const transaction_date = formData.get("transaction_date") as string;
  const category = formData.get("category") as string;
  const reference = formData.get("reference") as string;
  const notes = formData.get("notes") as string;
  const attachment = formData.get("attachment") as File | null;

  let attachment_url = null;

  // Handle file upload
  if (attachment && attachment.size > 0) {
    const fileExt = attachment.name.split('.').pop();
    const fileName = `${tenant_id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('financial_attachments')
      .upload(fileName, attachment);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Erro ao fazer upload do comprovante." };
    }

    const { data: publicUrlData } = supabase.storage
      .from('financial_attachments')
      .getPublicUrl(fileName);
      
    attachment_url = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabase
    .from("financial_transactions")
    .insert({
      tenant_id,
      type,
      description,
      amount,
      transaction_date,
      category,
      reference,
      notes,
      attachment_url
    });

  if (insertError) {
    console.error("Insert error:", insertError);
    return { error: "Erro ao salvar a transação." };
  }

  revalidatePath('/admin/financial-module');
  return { success: true };
}
