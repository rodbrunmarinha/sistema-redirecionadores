"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, ShoppingBag, ChevronDown, Package, Plus, ClipboardList } from "lucide-react";

export default function PurchaseGroupOrdersPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "Todos" },
    { id: "pending", label: "Aguardando Pagamento" },
    { id: "paid", label: "Pago" },
    { id: "purchasing", label: "Em Compra" },
    { id: "purchased", label: "Comprado" },
    { id: "completed", label: "Concluído" },
    { id: "partially_refunded", label: "Reembolso Parcial" },
    { id: "fully_refunded", label: "Reembolsado" },
    { id: "cancelled", label: "Cancelado" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <span className="text-3xl">🛍️</span>
            Minhas Compras
          </h1>
          <p className="text-zinc-600 mt-1">Acompanhe seus pedidos dos grupos de compras</p>
        </div>
        <Link 
          href="/app/purchase-groups" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/20 w-fit"
        >
          <Plus className="w-5 h-5" />
          Nova Compra
        </Link>
      </div>

      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-zinc-500 font-medium">
              0 pedidos encontrados
            </p>
          </div>
          
          {/* Filtros expandíveis */}
          <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <div className="border-t border-zinc-100 p-4">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">Filtrar por status</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      activeFilter === filter.id
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="text-center py-16 px-6">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-16 h-16 text-violet-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Nenhum pedido ainda</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-10">
              Você ainda não fez nenhum pedido nos grupos de compras. Explore os grupos ativos e aproveite as promoções exclusivas!
            </p>
            
            {/* Como Funciona */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-100 text-left shadow-sm">
                <h4 className="font-bold text-zinc-900 mb-5 flex items-center gap-2">
                  <Package className="w-5 h-5 text-violet-600" />
                  Como fazer seu primeiro pedido:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-violet-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">1</div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Escolha um grupo</p>
                      <p className="text-xs text-zinc-500 mt-1">Navegue pelos grupos ativos</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">2</div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Adicione ao carrinho</p>
                      <p className="text-xs text-zinc-500 mt-1">Selecione produtos e quantidades</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">3</div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Finalize o pedido</p>
                      <p className="text-xs text-zinc-500 mt-1">Pague e acompanhe aqui</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link 
              href="/app/purchase-groups" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/20"
            >
              <ShoppingBag className="w-5 h-5" />
              Explorar Grupos de Compras
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
