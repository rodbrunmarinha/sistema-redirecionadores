"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Home, ShoppingBag, Package, Check, CreditCard, Clock, MapPin, Inbox, Box
} from 'lucide-react';

export default function OrderDetailClient({ 
  tenant, 
  subdomain,
  order,
  currency = 'JPY'
}: { 
  tenant: any, 
  subdomain: string,
  order: any,
  currency?: string
}) {

  // Format currency dynamically
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  // For presentation, let's map the statuses
  const steps = [
    { key: 'received', title: 'Pedido Recebido', description: 'Pagamento confirmado', icon: <ShoppingBag className="w-8 h-8" />, completed: true },
    { key: 'processing', title: 'Processando', description: 'Separando produtos', icon: <Box className="w-8 h-8" />, completed: true },
    { key: 'shipped_to_suite', title: 'Enviado para Suíte', description: 'Produtos em sua suíte', icon: <Inbox className="w-8 h-8" />, completed: true },
    { key: 'delivered', title: 'Concluído', description: 'Disponível na sua suíte', icon: <Check className="w-8 h-8" />, completed: true },
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
            <Link href={`/app/store`} className="hover:text-amber-500 transition flex items-center gap-1">
              <Home className="w-4 h-4" />
              Loja
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
            <Link href={`/app/store/orders`} className="hover:text-amber-500 transition">
              Meus Pedidos
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
            <span className="text-zinc-900 dark:text-white">#{order.reference}</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Pedido #{order.reference}</h1>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 shadow-sm">
                  <Check className="w-4 h-4" />
                  Entregue
                </span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Realizado em {new Date(order.created_at).toLocaleString('pt-BR')}</p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 w-fit">
              <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-500">¥{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Progress Timeline */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 mb-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 to-amber-500"></div>
          
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-10">Rastreamento do Pedido</h2>
          
          <div className="relative">
            <div className="flex items-start justify-between">
              {steps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                  
                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-1/2 w-full h-1 -z-10 ml-8">
                      <div className={`h-full rounded-full transition-all duration-1000 ${step.completed ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>
                    </div>
                  )}
                  
                  {/* Step Circle */}
                  <div className="relative z-10 mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${step.completed ? 'text-zinc-950 bg-gradient-to-br from-amber-400 to-amber-500 scale-110' : 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'}`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Step Text */}
                  <div className="text-center max-w-[120px]">
                    <p className={`text-sm font-bold mb-1 ${step.completed ? 'text-amber-600 dark:text-amber-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Products List */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-500"></div>
              
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Produtos do Pedido</h2>
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500">
                    {order.items.length} itens
                  </span>
                </div>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {order.items.map((item: any) => (
                  <div key={item.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                          {typeof item.image_url === 'string' && item.image_url.trim().length > 0 ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <Package className="w-10 h-10 opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Link href={`/app/store/product/${item.id}`} className="text-lg font-bold text-zinc-900 dark:text-white hover:text-amber-500 transition-colors block mb-2">
                          {item.name}
                        </Link>
                        
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-extrabold text-amber-500">
                            ¥{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-sm font-medium text-zinc-500">
                            ¥{item.price.toFixed(2)} cada
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suite Delivery Info */}
            <div className="rounded-3xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">Entrega na Suíte</h3>
                  
                  {order.box ? (
                    <div className="mb-4 bg-white/80 dark:bg-zinc-900/80 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-800/80 dark:text-blue-400/80 font-bold mb-1">Caixa (Dock):</p>
                      <p className="font-mono font-bold text-lg text-blue-900 dark:text-blue-300">{order.box.tracking_number}</p>
                    </div>
                  ) : (
                    <p className="text-blue-800/80 dark:text-blue-400/80 font-medium mb-3">
                      Os produtos deste pedido serão enviados diretamente para sua suíte após a confirmação do pagamento.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur rounded-lg text-sm font-bold text-blue-800 dark:text-blue-300 shadow-sm">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Sem custo de envio local
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur rounded-lg text-sm font-bold text-blue-800 dark:text-blue-300 shadow-sm">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Consolidação disponível
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-4">
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 to-amber-500"></div>
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Resumo do Pedido</h2>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-2">
                    Subtotal
                  </span>
                  <span className="text-zinc-900 dark:text-white font-bold">¥{order.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-2">
                    Frete para Suíte
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-500">Grátis</span>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">Total</span>
                    <span className="text-3xl font-extrabold text-amber-500">
                      ¥{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="px-6 pb-6 space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                      <ShoppingBag className="w-4 h-4 text-zinc-400" />
                      Pedido
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{order.reference}</span>
                  </div>
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      Data
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{new Date(order.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                      <CreditCard className="w-4 h-4 text-zinc-400" />
                      Pagamento
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {order.payment_method === 'wallet' ? 'Saldo da Carteira' : order.payment_method}
                    </span>
                  </div>
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                      <Check className="w-4 h-4 text-zinc-400" />
                      Status
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Pago
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 pt-2">
                <Link href={`/app/store/orders`} className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                  Voltar aos Pedidos
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
