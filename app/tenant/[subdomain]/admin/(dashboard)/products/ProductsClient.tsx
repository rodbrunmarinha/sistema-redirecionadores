// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { PackageOpen, Search, Package, AlertTriangle, Image as ImageIcon, X, Printer, LayoutGrid, List, Edit2, Trash2 } from "lucide-react";
import { deleteProductByAdmin } from "@/app/actions/deleteProductByAdmin";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsClient({ initialProducts, tenantSettings }: { initialProducts: any[], tenantSettings: any }) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState("");
  
  // Modals
  const [imageModal, setImageModal] = useState<{ open: boolean; src: string; alt: string }>({ open: false, src: "", alt: "" });
  const [labelModal, setLabelModal] = useState<{ open: boolean; product: any }>({ open: false, product: null });

  // Settings
  const storageLimit = Number(tenantSettings?.operations?.storageDays || tenantSettings?.storageDays) || 30;
  const dailyFeeVal = tenantSettings?.operations?.storagePenalty ?? tenantSettings?.storagePenalty;
  const dailyFee = dailyFeeVal !== undefined ? Number(dailyFeeVal) : 1;

  const calculateStatus = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const isExpired = diffDays > storageLimit;
    const fee = isExpired ? (diffDays - storageLimit) * dailyFee : 0;
    
    return { diffDays, isExpired, fee };
  };
  
  const searchParams = useSearchParams();
  const statusFilter = searchParams?.get('status');
  const searchName = searchParams?.get('name') || "";
  const searchBarcode = searchParams?.get('barcode') || "";
  const searchBox = searchParams?.get('box_id') || "";

  const totalProducts = initialProducts.length;
  const expiredProducts = initialProducts.filter(p => calculateStatus(p.created_at).isExpired).length;
  const totalFees = initialProducts.reduce((acc, p) => acc + calculateStatus(p.created_at).fee, 0);
  const totalWeight = initialProducts.reduce((acc, p) => acc + Number(p.total_weight || 0), 0);

  const filteredProducts = initialProducts.filter(p => {
    if (statusFilter === 'expired' && !calculateStatus(p.created_at).isExpired) return false;
    if (searchBox && (!p.box_id || !p.box_id.toLowerCase().includes(searchBox.replace('#', '').toLowerCase()))) return false;
    
    // As name and barcode are handled by server, we don't strictly need to do them here, but we can do them here too if we want.
    // The user's query might crash if barcode or name are used in Server if not exact? No, name is ilike, barcode is eq (but barcode is text).
    // Let's also do a local fallback just in case.
    if (searchName && (!p.name || !p.name.toLowerCase().includes(searchName.toLowerCase()))) return false;
    if (searchBarcode && p.code !== searchBarcode) return false;

    return true;
  });


  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) return;
    setIsDeleting(id);
    const res = await deleteProductByAdmin(id);
    setIsDeleting("");
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

          
  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${path}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-medium">Produtos</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Catálogo de Produtos</h1>
                <p className="text-orange-100 text-sm mt-0.5">Gestão completa de produtos recebidos</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/products?show_abandoned=1" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition text-sm">
                <AlertTriangle className="w-4 h-4" />
                Ver abandonados
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/products" className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 transition cursor-pointer">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <p className="text-blue-100 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3">Total de Produtos</p>
              <p className="text-3xl font-extrabold tracking-tight">{totalProducts}</p>
            </div>
          </Link>
          <Link href="/admin/products?status=expired" className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-4 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700 transition cursor-pointer">
             <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
             <div className="relative">
               <p className="text-red-100 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3">Armaz. Vencido</p>
               <p className="text-3xl font-extrabold tracking-tight">{expiredProducts}</p>
             </div>
          </Link>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white shadow-lg shadow-amber-500/25">
             <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
             <div className="relative">
               <p className="text-amber-100 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3">Taxas Acumuladas</p>
               <p className="text-2xl font-extrabold tracking-tight">${totalFees.toFixed(2).replace('.', ',')}</p>
             </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-lg shadow-purple-500/25">
             <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
             <div className="relative">
               <p className="text-purple-100 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3">Peso Total</p>
               <p className="text-3xl font-extrabold tracking-tight">{totalWeight.toFixed(3)} <span className="text-base font-normal">kg</span></p>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800">
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-between px-5 py-4 text-left">
             <div className="flex items-center gap-2.5">
               <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
                 <Search className="h-3.5 w-3.5 text-orange-500" />
               </div>
               <span className="text-sm font-semibold text-zinc-200">Filtros Avançados</span>
             </div>
          </button>
          {showFilters && (
            <form method="GET" action="/admin/products" className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-zinc-800 pt-4">
              {/* Nome */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase text-zinc-500">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={searchName}
                  placeholder="Ex: iPhone 13"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              {/* Caixa */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase text-zinc-500">
                  ID da Caixa
                </label>
                <input
                  type="text"
                  name="box_id"
                  defaultValue={searchBox}
                  placeholder="#"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              {/* Código de Barras */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase text-zinc-500">
                  Cód. de Barras
                </label>
                <input
                  type="text"
                  name="barcode"
                  defaultValue={searchBarcode}
                  placeholder="Ex: 123456"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              {/* Botões */}
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
                >
                  Filtrar
                </button>
                <Link
                  href="/admin/products"
                  className="flex-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition"
                >
                  Limpar
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-800">
            <p className="text-sm text-zinc-400">{totalProducts} produto(s) encontrado(s)</p>
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button type="button" onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition ${viewMode === 'table' ? 'bg-zinc-800 text-orange-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <List className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setViewMode("cards")} className={`p-2 rounded-lg transition ${viewMode === 'cards' ? 'bg-zinc-800 text-orange-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {totalProducts === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-800 mb-6">
                <PackageOpen className="h-10 w-10 text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold text-white">Nenhum produto encontrado</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-sm">Registre produtos através das caixas recebidas.</p>
              <Link href="/admin/boxes" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition">
                Ver Caixas
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y divide-zinc-800 ${viewMode === 'cards' ? 'hidden' : ''}`}>
                <thead className="bg-zinc-950">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Produto</th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Dock</th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left hidden lg:table-cell">Caixa</th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Peso</th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredProducts.map(p => {
                    const status = calculateStatus(p.created_at);
                    return (
                    <tr key={p.id} className="hover:bg-zinc-800/50 transition">
                      <td className="px-4 py-3 whitespace-nowrap align-top">
                        <span className="font-mono text-xs font-semibold text-zinc-300">#{p.id.substring(0,6)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0">
                            {p.photos && p.photos.length > 0 ? (
                              <img 
                                src={getImageUrl(p.photos[0]) || ""} 
                                alt={p.name} 
                                onClick={() => setImageModal({ open: true, src: getImageUrl(p.photos[0]) || "", alt: p.name })}
                                className="h-12 w-12 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-orange-500 transition"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-zinc-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-100">{p.name}</p>
                            {p.code && <p className="text-xs font-mono text-zinc-500 mt-0.5">{p.code}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400">
                          {p.customer?.suite_number}
                        </span>
                        <div className="mt-1 text-xs text-zinc-500">{p.customer?.full_name}</div>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap">
                        <Link href={`/admin/boxes/${p.box_id}`} className="inline-flex items-center rounded-lg bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-zinc-400 hover:text-white transition">
                          #{p.box_id.substring(0,6)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right align-top">
                        <span className="inline-flex items-center rounded-lg bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
                          {Number(p.total_weight).toFixed(3)} kg
                        </span>
                        <span className="mt-0.5 block text-[11px] text-zinc-500">
                          {p.quantity} × {Number(p.unit_weight).toFixed(3)} kg
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="space-y-1">
                          {status.isExpired ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                              ❌ Vencido
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                              ✅ No prazo
                            </span>
                          )}
                          <div className="text-[11px] text-zinc-500">
                            📅 {status.diffDays}/{storageLimit} dias
                          </div>
                          <div className={`text-[11px] font-medium ${status.fee > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            ${status.fee.toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button onClick={() => setLabelModal({ open: true, product: p })} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition">
                            <Printer className="w-3.5 h-3.5" /> Etiqueta
                          </button>
                          <Link href={`/admin/products/${p.id}/edit`} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition">
                            <Edit2 className="w-3.5 h-3.5" /> Editar
                          </Link>
                          <button onClick={() => handleDelete(p.id)} disabled={isDeleting === p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50">
                            <Trash2 className="w-3.5 h-3.5" /> {isDeleting === p.id ? "..." : "Excluir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>

              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredProducts.map(p => {
                    const status = calculateStatus(p.created_at);
                    return (
                    <div key={p.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                         <div className="shrink-0">
                            {p.photos && p.photos.length > 0 ? (
                              <img 
                                src={getImageUrl(p.photos[0]) || ""} 
                                alt={p.name} 
                                onClick={() => setImageModal({ open: true, src: getImageUrl(p.photos[0]) || "", alt: p.name })}
                                className="h-16 w-16 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-orange-500 transition"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-zinc-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-100 leading-tight mb-1">{p.name}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/20 text-orange-400">
                              Dock {p.customer?.suite_number}
                            </span>
                          </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-zinc-400">
                        <span>{Number(p.total_weight).toFixed(3)} kg</span>
                        <Link href={`/admin/boxes/${p.box_id}`} className="hover:text-white">Caixa #{p.box_id.substring(0,6)}</Link>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs pt-2">
                        <div className="flex flex-col gap-0.5">
                          <span className={status.isExpired ? "text-red-400 font-semibold" : "text-emerald-400 font-semibold"}>
                            {status.isExpired ? "❌ Vencido" : "✅ No prazo"}
                          </span>
                          <span className="text-[10px] text-zinc-500">{status.diffDays}/{storageLimit} dias</span>
                        </div>
                        <span className={`font-medium ${status.fee > 0 ? 'text-orange-400' : 'text-zinc-400'}`}>${status.fee.toFixed(2).replace(".", ",")}</span>
                      </div>

                      <div className="pt-3 border-t border-zinc-800 grid grid-cols-3 gap-2">
                        <button onClick={() => setLabelModal({ open: true, product: p })} className="justify-center inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition">
                          <Printer className="w-3.5 h-3.5" /> Etiqueta
                        </button>
                        <Link href={`/admin/products/${p.id}/edit`} className="justify-center inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition">
                          <Edit2 className="w-3.5 h-3.5" /> Editar
                        </Link>
                        <button onClick={() => handleDelete(p.id)} disabled={isDeleting === p.id} className="justify-center inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50">
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </button>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Lightbox */}
      {imageModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setImageModal({ open: false, src: "", alt: "" })}>
          <div className="relative max-w-5xl max-h-[90vh]">
             <button onClick={() => setImageModal({ open: false, src: "", alt: "" })} className="absolute -top-4 -right-4 z-10 bg-zinc-800 text-white rounded-full p-2 hover:bg-zinc-700 transition">
               <X className="w-5 h-5" />
             </button>
             <img src={imageModal.src} alt={imageModal.alt} className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
          </div>
        </div>
      )}

      {/* Label Modal */}
      {labelModal.open && labelModal.product && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden relative print:w-full print:max-w-none print:shadow-none print:rounded-none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 print:hidden">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><Printer className="w-5 h-5 text-purple-500" /> Etiqueta</h3>
              <button onClick={() => setLabelModal({ open: false, product: null })} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 text-center bg-white print:p-0 print:m-0">
              <style>{`@media print { body * { visibility: hidden; } .fixed, .fixed * { visibility: visible; } .fixed { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: block; background: white !important;} }`}</style>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">DOCKDROP</p>
              <p className="text-sm font-extrabold text-gray-900 leading-tight mb-2 uppercase">{labelModal.product.name}</p>
              <p className="text-xs text-gray-600 mb-1">Dock {labelModal.product.customer?.suite_number}</p>
              <p className="text-xs text-gray-600 mb-4 font-mono font-bold">CAIXA: {labelModal.product.box_id.substring(0,6).toUpperCase()}</p>
              <div className="flex justify-center mb-2">
                 <div className="w-24 h-24 flex items-center justify-center bg-white p-1 border-2 border-black rounded-lg">
                   <QRCode value={labelModal.product.barcode || labelModal.product.id} size={80} level="M" />
                 </div>
              </div>
              <p className="font-mono text-[10px] font-bold text-gray-800 tracking-widest mt-2">{labelModal.product.code || ('ID-'+labelModal.product.id.substring(0,6).toUpperCase())}</p>
            </div>

            <div className="flex gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 print:hidden">
              <button onClick={() => setLabelModal({ open: false, product: null })} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition">Fechar</button>
              <button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition"><Printer className="w-4 h-4" /> Imprimir</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
