'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getShippingTypes(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shipping_types')
    .select('*, shipping_rates(id)')
    .eq('tenant_id', tenantId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching shipping types:', error);
    return [];
  }

  return data;
}

export async function deleteShippingType(typeId: string, subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { error } = await supabase
    .from('shipping_types')
    .delete()
    .eq('id', typeId);

  if (error) {
    console.error('Error deleting shipping type:', error);
    return { success: false, error: 'Falha ao excluir o tipo de frete.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/shipping`);
  return { success: true };
}

export async function reorderShippingTypes(orderedIds: string[], subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from('shipping_types')
      .update({ display_order: i })
      .eq('id', orderedIds[i]);
  }

  revalidatePath(`/tenant/${subdomain}/admin/shipping`);
  return { success: true };
}

export async function createShippingType(data: any, subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return { success: false, error: 'Tenant não encontrado.' };

  // Insert Shipping Type
  let ratesCount = 0;

// Insert Shipping Type
const { data: newType, error: insertError } = await supabase
    .from('shipping_types')
    .insert({
      tenant_id: tenant.id,
      name: data.name,
      display_order: data.sort_order || 0,
      is_active: data.is_active,
      requires_quote: data.requires_quote,
      requires_box_assembly: data.requires_box_assembly,
      skip_customs_declaration: data.skip_customs_declaration,
      charge_volumetric: data.charge_volumetric,
      volumetric_dimension_unit: data.volumetric_dimension_unit,
      volumetric_divisor: data.volumetric_divisor
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error creating shipping type:', insertError);
    return { success: false, error: 'Erro ao criar o tipo de frete.' };
  }

  // Generate Rates if its a table mode
  if (!data.requires_quote && data.min_weight !== undefined && data.max_weight !== undefined && data.weight_step !== undefined) {
    const minW = parseFloat(data.min_weight);
    const maxW = parseFloat(data.max_weight);
    const step = parseFloat(data.weight_step);
    
    if (minW >= 0 && maxW >= minW && step > 0) {
      const rates: any[] = [];
      
      if (data.generation_mode === 'limit') {
        let currentEnd = minW;
        let prevEnd = 0;
        while (currentEnd <= maxW) {
          rates.push({
            type_id: newType.id,
            weight_start: prevEnd === 0 ? 0 : Number((prevEnd + 0.001).toFixed(3)),
            weight_end: Number(currentEnd.toFixed(3)),
            price_cost: 0,
            price_sell: 0,
            fee_percentage: 0,
            is_active: true
          });
          prevEnd = currentEnd;
          currentEnd += step;
        }
      } else {
        let currentStart = minW;
        while (currentStart <= maxW) {
          let currentEnd = currentStart + step - 0.001;
          if (currentEnd > maxW) currentEnd = maxW;
          rates.push({
            type_id: newType.id,
            weight_start: Number(currentStart.toFixed(3)),
            weight_end: Number(currentEnd.toFixed(3)),
            price_cost: 0,
            price_sell: 0,
            fee_percentage: 0,
            is_active: true
          });
          currentStart += step;
        }
      }

      if (rates.length > 0) {
        ratesCount = rates.length;
        const { error: ratesError } = await supabase.from('shipping_rates').insert(rates);
        if (ratesError) {
          console.error('Error generating rates:', ratesError);
        }
      }
    }
  }

  revalidatePath(`/tenant/${subdomain}/admin/shipping`);
  return { success: true, id: newType.id, ratesCount };
}

export async function updateShippingTypeAndRates(data: any, subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return { success: false, error: 'Tenant não encontrado.' };

  // Update Shipping Type
  const { error: typeError } = await supabase
    .from('shipping_types')
    .update({
      name: data.type.name,
      requires_box_assembly: data.type.requires_box_assembly,
      skip_customs_declaration: data.type.skip_customs_declaration,
      charge_volumetric: data.type.charge_volumetric,
      volumetric_dimension_unit: data.type.volumetric_dimension_unit,
      volumetric_divisor: data.type.volumetric_divisor,
      allow_customer_edit_value: data.type.allow_customer_edit_value,
      customs_max_lines: data.type.customs_max_lines,
      customs_max_chars_per_line: data.type.customs_max_chars_per_line
    })
    .eq('id', data.type.id)
    .eq('tenant_id', tenant.id);

  if (typeError) {
    console.error('Error updating shipping type:', typeError);
    return { success: false, error: 'Erro ao atualizar tipo de frete.' };
  }

  // Update Rates
  for (const rate of data.rates) {
    await supabase
      .from('shipping_rates')
      .update({
        price_cost: rate.price_cost,
        price_sell: rate.price_sell,
        fee_percentage: rate.fee_percentage,
        box_extra_weight: rate.box_extra_weight,
        is_active: rate.is_active
      })
      .eq('id', rate.id);
  }

  revalidatePath(`/tenant/${subdomain}/admin/shipping`);
  return { success: true };
}


export async function updateShippingTypeStatus(typeId: string, isActive: boolean, subdomain: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('shipping_types').update({ is_active: isActive }).eq('id', typeId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/tenant/${subdomain}/admin/(dashboard)/shipping`, 'page');
  return { success: true };
}

export async function updateShippingTypeName(typeId: string, name: string, subdomain: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('shipping_types').update({ name }).eq('id', typeId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/tenant/${subdomain}/admin/(dashboard)/shipping`, 'page');
  return { success: true };
}

export async function duplicateShippingType(typeId: string, subdomain: string) {
  const supabase = await createClient();
  const { data: tenant } = await supabase.from('tenants').select('id').eq('subdomain', subdomain).single();
  if (!tenant) return { success: false, error: 'Tenant not found' };
  
  const { data: original, error: fetchErr } = await supabase.from('shipping_types').select('*, shipping_rates(*)').eq('id', typeId).single();
  if (fetchErr || !original) return { success: false, error: fetchErr?.message };
  
  const { data: newType, error: insErr } = await supabase.from('shipping_types').insert({
    tenant_id: tenant.id,
    name: original.name + ' (Cópia)',
    sort_order: (original.sort_order || 0) + 1,
    is_active: false,
    customs_max_lines: original.customs_max_lines,
    customs_max_chars_per_line: original.customs_max_chars_per_line,
    allow_customer_edit_value: original.allow_customer_edit_value
  }).select().single();
  
  if (insErr) return { success: false, error: insErr.message };
  
  if (original.shipping_rates && original.shipping_rates.length > 0) {
    const newRates = original.shipping_rates.map((r: any) => ({
      type_id: newType.id,
      weight_start: r.weight_start,
      weight_end: r.weight_end,
      price_cost: r.price_cost,
      price_sell: r.price_sell,
      fee_percentage: r.fee_percentage,
      box_extra_weight: r.box_extra_weight,
      is_active: r.is_active
    }));
    await supabase.from('shipping_rates').insert(newRates);
  }
  
  revalidatePath(`/tenant/${subdomain}/admin/(dashboard)/shipping`, 'page');
  return { success: true };
}
