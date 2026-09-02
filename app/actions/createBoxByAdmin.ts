"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";


export async function createBoxByAdmin(formData: FormData) {
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

    const tenantId = profile.tenant_id;
    const customer_id = formData.get("client_id") as string;
    const tracking_number = formData.get("tracking_code") as string;
    const store_name = formData.get("store_name") as string;
    const store_location = formData.get("store_location") as string;
    const received_at = formData.get("received_at") as string;
    const notes = formData.get("notes") as string;
    const pre_alert_id = formData.get("pre_alert_id") as string;
    
    if (!tracking_number) {
      return { error: "O Rastreio é obrigatório." };
    }

    const supabaseAdmin = createAdminClient();

    // Handle Photo Upload
    const photo = formData.get("photo") as File;
    let photoUrls: string[] = [];

    if (photo && photo.size > 0) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('boxes')
        .upload(fileName, photo, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return { error: "Erro ao fazer upload da foto: " + uploadError.message };
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('boxes')
        .getPublicUrl(fileName);

      if (publicUrlData) {
        photoUrls.push(publicUrlData.publicUrl);
      }
    }

    // Insert Box
    const { data: insertedBox, error: insertError } = await supabaseAdmin
      .from('boxes')
      .insert({
        tenant_id: tenantId,
        customer_id: customer_id || null,
        tracking_number: tracking_number,
        store_name: store_name || null,
        store_location: store_location || null,
        received_at: received_at ? new Date(received_at).toISOString() : new Date().toISOString(),
        notes: notes || null,
        status: 'RECEIVED',
        photos: photoUrls.length > 0 ? photoUrls : null
      }).select("id").single();

    if (insertError) {
      return { error: "Erro ao registrar caixa: " + insertError.message };
    }

    if (pre_alert_id && insertedBox) {
      await supabaseAdmin
        .from('pre_alerts')
        .update({ status: 'received', box_id: insertedBox.id })
        .eq('id', pre_alert_id);
    }

    revalidatePath("/admin/boxes");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro interno no servidor." };
  }
}
