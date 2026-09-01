"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createVipProgram(tenantId: string, data: any) {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Não autorizado." };
  }

  // Validação simples
  if (!data.name || data.name.trim() === "") {
    return { error: "O nome do programa é obrigatório." };
  }
  if (data.price === undefined || data.price < 0) {
    return { error: "O preço deve ser maior ou igual a zero." };
  }

  const { error } = await supabase
    .from("vip_programs")
    .insert({
      tenant_id: tenantId,
      name: data.name.trim(),
      template_key: data.template_key || 'basic',
      description: data.description || null,
      billing_cycle: data.billing_cycle || 'monthly',
      price: data.price,
      trial_days: data.trial_days || 0,
      grace_days: data.grace_days || 3,
      stacking_mode: data.stacking_mode || 'best_price',
      status: data.status || 'draft'
    });

  if (error) {
    console.error("Error creating VIP program:", error);
    return { error: "Erro ao criar programa VIP." };
  }

  revalidatePath("/tenant/[subdomain]/admin/vip-programs", "page");
  return { success: true };
}

export async function getVipPrograms(tenantId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("vip_programs")
    .select("*, vip_program_benefits(*)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching VIP programs:", error);
    return [];
  }

  return data;
}

export async function updateVipProgram(tenantId: string, programId: string, data: any) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: "Não autorizado." };

  if (!data.name || data.name.trim() === "") {
    return { error: "O nome do programa é obrigatório." };
  }
  if (data.price === undefined || data.price < 0) {
    return { error: "O preço deve ser maior ou igual a zero." };
  }

  const { error } = await supabase
    .from("vip_programs")
    .update({
      name: data.name.trim(),
      billing_cycle: data.billing_cycle,
      price: data.price,
      stacking_mode: data.stacking_mode,
      status: data.status
    })
    .eq("id", programId)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("Error updating VIP program:", error);
    return { error: "Erro ao atualizar programa VIP." };
  }

  revalidatePath("/tenant/[subdomain]/admin/vip-programs", "page");
  return { success: true };
}

export async function updateVipProgramBenefits(tenantId: string, programId: string, benefits: any[]) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: "Não autorizado." };

  // For simplicity, we can upsert all benefits sent from the client
  // Ensure tenant_id and program_id are enforced
  const upsertData = benefits.map((b: any) => ({
    tenant_id: tenantId,
    program_id: programId,
    benefit_key: b.benefit_key,
    benefit_type: b.benefit_type,
    value: b.value,
    min_value: b.min_value || 0,
    max_value: b.max_value || null,
    is_active: b.is_active
  }));

  const { error } = await supabase
    .from("vip_program_benefits")
    .upsert(upsertData, { onConflict: 'program_id, benefit_key' });

  if (error) {
    console.error("Error updating VIP benefits:", error);
    return { error: "Erro ao atualizar benefícios VIP." };
  }

  revalidatePath("/tenant/[subdomain]/admin/vip-programs", "page");
  return { success: true };
}

export async function deleteVipProgram(tenantId: string, programId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("vip_programs")
    .delete()
    .eq("id", programId)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("Error deleting VIP program:", error);
    return { error: "Erro ao excluir programa VIP." };
  }

  revalidatePath("/tenant/[subdomain]/admin/vip-programs", "page");
  return { success: true };
}
