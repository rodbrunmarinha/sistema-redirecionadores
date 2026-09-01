"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function previewBoxAction(payload: string) {
  try {
    await requirePermission("packages.view"); // Assuming general package view is enough

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autorizado");

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.tenant_id) throw new Error("Tenant não encontrado");

    // Check with RPC (handles full UUID, short UUID, and tracking_number)
    const { data: boxData, error } = await supabase
      .rpc('search_scanner_box', { 
        p_tenant_id: profile.tenant_id, 
        p_search: payload.trim() 
      });

    if (error) throw new Error(error.message);
    if (!boxData) {
      throw new Error("Caixa não encontrada ou não está no status recebida.");
    }

    // Get suggestions (top 3 empty locations)
    const { data: suggestions } = await supabase
      .from('warehouse_locations')
      .select('id, code, capacity, boxes(count)')
      .eq('tenant_id', profile.tenant_id)
      .eq('is_active', true)
      .is('deleted_at', null)
      .limit(3);
      
    const mappedSuggestions = (suggestions || []).map(s => {
      const bCount = (s.boxes && s.boxes[0]) ? s.boxes[0].count : 0;
      return {
        id: s.id,
        code: s.code,
        available: s.capacity ? Math.max(0, s.capacity - bCount) : null
      }
    });

    return { 
      success: true, 
      box: boxData, // boxData already matches {id, tracking_code, store_name, warehouse_location_code}
      suggestions: mappedSuggestions
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function previewLocationAction(payload: string) {
  try {
    await requirePermission("packages.view");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autorizado");

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error("Tenant não encontrado");

    let isId = false;
    let searchValue = payload;
    
    if (payload.startsWith("DOCKDROP_LOC:")) {
      isId = true;
      searchValue = payload.replace("DOCKDROP_LOC:", "");
    }

    let query = supabase
      .from('warehouse_locations')
      .select('id, code, name, capacity, boxes(id)')
      .eq('tenant_id', profile.tenant_id)
      .is('deleted_at', null);

    if (isId) {
      query = query.eq('id', searchValue);
    } else {
      query = query.eq('code', searchValue);
    }

    const { data: locations, error } = await query;
    if (error) throw new Error(error.message);
    
    if (!locations || locations.length === 0) {
      throw new Error("Localização não encontrada.");
    }
    
    const loc = locations[0];
    const boxesCount = loc.boxes ? loc.boxes.length : 0;
    const isFull = loc.capacity ? boxesCount >= loc.capacity : false;
    const percent = loc.capacity ? Math.round((boxesCount / loc.capacity) * 100) : 0;

    return { 
      success: true, 
      location: {
        id: loc.id,
        code: loc.code,
        name: loc.name,
        capacity: loc.capacity,
        boxes_count: boxesCount,
        is_full: isFull,
        percent
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignLocationAction(boxIds: string[], locationId: string) {
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

    if (!profile) throw new Error("Tenant não encontrado");

    // Check ownership of boxes and get their OLD locations
    const { data: boxesCheck } = await supabase
      .from('boxes')
      .select('id, location_id')
      .eq('tenant_id', profile.tenant_id)
      .in('id', boxIds);
      
    if (!boxesCheck || boxesCheck.length !== boxIds.length) {
      throw new Error("Uma ou mais caixas não foram encontradas no seu tenant.");
    }

    // Check ownership of location
    const { data: locCheck } = await supabase
      .from('warehouse_locations')
      .select('id')
      .eq('tenant_id', profile.tenant_id)
      .eq('id', locationId)
      .single();
      
    if (!locCheck) {
      throw new Error("Localização não encontrada.");
    }

    const supabaseAdmin = createAdminClient();
    
    // Update boxes
    const { error } = await supabaseAdmin
      .from('boxes')
      .update({ location_id: locationId })
      .in('id', boxIds);

    if (error) throw new Error(error.message);

    // Insert movements
    const movements = boxesCheck.map(box => ({
      tenant_id: profile.tenant_id,
      box_id: box.id,
      old_location_id: box.location_id,
      new_location_id: locationId,
      created_by: user.id
    }));

    if (movements.length > 0) {
      await supabaseAdmin.from('warehouse_movements').insert(movements);
    }

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/warehouse/locations");
    revalidatePath("/admin/warehouse/scan");
    
    return { success: true, message: `${boxIds.length} caixas vinculadas com sucesso!` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}