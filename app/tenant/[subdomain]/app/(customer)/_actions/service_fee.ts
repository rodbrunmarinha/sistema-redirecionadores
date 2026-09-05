'use server';

import { createClient } from "@/utils/supabase/server";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export async function checkAndGenerateMonthlyInvoice(tenantId: string, customerId: string, settings: any) {
  if (settings?.service_fee_strategy !== 'MONTHLY_INVOICE') return;

  const supabase = await createClient();
  const now = new Date();
  // The invoice is generated for the PREVIOUS month
  const previousMonthDate = subMonths(now, 1);
  const referenceMonth = format(previousMonthDate, "yyyy-MM");

  // Check if invoice already exists
  const { data: existingInvoice } = await supabase
    .from('service_invoices')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('customer_id', customerId)
    .eq('reference_month', referenceMonth)
    .single();

  if (existingInvoice) return; // Already generated

  // Need to generate!
  const startDate = startOfMonth(previousMonthDate).toISOString();
  const endDate = endOfMonth(previousMonthDate).toISOString();

  // 1. Store Orders
  const { data: storeOrders } = await supabase
    .from('store_orders')
    .select('total_amount')
    .eq('tenant_id', tenantId)
    .eq('customer_id', customerId)
    .eq('status', 'COMPLETED')
    .gte('updated_at', startDate)
    .lte('updated_at', endDate);
  
  const storeSpent = (storeOrders || []).reduce((acc, order) => acc + Number(order.total_amount || 0), 0);

  // 2. Assisted Purchases
  // Assuming total_paid represents the products value minus shipping (usually shipping is charged separately in boxes)
  const { data: assistedPurchases } = await supabase
    .from('assisted_purchases')
    .select('total_paid')
    .eq('tenant_id', tenantId)
    .eq('user_id', customerId) // Notice it's user_id in this table
    .in('status', ['COMPLETED', 'RECEIVED', 'STORED']) // Need to check which status implies completion
    .gte('updated_at', startDate)
    .lte('updated_at', endDate);
  
  const assistedSpent = (assistedPurchases || []).reduce((acc, order) => acc + Number(order.total_paid || 0), 0);

  // 3. Purchase Groups
  const { data: groupOrders } = await supabase
    .from('purchase_group_orders')
    .select('total_amount')
    .eq('tenant_id', tenantId)
    .eq('user_id', customerId)
    .eq('status', 'COMPLETED')
    .gte('updated_at', startDate)
    .lte('updated_at', endDate);
  
  const groupsSpent = (groupOrders || []).reduce((acc, order) => acc + Number(order.total_amount || 0), 0);

  const otherSpent = assistedSpent + groupsSpent;
  const totalSpent = storeSpent + otherSpent;

  // Calculate Fee based on tiers
  const tiers = settings?.service_fee_tiers || [];
  let applicableTier = null;

  for (const tier of tiers) {
    if (totalSpent >= tier.min && totalSpent <= tier.max) {
      applicableTier = tier;
      break;
    }
  }

  // If no tier matches (e.g. spent 0), fee is 0
  let feeAmount = 0;
  if (applicableTier) {
    feeAmount += Number(applicableTier.fixed_fee || 0);
    
    const percentage = Number(applicableTier.percentage_fee || 0);
    if (percentage > 0) {
      if (settings?.service_fee_charge_store_percentage) {
        feeAmount += (totalSpent * percentage) / 100;
      } else {
        feeAmount += (otherSpent * percentage) / 100;
      }
    }
  }

  if (feeAmount <= 0 && totalSpent <= 0) {
    // If they spent nothing and there's no fixed fee for 0, we can either skip or create an empty paid invoice.
    // Let's create an empty paid invoice to avoid checking again next time.
    await supabase.from('service_invoices').insert({
      tenant_id: tenantId,
      customer_id: customerId,
      reference_month: referenceMonth,
      total_spent: 0,
      fee_amount: 0,
      status: 'PAID',
      paid_at: new Date().toISOString()
    });
    return;
  }

  // Insert the pending invoice
  await supabase.from('service_invoices').insert({
    tenant_id: tenantId,
    customer_id: customerId,
    reference_month: referenceMonth,
    total_spent: totalSpent,
    fee_amount: feeAmount,
    status: feeAmount > 0 ? 'PENDING' : 'PAID',
    paid_at: feeAmount > 0 ? null : new Date().toISOString()
  });

}


export async function calculateCurrentMonthSpend(tenantId: string, customerId: string, settings: any) {
  const supabase = await createClient();
  const now = new Date();
  
  const startDate = startOfMonth(now).toISOString();
  const endDate = endOfMonth(now).toISOString();

  // 1. Store Orders
  const { data: storeOrders } = await supabase
    .from('store_orders')
    .select('total_amount')
    .eq('tenant_id', tenantId)
    .eq('customer_id', customerId)
    .eq('status', 'COMPLETED')
    .gte('updated_at', startDate)
    .lte('updated_at', endDate);
  
  const storeSpent = (storeOrders || []).reduce((acc: any, order: any) => acc + Number(order.total_amount || 0), 0);

  // 2. Assisted Purchases
  const { data: assistedPurchases } = await supabase
    .from('assisted_purchases')
    .select('total_paid')
    .eq('tenant_id', tenantId)
    .eq('user_id', customerId)
    .in('status', ['COMPLETED', 'RECEIVED', 'STORED'])
    .gte('updated_at', startDate)
    .lte('updated_at', endDate);
  
  const assistedSpent = (assistedPurchases || []).reduce((acc: any, order: any) => acc + Number(order.total_paid || 0), 0);

  // 3. Purchase Groups
  const { data: groupOrders } = await supabase
    .from('purchase_group_orders')
    .select('total_amount')
    .eq('tenant_id', tenantId)
    .eq('user_id', customerId)
    .eq('status', 'COMPLETED')
    .gte('updated_at', startDate)
    .lte('updated_at', endDate);
  
  const groupsSpent = (groupOrders || []).reduce((acc: any, order: any) => acc + Number(order.total_amount || 0), 0);

  const otherSpent = assistedSpent + groupsSpent;
  const totalSpent = storeSpent + otherSpent;

  const tiers = settings?.service_fee_tiers || [];
  let applicableTier = null;

  for (const tier of tiers) {
    if (totalSpent >= tier.min && totalSpent <= tier.max) {
      applicableTier = tier;
      break;
    }
  }

  return { totalSpent, applicableTier };
}
