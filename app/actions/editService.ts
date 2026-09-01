"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function editServiceAction(id: string, data: {
  name: string;
  description: string;
  icon: string;
  priceType: string;
  basePrice: string;
  estimatedDays: string;
  requiresApproval: boolean;
  autoRelease: boolean;
  chargeFreightUpfront: boolean;
  requiresProductSelection: boolean;
  allowQuantity: boolean;
  serviceAction: string;
  actionDays: string;
  isActive: boolean;
  paymentMode: string;
  depositAmount: string;
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
    const tenantId = profile.tenant_id;

    const supabaseAdmin = createAdminClient();
    
    // Verify tenant ownership
    const { data: service } = await supabaseAdmin
      .from("services")
      .select("tenant_id")
      .eq("id", id)
      .single();
      
    if (!service || service.tenant_id !== tenantId) {
      throw new Error("Serviço não encontrado");
    }
    
    let price = null;
    let payment_mode = data.paymentMode;
    let deposit_amount = null;

    if (data.priceType === 'quote') {
      payment_mode = 'after_completion';
    } else {
      if (data.basePrice) {
        price = parseFloat(data.basePrice.replace(',', '.'));
      }
    }

    if (payment_mode === 'pre_deposit') {
      if (data.depositAmount) {
        deposit_amount = parseFloat(data.depositAmount.replace(',', '.'));
      }
    }

    const estimated_days = data.estimatedDays ? parseInt(data.estimatedDays, 10) : null;
    const action_days = data.actionDays ? parseInt(data.actionDays, 10) : null;

    const { error } = await supabaseAdmin
      .from("services")
      .update({
        name: data.name,
        description: data.description,
        icon: data.icon,
        price_type: data.priceType,
        price,
        payment_mode,
        deposit_amount,
        estimated_days,
        requires_approval: data.requiresApproval,
        auto_release: data.autoRelease,
        charge_freight_upfront: data.chargeFreightUpfront,
        requires_product_selection: data.requiresProductSelection,
        allow_quantity: data.allowQuantity,
        is_active: data.isActive,
        service_action: data.serviceAction,
        action_days,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    revalidatePath("/admin/services");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
