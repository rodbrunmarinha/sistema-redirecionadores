"use client";

import { useState } from "react";
import { Package, X, ChevronRight, Inbox, Search } from "lucide-react";

export default function SuitePage() {
  // Estados para simular a interatividade
  const [selectedCount, setSelectedCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [hasPendingDraft, setHasPendingDraft] = useState(true); // Exibir por padrão para o usuário ver
  const [showShippingResults, setShowShippingResults] = useState(false);

  // Mock de resultados de frete
  const mockShippingResults = [
    {
      shipping_type: "Packet Express",
      weight: "1.5",
      weight_unit: "kg",
      box_extra_weight: "0.2",
      total_weight: "1.7",
      currency: "US$",
      sale_price: "25.00",
      service_fee: "5.00",
      rate_weight_limit: "2.0",
      price_per_weight: "15.00",
      total_cost: "30.00"
    },
    {
      shipping_type: "Standard BR",
      weight: "1.5",
      weight_unit: "kg",
      box_extra_weight: "0.2",
      total_weight: "1.7",
      currency: "US$",
      sale_price: "18.00",
      service_fee: "4.00",
      rate_weight_limit: "2.0",
      price_per_weight: "10.00",
      total_cost: "22.00"
    }
  ];

  // Função para simular seleção de produtos
  const simulateSelection = () => {
    setSelectedCount(3);
    setTotalItems(5);
    setTotalWeight(1.5);
  };

  const clearSelection = () => {
    setSelectedCount(0);
    setTotalItems(0);
    setTotalWeight(0);
    setShowShippingResults(false);
  };

  return (
    <>
      {/* Estilos de Animação Globais */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
        .animation-delay-1000 {
            animation-delay: 1s;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
      `}} />

      <div className="space-y-6">
        
        {/* Header e Estatísticas Rápidas */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
              <span className="text-3xl">📦</span>
              Meu Dock
            </h1>
            <p className="text-zinc-500 mt-1">
              Selecione produtos para solicitar envio
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white rounded-xl p-3 border border-zinc-200 shadow-sm min-w-[100px]">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">0</div>
              <div className="text-xs text-zinc-500">Disponíveis</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-zinc-200 shadow-sm min-w-[100px]">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">0</div>
              <div className="text-xs text-zinc-500">Enviados</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-zinc-200 shadow-sm min-w-[100px]">
              <div className="text-xl sm:text-2xl font-bold text-zinc-600">0</div>
              <div className="text-xs text-zinc-500">Total</div>
            </div>
          </div>
        </div>

        {/* Modal de Confirmação de Envio */}
        {showConfirmationModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-zinc-900/75 backdrop-blur-sm" onClick={() => setShowConfirmationModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-center">
                <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirmar Solicitação de Envio</h3>
                <p className="text-emerald-100 text-sm">Revise os detalhes antes de prosseguir</p>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                    <div className="flex justify-center mb-2"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
                    <div className="text-2xl font-bold text-blue-900">{selectedCount}</div>
                    <div className="text-xs font-medium text-blue-600 mt-1">Produtos</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
                    <div className="flex justify-center mb-2"><svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg></div>
                    <div className="text-2xl font-bold text-purple-900">{totalItems}</div>
                    <div className="text-xs font-medium text-purple-600 mt-1">Itens</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center border border-amber-200">
                    <div className="flex justify-center mb-2"><svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg></div>
                    <div className="text-2xl font-bold text-amber-900">{totalWeight.toFixed(3)}</div>
                    <div className="text-xs font-medium text-amber-600 mt-1">kg</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                      <p className="text-sm text-emerald-900 font-medium">Próximo passo</p>
                      <p className="text-xs text-emerald-700 mt-1">Você será direcionado para o assistente de envio, onde poderá escolher o método de entrega, endereço e serviços adicionais.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button onClick={() => setShowConfirmationModal(false)} className="px-6 py-2.5 bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 rounded-xl font-semibold shadow-sm">
                  Cancelar
                </button>
                <button className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  Prosseguir com Envio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerta de Rascunho Pendente */}
        {hasPendingDraft && (
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl shadow-xl shadow-amber-500/20 border border-amber-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
                      <span>📦 Envio Pendente</span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-semibold rounded-full">Etapa 1/7</span>
                    </h3>
                    <p className="text-amber-700 mt-1">
                      Você tem um envio não finalizado de hoje. Continue de onde parou!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button onClick={() => setHasPendingDraft(false)} className="px-4 py-2.5 text-amber-700 hover:bg-amber-100 rounded-xl transition font-medium text-sm">
                    Descartar
                  </button>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl shadow-lg transition font-semibold text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    Continuar Rascunho
                  </button>
                </div>
              </div>
            </div>
            <div className="h-1.5 bg-amber-200"><div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[14%]"></div></div>
          </div>
        )}

        {/* Barra Flutuante de Resumo (Simulação de UI) */}
        {selectedCount === 0 && (
          <div className="bg-zinc-100 border border-zinc-200 border-dashed rounded-xl p-4 text-center">
            <p className="text-sm text-zinc-500 mb-3">Para testar o visual dos botões flutuantes, clique no botão abaixo:</p>
            <button onClick={simulateSelection} className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm">
              Simular Seleção de Produtos
            </button>
          </div>
        )}

        {selectedCount > 0 && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
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
                <button onClick={clearSelection} className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-semibold shadow-lg">
                  Limpar Seleção
                </button>
                <button onClick={() => setShowShippingResults(true)} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  Simular Frete
                </button>
                <button onClick={() => setShowConfirmationModal(true)} className="px-8 py-3 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Solicitar Envio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Simulador de Frete Resultante */}
        {showShippingResults && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-amber-600 border-b border-orange-500 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg></div>
                <div>
                  <h3 className="text-lg font-bold text-white">Simulação de Frete</h3>
                  <p className="text-sm text-orange-100">Veja as opções de envio disponíveis para seus produtos</p>
                </div>
              </div>
              <button onClick={() => setShowShippingResults(false)} className="text-white hover:bg-white/20 p-2 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockShippingResults.map((res, i) => (
                  <div key={i} className="relative bg-white rounded-xl border-2 border-zinc-200 hover:border-orange-500 transition-all shadow-lg overflow-hidden group">
                    <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-zinc-200 flex justify-between items-center">
                      <h4 className="text-lg font-bold text-zinc-900">{res.shipping_type}</h4>
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <div className="p-5 space-y-3 border-b border-zinc-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">Peso dos produtos:</span>
                        <span className="font-semibold text-zinc-900">{res.weight} {res.weight_unit}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">+ Peso da caixa:</span>
                        <span className="font-semibold text-zinc-700">{res.box_extra_weight} {res.weight_unit}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                        <span className="font-semibold text-zinc-700">Peso Total:</span>
                        <span className="text-lg font-bold text-orange-600">{res.total_weight} {res.weight_unit}</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">Valor do frete:</span>
                        <span className="font-semibold text-zinc-900">{res.currency} {res.sale_price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">Taxa de serviço:</span>
                        <span className="font-semibold text-zinc-900">{res.currency} {res.service_fee}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-orange-200">
                        <span className="text-lg font-bold text-zinc-900">TOTAL:</span>
                        <span className="text-2xl font-black text-orange-600">{res.currency} {res.total_cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-zinc-200/50">
          <div className="flex gap-2 mb-6 pb-4 border-b border-zinc-200 overflow-x-auto">
            <button className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
              Disponíveis
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">0</span>
            </button>
            <button className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              Enviados
              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">0</span>
            </button>
            <button className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              Todos
              <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-200 text-zinc-700">0</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Buscar Produto</label>
              <input type="text" placeholder="Nome ou código de barras" className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Status de Armazenamento</label>
              <select className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors">
                <option value="">Todos</option>
                <option value="expired">Vencidos</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/30 transition-colors">
                Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Produtos (Empty State) */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 overflow-hidden">
          <div className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
              
              <div className="flex justify-center mb-8">
                <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g className="animate-bounce-slow">
                    <rect x="50" y="80" width="100" height="80" rx="8" fill="#f3f4f6" stroke="#10b981" strokeWidth="3"></rect>
                    <rect x="50" y="80" width="100" height="25" rx="8" fill="#10b981" opacity="0.2"></rect>
                    <path d="M100 80 L100 160" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" opacity="0.5"></path>
                    <path d="M50 80 L30 60 L30 85 Z" fill="#d1d5db" stroke="#10b981" strokeWidth="2"></path>
                    <path d="M150 80 L170 60 L170 85 Z" fill="#d1d5db" stroke="#10b981" strokeWidth="2"></path>
                  </g>
                  <g className="animate-float">
                    <circle cx="40" cy="50" r="12" fill="#10b981" opacity="0.2"></circle>
                    <text x="40" y="56" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#10b981">?</text>
                  </g>
                  <g className="animate-float animation-delay-1000">
                    <circle cx="160" cy="45" r="10" fill="#14b8a6" opacity="0.2"></circle>
                    <text x="160" y="50" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#14b8a6">?</text>
                  </g>
                  <g className="animate-bounce-slow animation-delay-2000">
                    <path d="M100 30 L100 50 M95 35 L100 30 L105 35" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </g>
                </svg>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-zinc-900 mb-3">Sua dock está vazia</h3>
                <p className="text-zinc-600 text-lg">Aguarde o recebimento das suas encomendas. Elas aparecerão aqui assim que chegarem.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-2">Várias formas de compra</h4>
                  <p className="text-sm text-zinc-600">Endereço de dock, Grupos, Loja Online ou Compra Assistida</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-2">Recebemos</h4>
                  <p className="text-sm text-zinc-600">Recebemos e armazenamos seus produtos com segurança</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-2">Você Escolhe</h4>
                  <p className="text-sm text-zinc-600">Decida quando e quais produtos enviar</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl p-8 border border-zinc-200">
                <h4 className="text-lg font-bold text-zinc-900 mb-6 text-center">Como começar?</h4>
                <div className="relative">
                  <div className="hidden md:flex absolute top-8 left-0 right-0 justify-center items-center z-0">
                    <div className="flex-1 max-w-[200px] h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                    <div className="w-16"></div>
                    <div className="flex-1 max-w-[200px] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg mx-auto">1</div>
                      <h5 className="font-bold text-zinc-900 mb-2">Faça suas compras</h5>
                      <p className="text-sm text-zinc-600">Use o endereço de dock, grupos, loja ou compra assistida</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg mx-auto">2</div>
                      <h5 className="font-bold text-zinc-900 mb-2">Compre nas lojas</h5>
                      <p className="text-sm text-zinc-600">Faça suas compras online usando nosso endereço</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg mx-auto">3</div>
                      <h5 className="font-bold text-zinc-900 mb-2">Aguarde o recebimento</h5>
                      <p className="text-sm text-zinc-600">Notificaremos quando seus produtos chegarem</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
