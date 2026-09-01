"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, Printer, QrCode } from "lucide-react";
import { editLocationAction } from "@/app/actions/editLocation";

export default function EditLocationClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [zone, setZone] = useState(initialData?.zone || "");
  const [gridRow, setGridRow] = useState(initialData?.grid_row?.toString() || "");
  const [gridCol, setGridCol] = useState(initialData?.grid_col?.toString() || "");
  const [capacity, setCapacity] = useState(initialData?.capacity?.toString() || "");
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order?.toString() || "0");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const qrData = `DOCKDROP_LOC:${initialData.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=18181b&bgcolor=ffffff`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error("O código é obrigatório.");
      return;
    }

    startTransition(async () => {
      const res = await editLocationAction(initialData.id, {
        code, name, zone, grid_row: gridRow, grid_col: gridCol,
        capacity, sort_order: sortOrder, is_active: isActive, notes
      });

      if (res.success) {
        toast.success("Localização atualizada com sucesso!");
        router.push("/admin/warehouse/locations");
      } else {
        toast.error(res.error || "Erro ao atualizar localização");
      }
    });
  };

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
            <Link href="/admin/warehouse/locations" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Localizações
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">{initialData.code}</span>
          </nav>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/admin/warehouse/locations" className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-lg shrink-0 transition">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="min-w-0">
                <h1 className="font-bold text-2xl text-white truncate">Editar localização: <span className="text-orange-200">{initialData.code}</span></h1>
                <p className="text-sm text-orange-100 mt-0.5">Atualize os dados e imprima etiquetas de localização para o armazém.</p>
              </div>
            </div>

            <button 
              onClick={() => toast("Funcionalidade de impressão será implementada em breve!")}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold transition shrink-0"
            >
              <Printer className="w-5 h-5" />
              Imprimir etiqueta
            </button>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
                <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-500"></div>
                <div className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Code */}
                      <div>
                        <label htmlFor="code" className="block text-sm font-semibold text-zinc-300 mb-2">Código <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="code" 
                          value={code}
                          onChange={e => setCode(e.target.value)}
                          required 
                          maxLength={80} 
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                        />
                      </div>

                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-zinc-300 mb-2">Nome</label>
                        <input 
                          type="text" 
                          id="name" 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          maxLength={255} 
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                        />
                      </div>

                      {/* Zone */}
                      <div>
                        <label htmlFor="zone" className="block text-sm font-semibold text-zinc-300 mb-2">Zona / corredor</label>
                        <input 
                          type="text" 
                          id="zone" 
                          value={zone}
                          onChange={e => setZone(e.target.value)}
                          maxLength={80} 
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                        />
                        <p className="mt-1.5 text-xs text-zinc-500">Agrupa as localizações no mapa (ex.: Corredor A).</p>
                      </div>

                      {/* Grid / Capacity */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label htmlFor="grid_row" className="block text-sm font-semibold text-zinc-300 mb-2">Linha</label>
                          <input 
                            type="number" 
                            id="grid_row" 
                            value={gridRow}
                            onChange={e => setGridRow(e.target.value)}
                            min="1" max="200" 
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                          />
                        </div>
                        <div>
                          <label htmlFor="grid_col" className="block text-sm font-semibold text-zinc-300 mb-2">Coluna</label>
                          <input 
                            type="number" 
                            id="grid_col" 
                            value={gridCol}
                            onChange={e => setGridCol(e.target.value)}
                            min="1" max="200" 
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                          />
                        </div>
                        <div>
                          <label htmlFor="capacity" className="block text-sm font-semibold text-zinc-300 mb-2">Capacidade</label>
                          <input 
                            type="number" 
                            id="capacity" 
                            value={capacity}
                            onChange={e => setCapacity(e.target.value)}
                            min="0" max="100000" 
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                          />
                        </div>
                        <div className="col-span-3 -mt-1">
                          <p className="text-xs text-zinc-500">Linha e coluna posicionam a localização no mapa do armazém.</p>
                        </div>
                      </div>

                      {/* Order */}
                      <div>
                        <label htmlFor="sort_order" className="block text-sm font-semibold text-zinc-300 mb-2">Ordem</label>
                        <input 
                          type="number" 
                          id="sort_order" 
                          value={sortOrder}
                          onChange={e => setSortOrder(e.target.value)}
                          min="0" max="999999" 
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                        />
                      </div>

                      {/* Active Toggle */}
                      <div className="flex items-end">
                        <label className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 w-full cursor-pointer hover:bg-zinc-700/80 transition">
                          <input 
                            type="checkbox" 
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-600 bg-zinc-950 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-800" 
                          />
                          <span className="text-sm font-semibold text-zinc-300">Ativa</span>
                        </label>
                      </div>

                      {/* Notes */}
                      <div className="lg:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-semibold text-zinc-300 mb-2">Observações</label>
                        <textarea 
                          id="notes" 
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          rows={4} 
                          maxLength={1000} 
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none" 
                        ></textarea>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap gap-3">
                      <button 
                        type="submit" 
                        disabled={isPending}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isPending ? "Salvando..." : "Atualizar localização"}
                      </button>
                      <Link 
                        href="/admin/warehouse/locations" 
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-700 hover:text-white transition active:scale-95"
                      >
                        Cancelar
                      </Link>
                    </div>

                  </form>
                </div>
              </div>
            </div>

            {/* Label Preview */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden shadow-sm sticky top-6">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <QrCode className="w-6 h-6 text-orange-500" />
                    <h3 className="font-bold text-lg text-white">Preview da Etiqueta</h3>
                  </div>
                  
                  <div className="bg-white rounded-xl border-4 border-zinc-950 p-6 text-center shadow-lg">
                    <div className="text-xs font-bold tracking-wider uppercase text-zinc-500 mb-2">
                      Etiqueta de localização
                    </div>
                    <h2 className="text-4xl font-extrabold text-zinc-950 mb-2 leading-tight">
                      {code || "---"}
                    </h2>
                    <p className="text-base text-zinc-700 mb-4">
                      {name || "-"}
                    </p>
                    
                    <div className="flex justify-center my-4">
                      <div className="inline-block bg-white p-2 rounded-lg border border-zinc-200">
                        <img src={qrUrl} alt="QR Code" width="150" height="150" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-zinc-600 mb-2">Escaneie para localizar</p>
                    <p className="text-xs text-zinc-500 font-mono break-all">{qrData}</p>
                  </div>
                  
                  <button 
                    onClick={() => toast("Funcionalidade de impressão será implementada em breve!")}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition shadow-lg active:scale-95"
                  >
                    <Printer className="w-5 h-5" />
                    Imprimir etiqueta
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
