// @ts-nocheck
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, 
  X, 
  ChevronRight, 
  Search, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Camera,
  Trash2
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProductsClient({ initialProducts, initialTab }: { initialProducts: any[], initialTab: string }) {
  const router = useRouter();
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { quantity: number, maxQty: number, weight: number }>>({});
  
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingResults, setShippingResults] = useState<any[]>([]);
  const [shippingError, setShippingError] = useState<string | null>(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const getPhotoUrl = (photos: any) => {
    if (!photos) return null;
    const path = Array.isArray(photos) ? photos[0] : (typeof photos === 'string' ? photos : null);
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${supabaseUrl}/storage/v1/object/public/products/${path}`;
  };


  // Restore selection on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("app_products_selection");
      if (saved) {
        setSelectedProducts(JSON.parse(saved));
      }
    } catch(e) {}
  }, []);

  // Save selection on change
  useEffect(() => {
    sessionStorage.setItem("app_products_selection", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  // Derived state
  const availableProducts = initialProducts.filter(p => p.boxes?.status === 'RECEIVED');
  const shippedProducts = initialProducts.filter(p => p.boxes?.status !== 'RECEIVED');

  const filteredProducts = useMemo(() => {
    let source = tab === 'available' ? availableProducts : tab === 'shipped' ? shippedProducts : initialProducts;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      source = source.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.id && p.id.toLowerCase().includes(q.replace('#', ''))) ||
        (p.code && p.code.toLowerCase().includes(q))
      );
    }
    
    // Simplistic expiry filter if implemented
    if (statusFilter === 'expired') {
       // Assuming expiry logic exists
       source = source.filter(p => false); // placeholder
    }
    
    return source;
  }, [tab, search, statusFilter, availableProducts, shippedProducts, initialProducts]);

  const toggleProduct = (p: any) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[p.id]) {
        delete next[p.id];
      } else {
        const photoUrl = getPhotoUrl(p.photos);
        next[p.id] = {
          quantity: p.quantity || 1,
          maxQty: p.quantity || 1,
          weight: p.unit_weight || 0,
          name: p.name || "",
          photo_url: photoUrl
        };
      }
      return next;
    });
  };

  const updateQuantity = (id: string, val: string) => {
    const qty = parseInt(val, 10);
    if (isNaN(qty) || qty < 1) return;
    setSelectedProducts(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          quantity: Math.min(qty, prev[id].maxQty)
        }
      };
    });
  };

  const selectAll = () => {
    const next = { ...selectedProducts };
    filteredProducts.forEach(p => {
      if (!next[p.id]) {
        const photoUrl = getPhotoUrl(p.photos);
        next[p.id] = {
          quantity: p.quantity || 1,
          maxQty: p.quantity || 1,
          weight: p.unit_weight || 0,
          name: p.name || "",
          photo_url: photoUrl
        };
      }
    });
    setSelectedProducts(next);
  };

  const deselectAll = () => {
    setSelectedProducts({});
    setShippingResults([]);
  };

  const selectedCount = Object.keys(selectedProducts).length;
  const totalItems = Object.values(selectedProducts).reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = Object.values(selectedProducts).reduce((sum, item) => sum + (item.weight * item.quantity), 0);

  const calculateShipping = async () => {
    if (selectedCount === 0) return;
    setLoadingShipping(true);
    setShippingError(null);
    setShippingResults([]);
    
    // Simulate delay
    setTimeout(() => {
      setLoadingShipping(false);
      setShippingResults([
        {
          shipping_type: "Express Air",
          weight: totalWeight.toFixed(3),
          weight_unit: weightUnit,
          box_extra_weight: "0.200",
          total_weight: (totalWeight + 0.2).toFixed(3),
          currency: currency,
          sale_price: "45.00",
          service_fee: "5.00",
          total_cost: "50.00"
        },
        {
          shipping_type: "Economy Packet",
          weight: totalWeight.toFixed(3),
          weight_unit: weightUnit,
          box_extra_weight: "0.200",
          total_weight: (totalWeight + 0.2).toFixed(3),
          currency: currency,
          sale_price: "25.00",
          service_fee: "5.00",
          total_cost: "30.00"
        }
      ]);
    }, 1500);
  };

  const requestShipping = () => {
    if (selectedCount === 0) {
      toast.error("Selecione pelo menos um produto para solicitar envio.");
      return;
    }
    setShowConfirmationModal(true);
  };

  const confirmShipping = () => {
    sessionStorage.setItem("preselected_products", JSON.stringify(selectedProducts));
    toast.success("Redirecionando para criação de envio...");
    router.push('/app/shipments/create');
    setShowConfirmationModal(false);
  };

  const openLightbox = (photos: any) => {
    if (!photos) return;
    let images = [];
    if (typeof photos === 'string') images = [photos];
    else if (Array.isArray(photos)) images = photos;
    else return;
    
    if (images.length > 0) {
      setLightboxImages(images);
      setLightboxIndex(0);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="-m-8 min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950 py-8 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-3xl">📦</span>
              Meu Dock
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Selecione produtos para solicitar envio
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-500">{availableProducts.length}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Disponíveis</div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-500">{shippedProducts.length}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Enviados</div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-zinc-600 dark:text-zinc-300">{initialProducts.length}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Total</div>
            </div>
          </div>
        </div>

        {/* Resumo e Ações */}
        {selectedCount > 0 && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-xs font-medium text-emerald-100 mb-1">Produtos Selecionados</div>
                  <div className="text-2xl font-bold">{selectedCount}</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-xs font-medium text-emerald-100 mb-1">Total de Itens</div>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-xs font-medium text-emerald-100 mb-1">Peso Total</div>
                  <div className="text-2xl font-bold">{totalWeight.toFixed(3)} kg</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={deselectAll} type="button" className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-semibold transition shadow-lg">
                  Limpar Seleção
                </button>
                <button onClick={calculateShipping} type="button" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Simular Frete
                </button>
                <button onClick={requestShipping} type="button" className="px-8 py-3 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold transition shadow-xl flex items-center justify-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Solicitar Envio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Simulador de Frete */}
        {(shippingResults.length > 0 || loadingShipping || shippingError) && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-top-4">
            <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-amber-600 border-b border-orange-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Simulação de Frete</h3>
                  <p className="text-sm text-orange-100">Veja as opções de envio disponíveis</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loadingShipping && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  <p className="mt-4 text-sm text-zinc-500">Calculando opções...</p>
                </div>
              )}
              
              {!loadingShipping && shippingResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shippingResults.map((result, i) => (
                    <div key={i} className="relative bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-orange-500 transition-all p-5">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                        <h4 className="text-lg font-bold">{result.shipping_type}</h4>
                      </div>
                      <div className="space-y-3 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700 text-sm">
                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                          <span>Peso produtos:</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{result.weight} {result.weight_unit}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t border-zinc-200 dark:border-zinc-700">
                          <span>Peso Total:</span>
                          <span className="text-orange-500">{result.total_weight} {result.weight_unit}</span>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Frete:</span>
                          <span className="font-semibold">{result.currency} {result.sale_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Serviço:</span>
                          <span className="font-semibold">{result.currency} {result.service_fee}</span>
                        </div>
                        <div className="flex justify-between pt-3 mt-3 border-t-2 border-orange-500/20 text-lg font-bold">
                          <span>TOTAL:</span>
                          <span className="text-orange-500">{result.currency} {result.total_cost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-2 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
            <button onClick={() => setTab('available')} className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${tab === 'available' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
              Disponíveis
              <span className={`px-2 py-0.5 rounded-full text-xs ${tab === 'available' ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>{availableProducts.length}</span>
            </button>
            <button onClick={() => setTab('shipped')} className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${tab === 'shipped' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
              Enviados
              <span className={`px-2 py-0.5 rounded-full text-xs ${tab === 'shipped' ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>{shippedProducts.length}</span>
            </button>
            <button onClick={() => setTab('all')} className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${tab === 'all' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
              Todos
              <span className={`px-2 py-0.5 rounded-full text-xs ${tab === 'all' ? 'bg-white/20' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'}`}>{initialProducts.length}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Buscar Produto</label>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nome ou ID" className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500 px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 focus:border-emerald-500 px-4 py-2.5">
                <option value="">Todos</option>
                <option value="expired">Vencidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {tab === 'available' && (
            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold">{filteredProducts.length}</span> produtos listados
              </div>
              <div className="flex items-center gap-2">
                <button onClick={selectAll} className="px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition">
                  Selecionar Todos
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  {tab === 'available' && <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Selec.</th>}
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Caixa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Qtd</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Peso Unit.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Valor Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredProducts.map(p => (
                  <tr key={p.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition ${selectedProducts[p.id] ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}>
                    
                    {tab === 'available' && (
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <input 
                            type="checkbox" 
                            checked={!!selectedProducts[p.id]} 
                            onChange={() => toggleProduct(p)} 
                            className="w-5 h-5 text-emerald-600 border-zinc-300 rounded focus:ring-emerald-500" 
                          />
                          {selectedProducts[p.id] && (
                            <div className="mt-2">
                              <label className="block text-xs text-zinc-500 mb-1">Enviar:</label>
                              <input 
                                type="number" 
                                min={1} 
                                max={p.quantity || 1} 
                                value={selectedProducts[p.id]?.quantity || 1}
                                onChange={(e) => updateQuantity(p.id, e.target.value)}
                                className="w-20 px-2 py-1 text-sm border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 rounded focus:ring-emerald-500"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 cursor-pointer hover:ring-2 ring-emerald-500" onClick={() => openLightbox(p.photos)}>
                          {getPhotoUrl(p.photos) ? <img src={getPhotoUrl(p.photos)} alt="Produto" className="w-full h-full object-cover rounded-lg" /> : <Package className="w-6 h-6 text-zinc-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{p.name || 'Sem nome'}</div>
                          <div className="text-xs font-mono text-zinc-500 mt-1">#{p.id.substring(0,6)}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {p.box_id ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                          <Package className="w-4 h-4" /> Caixa #{p.box_id.substring(0,6)}
                        </span>
                      ) : '-'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-500">{p.quantity || 1}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold">{p.unit_weight || 0} kg</div>
                      <div className="text-xs text-zinc-500">Total: {((p.unit_weight || 0) * (p.quantity || 1)).toFixed(3)} kg</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-emerald-600">${p.price_paid || '0.00'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                        OK
                      </span>
                    </td>

                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmationModal(false)}></div>
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Confirmar Solicitação</h3>
              <p className="text-emerald-100 text-sm">Revise os detalhes antes de prosseguir</p>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-700">
                  <div className="text-2xl font-bold">{selectedCount}</div>
                  <div className="text-xs text-zinc-500 mt-1">Produtos</div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-700">
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <div className="text-xs text-zinc-500 mt-1">Itens</div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-700">
                  <div className="text-2xl font-bold">{totalWeight.toFixed(3)}</div>
                  <div className="text-xs text-zinc-500 mt-1">kg</div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button onClick={() => setShowConfirmationModal(false)} className="px-6 py-2.5 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl font-semibold transition-all">
                Cancelar
              </button>
              <button onClick={confirmShipping} className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                Prosseguir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox placeholder */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4" onClick={() => setLightboxOpen(false)}>
           <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxOpen(false)}><X className="w-8 h-8" /></button>
           {/* In a real app we render the image tag here */}
           
           <div className="relative max-w-5xl max-h-[90vh] p-4 flex flex-col items-center">
             {lightboxImages.length > 0 && getPhotoUrl(lightboxImages[lightboxIndex]) && (
               <img src={getPhotoUrl(lightboxImages[lightboxIndex])} alt="Lightbox" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" />
             )}
             {lightboxImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full bg-black/70 text-white border border-white/20">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </div>
             )}
           </div>
           {lightboxImages.length > 1 && (
             <>
               <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-zinc-900 rounded-full p-2" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length); }}>
                 &lt;
               </button>
               <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-zinc-900 rounded-full p-2" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % lightboxImages.length); }}>
                 &gt;
               </button>
             </>
           )}

        </div>
      )}

    </div>
  );
}
