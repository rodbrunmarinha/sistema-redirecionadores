"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function editLocationAction(id: string, data: {
  code: string;
  name: string;
  zone: string;
  grid_row: string;
  grid_col: string;
  capacity: string;
  sort_order: string;
  is_active: boolean;
  notes: string;
}) {
  try {
    await requirePermission("packages.create");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autorizado");

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.tenant_id) {
      throw new Error("Erro ao identificar tenant");
    }

    const supabaseAdmin = createAdminClient();
    
    // Check ownership
    const { data: location } = await supabaseAdmin
      .from("warehouse_locations")
      .select("tenant_id")
      .eq("id", id)
      .single();
      
    if (!location || location.tenant_id !== profile.tenant_id) {
      throw new Error("Localização não encontrada");
    }

    const { error } = await supabaseAdmin
      .from("warehouse_locations")
      .update({
        code: data.code,
        name: data.name,
        zone: data.zone,
        grid_row: data.grid_row ? parseInt(data.grid_row, 10) : null,
        grid_col: data.grid_col ? parseInt(data.grid_col, 10) : null,
        capacity: data.capacity ? parseInt(data.capacity, 10) : null,
        sort_order: data.sort_order ? parseInt(data.sort_order, 10) : 0,
        is_active: data.is_active,
        notes: data.notes,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/warehouse/locations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
