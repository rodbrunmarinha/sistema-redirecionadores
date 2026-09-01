"use server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function searchBoxesAction(q: string, subdomain: string) {
  try {
    if (!q || q.length < 2) return { data: [] };
    
    const supabase = createAdminClient();
    const { data: tenant } = await supabase.from("tenants").select("id").eq("subdomain", subdomain).single();
    if (!tenant) return { data: [] };
    
    const { data: boxes, error } = await supabase
      .from("boxes")
      .select("id, tracking_number, store_name, profiles!boxes_customer_id_fkey(full_name, suite_number)")
      .eq("tenant_id", tenant.id)
      .eq("status", "RECEIVED")
      .or(`tracking_number.ilike.%${q}%,store_name.ilike.%${q}%,id.eq.${q.match(/^[0-9a-fA-F-]{36}$/) ? q : '00000000-0000-0000-0000-000000000000'}`)
      .limit(10);
      
    if (error) {
      console.error(error);
      return { data: [] };
    }
    
    return { 
      data: boxes.map(b => ({
        id: b.id,
        label: `${b.store_name || 'S/ Loja'} · ${b.tracking_number || 'S/ Rastreio'} · Dock ${(b.profiles as any)?.suite_number || ((b.profiles as any)?.[0]?.suite_number) || '-'}`
      })) 
    };
  } catch (error: any) {
    return { data: [] };
  }
}

export async function matchPreAlertToBoxAction(preAlertId: string, boxId: string, subdomain: string) {
  try {
    const supabase = createAdminClient();
    
    // Update pre_alert with status received and box_id
    const { error: preAlertError } = await supabase
      .from("pre_alerts")
      .update({ status: 'received', box_id: boxId })
      .eq("id", preAlertId);
      
    if (preAlertError) throw preAlertError;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unlinkPreAlertBoxAction(preAlertId: string, subdomain: string) {
  try {
    const supabase = createAdminClient();
    
    // Remove box_id and revert status
    const { error: preAlertError } = await supabase
      .from("pre_alerts")
      .update({ status: 'pending', box_id: null })
      .eq("id", preAlertId);
      
    if (preAlertError) throw preAlertError;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSuggestedBoxesAction(customerId: string, trackingNumber: string | null, subdomain: string) {
  try {
    const supabase = createAdminClient();
    
    // Get tenant
    const { data: tenant } = await supabase.from("tenants").select("id").eq("subdomain", subdomain).single();
    if (!tenant || !customerId) return { data: [] };

    // Fetch boxes for this customer, tenant, and status = RECEIVED
    const { data: boxes } = await supabase
      .from("boxes")
      .select("id, tracking_number, store_name, created_at, profiles!boxes_customer_id_fkey(full_name, suite_number)")
      .eq("tenant_id", tenant.id)
      .eq("customer_id", customerId)
      .eq("status", "RECEIVED")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!boxes) return { data: [] };
    
    // Sort so exact tracking number comes first
    const sortedBoxes = boxes.sort((a, b) => {
      const aMatch = trackingNumber && a.tracking_number === trackingNumber ? 1 : 0;
      const bMatch = trackingNumber && b.tracking_number === trackingNumber ? 1 : 0;
      return bMatch - aMatch;
    });
    
    return { 
      data: sortedBoxes.map(b => ({
        id: b.id,
        tracking_number: b.tracking_number,
        is_exact_match: trackingNumber ? b.tracking_number === trackingNumber : false,
        label: `${b.store_name || 'S/ Loja'} · ${b.tracking_number || 'S/ Rastreio'} · Dock ${((b.profiles as any)?.suite_number) || (((b.profiles as any)?.[0]?.suite_number)) || '-'}`
      })) 
    };

  } catch (error: any) {
    console.error(error);
    return { data: [] };
  }
}
