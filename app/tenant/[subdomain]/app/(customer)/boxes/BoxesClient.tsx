"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Users, ShoppingBag, HeartHandshake, X, ChevronLeft, ChevronRight, Package, Image as ImageIcon, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function BoxesClient({ initialBoxes, currencySymbol }: { initialBoxes: any[], currencySymbol: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  
  // Estado para o Lightbox de Imagens
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

  const getImageUrl = (url: string, bucket: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${url}`;
  };

  const filteredBoxes = initialBoxes.filter(box => {
    const matchesSearch = box.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = storeFilter ? box.store_name?.toLowerCase().includes(storeFilter.toLowerCase()) : true;
    return matchesSearch && matchesStore;
  });

  return (
    <>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
                Caixas Recebidas
              </h1>
              <p className="text-zinc-600 mt-1">
                Acompanhe suas encomendas recebidas no dock
              </p>
            </div>
            
            {/* Estatstica rapida */}
            <div className="bg-white rounded-xl p-4 border border-zinc-200 shadow-sm min-w-[120px]">
              <div className="text-3xl font-bold text-blue-600">{initialBoxes.length}</div>
              <div className="text-sm text-zinc-500">Caixas</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Filtros */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-zinc-400" />
                  </div>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Código de rastreio..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Loja</label>
                <input 
                  type="text" 
                  value={storeFilter}
                  onChange={(e) => setStoreFilter(e.target.value)}
                  placeholder="Nome da loja..." 
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                />
              </div>
            </div>
          </div>

          {filteredBoxes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 overflow-hidden">
              <div className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                  <svg className="mx-auto h-24 w-24 text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                    Nenhuma caixa encontrada
                  </h3>
                  <p className="text-zinc-600 text-lg mb-10">
                    Sua busca não retornou resultados, ou você ainda não possui caixas recebidas.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-md transition cursor-pointer">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-zinc-900 mb-2 text-sm">
                        Endereo nos Estados Unidos
                      </h4>
                      <p className="text-xs text-zinc-600">Compre usando seu endereo do dock</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-md transition cursor-pointer">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-zinc-900 mb-2 text-sm">Grupos de Compras</h4>
                      <p className="text-xs text-zinc-600">Participe e economize em grupo</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 hover:shadow-md transition cursor-pointer">
                      <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-zinc-900 mb-2 text-sm">Loja Online</h4>
                      <p className="text-xs text-zinc-600">Produtos prontos para comprar</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 hover:shadow-md transition cursor-pointer">
                      <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                        <HeartHandshake className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-zinc-900 mb-2 text-sm">Compra Assistida</h4>
                      <p className="text-xs text-zinc-600">Nós compramos para você</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBoxes.map((box) => {
                const allBoxPhotos = box.photos ? box.photos.map((p: string) => getImageUrl(p, "boxes")) : [];
                const allProductPhotos = (box.products || []).filter((p: any) => !p.deleted_at).flatMap((p: any) => p.photos ? p.photos.map((ph: string) => getImageUrl(ph, "products")) : []);
                const allPhotos = [...allBoxPhotos, ...allProductPhotos];
                const totalPhotosCount = allPhotos.length;
                return (

                <div key={box.id} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-zinc-200/50 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 bg-zinc-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200/60 shadow-sm cursor-pointer" 
                        onClick={() => box.photos && box.photos.length > 0 && openLightbox(box.photos.map((p: string) => getImageUrl(p, "boxes")), `Fotos da caixa ${box.tracking_number}`)}
                      >
                        {box.photos && box.photos.length > 0 ? (
                          <img src={getImageUrl(box.photos[0], "boxes")} alt="Box" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <Package className="w-6 h-6 text-zinc-400" />
                        )}
                      </div>
                                            <div className="overflow-hidden">
                        <h3 className="font-bold text-[15px] text-zinc-900 truncate">{box.store_name || "Loja não informada"}</h3>
                        <p className="text-[12px] font-medium text-zinc-500 truncate">{box.tracking_number}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      {box.status === 'RECEIVED' ? 'Recebida' : box.status}
                    </span>
                    <Link href={`/app/boxes/${box.id}`} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100/80 text-zinc-600 font-bold text-xs hover:bg-zinc-200 hover:text-zinc-900 transition-colors border border-zinc-200/50">
                      Ver Detalhes <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                    </Link>
                  </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      {box.received_at ? format(new Date(box.received_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : '-'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-zinc-400" />
                      {box.products ? box.products.length : 0} produtos
                    </div>
                    {totalPhotosCount > 0 && (
                      <button 
                        onClick={() => openLightbox(allPhotos, `Todas as fotos da caixa ${box.tracking_number}`)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <ImageIcon className="w-4 h-4" />
                        {totalPhotosCount} {totalPhotosCount === 1 ? 'foto' : 'fotos'}
                      </button>
                    )}
                  </div>
                  
                  {/* Produtos da Caixa */}
                  <div className="mt-auto pt-3 border-t border-zinc-100/80">
                    <h4 className="text-xs font-bold text-zinc-800 mb-2">Itens:</h4>
                    {box.products && box.products.length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1.5 custom-scrollbar">
                        {box.products.filter((p: any) => !p.deleted_at).map((product: any) => (
                          <div key={product.id} className="flex justify-between items-center text-[12px] py-1.5 px-2 bg-orange-50/50 hover:bg-orange-50 rounded-md border border-orange-100/30 mb-1">
                              <span className="text-zinc-700 truncate mr-3 font-medium">{product.name}</span>
                              <span className="font-bold text-orange-600 shrink-0 bg-white px-2 py-0.5 rounded-md border border-orange-100/50 shadow-sm">x{product.quantity}</span>
                            </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">Nenhum produto cadastrado nesta caixa.</p>
                    )}
                  </div>

                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md">
                {lightbox.index + 1} de {lightbox.items.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
