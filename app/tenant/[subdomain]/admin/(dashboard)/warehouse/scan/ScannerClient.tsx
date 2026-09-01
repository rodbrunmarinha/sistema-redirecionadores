"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import Script from "next/script";
import { 
  ScanBarcode, 
  MapPin, 
  CheckCircle2, 
  X, 
  Check, 
  ChevronRight, 
  AlertTriangle,
  Camera,
  ArrowRightLeft,
  Maximize2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  previewBoxAction, 
  previewLocationAction, 
  assignLocationAction 
} from "@/app/actions/scannerActions";

type Box = { id: string; tracking_code: string; store_name: string; warehouse_location_code: string | null };
type LocationData = { id: string; code: string; name: string; capacity: number | null; boxes_count: number; is_full: boolean; percent: number };
type Suggestion = { id: string; code: string; available: number | null };

export default function ScannerClient({ initialQuickLocations, initialMovements = [] }: { initialQuickLocations: any[], initialMovements?: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [boxPayload, setBoxPayload] = useState("");
  const [locationPayload, setLocationPayload] = useState("");
  
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const [cameraMode, setCameraMode] = useState<'box' | 'location' | null>(null);
  const qrInstanceRef = useRef<any>(null);

  const canAssign = boxes.length > 0 && location !== null;

  const handleAddBox = (payload: string = boxPayload) => {
    const val = payload.trim();
    if (!val) return;
    
    startTransition(async () => {
      const res = await previewBoxAction(val);
      if (res.success && res.box) {
        if (!boxes.find(b => b.id === res.box!.id)) {
          setBoxes(prev => [...prev, res.box!]);
          toast.success(`Caixa ${res.box!.tracking_code} adicionada!`);
        }
        if (res.suggestions) setSuggestions(res.suggestions);
        setBoxPayload("");
      } else {
        toast.error(res.error || "Caixa não encontrada.");
      }
    });
  };

  const handleResolveLocation = (payload: string = locationPayload) => {
    const val = payload.trim();
    if (!val) return;
    
    startTransition(async () => {
      const res = await previewLocationAction(val);
      if (res.success && res.location) {
        setLocation(res.location);
        setLocationPayload(res.location.code);
        toast.success(`Localização ${res.location.code} selecionada!`);
      } else {
        toast.error(res.error || "Localização não encontrada.");
      }
    });
  };

  const handleAssign = () => {
    if (!canAssign) return;
    
    startTransition(async () => {
      const res = await assignLocationAction(boxes.map(b => b.id), location.id);
      if (res.success) {
        toast.success(res.message || "Caixas vinculadas com sucesso!");
        // Update boxes visually
        setBoxes(prev => prev.map(b => ({ ...b, warehouse_location_code: location.code })));
        setBoxes([]);
        setBoxPayload("");
      } else {
        toast.error(res.error || "Erro ao vincular caixas.");
      }
    });
  };

  const stopCamera = async () => {
    if (qrInstanceRef.current) {
      try {
        await qrInstanceRef.current.stop();
        await qrInstanceRef.current.clear();
      } catch (e) {}
      qrInstanceRef.current = null;
    }
    setCameraMode(null);
  };

  const toggleCamera = async (mode: 'box' | 'location') => {
    if (typeof window === "undefined" || !(window as any).Html5Qrcode) {
      toast.error("Leitor QR code não está disponível.");
      return;
    }
    
    if (cameraMode === mode) {
      await stopCamera();
      return;
    }
    
    await stopCamera();
    setCameraMode(mode);
    
    setTimeout(async () => {
      const elementId = mode === 'box' ? 'warehouse-box-reader' : 'warehouse-location-reader';
      const Html5Qrcode = (window as any).Html5Qrcode;
      const html5QrCode = new Html5Qrcode(elementId);
      qrInstanceRef.current = html5QrCode;
      
      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (decodedText: string) => {
            await stopCamera();
            if (mode === 'box') {
              setBoxPayload(decodedText);
              handleAddBox(decodedText);
            } else {
              setLocationPayload(decodedText);
              handleResolveLocation(decodedText);
            }
          },
          () => {} // ignore errors while scanning
        );
      } catch (error) {
        toast.error("Não foi possível iniciar a câmera.");
        await stopCamera();
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      <Script src="https://unpkg.com/html5-qrcode" strategy="lazyOnload" />
      
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
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/warehouse" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Warehouse
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Scanner</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shrink-0">
                <ScanBarcode className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-2xl text-white truncate">Scanner do Warehouse</h1>
                <p className="text-sm text-orange-100 mt-0.5">Bipe as caixas e depois a localização para vincular em lote.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/warehouse/locations" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold transition text-sm"
              >
                Gerenciar localizações
              </Link>
              <Link 
                href="/admin/warehouse" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold transition text-sm"
              >
                Visão Geral
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Steps Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-sm font-bold shadow-sm">1</div>
              <span className="hidden sm:block text-sm font-semibold text-zinc-300">1. Escaneie as caixas</span>
            </div>
            <div className="flex-1 h-px bg-zinc-800 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 text-sm font-bold shadow-sm">2</div>
              <span className="hidden sm:block text-sm font-semibold text-zinc-300">2. Escaneie a localização</span>
            </div>
            <div className="flex-1 h-px bg-zinc-800 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-sm font-bold shadow-sm">3</div>
              <span className="hidden sm:block text-sm font-semibold text-zinc-300">3. Confirmar vínculo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-5">
              
              {/* Box Step */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <ScanBarcode className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">1. Escaneie as caixas</h3>
                        <p className="text-xs text-zinc-500">Use a etiqueta QR já existente da caixa. Leitor USB, cola ou câmera funcionam.</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => toggleCamera('box')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition border border-zinc-700"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{cameraMode === 'box' ? 'Fechar câmera' : 'Usar câmera'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <input 
                      type="text" 
                      value={boxPayload} 
                      onChange={e => setBoxPayload(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleAddBox()}
                      placeholder="QR da caixa" 
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 text-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleAddBox()}
                      disabled={isPending}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Adicionar caixa
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setBoxes([])}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition border border-zinc-700"
                    >
                      Limpar
                    </button>
                  </div>

                  {cameraMode === 'box' && (
                    <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border border-dashed border-zinc-700 space-y-3">
                      <div id="warehouse-box-reader" className="w-full overflow-hidden rounded-xl"></div>
                      <p className="text-sm text-center text-zinc-500 flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        Aponte a câmera para o QR code da caixa.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Step */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">2. Escaneie a localização</h3>
                        <p className="text-xs text-zinc-500">Use a etiqueta QR da localização ou digite o código manualmente.</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => toggleCamera('location')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition border border-zinc-700"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{cameraMode === 'location' ? 'Fechar câmera' : 'Usar câmera'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <input 
                      type="text" 
                      value={locationPayload} 
                      onChange={e => setLocationPayload(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleResolveLocation()}
                      placeholder="QR da localização" 
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 text-white px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleResolveLocation()}
                      disabled={isPending}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      Validar localização
                    </button>
                  </div>

                  {cameraMode === 'location' && (
                    <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border border-dashed border-zinc-700 space-y-3">
                      <div id="warehouse-location-reader" className="w-full overflow-hidden rounded-xl"></div>
                      <p className="text-sm text-center text-zinc-500 flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                        Aponte a câmera para o QR code da localização.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Step */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <div className="p-5 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">3. Confirmar vínculo</h3>
                        <p className="text-xs text-zinc-500">Pronto para vincular</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAssign} 
                      disabled={!canAssign || isPending}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition text-sm
                        ${canAssign 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' 
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'}`}
                    >
                      <Check className="w-4 h-4" />
                      {isPending ? 'Vinculando...' : 'Vincular caixas'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Selected Boxes */}
                    <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ScanBarcode className="w-4 h-4 text-blue-500" />
                          <h4 className="font-semibold text-white text-sm">Caixas escaneadas</h4>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                          {boxes.length}
                        </span>
                      </div>
                      
                      {boxes.length > 0 ? (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {boxes.map(box => (
                            <div key={box.id} className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 flex items-start justify-between gap-2 hover:border-blue-500/50 transition">
                              <div className="flex items-start gap-2 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                                  {(box.tracking_code || '??').slice(0,2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-white text-sm truncate">{box.tracking_code}</p>
                                  <p className="text-xs text-zinc-500 truncate">{box.store_name || ''}</p>
                                  <p className="text-[10px] text-zinc-400 mt-1">
                                    Atual: <span className="font-medium text-zinc-300">{box.warehouse_location_code || 'Sem localização'}</span>
                                  </p>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setBoxes(prev => prev.filter(b => b.id !== box.id))}
                                className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center">
                          <ScanBarcode className="w-8 h-8 mx-auto text-blue-500/30 mb-2" />
                          <p className="text-xs text-zinc-500">Nenhuma caixa escaneada ainda.</p>
                        </div>
                      )}
                    </div>

                    {/* Selected Location */}
                    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <h4 className="font-semibold text-white text-sm">Localização selecionada</h4>
                      </div>

                      {location ? (
                        <div className={`rounded-xl bg-zinc-950 border p-4 ${location.is_full ? 'border-red-500/50' : 'border-zinc-800'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">
                              {location.code.slice(0,3)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white truncate">{location.code}</p>
                              <p className="text-sm text-zinc-500 truncate">{location.name || "—"}</p>
                            </div>
                            {location.is_full && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400">
                                ⚠ Cheia
                              </span>
                            )}
                          </div>

                          {location.capacity && (
                            <div className="mt-4">
                              <div className="flex justify-between text-[11px] font-semibold mb-1.5 text-zinc-400">
                                <span>{location.boxes_count} / {location.capacity}</span>
                                <span>{location.percent}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${location.percent >= 100 ? 'bg-red-500' : (location.percent >= 90 ? 'bg-amber-500' : 'bg-emerald-500')}`} 
                                  style={{ width: `${Math.max(4, Math.min(100, location.percent))}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {location.is_full && (
                            <p className="mt-3 text-xs text-red-400">Esta localização atingiu a capacidade. Você pode continuar, mas considere outro local.</p>
                          )}
                        </div>
                      ) : (
                        <div className="py-6 text-center">
                          <MapPin className="w-8 h-8 mx-auto text-purple-500/30 mb-2" />
                          <p className="text-xs text-zinc-500">Nenhuma localização selecionada.</p>
                        </div>
                      )}

                      {/* Suggestions */}
                      {suggestions.length > 0 && !location && (
                        <div className="mt-4 pt-4 border-t border-purple-500/20">
                          <p className="text-[10px] uppercase tracking-wider text-emerald-400 mb-2 font-semibold flex items-center gap-1.5">
                            Sugestões (mais vazias)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.map(s => (
                              <button 
                                key={s.id}
                                type="button" 
                                onClick={() => { setLocationPayload(s.code); handleResolveLocation(s.code); }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition inline-flex items-center gap-1.5"
                              >
                                <span>{s.code}</span>
                                {s.available !== null && <span className="font-normal opacity-70">· {s.available} vagas</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Locations */}
                      <div className={`mt-4 pt-4 border-t ${suggestions.length > 0 && !location ? 'border-zinc-800' : 'border-purple-500/20'}`}>
                        <p className="text-[10px] uppercase tracking-wider text-purple-400 mb-2 font-semibold">Localizações rápidas</p>
                        <div className="flex flex-wrap gap-2">
                          {initialQuickLocations.map(ql => (
                            <button 
                              key={ql.id}
                              type="button" 
                              onClick={() => { setLocationPayload(ql.code); handleResolveLocation(ql.code); }}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                            >
                              {ql.code}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar (Recent Movements) */}
            <div className="space-y-5">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Movimentações recentes</h3>
                </div>
                <div>
                  {initialMovements.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                      <ArrowRightLeft className="w-8 h-8 mx-auto text-zinc-700 mb-3" />
                      <p className="text-xs text-zinc-500">Nenhuma movimentação registrada ainda.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-800/50">
                      {initialMovements.map(mov => (
                        <div key={mov.id} className="p-4 hover:bg-zinc-800/30 transition">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{mov.shortId}</span>
                              <span className="text-xs text-zinc-500 uppercase truncate">{mov.tracking}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 whitespace-nowrap">{mov.timeAgo}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-medium border border-zinc-700">{mov.oldLoc}</span>
                              <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                              <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20">{mov.newLoc}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-right">
                            <p className="text-[10px] font-medium text-zinc-400">por {mov.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
