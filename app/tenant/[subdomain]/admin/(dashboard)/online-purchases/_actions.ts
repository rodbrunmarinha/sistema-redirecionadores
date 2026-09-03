"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsPurchased(tenantId: string, purchaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("assisted_purchases")
    .update({ status: 'PURCHASED' })
    .eq('id', purchaseId)
    .eq('tenant_id', tenantId);

  if (error) return { error: "Erro ao marcar como comprado." };
  revalidatePath("/tenant/[subdomain]/admin/online-purchases", "page");
  return { success: true };
}

export async function requestExtraPayment(tenantId: string, purchaseId: string, amount: number, note: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("assisted_purchases")
    .update({ 
      status: 'PENDING_EXTRA_PAYMENT',
      extra_amount_requested: amount,
      admin_notes: note
    })
    .eq('id', purchaseId)
    .eq('tenant_id', tenantId);

  if (error) return { error: "Erro ao solicitar pagamento extra." };
  revalidatePath("/tenant/[subdomain]/admin/online-purchases", "page");
  return { success: true };
}

export async function markAsOutOfStock(tenantId: string, purchaseId: string) {
  const supabase = await createClient();
  
  const { data: purchase, error: fetchError } = await supabase
    .from("assisted_purchases")
    .select("*")
    .eq('id', purchaseId)
    .eq('tenant_id', tenantId)
    .single();

  if (fetchError || !purchase) return { error: "Compra não encontrada." };
  if (purchase.status === 'OUT_OF_STOCK' || purchase.status === 'CANCELLED') {
    return { error: "Já cancelado ou esgotado." };
  }

  const refundAmount = purchase.total_paid;

  if (refundAmount > 0) {
    // Usa o RPC para garantia de Atomicidade na devolução
    const { error: refundError } = await supabase.rpc(
      "process_wallet_deposit",
      {
        p_customer_id: purchase.user_id,
        p_tenant_id: tenantId,
        p_amount: refundAmount,
        p_reference_type: 'ASSISTED_PURCHASE',
        p_reference_id: purchase.id,
        p_description: "Estorno: Produto Esgotado/Cancelado - " + purchase.product_name
      }
    );
    
    if (refundError) {
      return { error: "Erro ao processar estorno na carteira." };
    }
  }

  const { error } = await supabase
    .from("assisted_purchases")
    .update({ status: 'OUT_OF_STOCK', admin_notes: "Produto Esgotado. Valor estornado para a carteira." })
    .eq('id', purchaseId)
    .eq('tenant_id', tenantId);

  if (error) return { error: "Erro ao atualizar status." };
  revalidatePath("/tenant/[subdomain]/admin/online-purchases", "page");
  return { success: true };
}
