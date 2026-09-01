"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function generateLocationsGridAction(data: {
  zone: string;
  prefix: string;
  separator: string;
  rows: number;
  cols: number;
  capacity?: number;
  pad: boolean;
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

    const locationsToInsert = [];
    const prefix = data.prefix || "";
    const sep = data.separator || "";
    const cap = data.capacity || null;

    for (let r = 1; r <= data.rows; r++) {
      for (let c = 1; c <= data.cols; c++) {
        const rowStr = data.pad ? String(r).padStart(2, "0") : String(r);
        const colStr = data.pad ? String(c).padStart(2, "0") : String(c);
        const code = `${prefix}${sep}${rowStr}${sep}${colStr}`;
        const name = `Posição ${code}`;

        locationsToInsert.push({
          tenant_id: profile.tenant_id,
          code,
          name,
          zone: data.zone,
          grid_row: r,
          grid_col: c,
          capacity: cap,
          sort_order: (r * 100) + c,
          is_active: true
        });
      }
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from("warehouse_locations")
      .insert(locationsToInsert);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/warehouse/locations");
    return { success: true, count: locationsToInsert.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
