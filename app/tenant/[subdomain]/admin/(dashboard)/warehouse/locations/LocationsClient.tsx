"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  MapPin, 
  Search, 
  Plus, 
  Grid2X2,
  Printer,
  Edit2,
  Trash2,
  Package,
  X
} from "lucide-react";
import { deleteLocationAction } from "@/app/actions/deleteLocation";
import { generateLocationsGridAction } from "@/app/actions/generateLocationsGrid";

export default function LocationsClient({ initialLocations, currentSearch }: { initialLocations: any[], currentSearch: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  // Grid Modal State
  const [zone, setZone] = useState("Corredor A");
  const [prefix, setPrefix] = useState("A");
  const [sep, setSep] = useState("-");
  const [rows, setRows] = useState("4");
  const [cols, setCols] = useState("6");
  const [cap, setCap] = useState("");
  const [pad, setPad] = useState(true);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/warehouse/locations?search=${encodeURIComponent(search)}`);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Deseja realmente excluir a localização ${code}?`)) {
      startTransition(async () => {
        const res = await deleteLocationAction(id);
        if (res.success) {
          toast.success("Localização excluída!");
        } else {
          toast.error(res.error || "Erro ao excluir");
        }
      });
    }
  };

  const handleGenerateGrid = (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseInt(rows) || 0;
    const c = parseInt(cols) || 0;
    if (r <= 0 || c <= 0) {
      toast.error("Linhas e colunas devem ser maiores que zero.");
      return;
    }
    
    startTransition(async () => {
      const res = await generateLocationsGridAction({
        zone,
        prefix,
        separator: sep,
        rows: r,
        cols: c,
        capacity: parseInt(cap) || undefined,
        pad
      });

      if (res.success) {
        toast.success(`${res.count} localizações geradas com sucesso!`);
        setIsGridModalOpen(false);
      } else {
        toast.error(res.error || "Erro ao gerar grade");
      }
    });
  };

  // Preview computations
  const fmt = (n: number) => pad ? String(n).padStart(2, '0') : String(n);
  const exPrefix = prefix || '';
  const exampleColN = Math.min(3, Math.max(1, parseInt(cols) || 1));
  const exRow = fmt(1);
  const exCol = fmt(exampleColN);
  const example = `${exPrefix}${sep}${exRow}${sep}${exCol}`;
  const total = (parseInt(rows) || 0) * (parseInt(cols) || 0);
  const vizRows = Math.min(parseInt(rows) || 0, 5);
  const vizCols = Math.min(parseInt(cols) || 0, 8);
  const truncated = (parseInt(rows) || 0) > 5 || (parseInt(cols) || 0) > 8;

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
            <Link href="/admin/warehouse" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Warehouse
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Localizações do Warehouse</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-2xl text-white truncate">Localizações do Warehouse</h1>
                <p className="text-sm text-orange-100 mt-0.5">Crie, edite e imprima etiquetas de localização para o armazém.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/warehouse" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold transition text-sm"
              >
                Visão Geral
              </Link>
              
              <button 
                type="button" 
                onClick={() => setIsGridModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold transition text-sm"
              >
                <Grid2X2 className="w-4 h-4" />
                Gerar grade
              </button>

              <Link 
                href="/admin/warehouse/locations/create" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-orange-600 font-bold hover:bg-orange-50 transition shadow-lg active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4" />
                Nova localização
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Search Bar */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-zinc-500" />
                </div>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por código ou nome" 
                  className="pl-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition border border-zinc-700 text-sm">
                  Filtrar
                </button>
                {currentSearch && (
                  <button 
                    type="button" 
                    onClick={() => { setSearch(""); router.push("/admin/warehouse/locations"); }}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 font-semibold hover:text-white hover:bg-zinc-700 transition border border-zinc-700 text-sm"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {initialLocations.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-zinc-900 rounded-2xl border border-zinc-800">
                <MapPin className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-1">Nenhuma localização encontrada</h3>
                <p className="text-sm text-zinc-500">Crie sua primeira localização ou gere uma grade.</p>
              </div>
            ) : (
              initialLocations.map(loc => (
                <div key={loc.id} className="group relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-600 transition-all">
                  
                  <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-500"></div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                          <MapPin className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{loc.code}</p>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">{loc.name || "—"}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${loc.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {loc.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
                          <Package className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-lg font-extrabold text-white leading-none">0</p>
                          <p className="text-xs text-zinc-500 uppercase tracking-wide">Caixas</p>
                        </div>
                      </div>
                      {loc.notes && (
                        <p className="text-xs text-zinc-500 italic truncate min-w-0">{loc.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                      <button 
                        type="button" 
                        onClick={() => toast("Impressão será implementada em breve!")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 hover:text-white transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Imprimir
                      </button>
                      <Link 
                        href={`/admin/warehouse/locations/${loc.id}/edit`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-semibold hover:bg-orange-500/20 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      <button 
                        type="button"
                        onClick={() => handleDelete(loc.id, loc.code)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grid Modal */}
      {isGridModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isPending && setIsGridModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Grid2X2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Gerar grade</h3>
                  <p className="text-xs text-orange-100">Cria uma zona inteira de uma vez</p>
                </div>
              </div>
              <button onClick={() => !isPending && setIsGridModalOpen(false)} className="text-white/70 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleGenerateGrid} className="p-5 space-y-4 text-left">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Crie várias posições de uma vez. Você define quantas linhas e colunas — o código de cada posição é montado automaticamente.
              </p>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Zona / corredor</label>
                <input 
                  type="text" 
                  value={zone} 
                  onChange={e => setZone(e.target.value)} 
                  maxLength={80} 
                  required 
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Prefixo</label>
                  <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} maxLength={30} required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Separador</label>
                  <input type="text" value={sep} onChange={e => setSep(e.target.value)} maxLength={3} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Linhas</label>
                  <input type="number" value={rows} onChange={e => setRows(e.target.value)} min="1" max="100" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Colunas</label>
                  <input type="number" value={cols} onChange={e => setCols(e.target.value)} min="1" max="100" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Capacidade</label>
                  <input type="number" value={cap} onChange={e => setCap(e.target.value)} min="0" max="100000" placeholder="—" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 mt-7 cursor-pointer group">
                    <input type="checkbox" checked={pad} onChange={e => setPad(e.target.checked)} className="rounded border-zinc-600 bg-zinc-900 text-orange-500 focus:ring-orange-500" />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition">Zerar (01, 02…)</span>
                  </label>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3.5 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">Como o código é montado:</p>
                  <div className="flex items-center gap-1 flex-wrap font-mono text-sm">
                    <span className="inline-flex flex-col items-center">
                      <span className="px-2 py-1 rounded-md bg-zinc-800 text-white font-bold">{exPrefix || '—'}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 font-sans">Prefixo</span>
                    </span>
                    <span className="text-orange-500 pb-4">{sep}</span>
                    <span className="inline-flex flex-col items-center">
                      <span className="px-2 py-1 rounded-md bg-zinc-800 text-white font-bold">{exRow}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 font-sans">Linha</span>
                    </span>
                    <span className="text-orange-500 pb-4">{sep}</span>
                    <span className="inline-flex flex-col items-center">
                      <span className="px-2 py-1 rounded-md bg-zinc-800 text-white font-bold">{exCol}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 font-sans">Coluna</span>
                    </span>
                  </div>
                </div>

                {vizRows > 0 && vizCols > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">Prévia da grade</p>
                    <div className="inline-flex flex-col gap-1">
                      {Array.from({length: vizRows}).map((_, rIdx) => {
                        const r = rIdx + 1;
                        return (
                          <div key={r} className="flex gap-1 items-center">
                            {Array.from({length: vizCols}).map((_, cIdx) => {
                              const c = cIdx + 1;
                              const isExample = r === 1 && c === exampleColN;
                              return (
                                <div key={c} className={`h-4 w-6 rounded-sm border flex items-center justify-center ${isExample ? 'bg-orange-600 border-orange-500 ring-1 ring-orange-500/50' : 'bg-zinc-800 border-zinc-700'}`}>
                                  {isExample && <span className="text-[8px] font-bold text-white leading-none">{exCol}</span>}
                                </div>
                              );
                            })}
                            {truncated && r === vizRows && <span className="text-zinc-500 text-xs self-center ml-0.5">…</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-zinc-400 pt-2 border-t border-zinc-800">
                  Serão criadas {total} localizações. Ex.: 
                  <span className="font-mono font-bold text-white ml-1">{example}</span>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => !isPending && setIsGridModalOpen(false)} disabled={isPending} className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 hover:text-white transition disabled:opacity-50">Cancelar</button>
                <button type="submit" disabled={isPending} className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition shadow-md disabled:opacity-50">
                  {isPending ? "Gerando..." : "Gerar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
