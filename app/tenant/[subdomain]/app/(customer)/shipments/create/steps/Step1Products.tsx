"use client";
import { useTenantSettings } from "../../../components/TenantSettingsContext";

import React, { useState } from "react";
import { Trash2, Plus, Minus, CheckCircle2, Search, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Step1Products({ formData, setFormData, onNext, onPrev }: any) {
  const { weightUnit } = useTenantSettings();
  const selectedProducts = formData.products || {};
  const productIds = Object.keys(selectedProducts);
  
  const totalItems = productIds.reduce((acc, id) => acc + (selectedProducts[id].quantity || 1), 0);
  const totalWeight = productIds.reduce((acc, id) => acc + (parseFloat(selectedProducts[id].weight || 0) * (selectedProducts[id].quantity || 1)), 0);

  const [showModal, setShowModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const getPhotoUrl = (photos: any) => {
    if (!photos) return null;
    const path = Array.isArray(photos) ? photos[0] : (typeof photos === 'string' ? photos : null);
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${supabaseUrl}/storage/v1/object/public/products/${path}`;
  };

  const openAddModal = async () => {
    setShowModal(true);
    if (availableProducts.length === 0) {
      setLoadingProducts(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: products } = await supabase
          .from('products')
          .select('*, boxes(status, id)')
          .eq('customer_id', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });
        
        if (products) {
          const av = products.filter(p => p.boxes?.status === 'RECEIVED');
          setAvailableProducts(av);
        }
      }
      setLoadingProducts(false);
    }
  };

  const toggleProductModal = (p: any) => {
    setFormData((prev: any) => {
      const next = { ...prev };
      const nextProducts = { ...(next.products || {}) };
      
      if (nextProducts[p.id]) {
        delete nextProducts[p.id];
      } else {
        const photoUrl = getPhotoUrl(p.photos);
        nextProducts[p.id] = {
          quantity: p.quantity || 1,
          maxQty: p.quantity || 1,
          weight: p.unit_weight || 0,
          name: p.name || "",
          photo_url: photoUrl,
          price_paid: p.price_paid || 0
        };
      }
      
      sessionStorage.setItem("preselected_products", JSON.stringify(nextProducts));
      return { ...next, products: nextProducts };
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setFormData((prev: any) => {
      const prod = prev.products[id];
      if (!prod) return prev;
      
      const newQty = (prod.quantity || 1) + delta;
      if (newQty < 1 || newQty > (prod.maxQty || 1)) return prev;

      const newProducts = {
        ...prev.products,
        [id]: {
          ...prod,
          quantity: newQty
        }
      };

      sessionStorage.setItem("preselected_products", JSON.stringify(newProducts));
      
      return {
        ...prev,
        products: newProducts
      };
    });
  };

  const removeProduct = (id: string) => {
    setFormData((prev: any) => {
      const newProducts = { ...prev.products };
      delete newProducts[id];
      
      // Keep sessionStorage in sync
      sessionStorage.setItem("preselected_products", JSON.stringify(newProducts));
      
      return {
        ...prev,
        products: newProducts
      };
    });
  };

  const filteredModalProducts = availableProducts.filter(p => {
    if (!search) return true;
    const term = search.toLowerCase();
    const shortId = p.id.split('-')[0];
    return (
      (p.name || '').toLowerCase().includes(term) ||
      (p.tracking_number || '').toLowerCase().includes(term) ||
      shortId.includes(term) ||
      `#${shortId}`.includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            📦
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Selecionar Produtos</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Escolha os produtos que deseja enviar</p>
          </div>
        </div>
      </div>

      {productIds.length > 0 ? (
        <div className="space-y-4">
          {productIds.map((id) => {
            const product = selectedProducts[id];
            return (
              <div key={id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-visible shrink-0 flex items-center justify-center border border-gray-100 dark:border-gray-600">
                    {product.photo_url ? (
                      <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                    {/* Green check badge */}
                    <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-0.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500 text-white dark:text-gray-800" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">{product.name}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-3 mt-1">
                       <span className="flex items-center gap-1">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                         {parseFloat(product.weight || 0).toFixed(3)} {weightUnit}
                       </span>
                       <span># {product.maxQty || 1} un.</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 justify-end sm:justify-start">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden h-10 bg-white dark:bg-gray-800">
                    <button 
                      onClick={() => updateQuantity(id, -1)}
                      disabled={(product.quantity || 1) <= 1}
                      className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-10 h-full flex items-center justify-center font-semibold text-sm text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700">
                      {product.quantity || 1}
                    </div>
                    <button 
                      onClick={() => updateQuantity(id, 1)}
                      disabled={(product.quantity || 1) >= (product.maxQty || 1)}
                      className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeProduct(id)}
                    className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum produto selecionado.</p>
        </div>
      )}

      {/* Botão Adicionar Mais */}
      <button 
        onClick={openAddModal}
        className="w-full py-4 border-2 border-dashed border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Plus className="w-5 h-5" />
        Adicionar Mais Produtos
      </button>

      {/* Summary Box */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-4 text-center mt-4">
        <div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{productIds.length}</div>
          <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-1">Produtos</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalItems}</div>
          <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-1">Itens</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-500">{totalWeight.toFixed(3)}</div>
          <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-1">KG</div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={productIds.length === 0}
          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continuar
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>

      {/* MODAL Adicionar Produtos */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 shrink-0">
              <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-2xl">📦</span>
                      Meu Dock
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Selecione mais produtos para adicionar a este envio</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por nome, tracking, dock..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/20">
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Carregando produtos...</p>
                </div>
              ) : filteredModalProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Nenhum produto encontrado.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredModalProducts.map(p => {
                    const isSelected = !!selectedProducts[p.id];
                    const photoUrl = getPhotoUrl(p.photos);
                    
                    return (
                      <div 
                        key={p.id}
                        onClick={() => toggleProductModal(p)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition cursor-pointer ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                          {photoUrl ? (
                            <img src={photoUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white truncate">{p.name || 'Sem nome'}</h4>
                          <div className="text-xs text-gray-500 mt-1 flex gap-2">
                             <span>Qtd: {p.quantity || 1}</span>
                             <span>Peso: {p.unit_weight || 0} {weightUnit}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                             isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 dark:border-gray-600'
                           }`}>
                             {isSelected && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0 flex justify-end">
               <button 
                 onClick={() => setShowModal(false)}
                 className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-lg"
               >
                 Confirmar Seleção ({productIds.length})
               </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
