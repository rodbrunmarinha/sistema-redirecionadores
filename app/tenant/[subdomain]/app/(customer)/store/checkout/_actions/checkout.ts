'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Carrinho vazio'),
  notes: z.string().optional(),
  coupon_code: z.string().optional(),
});

export async function checkoutStoreCart(
  subdomain: string,
  payload: z.infer<typeof checkoutSchema>
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
      return { success: false, error: 'UsuÃ¡rio nÃ£o autenticado' };
    }

    // 2. Fetch tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (!tenant) {
      return { success: false, error: 'Tenant nÃ£o encontrado' };
    }

    // Validate payload
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: 'Dados invÃ¡lidos do carrinho' };
    }

    const { items, notes, coupon_code } = parsed.data; // 3. Fetch products from DB to verify prices and stock
    const productIds = items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('store_products')
      .select('id, name, price, stock_quantity')
      .eq('tenant_id', tenant.id)
      .in('id', productIds);

    if (productsError || !products || products.length !== items.length) {
      return { success: false, error: 'Alguns produtos nÃ£o foram encontrados.' };
    }

    // 4. Calculate total and check stock
    let totalAmount = 0;
    const orderItemsToInsert = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) continue;

      if (product.stock_quantity < item.quantity) {
        return { 
          success: false, 
          error: `Estoque insuficiente para o produto: ${product.name}. Apenas ${product.stock_quantity} disponÃ­veis.` 
        };
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsToInsert.push({
        tenant_id: tenant.id,
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: itemTotal
      });
    }

    // Validate coupon and calculate final amount
    let finalAmount = totalAmount;
    let appliedCouponId = null;

    if (coupon_code) {
      const couponResult = await validateCoupon(subdomain, coupon_code, totalAmount);
      if (couponResult.error) {
        return { success: false, error: couponResult.error };
      }
      if (couponResult.success) {
        finalAmount = Math.max(0, totalAmount - (couponResult.discount || 0));
        appliedCouponId = couponResult.coupon_id;
      }
    }

    // Generate a reference ID for this order before paying
    const orderId = crypto.randomUUID();

    // 5. Execute Wallet Payment (Secure RPC)
    const { data: paymentResult, error: paymentError } = await supabaseAdmin.rpc('process_wallet_payment', {
      p_customer_id: user.id,
      p_tenant_id: tenant.id,
      p_amount: finalAmount,
      p_type: 'PURCHASE',
      p_reference_type: 'STORE_ORDER',
      p_reference_id: orderId,
      p_description: 'Compra na Loja Virtual'
    });

    if (paymentError) {
      console.error("Payment error:", paymentError);
      return { success: false, error: paymentError.message || 'Erro ao processar pagamento. Verifique seu saldo.' };
    }

    const transactionId = paymentResult.transaction_id;

    // 6. Create Store Order
    const { error: orderError } = await supabaseAdmin
      .from('store_orders')
      .insert({
        id: orderId,
        tenant_id: tenant.id,
        customer_id: user.id,
        total_amount: finalAmount,
        status: 'COMPLETED',
        payment_transaction_id: transactionId,
        notes: notes || null
      });

    if (orderError) {
      console.error("Order creation error:", orderError);
      // NOTE: In a perfect world, we would reverse the payment if this fails.
      return { success: false, error: 'Pagamento aprovado, mas falha ao criar o pedido. Contate o suporte.' };
    }

    // 7. Insert Order Items
    const itemsWithOrderId = orderItemsToInsert.map(i => ({ ...i, order_id: orderId }));
    const { error: itemsError } = await supabaseAdmin
      .from('store_order_items')
      .insert(itemsWithOrderId);

    // 8. Create the Box in the Suite (Dock)
    const { data: newBox, error: boxError } = await supabaseAdmin
      .from('boxes')
      .insert({
        tenant_id: tenant.id,
        customer_id: user.id,
        tracking_number: `LOJA-${orderId.split('-')[0].toUpperCase()}`,
        status: 'RECEIVED',
        store_name: 'Loja Virtual',
        service_fee_exempt: true,
        notes: notes || 'Produtos adquiridos via Loja Virtual do sistema'
      })
      .select('id')
      .single();

    if (newBox) {
      // 9. Move products to the Box (Dock)
      const productsToInsert = items.map(item => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          tenant_id: tenant.id,
          customer_id: user.id,
          box_id: newBox.id,
          name: product?.name || 'Produto da Loja',
          quantity: item.quantity,
          price_paid: product?.price || 0,
          notes: 'Adquirido na Loja Virtual',
        };
      });

      await supabaseAdmin.from('products').insert(productsToInsert);
    }

    // 10. Decrement stock for store products
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        await supabaseAdmin
          .from('store_products')
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq('id', product.id);
      }
    }

    // 11. Update coupon usage count if a coupon was used
    if (appliedCouponId) {
      const { data: c } = await supabaseAdmin.from('store_coupons').select('usage_count').eq('id', appliedCouponId).single();
      if (c) {
        await supabaseAdmin.from('store_coupons').update({ usage_count: (c.usage_count || 0) + 1 }).eq('id', appliedCouponId);
      }
    }

    return { success: true, newBalance: paymentResult.new_balance, orderId };

  } catch (err: any) {
    console.error("Checkout exception:", err);
    return { success: false, error: 'Erro interno ao processar checkout.' };
  }
}

export async function validateCoupon(subdomain: string, code: string, cartTotal: number) {
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return { error: 'Loja não encontrada' };

  const { data: coupon, error } = await supabase
    .from('store_coupons')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('code', code.trim().toUpperCase())
    .eq('status', 'ACTIVE')
    .eq('applies_to_store', true)
    .single();

  if (error || !coupon) return { error: 'Cupom inválido ou expirado.' };

  if (coupon.min_purchase_amount && cartTotal < coupon.min_purchase_amount) {
    return { error: \Este cupom exige um carrinho de no mínimo \$ \\ };
  }

  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return { error: 'Este cupom atingiu o limite de usos.' };
  }

  if (coupon.end_date && new Date(coupon.end_date) < new Date()) {
    return { error: 'Este cupom está expirado.' };
  }
  
  if (coupon.start_date && new Date(coupon.start_date) > new Date()) {
    return { error: 'Este cupom ainda não está ativo.' };
  }

  // TODO: Implement VIP and Specific Customers logic if requested in the future

  let discount = 0;
  if (coupon.discount_type === 'PERCENTAGE') {
    discount = cartTotal * (coupon.discount_value / 100);
  } else {
    discount = coupon.discount_value;
  }
  
  if (discount > cartTotal) discount = cartTotal;

  return { success: true, discount, type: coupon.discount_type, value: coupon.discount_value, coupon_id: coupon.id, code: coupon.code };
}
