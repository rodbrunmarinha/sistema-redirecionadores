"use client";

import { useState } from "react";
import { Search, ChevronDown, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShipmentsClient({ initialShipments, availableProductsCount }: { initialShipments: any[], availableProductsCount: number }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes sway {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        .animate-float-fast {
            animation: float 2s ease-in-out infinite;
        }
        .animate-sway {
            animation: sway 3s ease-in-out infinite;
        }
      `}} />

      <div className="space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
                <span className="text-3xl">📦</span>
                Meus Envios
              </h1>
              <p className="text-zinc-600 mt-1">
                Acompanhe seus envios e rastreie seus pacotes
              </p>
            </div>
            
            {initialShipments.length > 0 && availableProductsCount > 0 && (
               <Link href="/app/shipments/create">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition shadow-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Criar Novo Envio
                  </button>
               </Link>
            )}
          </div>
        </div>

        {/* Filtros */}
        {initialShipments.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-zinc-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              
              {/* Busca */}
              <div className="flex-1 min-w-0 w-full">
                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase tracking-wide">
                  Filtros
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-zinc-400" />
                  </div>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por número, rastreio ou destinatário…" 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="w-full sm:w-64">
                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase tracking-wide">
                  Status
                </label>
                <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full py-2.5 pl-4 pr-10 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors appearance-none"
                  >
                    <option value="">Todos os status</option>
                    <option value="awaiting_box_assembly">Aguardando Montagem da Caixa</option>
                    <option value="pending_payment">Aguardando Pagamento</option>
                    <option value="awaiting_payment_confirmation">Aguardando Confirmação</option>
                    <option value="paid">Pago</option>
                    <option value="processing">Processando</option>
                    <option value="forwarded_to_carrier">Encaminhado para Transportadora</option>
                    <option value="collected">Coletado</option>
                    <option value="shipped">Enviado</option>
                    <option value="in_transit">Em Trânsito</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="refunded">Reembolsado</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listagem ou Estado Vazio */}
        {initialShipments.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <p className="text-zinc-500">A lista de envios será implementada aqui.</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 p-12 text-center overflow-hidden relative">
              
            {/* Decoração de fundo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            {/* Ilustração Animada */}
            <div className="relative z-10 mb-8">
              <div className="inline-block relative">
                {/* Círculo de fundo com pulso */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse opacity-50"></div>
                
                {/* Container da ilustração */}
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  {/* Caixa vazia (animação de balanço) */}
                  <div className={`relative ${availableProductsCount === 0 ? 'animate-sway' : 'animate-float-fast'}`}>
                    <svg className={`w-20 h-20 ${availableProductsCount > 0 ? 'text-blue-500' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    
                    {/* Ícone de interrogação flutuante APENAS se não houver produtos */}
                    {availableProductsCount === 0 && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-float-fast">
                        ?
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              {availableProductsCount > 0 ? (
                <>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 flex items-center justify-center gap-2">
                    Você possui produtos para enviar!
                  </h3>
                  <p className="text-zinc-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Você tem <strong className="text-blue-600">{availableProductsCount}</strong> produtos na seu dock que já podem ser despachados para o seu endereço.
                  </p>
                  <Link href="/app/shipments/create">
                    <button className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 mx-auto">
                      <Plus className="w-5 h-5" />
                      Criar Novo Envio
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 flex items-center justify-center gap-2">
                    <span>📭</span> Nenhum envio encontrado
                  </h3>
                  
                  <p className="text-zinc-600 mb-6 max-w-md mx-auto leading-relaxed">
                    Você ainda não criou nenhum envio. Aguarde o recebimento dos seus produtos no dock para solicitar um envio para sua casa.
                  </p>

                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-50 text-zinc-500 rounded-2xl font-semibold border-2 border-dashed border-zinc-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Nenhum envio disponível</span>
                  </div>
                </>
              )}
              
              {/* Passos para começar */}
              <div className="mt-12 max-w-2xl mx-auto">
                <h4 className="text-lg font-bold text-zinc-800 mb-8">Como funciona?</h4>
                <div className="relative">
                  {/* Linhas conectoras de fundo */}
                  <div className="hidden md:flex absolute top-8 left-0 right-0 justify-center items-center z-0">
                    <div className="flex-1 max-w-[200px] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="w-16"></div>
                    <div className="flex-1 max-w-[200px] h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500"></div>
                  </div>
                  
                  {/* Grid de passos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-500/30">
                        1
                      </div>
                      <h5 className="font-bold text-zinc-900 mb-2">Compre Online</h5>
                      <p className="text-sm text-zinc-600 text-center">Faça suas compras nas lojas favoritas</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-purple-500/30">
                        2
                      </div>
                      <h5 className="font-bold text-zinc-900 mb-2">Recebemos</h5>
                      <p className="text-sm text-zinc-600 text-center">Recebemos e armazenamos seus produtos</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-emerald-500/30">
                        3
                      </div>
                      <h5 className="font-bold text-zinc-900 mb-2">Você Envia</h5>
                      <p className="text-sm text-zinc-600 text-center">Crie seu envio quando quiser</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </>
  );
}
