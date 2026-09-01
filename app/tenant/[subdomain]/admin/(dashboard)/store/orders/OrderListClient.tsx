"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, ShoppingBag, Search, Settings, Archive, FileText
} from 'lucide-react';

export default function OrderListClient({ 
  tenantId, 
  subdomain, 
  initialOrders = [] 
}: { 
  tenantId: string, 
  subdomain: string, 
  initialOrders?: any[] 
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  
  // Fake state for "Exigir separação" preference
  const [requiresPicking, setRequiresPicking] = useState(false);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href={`/admin/dashboard`} className="text-zinc-500 hover:text-zinc-300 transition-colors">Loja Virtual</Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-100 font-medium">Pedidos</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
                <ShoppingBag className="w-6 h-6 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Pedidos da Loja</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Acompanhe e gerencie os pedidos da loja</p>
              </div>
            </div>
            
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-xl text-sm font-semibold shrink-0">
              <span className={`w-2 h-2 rounded-full ${pendingCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-zinc-500'}`}></span>
              {pendingCount} pendentes
            </span>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Settings Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="min-w-0">
            <p className="font-bold text-white text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-500" />
              Exigir separação antes de liberar na suíte
            </p>
            <p className="mt-1 text-xs text-zinc-400 max-w-3xl leading-relaxed">
              Com isto ligado, o produto comprado só aparece na suíte do cliente depois que o operador confirmar que o separou fisicamente. Desligado, ele entra na suíte assim que o pagamento é confirmado.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setRequiresPicking(!requiresPicking)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                requiresPicking 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20' 
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {requiresPicking ? 'Ligado' : 'Desligado'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <div className="flex-1 min-w-full sm:min-w-[200px] relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar pedido..." 
                className="w-full pl-10 pr-4 py-2.5 text-base border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" 
              />
            </div>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 text-base border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              <option value="">Status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <select 
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 text-base border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              <option value="">Pagamento</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
        </div>

        {/* Mobile: Order Cards */}
        <div className="lg:hidden space-y-3">
          {orders.length === 0 ? (
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
              <p className="text-zinc-500 font-medium">Nenhum pedido encontrado</p>
            </div>
          ) : (
            // Cards map would go here
            null
          )}
        </div>

        {/* Desktop: Orders Table */}
        <div className="hidden lg:block bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Ordem</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Cliente</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Itens</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Total</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Status</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Pagamento</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Data</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-zinc-500">
                      <ShoppingBag className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                      <p className="font-medium text-zinc-400">Nenhum pedido encontrado</p>
                    </td>
                  </tr>
                ) : (
                  // Rows map would go here
                  null
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
