// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Map, LayoutGrid, X, Box, Info } from "lucide-react";

export default function WarehouseMapClient({ locations, boxes }: { locations: any[], boxes: any[] }) {
  const [iso, setIso] = useState(false);
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Group locations by zone
  const zones = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    locations.forEach(loc => {
      const z = loc.zone || "Outros";
      if (!grouped[z]) grouped[z] = [];
      grouped[z].push(loc);
    });
    // Sort zones alphabetically
    return Object.keys(grouped).sort().map(zone => ({
      name: zone,
      locations: grouped[zone]
    }));
  }, [locations]);

  // Determine highlighted location IDs from search
  const highlightIds = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().replace('#', '');
    const matchedBoxes = boxes.filter(b => {
      return (
        b.id.toLowerCase().includes(q) ||
        (b.tracking_number && b.tracking_number.toLowerCase().includes(q)) ||
        (b.customer?.full_name && b.customer.full_name.toLowerCase().includes(q)) ||
        (b.customer?.suite_number && String(b.customer.suite_number).includes(q))
      );
    });
    return Array.from(new Set(matchedBoxes.map(b => b.location_id).filter(Boolean)));
  }, [query, boxes]);

  const handleOpenLocation = (loc: any) => {
    setSelectedLocation(loc);
    setPanelOpen(true);
  };

  const getOccupancyStyles = (loc: any) => {
    const locBoxes = boxes.filter(b => b.location_id === loc.id);
    const count = locBoxes.length;
    const capacity = loc.capacity || 10; // default 10 if not specified
    const ratio = count / capacity;

    if (count === 0) {
      return "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800";
    } else if (ratio < 0.5) {
      return "bg-emerald-950/30 border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/40";
    } else if (ratio < 0.8) {
      return "bg-amber-950/30 border-amber-900/50 text-amber-400 hover:bg-amber-900/40";
    } else {
      return "bg-rose-950/30 border-rose-900/50 text-rose-400 hover:bg-rose-900/40";
    }
  };

  const getOccupancyCount = (loc: any) => {
    return boxes.filter(b => b.location_id === loc.id).length;
  };

  const selectedLocationBoxes = useMemo(() => {
    if (!selectedLocation) return [];
    return boxes.filter(b => b.location_id === selectedLocation.id);
  }, [selectedLocation, boxes]);

  return (
    <div className="-m-8 min-h-[calc(100vh-4rem)] bg-zinc-950">
      <style>{`
        
        .wh-scroll::-webkit-scrollbar { height: 8px; }
        .wh-scroll::-webkit-scrollbar-track { background: #18181b; border-radius: 4px; }
        .wh-scroll::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        .wh-scroll::-webkit-scrollbar-thumb:hover { background: #52525b; }

        .wh-map { transition: transform .35s ease; }
        .wh-map.is-iso { transform: perspective(1500px) rotateX(26deg) scale(.97); transform-origin: top center; }
        .wh-cell { transition: transform .15s ease, box-shadow .15s ease; }
        .wh-map.is-iso .wh-cell { box-shadow: 0 10px 0 -2px rgba(24,24,27,.5); }
        .wh-map.is-iso .wh-cell:hover { transform: translateY(-5px); }
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin/dashboard" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">Dashboard</Link>
            <span className="text-white/50">/</span>
            <Link href="/admin/warehouse" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">Warehouse</Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Mapa do armazém</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <span className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                <Map className="w-7 h-7" />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight truncate">Mapa do armazém</h1>
                <p className="mt-1 text-sm text-orange-100">Visualize a ocupação por localização e encontre caixas rapidamente.</p>
              </div>
            </div>
            <Link href="/admin/warehouse" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-sm font-semibold text-white transition self-start shrink-0">
              <ChevronLeft className="w-4 h-4" />
              Visão Geral
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        
        {/* Toolbar */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Onde está? dock, tracking, n° do pacote ou código (ex: #c0b3)" 
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>
              {query && (
                <button type="button" onClick={() => setQuery("")} className="px-3 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 rounded-xl p-1 self-start border border-zinc-800">
              <button 
                type="button" 
                onClick={() => setIso(false)} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${!iso ? 'bg-zinc-800 text-orange-400 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Planta
              </button>
              <button 
                type="button" 
                onClick={() => setIso(true)} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${iso ? 'bg-zinc-800 text-orange-400 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Map className="w-4 h-4" />
                Isométrico
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-zinc-400">
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800"></span>Vazio</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500/50"></span>Baixa</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500/50"></span>Média</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-500/50"></span>Alta/cheia</span>
            <span className="ml-auto text-zinc-500">{locations.length} localizações no mapa · {boxes.length} caixas alocadas</span>
          </div>
        </div>

        {/* Map Zones */}
        <div className="space-y-6">
          {zones.map((zone, zIndex) => (
            <div key={zIndex} className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 text-sm font-bold">
                  {zIndex + 1}
                </span>
                <h3 className="text-base font-bold uppercase tracking-widest text-zinc-300">{zone.name}</h3>
                <span className="text-xs font-medium text-zinc-500">· {zone.locations.length} localizações</span>
              </div>

              <div className="overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 wh-scroll">
                <div 
                  className={`wh-map ${iso ? 'is-iso' : ''} p-6`} 
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem', minWidth: '320px' }}
                >
                  {zone.locations.map(loc => {
                    const isHighlighted = highlightIds.includes(loc.id);
                    const inlineStyle: any = {};
                    if (iso && loc.grid_row && loc.grid_col) {
                       // Only apply strict grid rules if isometric maybe? Or both. 
                       // I'll apply it if they exist, else let CSS Grid auto-flow.
                       inlineStyle.gridRow = loc.grid_row;
                       inlineStyle.gridColumn = loc.grid_col;
                    }
                    
                    return (
                      <button 
                        key={loc.id}
                        type="button" 
                        onClick={() => handleOpenLocation(loc)} 
                        style={inlineStyle}
                        className={`wh-cell relative flex flex-col items-center justify-center rounded-xl border p-3 min-h-[72px] transition-all
                          ${getOccupancyStyles(loc)}
                          ${isHighlighted ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900 animate-pulse z-10 scale-105' : ''}
                        `}
                      >
                        <span className="text-sm font-bold truncate max-w-full font-mono">{loc.code}</span>
                        <span className="text-[11px] font-semibold tabular-nums mt-1 opacity-80 flex items-center gap-1">
                          <Box className="w-3 h-3" />
                          {getOccupancyCount(loc)}<span className="opacity-50">/{loc.capacity || 10}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Side Panel */}
        {panelOpen && (
          <div className="fixed inset-0 z-[9998] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setPanelOpen(false)}></div>
            <div className="relative w-full max-w-md bg-zinc-900 shadow-2xl flex flex-col h-full border-l border-zinc-800 animate-in slide-in-from-right duration-200">
              
              <div className="px-6 py-5 border-b border-zinc-800 flex items-start justify-between gap-3 bg-zinc-900">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-orange-500 font-bold mb-1">Localização</p>
                  <h3 className="text-xl font-bold text-white truncate font-mono">{selectedLocation?.code}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{[selectedLocation?.name, selectedLocation?.zone].filter(Boolean).join(' · ')}</p>
                </div>
                <button onClick={() => setPanelOpen(false)} className="shrink-0 rounded-xl p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-zinc-300">
                    Caixas nesta localização
                    <span className="text-zinc-500 font-normal ml-2">({selectedLocationBoxes.length}/{selectedLocation?.capacity || 10})</span>
                  </p>
                  <Link href={`/admin/warehouse/locations/${selectedLocation?.id}/edit`} className="text-xs font-semibold text-orange-500 hover:text-orange-400 hover:underline">
                    Editar local
                  </Link>
                </div>

                {selectedLocationBoxes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                    <Info className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm">Nenhuma caixa nesta localização.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedLocationBoxes.map((box: any) => (
                      <Link 
                        key={box.id}
                        href={`/admin/boxes/${box.id}`} 
                        className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition group"
                      >
                        <div className="flex items-center justify-between min-w-0">
                          <p className="text-sm font-bold text-white font-mono uppercase">#{box.id.substring(0,6)}</p>
                          <ChevronLeft className="w-4 h-4 text-zinc-600 group-hover:text-orange-500 rotate-180 transition-colors shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 truncate">
                          <span className="font-semibold text-zinc-300 truncate">{box.customer?.full_name || 'Sem cliente'}</span>
                          <span>·</span>
                          <span className="text-orange-400">Dock {box.customer?.suite_number || '?'}</span>
                          <span>·</span>
                          <span className="truncate">{box.tracking_number || 'Sem rastreio'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
