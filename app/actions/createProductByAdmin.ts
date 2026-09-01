"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { logProductAudit } from "@/utils/auditLogger";

export async function createProductByAdmin(formData: FormData) {
  try {
    const { user, profile } = await requirePermission("packages.create");
    const adminId = user.id;
    const tenantId = profile.tenant_id;
    
    const boxId = formData.get("received_box_id") as string;
    if (!boxId) return { error: "Box ID é obrigatório." };

    const name = formData.get("name") as string;
    const barcode = formData.get("barcode") as string;
    const quantityStr = formData.get("quantity") as string;
    const weightStr = formData.get("weight") as string;
    const weightMode = formData.get("weight_mode") as string;
    const pricePaidStr = formData.get("price_paid") as string;
    const notes = formData.get("notes") as string;
    const isPerishable = formData.get("is_perishable") === "true";
    const expiryDate = formData.get("expiry_date") as string;
    const photo = formData.get("photo") as File;
    const saveAndAdd = formData.get("save_and_add") === "1";

    const quantity = parseInt(quantityStr, 10) || 1;
    const weightInput = parseFloat(weightStr) || 0;
    
    let unit_weight = 0;
    let total_weight = 0;
    
    if (weightMode === 'total') {
      total_weight = weightInput;
      unit_weight = weightInput / quantity;
    } else {
      unit_weight = weightInput;
      total_weight = weightInput * quantity;
    }

    const price_paid = pricePaidStr ? parseFloat(pricePaidStr) : null;

    const supabaseAdmin = createAdminClient();

    // Verify box exists and get tenant_id and customer_id
    const { data: box } = await supabaseAdmin.from('boxes').select('tenant_id, customer_id').is('deleted_at', null).eq('id', boxId).single();
    if (!box) return { error: "Caixa não encontrada." };

    let photoPaths: string[] = [];

    if (photo && photo.size > 0) {
      const ext = photo.name.split('.').pop();
      const fileName = `${box.tenant_id}/${boxId}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('products')
        .upload(fileName, photo, { contentType: photo.type });
        
      if (uploadError) {
        return { error: "Erro ao fazer upload da foto: " + uploadError.message };
      }
      photoPaths.push(fileName);
    }

    const { data: product, error: insertError } = await supabaseAdmin.from('products').insert({
      tenant_id: box.tenant_id,
      box_id: boxId,
      customer_id: box.customer_id,
      code: barcode || null,
      name,
      quantity,
      unit_weight,
      total_weight,
      price_paid,
      notes,
      photos: photoPaths,
      is_perishable: isPerishable,
      expiry_date: isPerishable && expiryDate ? expiryDate : null
    }).select().single();


    if (!insertError && product) {
       console.log('CRITICAL: Attempting to log product audit for product', product.id);
       await logProductAudit(tenantId, product.id, adminId, '__created__', null, `Produto "${product.name}" cadastrado (Qtd: ${product.quantity})`);
    }

    if (insertError) {
      return { error: "Erro ao criar produto: " + insertError.message };
    }

    revalidatePath(`/admin/boxes/${boxId}`);
    
    return { success: true, saveAndAdd, boxId };
  } catch (error: any) {
    return { error: error.message || "Erro interno no servidor." };
  }
}
