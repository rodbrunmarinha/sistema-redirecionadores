import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ScannerClient from "./ScannerClient";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function ScannerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.tenant_id) {
    return notFound();
  }
  
  // Fetch quick locations
  const { data: quickLocations } = await supabase
    .from('warehouse_locations')
    .select('id, code, name')
    .eq('tenant_id', profile.tenant_id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .limit(8);

  // Fetch recent movements
  const { data: movementsData } = await supabase
    .from('warehouse_movements')
    .select(`
      id, 
      created_at, 
      boxes(id, tracking_number), 
      old_location:old_location_id(code), 
      new_location:new_location_id(code),
      profiles(full_name)
    `)
    .eq('tenant_id', profile.tenant_id)
    .order('created_at', { ascending: false })
    .limit(5);
    
  const formattedMovements = (movementsData || []).map(mov => ({
    id: mov.id,
    shortId: `#${(mov.boxes as any)?.id?.split('-')[0]}`,
    tracking: (mov.boxes as any)?.tracking_number,
    oldLoc: (mov.old_location as any)?.code || "Sem localização",
    newLoc: (mov.new_location as any)?.code || "Sem localização",
    user: (mov.profiles as any)?.full_name || "Desconhecido",
    timeAgo: formatDistanceToNow(new Date(mov.created_at), { addSuffix: true, locale: ptBR })
  }));

  return <ScannerClient initialQuickLocations={quickLocations || []} initialMovements={formattedMovements} />;
}
