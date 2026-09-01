"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function transferBox(boxId: string, newCustomerId: string) {
  try {
    await requirePermission("packages.edit");

    if (!boxId || !newCustomerId) {
      return { error: "Caixa ou cliente não informados." };
    }

    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from('boxes')
      .update({ customer_id: newCustomerId })
      .eq('id', boxId);

    if (error) {
      return { error: "Erro ao transferir caixa: " + error.message };
    }

    const { error: productsError } = await supabaseAdmin
      .from('products')
      .update({ customer_id: newCustomerId })
      .eq('box_id', boxId);

    if (productsError) {
      return { error: "Caixa transferida, mas erro ao transferir os produtos: " + productsError.message };
    }

    revalidatePath("/admin/boxes");
    revalidatePath(`/admin/boxes/${boxId}`);
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro interno no servidor." };
  }
}
