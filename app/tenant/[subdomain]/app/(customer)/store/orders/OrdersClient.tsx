"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Home, ShoppingBag, ArrowRight
} from 'lucide-react';

export default function OrdersClient({ 
  tenant, 
  subdomain,
  orders,
  currency = 'USD',
  error = null
}: { 
  tenant: any, 
  subdomain: string,
  orders: any[],
  currency?: string,
  error?: string | null
}) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative min-h-[80vh] flex flex-col">
      
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
            <Link href={`/app/store`} className="hover:text-amber-500 transition flex items-center gap-1">
              <Home className="w-4 h-4" />
              Loja
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
            <span className="text-zinc-900 dark:text-white">Meus Pedidos</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 tracking-tight">Meus Pedidos</h1>
              <p className="text-zinc-500 dark:text-zinc-400">Acompanhe todas as suas compras na loja em um só lugar</p>
            </div>
            
            {/* Order Count Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 w-fit">
              <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-500">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
        
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Erro do banco de dados: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {orders.length === 0 && !error ? (
          /* Modern Empty State */
          <div className="relative overflow-hidden w-full max-w-3xl mx-auto mt-10">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-zinc-100/50 to-amber-100/30 dark:from-amber-900/10 dark:via-zinc-900/50 dark:to-amber-800/10 rounded-3xl"></div>
            
            <div className="relative text-center py-24 px-6 sm:px-12 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              
              {/* Animated Icon Container */}
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-zinc-100 via-white to-amber-50 dark:from-zinc-800 dark:via-zinc-900 dark:to-amber-900/20 rounded-3xl mb-8 shadow-xl border border-white/50 dark:border-zinc-700/50 relative group">
                <ShoppingBag className="w-16 h-16 text-zinc-400 dark:text-zinc-500 group-hover:text-amber-500 transition-colors duration-500" strokeWidth={1.5} />
                
                {/* Ping dot */}
                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 shadow-sm border-2 border-white dark:border-zinc-900"></span>
                </div>
              </div>
              
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">Nenhum pedido encontrado</h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-md mx-auto font-medium">
                Você ainda não realizou nenhuma compra. Explore nossa loja e encontre produtos incríveis!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/app/store`} className="group inline-flex w-full sm:w-auto justify-center items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-1">
                  <ShoppingBag className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-300" />
                  <span>Explorar Loja</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link href={`/app/dashboard`} className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold transition-all duration-300 hover:border-amber-500 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-500 hover:shadow-md">
                  <Home className="w-5 h-5" />
                  Voltar ao Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Link 
                key={order.id} 
                href={`/app/store/orders/${order.id}`}
                className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 relative"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  {order.status === 'delivered' ? (
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                      Entregue
                    </span>
                  ) : order.status === 'processing' ? (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
                      Em Processamento
                    </span>
                  ) : order.status === 'cancelled' ? (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                      Cancelado
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 text-xs font-bold rounded-full uppercase">
                      {order.status}
                    </span>
                  )}
                </div>

                {/* Order Date & ID */}
                <div className="mb-6">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">
                    {formatDate(order.created_at)}
                  </p>
                  <p className="text-zinc-900 dark:text-white font-mono text-xs font-bold opacity-50">
                    {order.reference}
                  </p>
                </div>

                {/* Main Item */}
                <div className="flex items-center gap-4 mb-6 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-2 leading-tight group-hover:text-amber-500 transition-colors">
                      {order.mainItemName}
                    </h3>
                  </div>
                </div>

                {/* Footer with Price */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">Total do Pedido</p>
                    <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-amber-500 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );

}
