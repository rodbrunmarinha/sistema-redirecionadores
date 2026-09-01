"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ArrowLeft, 
  LayoutDashboard, 
  Box, 
  ShoppingBag, 
  Truck, 
  Wrench, 
  ShoppingCart, 
  Users, 
  MapPin, 
  Store,
  List,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PlayCircle,
  CheckSquare,
  AlertCircle,
  AlertTriangle,
  Download,
  X,
  CreditCard,
  Ban
} from "lucide-react";

interface PGOrder {
  id: string;
  // Define structure when list is not empty
}

interface ClientPurchaseGroupOrdersClientProps {
  client: {
    id: string;
    name: string;
    email: string;
    suite: string;
    initials: string;
    status: string;
  };
  orders: PGOrder[];
}

export default function ClientPurchaseGroupOrdersClient({ client, orders }: ClientPurchaseGroupOrdersClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatusAction, setBulkStatusAction] = useState<'start_purchasing' | 'mark_purchased' | null>(null);
  
  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelOrderNumber, setCancelOrderNumber] = useState('');
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelOrderIsPaid, setCancelOrderIsPaid] = useState(false);

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      
      {/* Header Profile Section */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm mb-6 text-zinc-400" aria-label="Breadcrumb">
            <Link href="/admin/dashboard" className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href="/admin/clients" className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Clientes
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/admin/clients/${client.id}`} className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              {client.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-100 font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Pedidos de Grupos
            </span>
          </nav>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link href={`/admin/clients/${client.id}`} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition shrink-0 border border-zinc-700" title="Voltar ao cliente">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-amber-500 shrink-0 shadow-lg">
                {client.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 truncate">{client.name}</h1>
                  {client.status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Ativo</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mt-0.5">
                  {client.email} <span className="mx-1 opacity-60">·</span> {client.suite}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href="/admin/purchase-group-orders" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-semibold rounded-xl transition shadow-sm active:scale-95 text-sm">
                <List className="w-4 h-4 shrink-0" />
                Ver lista completa
              </Link>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link href={`/admin/clients/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Visão Geral</span>
            </Link>
            <Link href={`/admin/boxes/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Box className="w-4 h-4 shrink-0" />
              <span>Caixas</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">2</span>
            </Link>
            <Link href={`/admin/products?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Produtos</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">3</span>
            </Link>
            <Link href={`/admin/shipments/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Truck className="w-4 h-4 shrink-0" />
              <span>Envios</span>
            </Link>
            <Link href={`/admin/service-orders?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Serviços</span>
            </Link>
            <Link href={`/admin/online-purchases?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Compra Assistida</span>
            </Link>
            <Link href={`/admin/purchase-group-orders/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition shadow-sm bg-amber-500 text-zinc-950 shadow-amber-500/20">
              <Users className="w-4 h-4 shrink-0" />
              <span>Pedidos em Grupo</span>
            </Link>
            <Link href={`/admin/clients/${client.id}/addresses`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Endereços</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">0</span>
            </Link>
            <Link href={`/admin/store/orders/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Store className="w-4 h-4 shrink-0" />
              <span>Loja</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4 mb-6">
          <Link href="/admin/purchase-group-orders?status=pending" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Pendentes</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
          </Link>
          <Link href="/admin/purchase-group-orders?status=paid" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Pagos</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
          </Link>
          <Link href="/admin/purchase-group-orders?status=purchasing" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-purple-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Em Compra</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-4 h-4 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
          </Link>
          <Link href="/admin/purchase-group-orders?status=purchased" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Comprados</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
          </Link>
          <Link href="/admin/purchase-group-orders?status=completed" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-pink-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Concluídos</span>
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4 text-pink-500" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
          </Link>
          <Link href="/admin/purchase-group-orders?acao=1" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-indigo-500/50 transition-colors col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Precisa ação</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
          </Link>
          <Link href="/admin/purchase-group-orders?attention=1" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-red-500/50 transition-colors col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Atenção</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-500" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar por cliente, email ou número do pedido..." 
                className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              />
              <kbd className="absolute top-1/2 -translate-y-1/2 right-4 font-mono text-xs font-bold text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 pointer-events-none">
                /
              </kbd>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-400">Status</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                  <option value="">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="purchasing">Em Compra</option>
                  <option value="purchased">Comprado</option>
                  <option value="completed">Concluído</option>
                  <option value="partially_refunded">Reemb. Parcial</option>
                  <option value="fully_refunded">Reembolsado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-400">Ordenar por</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                  <option value="">Mais recentes</option>
                  <option value="acao">Ação primeiro (mais parados no topo)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-400">Grupo</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                  <option value="">Todos os Grupos</option>
                </select>
              </div>

              <div className="flex items-end lg:col-start-4">
                <button type="submit" className="w-full px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 active:scale-95">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Users className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-zinc-400 text-sm">
                Os pedidos dos grupos de compras aparecerão aqui assim que os clientes começarem a fazer pedidos.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-8">
          <div className="bg-zinc-800 border border-zinc-700 shadow-2xl rounded-2xl py-3 px-5 flex items-center gap-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs">
                {selectedIds.size}
              </span>
              <span className="font-bold text-zinc-100">Selecionadas</span>
            </div>
            
            <div className="w-px h-6 bg-zinc-700"></div>

            <div className="flex items-center gap-2">
              <button onClick={() => setBulkStatusAction('start_purchasing')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-950 bg-amber-500 hover:bg-amber-600 transition">
                <PlayCircle className="w-4 h-4" />
                Iniciar compra
              </button>
              <button onClick={() => setBulkStatusAction('mark_purchased')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition">
                <CheckSquare className="w-4 h-4" />
                Marcar comprado
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition">
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>

            <button onClick={clearSelection} className="ml-2 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition" title="Limpar seleção">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Status Action Modal */}
      {bulkStatusAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setBulkStatusAction(null)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-800 animate-in zoom-in-95">
            <div className="p-6">
              <h3 className="text-lg font-bold text-zinc-100 mb-2">
                {bulkStatusAction === 'start_purchasing' ? 'Iniciar compra' : 'Marcar como comprado'}
              </h3>
              <p className="text-sm text-zinc-400">
                Aplicar esta ação a {selectedIds.size} pedido(s) selecionado(s)?
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                Pedidos que não estão no status necessário serão ignorados e informados no resultado.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-6 py-4 bg-zinc-950/50 rounded-b-2xl">
              <button onClick={() => setBulkStatusAction(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 transition">
                Cancelar
              </button>
              <button className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 text-sm font-bold hover:bg-amber-600 transition">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setCancelModalOpen(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-zinc-100 text-center mb-2">
              Cancelar pedido?
            </h3>
            <p className="text-sm text-zinc-400 text-center mb-1">
              Esta ação não pode ser desfeita. Confirmar cancelamento do pedido
            </p>
            <p className="text-base font-bold text-zinc-100 text-center mb-5">
              {cancelOrderNumber}
            </p>

            {cancelOrderIsPaid && (
              <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-500 text-center">
                Este pedido foi pago. Escolha se deseja devolver o valor à carteira do cliente.
              </div>
            )}

            <div className="space-y-3">
              {cancelOrderIsPaid ? (
                <>
                  <button className="w-full px-4 py-3 bg-red-500 text-zinc-950 font-bold rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2">
                    <Ban className="w-4 h-4" />
                    Cancelar e reembolsar carteira
                  </button>
                  <button className="w-full px-4 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition border border-zinc-700 hover:border-zinc-600">
                    Cancelar sem reembolso
                  </button>
                </>
              ) : (
                <button className="w-full px-4 py-3 bg-red-500 text-zinc-950 font-bold rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2">
                  <Ban className="w-4 h-4" />
                  Sim, cancelar
                </button>
              )}
              
              <button onClick={() => setCancelModalOpen(false)} className="w-full px-4 py-3 bg-transparent text-zinc-400 font-bold rounded-xl hover:text-zinc-200 transition">
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
