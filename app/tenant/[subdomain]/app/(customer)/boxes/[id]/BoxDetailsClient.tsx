"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, X, ChevronRight, Package, Image as ImageIcon } from "lucide-react";

export function BoxDetailsClient({ box, currencySymbol, weightUnit }: { box: any, currencySymbol: string, weightUnit: string }) {
  // Estado para o Lightbox
  const [lightbox, setLightbox] = useState<{isOpen: boolean, items: string[], index: number, alt: string}>({
    isOpen: false,
    items: [],
    index: 0,
    alt: ""
  });

  const openLightbox = (items: string[], alt: string = "") => {
    if (items && items.length > 0) {
      setLightbox({ isOpen: true, items, index: 0, alt });
    }
  };

  const closeLightbox = () => {
    setLightbox({ ...lightbox, isOpen: false });
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.items.length
    }));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.items.length) % prev.items.length
    }));
  };

  const validProducts = box.products?.filter((p: any) => !p.deleted_at) || [];
  const totalProducts = validProducts.length;
  const totalQuantity = validProducts.reduce((acc: number, curr: any) => acc + (curr.quantity || 1), 0);
  const totalWeight = validProducts.reduce((acc: number, curr: any) => acc + (curr.total_weight || 0), 0);
  const totalPaid = validProducts.reduce((acc: number, curr: any) => acc + (curr.price_paid || 0), 0);

  const getImageUrl = (url: string, bucket: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${url}`;
  };


  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        
        {/* Header (Back button) */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/app/boxes" className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            Detalhes da Caixa <span className="text-zinc-400 font-medium">#{box.id.substring(0,8).toUpperCase()}</span>
          </h1>
        </div>
        
        {/* Informações da Caixa */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-zinc-200/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <h3 className="text-lg font-bold text-zinc-900">Informações Gerais</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto da Caixa */}
              <div className="md:col-span-2">
                {box.photos && box.photos.length > 0 ? (
                  <div className="relative group w-full max-w-2xl mx-auto rounded-xl shadow-sm overflow-hidden cursor-pointer" onClick={() => openLightbox(box.photos.map((p: string) => getImageUrl(p, "boxes")), `Fotos da caixa ${box.tracking_number}`)}>
                    <img src={getImageUrl(box.photos[0], "boxes")} alt="Foto da caixa" className="w-full h-auto max-h-64 object-contain bg-zinc-50 group-hover:scale-[1.02] transition-transform duration-300" />
                    {box.photos.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <ImageIcon className="w-4 h-4" />
                        + {box.photos.length - 1} foto{box.photos.length - 1 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-2xl mx-auto h-48 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                    <Package className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Nenhuma foto anexada</span>
                  </div>
                )}
              </div>
                
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">Nome da Loja</label>
                <p className="text-lg font-bold text-zinc-900">{box.store_name || "Loja não informada"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">Código de Rastreio</label>
                <code className="inline-block px-3 py-1 text-base font-mono bg-zinc-100 text-zinc-800 rounded-lg font-semibold">{box.tracking_number}</code>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">Recebido em</label>
                <p className="text-lg font-bold text-zinc-900">
                  {box.received_at ? format(new Date(box.received_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">Status</label>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-50 text-blue-600 border border-blue-100">
                  {box.status === 'RECEIVED' ? 'Recebida' : box.status}
                </span>
              </div>

              {box.notes && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-500 mb-1">Observações</label>
                  <p className="text-zinc-700 bg-zinc-50 rounded-xl p-4 border border-zinc-100/80">{box.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
            
        {/* Produtos da Caixa */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-zinc-200/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-zinc-900">Produtos na Caixa</h3>
            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-sm font-bold rounded-xl shadow-sm">
              {totalProducts} produto{totalProducts !== 1 ? 's' : ''}
            </span>
          </div>
          
          {totalProducts > 0 ? (
            <div className="divide-y divide-zinc-100">
              {validProducts.map((product: any) => (
                <div key={product.id} className="p-6 hover:bg-zinc-50/80 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    
                    {/* Foto do Produto */}
                    <div className="relative shrink-0">
                      {product.photos && product.photos.length > 0 ? (
                        <div 
                          className="w-24 h-24 rounded-xl overflow-hidden shadow-sm cursor-pointer border border-zinc-200 group"
                          onClick={() => openLightbox(product.photos.map((p: string) => getImageUrl(p, "products")), product.name)}
                        >
                          <img src={getImageUrl(product.photos[0], "products")} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          {product.photos.length > 1 && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold border border-white/20 backdrop-blur-sm">
                              +{product.photos.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-zinc-100 rounded-xl flex flex-col items-center justify-center text-zinc-400 border border-zinc-200">
                          <Package className="w-8 h-8 opacity-50 mb-1" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Sem foto</span>
                        </div>
                      )}
                    </div>
                                        
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h4 className="text-lg font-bold text-zinc-900">{product.name}</h4>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-zinc-100 text-zinc-600 border border-zinc-200">
                          #{product.id.substring(0,6)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Qtd</span>
                          <p className="text-lg font-bold text-zinc-900">{product.quantity}</p>
                        </div>
                        
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Peso Total</span>
                          <p className="text-lg font-bold text-zinc-900">{Number(product.total_weight || 0).toFixed(3)} {weightUnit}</p>
                        </div>
                        
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Valor Pago</span>
                          <p className="text-lg font-bold text-emerald-600">{currencySymbol}{Number(product.price_paid || 0).toFixed(2)}</p>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase">Declaração</p>
                        </div>

                        {product.code && (
                          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Código de Barras</span>
                            <p className="text-sm font-mono font-bold text-zinc-800 break-all">{product.code}</p>
                          </div>
                        )}
                      </div>

                      {product.notes && (
                        <div className="mt-4 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700/70 block mb-1">Observações</span>
                          <p className="text-sm font-medium text-amber-900">{product.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium text-lg">Nenhum produto listado nesta caixa</p>
            </div>
          )}

          {/* Totais */}
          {totalProducts > 0 && (
            <div className="px-6 py-6 bg-zinc-50 border-t border-zinc-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Produtos Únicos</p>
                  <p className="text-2xl font-black text-zinc-900">{totalProducts}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Total de Itens</p>
                  <p className="text-2xl font-black text-zinc-900">{totalQuantity}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mt-1">Disponível</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Peso Total</p>
                  <p className="text-2xl font-black text-zinc-900">{totalWeight.toFixed(3)} {weightUnit}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mt-1">Estimado</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Valor Total Pago</p>
                  <p className="text-2xl font-black text-emerald-600">{currencySymbol}{totalPaid.toFixed(2)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">Para declaração aduaneira</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeLightbox}
        >
          <div className="relative max-w-5xl max-h-[90vh] p-4 flex flex-col items-center justify-center w-full h-full">
            <button
              onClick={closeLightbox}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition"
            >
              <X className="w-8 h-8" />
            </button>

            {lightbox.items.length > 1 && (
              <button
                onClick={prevImage}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {lightbox.items.length > 1 && (
              <button
                onClick={nextImage}
                aria-label="Próxima foto"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            <img
              src={lightbox.items[lightbox.index]}
              alt={lightbox.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {lightbox.items.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md shadow-xl border border-white/10">
                {lightbox.index + 1} / {lightbox.items.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
