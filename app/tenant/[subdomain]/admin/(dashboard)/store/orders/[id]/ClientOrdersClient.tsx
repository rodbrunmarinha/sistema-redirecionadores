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
  Eye,
  ToggleLeft,
  ToggleRight,
  Search
} from "lucide-react";

interface Order {
  id: string;
  number: string;
  date: string;
  time: string;
  items: number;
  total: number;
  status: string;
  payment: string;
}

interface ClientOrdersClientProps {
  client: {
    id: string;
    name: string;
    email: string;
    suite: string;
    initials: string;
    status: string;
    requiresPicking: boolean;
  };
  orders: Order[];
}

export default function ClientOrdersClient({ client, orders }: ClientOrdersClientProps) {
  const [requiresPicking, setRequiresPicking] = useState(client.requiresPicking);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'JPY',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Entregue</span>;
      case 'shipped':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Enviado</span>;
      case 'processing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Processando</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">Cancelado</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Pendente</span>;
    }
  };

  const getPaymentBadge = (payment: string) => {
    if (payment === 'paid') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pago</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Pendente</span>;
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
              Pedidos
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
              <Link href="/admin/store/orders" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-semibold rounded-xl transition shadow-sm active:scale-95 text-sm">
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
            <Link href={`/admin/boxes?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
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
            <Link href={`/admin/purchase-group-orders?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Users className="w-4 h-4 shrink-0" />
              <span>Pedidos em Grupo</span>
            </Link>
            <Link href={`/admin/clients/${client.id}/addresses`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Endereços</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">0</span>
            </Link>
            <Link href={`/admin/store/orders/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition shadow-sm bg-amber-500 text-zinc-950 shadow-amber-500/20">
              <Store className="w-4 h-4 shrink-0" />
              <span>Loja</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">

        {/* Action / Setting block */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="min-w-0">
            <p className="font-bold text-zinc-100 text-sm">Exigir separação antes de liberar na suíte</p>
            <p className="mt-1 text-xs text-zinc-400 max-w-3xl leading-relaxed">
              Com isto ligado, o produto comprado só aparece na suíte do cliente depois que o operador confirmar que o separou fisicamente. Desligado, ele entra na suíte assim que o pagamento é confirmado.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setRequiresPicking(!requiresPicking)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                requiresPicking 
                  ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600' 
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              {requiresPicking ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  Ligado
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  Desligado
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 shadow-sm">
          <form className="flex flex-col sm:flex-row sm:flex-wrap gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 min-w-full sm:min-w-[240px] relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-500" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar pedido..." 
                className="w-full pl-9 pr-12 py-2.5 text-sm bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              />
              <kbd className="absolute top-1/2 -translate-y-1/2 right-3 font-mono text-[10px] font-bold text-zinc-500 bg-zinc-800/50 border border-zinc-700 rounded px-1.5 py-0.5 pointer-events-none">
                /
              </kbd>
            </div>
            
            <select className="px-4 py-2.5 text-sm bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
              <option value="">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
            
            <select className="px-4 py-2.5 text-sm bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
              <option value="">Todo Pagamento</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
            </select>
            
            <button type="submit" className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold text-sm transition active:scale-95 shadow-sm">
              Filtrar
            </button>
          </form>
        </div>

        {/* Mobile: Order Cards */}
        <div className="lg:hidden space-y-4">
          {orders.map((order) => (
            <Link 
              key={order.id}
              href={`/admin/store/orders/detail/${order.id}`} // Assuming detail route format
              className="block bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors shadow-sm"
            >
              {/* Header: Order Number + Date */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm">{order.number}</h3>
                  <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{order.date} {order.time}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.payment)}
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
                <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-amber-500 text-xs font-bold shrink-0">
                  {client.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-zinc-200 text-xs truncate">{client.name}</p>
                  <p className="text-[11px] font-medium text-zinc-500 truncate">{client.email}</p>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Total</p>
                  <p className="font-bold text-white text-base">{formatCurrency(order.total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Itens</p>
                  <p className="font-bold text-white text-base">{order.items}</p>
                </div>
              </div>
            </Link>
          ))}
          {orders.length === 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-400 text-sm">Nenhum pedido encontrado.</p>
            </div>
          )}
        </div>

        {/* Desktop: Orders Table */}
        <div className="hidden lg:block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-950/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-left">Ordem</th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-left">Cliente</th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-center">Itens</th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-right">Total</th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-center">Status</th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-center">Pagamento</th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-left">Data</th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/store/orders/detail/${order.id}`} className="font-bold text-sm text-zinc-100 hover:text-amber-500 transition-colors">
                        {order.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-amber-500 text-xs font-bold">
                          {client.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-zinc-200">{client.name}</p>
                          <p className="text-xs font-medium text-zinc-500">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-zinc-300">{order.items}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="font-bold text-sm text-zinc-100">{formatCurrency(order.total)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getPaymentBadge(order.payment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-zinc-300">{order.date}</p>
                      <p className="text-xs font-medium text-zinc-500 mt-0.5">{order.time}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end">
                        <Link 
                          href={`/admin/store/orders/detail/${order.id}`} 
                          className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition" 
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-500 text-sm">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
