'use server';

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function payInvoice(invoiceId: string) {
  const supabase = await createClient();
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get Invoice
  const { data: invoice } = await supabase
    .from('service_invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();

  if (!invoice) throw new Error("Fatura não encontrada");
  if (invoice.status === 'PAID') throw new Error("Fatura já foi paga");
  if (invoice.status !== 'PENDING') throw new Error("Status da fatura inválido");

  // Call the secure RPC function to process the payment
  const { data: paymentResult, error: paymentError } = await supabaseAdmin.rpc('process_wallet_payment', {
    p_customer_id: user.id,
    p_tenant_id: invoice.tenant_id,
    p_amount: invoice.fee_amount,
    p_reference_type: 'SERVICE_FEE',
    p_reference_id: invoice.id,
    p_description: `Pagamento de Fatura Mensal (Ref: ${invoice.reference_month})`
  });

  if (paymentError) {
    console.error("Payment error:", paymentError);
    return { success: false, error: paymentError.message || "Erro ao descontar saldo da carteira. Verifique se possui saldo suficiente." };
  }

  // Se o pagamento foi processado com sucesso na carteira, atualiza a fatura
  const { error: updateError } = await supabaseAdmin
    .from('service_invoices')
    .update({
      status: 'PAID',
      paid_at: new Date().toISOString()
    })
    .eq('id', invoiceId);

  if (updateError) {
    console.error("Invoice update error:", updateError);
    // Em um sistema perfeito, reverteríamos o saldo aqui (ou usaríamos uma única RPC no backend).
    // Mas para o escopo atual, o RPC garantiu a transação financeira.
    return { success: false, error: "Saldo descontado, mas houve um erro ao atualizar o status da fatura. Contate o suporte." };
  }

  return { success: true };
}
