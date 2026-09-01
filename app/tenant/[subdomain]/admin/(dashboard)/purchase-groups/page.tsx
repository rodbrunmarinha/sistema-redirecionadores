"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Settings, 
  ShoppingCart, 
  DollarSign, 
  Plus, 
  Search,
  CheckCircle,
  Package,
  AlertTriangle,
  X
} from "lucide-react";

export default function PurchaseGroupsPage() {
  // Filters State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Deactivate Modal State
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivateAction, setDeactivateAction] = useState("pause"); // "pause" or "close"
  const [orderGenerationMode, setOrderGenerationMode] = useState("all"); // "all" or "confirmed_only"
  
  // Mock group for modal
  const [modalGroupData, setModalGroupData] = useState({ id: 0, name: "", cartsCount: 0 });

  // Exemplo de como abrir o modal: 
  // const handleOpenDeactivateModal = (group: any) => {
  //   setModalGroupData(group);
  //   setDeactivateAction("pause");
  //   setIsDeactivateModalOpen(true);
  // }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 flex flex-col relative overflow-x-hidden">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-orange-200 text-xs font-semibold uppercase tracking-widest">Grupos de Compras</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Grupos de Compras</h1>
                <p className="text-orange-100 text-sm mt-0.5">Crie seu primeiro grupo de compras para começar a vender.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Link 
                href="/admin/purchase-groups-automation" 
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-sm font-semibold text-white transition"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Automação</span>
              </Link>
              
              <Link 
                href="/admin/purchase-group-carts" 
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-sm font-semibold text-white transition"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Carrinhos em Aberto dos Clientes</span>
              </Link>
              
              <Link 
                href="/admin/purchase-groups-commissions" 
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-sm font-semibold text-white transition"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Comissões</span>
              </Link>
              
              <Link 
                href="/admin/purchase-groups/create" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Novo Grupo</span>
                <span className="sm:hidden">Novo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full pb-12">
        
        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg shadow-zinc-900/25 border border-zinc-700">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-300 truncate">Grupos</span>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white truncate">0</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-500/25">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-100 truncate">Ativos</span>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white truncate">0</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 sm:p-5 shadow-lg shadow-blue-500/25">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-blue-100 truncate">Total de Pedidos</span>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white truncate">0</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-500/25">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-amber-100 truncate">Vendas</span>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white truncate">$0</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-5 sm:mb-6 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4">
          <form className="flex flex-col sm:flex-row flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar grupos..." 
                className="w-full pl-10 rounded-xl text-sm border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-2.5 transition"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-semibold text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5">
                /
              </kbd>
            </div>
            <div className="w-full sm:w-48">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl text-sm border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-2.5 px-3 appearance-none transition"
              >
                <option value="">Todos</option>
                <option value="open">✅ Aberto</option>
                <option value="closed">🔒 Fechado</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="ended">Encerrados</option>
              </select>
            </div>
            <button 
              type="button" 
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-md shadow-orange-500/20"
            >
              Filtrar
            </button>
          </form>
        </div>

        {/* Empty State */}
        <div className="text-center py-16 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 shadow-sm">
            <Users className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Nenhum grupo de compras</h3>
          <p className="text-zinc-400 mb-6 max-w-sm mx-auto">Crie seu primeiro grupo de compras para começar a vender.</p>
          <Link 
            href="/admin/purchase-groups/create" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Criar Primeiro Grupo
          </Link>
        </div>

      </div>

      {/* Modal Desativar Grupo */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full border border-zinc-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white">Desativar grupo</h3>
              <p className="text-sm text-zinc-400 mt-1">{modalGroupData.name}</p>

              <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200/80">
                  Este grupo tem {modalGroupData.cartsCount} carrinho(s) montado(s) por clientes.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {/* Opção: Pausar */}
                <label className="block cursor-pointer">
                  <input 
                    type="radio" 
                    name="acao-desativar" 
                    value="pause" 
                    checked={deactivateAction === "pause"}
                    onChange={() => setDeactivateAction("pause")}
                    className="sr-only peer" 
                  />
                  <div className={`rounded-xl border p-4 transition ${deactivateAction === "pause" ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600 bg-zinc-950'}`}>
                    <p className={`font-semibold ${deactivateAction === "pause" ? 'text-white' : 'text-zinc-300'}`}>Pausar (temporário)</p>
                    <p className={`text-xs mt-1 ${deactivateAction === "pause" ? 'text-amber-200/70' : 'text-zinc-500'}`}>O grupo some para os clientes e os carrinhos ficam guardados como estão. Ao reativar, tudo volta.</p>
                  </div>
                </label>

                {/* Opção: Encerrar */}
                <label className="block cursor-pointer">
                  <input 
                    type="radio" 
                    name="acao-desativar" 
                    value="close" 
                    checked={deactivateAction === "close"}
                    onChange={() => setDeactivateAction("close")}
                    className="sr-only peer" 
                  />
                  <div className={`rounded-xl border p-4 transition ${deactivateAction === "close" ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600 bg-zinc-950'}`}>
                    <p className={`font-semibold ${deactivateAction === "close" ? 'text-white' : 'text-zinc-300'}`}>Encerrar e gerar os pedidos</p>
                    <p className={`text-xs mt-1 ${deactivateAction === "close" ? 'text-amber-200/70' : 'text-zinc-500'}`}>Transforma os carrinhos em pedidos, avisa os clientes e encerra o grupo. Não tem volta.</p>

                    {deactivateAction === "close" && (
                      <div className="mt-4 space-y-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                        <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer hover:text-white transition">
                          <input 
                            type="radio" 
                            name="modo-pedidos" 
                            value="all" 
                            checked={orderGenerationMode === "all"}
                            onChange={() => setOrderGenerationMode("all")}
                            className="text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700" 
                          />
                          Todos os carrinhos
                        </label>
                        <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer hover:text-white transition">
                          <input 
                            type="radio" 
                            name="modo-pedidos" 
                            value="confirmed_only" 
                            checked={orderGenerationMode === "confirmed_only"}
                            onChange={() => setOrderGenerationMode("confirmed_only")}
                            className="text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700" 
                          />
                          Somente itens confirmados pelo cliente
                        </label>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsDeactivateModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="flex-1 px-4 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition font-bold shadow-lg shadow-amber-500/20"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
