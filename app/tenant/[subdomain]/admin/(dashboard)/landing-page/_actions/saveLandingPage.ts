"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveLandingPageConfig(subdomain: string, landingPageConfig: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado" };

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenant) return { success: false, error: "Empresa não encontrada" };

  const { error } = await supabase
    .from("tenant_settings")
    .upsert({ 
      tenant_id: tenant.id,
      landing_page: landingPageConfig 
    }, { 
      onConflict: "tenant_id" 
    });

  if (error) {
    console.error(error);
    return { success: false, error: "Erro ao salvar as configurações" };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout"); // Clears all router cache to reflect changes everywhere

  return { success: true };
}
