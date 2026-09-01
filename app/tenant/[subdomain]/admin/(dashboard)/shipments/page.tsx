"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PackageCheck, 
  KanbanSquare, 
  Download, 
  Clock, 
  Box, 
  CheckCircle2, 
  Settings, 
  Truck, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  ChevronDown,
  PackageX
} from "lucide-react";

export default function ShipmentsPage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Gerenciar Envios</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <PackageCheck className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Gerenciar Envios</h1>
                <p className="text-orange-100 text-sm mt-0.5">Acompanhe e gerencie todos os envios dos clientes</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/shipments/kanban" 
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition text-sm shadow-sm active:scale-95"
              >
                <KanbanSquare className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Visualização</span> Kanban
              </Link>
              <Link 
                href="/admin/shipments/export" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm"
              >
                <Download className="w-4 h-4 shrink-0" />
                Exportar
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        
        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          
          <Link href="/admin/shipments?group=pending" className="relative group rounded-2xl bg-zinc-900 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg border-zinc-800 hover:border-yellow-500/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-yellow-500/10">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-2xl font-extrabold text-white">0</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Pagamento Pendente</p>
            </div>
          </Link>

          <Link href="/admin/shipments?group=awaiting" className="relative group rounded-2xl bg-zinc-900 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg border-zinc-800 hover:border-amber-500/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-amber-500/10">
                  <Box className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-2xl font-extrabold text-white">0</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Em Preparação</p>
            </div>
          </Link>

          <Link href="/admin/shipments?group=paid" className="relative group rounded-2xl bg-zinc-900 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg border-zinc-800 hover:border-emerald-500/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-emerald-500/10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-2xl font-extrabold text-white">0</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Pago</p>
            </div>
          </Link>

          <Link href="/admin/shipments?group=processing" className="relative group rounded-2xl bg-zinc-900 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg border-zinc-800 hover:border-blue-500/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-blue-500/10">
                  <Settings className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-2xl font-extrabold text-white">0</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Processando</p>
            </div>
          </Link>

          <Link href="/admin/shipments?group=shipped" className="relative group rounded-2xl bg-zinc-900 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg border-zinc-800 hover:border-indigo-500/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-indigo-500/10">
                  <Truck className="w-5 h-5 text-indigo-500" />
                </div>
                <span className="text-2xl font-extrabold text-white">0</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Enviados</p>
            </div>
          </Link>

          <Link href="/admin/shipments?group=completed" className="relative group rounded-2xl bg-zinc-900 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg border-zinc-800 hover:border-green-500/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-green-500/10">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-2xl font-extrabold text-white">0</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Concluídos</p>
            </div>
          </Link>

          <Link href="/admin/shipments?group=cancelled" className="relative group rounded-2xl bg-zinc-900 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg border-zinc-800 hover:border-red-500/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-red-500/10">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-2xl font-extrabold text-white">0</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Cancelados</p>
            </div>
          </Link>
          
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800">
          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)} 
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Filter className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <span className="text-sm font-semibold text-white">Buscar</span>
            </div>
            <div className="flex items-center gap-3">
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {showFilters && (
            <form method="GET" action="/admin/shipments" className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Buscar</label>
                  <input type="text" name="search" placeholder="ID, tracking, nome..." className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Cliente</label>
                  <input type="text" name="client" placeholder="Todos" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Dock</label>
                  <input type="text" name="dock" placeholder="Nº do dock" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Status</label>
                  <select name="status" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <option value="">Todos</option>
                    <option value="awaiting_box_assembly">Aguardando Montagem</option>
                    <option value="awaiting_quote">Aguardando Orçamento</option>
                    <option value="pending_payment">Pagamento Pendente</option>
                    <option value="paid">Pago</option>
                    <option value="processing">Processando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Período</label>
                  <select name="period" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <option value="">Todo período</option>
                    <option value="7">Últimos 7 dias</option>
                    <option value="30">Últimos 30 dias</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-sm shadow-sm transition active:scale-[0.98]">
                    <Search className="w-4 h-4" />
                    Filtrar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-zinc-800">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Método de Frete</label>
                  <select name="shipping_method" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <option value="">Todos</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Método de Pagamento</label>
                  <select name="payment_method" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                    <option value="">Todos</option>
                    <option value="wallet">Créditos</option>
                    <option value="pix">PIX</option>
                    <option value="credit_card">Cartão</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Alterado de</label>
                  <input type="date" name="updated_from" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Alterado até</label>
                  <input type="date" name="updated_to" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Empty State */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800 overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center px-6 py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-800 border border-zinc-700 mb-6 shadow-sm">
              <PackageX className="h-10 w-10 text-zinc-500" />
            </div>

            <h3 className="text-lg font-bold text-white">Nenhum envio encontrado</h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-sm">Os envios dos clientes aparecerão aqui assim que forem criados.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
