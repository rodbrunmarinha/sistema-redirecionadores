"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAssistedPurchase(
  tenantId: string,
  userId: string,
  data: {
    product_url: string;
    product_name: string;
    product_options: string;
    quantity: number;
    unit_price: number;
  }
) {
  const supabase = await createClient();

  const { data: purchase, error } = await supabase
    .from("assisted_purchases")
    .insert({
      tenant_id: tenantId,
      user_id: userId,
      product_url: data.product_url,
      product_name: data.product_name,
      product_options: data.product_options,
      quantity: data.quantity,
      unit_price: data.unit_price,
      total_paid: 0,
      extra_amount_requested: 0,
      status: 'PENDING_PAYMENT'
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating assisted purchase:", error);
    return { error: "Erro ao criar solicitação." };
  }

  revalidatePath("/tenant/[subdomain]/app/online-purchases", "page");
  return { success: true, purchase };
}

export async function payAssistedPurchase(
  tenantId: string, 
  userId: string, 
  purchaseId: string
) {
  const supabase = await createClient();

  const { data: purchase, error: purchaseError } = await supabase
    .from("assisted_purchases")
    .select("*")
    .eq("id", purchaseId)
    .eq("user_id", userId)
    .eq("tenant_id", tenantId)
    .single();

  if (purchaseError || !purchase) return { error: "Compra não encontrada." };
  if (purchase.status !== 'PENDING_PAYMENT') return { error: "Status inválido para pagamento inicial." };

  const amountToPay = purchase.unit_price * purchase.quantity;

  // Usa o RPC para garantia de Atomicidade (FOR UPDATE)
  const { data: paymentResult, error: paymentError } = await supabase.rpc(
    "process_wallet_payment",
    {
      p_customer_id: userId,
      p_tenant_id: tenantId,
      p_amount: amountToPay,
      p_type: 'PURCHASE',
      p_reference_type: 'ASSISTED_PURCHASE',
      p_reference_id: purchase.id,
      p_description: "Pagamento de Compra Assistida: " + purchase.product_name
    }
  );

  if (paymentError) {
    return { error: paymentError.message || "Erro de saldo ou concorrência." };
  }

  const { error: updatePurchaseError } = await supabase
    .from("assisted_purchases")
    .update({ 
      status: 'PAID_PENDING_PURCHASE', 
      total_paid: purchase.total_paid + amountToPay 
    })
    .eq("id", purchase.id);

  if (updatePurchaseError) return { error: "Erro ao atualizar status do pedido." };

  revalidatePath("/tenant/[subdomain]/app/online-purchases", "page");
  return { success: true };
}

export async function payExtraAmountAssistedPurchase(
  tenantId: string, 
  userId: string, 
  purchaseId: string
) {
  const supabase = await createClient();

  const { data: purchase, error: purchaseError } = await supabase
    .from("assisted_purchases")
    .select("*")
    .eq("id", purchaseId)
    .eq("user_id", userId)
    .eq("tenant_id", tenantId)
    .single();

  if (purchaseError || !purchase) return { error: "Compra não encontrada." };
  if (purchase.status !== 'PENDING_EXTRA_PAYMENT') return { error: "Status inválido para pagamento extra." };

  const amountToPay = purchase.extra_amount_requested;

  // Usa o RPC para garantia de Atomicidade (FOR UPDATE)
  const { data: paymentResult, error: paymentError } = await supabase.rpc(
    "process_wallet_payment",
    {
      p_customer_id: userId,
      p_tenant_id: tenantId,
      p_amount: amountToPay,
      p_type: 'PURCHASE',
      p_reference_type: 'ASSISTED_PURCHASE',
      p_reference_id: purchase.id,
      p_description: "Pagamento Extra: Compra Assistida " + purchase.product_name
    }
  );

  if (paymentError) {
    return { error: paymentError.message || "Erro de saldo ou concorrência." };
  }

  const { error: updatePurchaseError } = await supabase
    .from("assisted_purchases")
    .update({ 
      status: 'PAID_PENDING_PURCHASE', 
      total_paid: purchase.total_paid + amountToPay,
      extra_amount_requested: 0,
      admin_notes: null
    })
    .eq("id", purchase.id);

  if (updatePurchaseError) return { error: "Erro ao atualizar status." };

  revalidatePath("/tenant/[subdomain]/app/online-purchases", "page");
  return { success: true };
}

export async function getProductOgImage(url: string) {
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }, 
      next: { revalidate: 86400 } 
    });
    const html = await res.text();
    const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) 
               || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    if (match && match[1]) {
      let imageUrl = match[1];
      if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
      else if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = urlObj.origin + imageUrl;
      }
      return imageUrl;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function deleteAssistedPurchase(tenantId: string, userId: string, purchaseId: string) {
  const supabase = await createClient();
  
  // Apenas excluir se o status for PENDING_PAYMENT
  const { data: purchase } = await supabase
    .from('assisted_purchases')
    .select('status')
    .eq('id', purchaseId)
    .eq('customer_id', userId)
    .single();
    
  if (!purchase) return { error: 'Compra não encontrada.' };
  if (purchase.status !== 'PENDING_PAYMENT') return { error: 'Você só pode excluir compras que ainda não foram pagas.' };

  const { error } = await supabase
    .from('assisted_purchases')
    .delete()
    .eq('id', purchaseId);

  if (error) return { error: error.message };

  revalidatePath(`/tenant/${tenantId}/app/online-purchases`);
  return { success: true };
}
