import Link from "next/link";
import { 
  Package, 
  Map, 
  ScanBarcode, 
  MapPin, 
  CheckCircle, 
  PackageCheck, 
  PackageMinus, 
  TrendingUp, 
  ArrowRightLeft,
  Plus,
  Maximize2
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function WarehousePage() {
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

  // Fetch Stats
  const [{ count: locationsCount }, { count: activeLocationsCount }, { count: locatedBoxesCount }, { count: unlocatedBoxesCount }] = await Promise.all([
    supabase.from('warehouse_locations').select('*', { count: 'exact', head: true }).eq('tenant_id', profile.tenant_id).is('deleted_at', null),
    supabase.from('warehouse_locations').select('*', { count: 'exact', head: true }).eq('tenant_id', profile.tenant_id).eq('is_active', true).is('deleted_at', null),
    supabase.from('boxes').select('*', { count: 'exact', head: true }).eq('tenant_id', profile.tenant_id).not('location_id', 'is', null).eq('status', 'RECEIVED'),
    supabase.from('boxes').select('*', { count: 'exact', head: true }).eq('tenant_id', profile.tenant_id).is('location_id', null).eq('status', 'RECEIVED'),
  ]);

  // Fetch top locations
  const { data: topLocationsData } = await supabase
    .from('warehouse_locations')
    .select('id, code, name, boxes!boxes_location_id_fkey(id)')
    .eq('tenant_id', profile.tenant_id)
    .is('deleted_at', null);
  
  const formattedLocations = (topLocationsData || []).map(loc => ({
    ...loc,
    box_count: loc.boxes?.length || 0
  })).sort((a, b) => b.box_count - a.box_count).slice(0, 5);

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
    .limit(6);

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Warehouse</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Visão Geral</h1>
                <p className="text-orange-100 text-sm mt-0.5">Organize as caixas por localização física e agilize a separação.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/warehouse/map" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 font-bold rounded-xl transition shadow-lg hover:bg-orange-50 active:scale-95 text-sm"
              >
                <Map className="w-4 h-4 shrink-0" />
                Ver mapa
              </Link>
              <Link 
                href="/admin/warehouse/scan" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition shadow-lg active:scale-95 text-sm"
              >
                <ScanBarcode className="w-4 h-4 shrink-0" />
                Abrir scanner
              </Link>
              <Link 
                href="/admin/warehouse/locations" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition active:scale-95 text-sm"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                Gerenciar localizações
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Stats Grid (Matching screenshot layout) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-sm flex flex-col justify-between min-h-[120px]">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{locationsCount || 0}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-1">Localizações</p>
            </div>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{activeLocationsCount || 0}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-1">Ativas</p>
            </div>
            <div className="absolute bottom-0 left-5 right-5 h-1 bg-emerald-500 rounded-t-full"></div>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-sm flex flex-col justify-between min-h-[120px]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
              <PackageCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{locatedBoxesCount || 0}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-1">Caixas localizadas</p>
            </div>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-sm flex flex-col justify-between min-h-[120px]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-2">
              <PackageMinus className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{unlocatedBoxesCount || 0}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-1">Caixas sem localização</p>
              {(unlocatedBoxesCount || 0) > 0 && (
                <p className="mt-1 text-[11px] text-amber-500 font-semibold">Requer atenção</p>
              )}
            </div>
          </div>
          
        </div>

        {(unlocatedBoxesCount || 0) > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-2xl"></div>
            <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">{unlocatedBoxesCount} Caixas sem localização</h3>
                  <p className="text-sm text-orange-100">Organize as caixas por localização física e agilize a separação.</p>
                </div>
              </div>
              <Link 
                href="/admin/warehouse/scan" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl transition shadow-md hover:bg-orange-50 active:scale-95 text-sm shrink-0"
              >
                <Maximize2 className="w-4 h-4" />
                Abrir scanner
              </Link>
            </div>
          </div>
        )}

        {/* Lists Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Top Locations */}
          <div className="xl:col-span-1 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-zinc-400" />
                <h3 className="font-semibold text-white text-sm">Localizações com mais caixas</h3>
              </div>
              <Link href="/admin/warehouse/locations" className="text-xs text-orange-500 font-semibold hover:underline underline-offset-2">
                Gerenciar localizações
              </Link>
            </div>
            
            <div className="p-4 flex-1">
              {formattedLocations.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center h-full">
                  <MapPin className="w-8 h-8 text-zinc-600 mb-3" />
                  <p className="text-sm text-zinc-400">Nenhuma localização cadastrada.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formattedLocations.map((loc, index) => (
                    <div key={loc.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/50 bg-zinc-950/50 hover:bg-zinc-800 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{loc.code}</p>
                          <p className="text-xs text-zinc-500 truncate">{loc.name || "—"}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold">
                        {loc.box_count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Movements */}
          <div className="xl:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-zinc-400" />
              <h3 className="font-semibold text-white text-sm">Movimentações recentes</h3>
            </div>

            <div className="p-0 flex-1 flex flex-col">
              {!movementsData || movementsData.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 mb-4 shadow-sm">
                    <ArrowRightLeft className="w-8 h-8 text-zinc-500" />
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">Nenhuma movimentação registrada ainda.</p>
                  <Link href="/admin/warehouse/scan" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition active:scale-95 shadow-md">
                    <ScanBarcode className="w-4 h-4" />
                    Abrir scanner
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/50">
                  {movementsData.map(mov => {
                    const shortId = `#${(mov.boxes as any)?.id?.split('-')[0]}`;
                    const timeAgo = formatDistanceToNow(new Date(mov.created_at), { addSuffix: true, locale: ptBR });
                    const oldLoc = (mov.old_location as any)?.code || "Sem localização";
                    const newLoc = (mov.new_location as any)?.code || "Sem localização";
                    return (
                      <div key={mov.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 transition">
                        
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white text-sm">{shortId}</span>
                              <span className="text-xs text-zinc-500 uppercase">{(mov.boxes as any)?.tracking_number}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-medium border border-zinc-700">{oldLoc}</span>
                              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                              <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20">{newLoc}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs">
                          <p className="font-medium text-zinc-300">{(mov.profiles as any)?.full_name || "Desconhecido"}</p>
                          <p className="text-zinc-500">{timeAgo}</p>
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
