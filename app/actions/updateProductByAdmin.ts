
"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { logProductAudit } from "@/utils/auditLogger";

export async function updateProductByAdmin(productId: string, formData: FormData) {
  try {
    const { user, profile } = await requirePermission("packages.edit");
    const adminId = user.id;
    const tenantId = profile.tenant_id;
    
    const boxId = formData.get("received_box_id") as string;
    const customerId = formData.get("user_id") as string;
    const entryMode = formData.get("entry_mode") as string;
    
    if (entryMode === "box" && !boxId) return { error: "Box ID é obrigatório." };
    if (entryMode === "direct" && !customerId) return { error: "Cliente é obrigatório." };

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
    const createdAt = formData.get("created_at") as string;

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

    // Verify product exists
    const { data: existingProduct, error: fetchError } = await supabaseAdmin.from('products').select('*').is('deleted_at', null).eq('id', productId).single();
    if (fetchError || !existingProduct) return { error: "Produto não encontrado." };

    let targetBoxId = existingProduct.box_id;
    let targetCustomerId = existingProduct.customer_id;
    
    if (entryMode === "box" && boxId) {
        const { data: box } = await supabaseAdmin.from('boxes').select('customer_id').is('deleted_at', null).eq('id', boxId).single();
        if (box) {
            targetBoxId = boxId;
            targetCustomerId = box.customer_id;
        }
    } else if (entryMode === "direct" && customerId) {
        targetBoxId = null;
        targetCustomerId = customerId;
    }

    let photoPaths: string[] = existingProduct.photos || [];

    if (photo && photo.size > 0) {
      const ext = photo.name.split('.').pop();
      const folder = targetBoxId ? `${existingProduct.tenant_id}/${targetBoxId}` : `${existingProduct.tenant_id}/direct`;
      const fileName = `${folder}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('products')
        .upload(fileName, photo, { contentType: photo.type });
        
      if (uploadError) {
        return { error: "Erro ao fazer upload da foto: " + uploadError.message };
      }
      photoPaths = [fileName]; // Overwrite or push? Usually overwrite primary photo or add to array. I'll replace it to keep simple like create.
    }

    let updatePayload: any = {
      box_id: targetBoxId,
      customer_id: targetCustomerId,
      code: barcode || null,
      name,
      quantity,
      unit_weight,
      total_weight,
      price_paid,
      notes,
      photos: photoPaths,
      is_perishable: isPerishable,
      expiry_date: isPerishable && expiryDate ? expiryDate : null,
      updated_at: new Date().toISOString()
      
    };
    
    if (createdAt) {
      updatePayload.created_at = new Date(createdAt).toISOString();
    }

    const { error: updateError } = await supabaseAdmin.from('products').update(updatePayload).eq('id', productId);


    if (!updateError) {
      // Audit log diffing
      const diffs = [];
      if (existingProduct.name !== name) diffs.push({ field: 'name', old: existingProduct.name, new: name });
      if (existingProduct.quantity !== quantity) diffs.push({ field: 'quantity', old: existingProduct.quantity?.toString(), new: quantity?.toString() });
      if ((existingProduct.code || "") !== (barcode || "")) diffs.push({ field: 'barcode', old: existingProduct.code, new: barcode });
      if ((existingProduct.notes || "") !== (notes || "")) diffs.push({ field: 'notes', old: existingProduct.notes, new: notes });
      if (existingProduct.unit_weight !== unit_weight) diffs.push({ field: 'weight', old: existingProduct.unit_weight?.toString(), new: unit_weight?.toString() });
      if (existingProduct.box_id !== targetBoxId) diffs.push({ field: 'received_box_id', old: existingProduct.box_id, new: targetBoxId });
      if (existingProduct.customer_id !== targetCustomerId) diffs.push({ field: 'dock', old: existingProduct.customer_id, new: targetCustomerId });
      
      // If photos changed
      if (photoPaths.length > 0 && photoPaths[0] !== existingProduct.photos?.[0]) {
         diffs.push({ field: 'photo_path', old: existingProduct.photos?.[0] || null, new: photoPaths[0] });
      }

      if ((existingProduct.price_paid || 0) !== (price_paid || 0)) diffs.push({ field: 'price_paid', old: existingProduct.price_paid?.toString(), new: price_paid?.toString() });
      
      const oldPerishable = existingProduct.is_perishable || false;
      if (oldPerishable !== isPerishable) diffs.push({ field: 'is_perishable', old: oldPerishable.toString(), new: isPerishable.toString() });
      
      if ((existingProduct.expiry_date || "") !== (expiryDate || "")) diffs.push({ field: 'expiry_date', old: existingProduct.expiry_date, new: expiryDate });

      if (createdAt && (existingProduct.created_at || "") !== (updatePayload.created_at || "")) {
         diffs.push({ field: 'created_at', old: existingProduct.created_at, new: updatePayload.created_at });
      }

      console.log('CRITICAL: diffs evaluated:', diffs);
      for (const diff of diffs) {
        await logProductAudit(tenantId, productId, adminId, diff.field, diff.old, diff.new);
      }
    }

    if (updateError) {
      return { error: "Erro ao atualizar produto: " + updateError.message };
    }

    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/products/${productId}`);
    if (targetBoxId) {
       revalidatePath(`/admin/boxes/${targetBoxId}`);
    }
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro interno no servidor." };
  }
}
