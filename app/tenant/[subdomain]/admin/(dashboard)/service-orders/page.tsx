"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ClipboardList, Filter, Plus, Search, GitMerge, Inbox } from "lucide-react";

export default function ServiceOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [serviceId, setServiceId] = useState("");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 pb-8 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Ordens de Serviço
            </span>
          </nav>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Ordens de Serviço</h1>
                <p className="text-orange-100 text-sm mt-0.5">Gerencie solicitações de serviços dos clientes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Link 
                href="/admin/service-orders/internal-statuses" 
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-xl transition text-sm backdrop-blur-sm"
                title="Status internos"
              >
                <GitMerge className="w-4 h-4" />
                <span className="hidden sm:inline">Status internos</span>
              </Link>
              <Link 
                href="/admin/service-orders/create" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4" />
                Nova Ordem
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="rounded-2xl p-4 sm:p-5 text-white bg-zinc-900 border border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-400">Total</p>
                <span className="text-lg leading-none">📋</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate">0</p>
            </div>

            <div className="rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-amber-400">Pendentes</p>
                <span className="text-lg leading-none">⏳</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate text-amber-500">0</p>
            </div>

            <div className="rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-orange-400">Em Andamento</p>
                <span className="text-lg leading-none">🔧</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate text-orange-500">0</p>
            </div>

            <div className="rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-blue-400">Aguardando Pgto</p>
                <span className="text-lg leading-none">💳</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate text-blue-500">0</p>
            </div>

            <div className="rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-emerald-400">Pagas/Concluídas</p>
                <span className="text-lg leading-none">✅</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate text-emerald-500">0</p>
            </div>

            <div className="rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-red-400">Canceladas</p>
                <span className="text-lg leading-none">❌</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate text-red-500">0</p>
            </div>

            <div className="col-span-2 rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-400">Receita Total</p>
                <span className="text-lg leading-none">💰</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate">$0.00</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <form className="flex-1 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    name="search" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por número, cliente, dock..." 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-md pointer-events-none">
                    /
                  </kbd>
                </div>

                <select 
                  name="status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium outline-none appearance-none"
                >
                  <option value="">📋 Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovada</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="awaiting_payment">Aguardando pagamento</option>
                  <option value="paid">Paga</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>

                <select 
                  name="service_id" 
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium outline-none appearance-none"
                >
                  <option value="">✨ Todos os serviços</option>
                </select>

                <button 
                  type="button" 
                  className="px-5 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 border border-zinc-700 font-medium transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Filter className="w-5 h-5" />
                  Filtrar
                </button>
              </form>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex flex-col items-center justify-center text-center px-6 py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-800/50 border border-zinc-700 mb-6 shadow-sm">
                <Inbox className="h-10 w-10 text-zinc-500" />
              </div>

              <h3 className="text-lg font-bold text-white">Nenhuma ordem de serviço</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-sm">
                Crie a primeira ordem de serviço para começar.
              </p>
              
              <Link 
                href="/admin/service-orders/create" 
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Criar Primeira Ordem
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
