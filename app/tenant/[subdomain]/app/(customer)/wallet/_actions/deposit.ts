'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const depositSchema = z.object({
  amount: z.number().positive('O valor deve ser maior que zero'),
});

export async function processDeposit(
  subdomain: string,
  payload: z.infer<typeof depositSchema>
) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // 2. Fetch tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (!tenant) {
      return { success: false, error: 'Tenant não encontrado' };
    }

    // Validate payload
    const parsed = depositSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: 'Valor inválido' };
    }

    const { amount } = parsed.data;

    // Simulate Payment Gateway approval delay (e.g. Stripe, PayPal, Pix)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3. Process deposit via Admin RPC (Secure)
    const { data: paymentResult, error: paymentError } = await supabaseAdmin.rpc('process_wallet_deposit', {
      p_customer_id: user.id,
      p_tenant_id: tenant.id,
      p_amount: amount,
      p_reference_type: 'WALLET_TRANSACTION',
      p_reference_id: null,
      p_description: 'Recarga via Gateway (Simulação)'
    });

    if (paymentError) {
      console.error("Deposit error:", paymentError);
      return { success: false, error: paymentError.message || 'Erro ao processar depósito.' };
    }

    // Revalidate the wallet page to show new balance and transaction
    revalidatePath(`/tenant/${subdomain}/app/(customer)/wallet`);

    return { success: true, newBalance: paymentResult.new_balance };

  } catch (err: any) {
    console.error("Deposit exception:", err);
    return { success: false, error: 'Erro interno ao processar depósito.' };
  }
}
