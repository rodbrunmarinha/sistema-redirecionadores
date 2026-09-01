"use client";

import Link from "next/link";
import { ShoppingBag, Plus, Info, CalendarClock, CheckCircle, Package } from "lucide-react";

export default function AssistedPurchasePage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <span className="text-3xl">🛍️</span>
            Compra Online
          </h1>
          <p className="text-zinc-600 mt-1">Solicite produtos e nossa equipe compra para você</p>
        </div>
        <Link 
          href="/app/assisted-purchase/create" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/20 w-fit"
        >
          <Plus className="w-5 h-5" />
          Nova Solicitação
        </Link>
      </div>

      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-zinc-900 mb-2">Como funciona o serviço de Compra Online?</h4>
              <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">
                Nós compramos para você! Envie os links dos produtos que deseja e nossa equipe fará a cotação com a taxa de serviço inclusa. Após sua aprovação, efetuamos a compra e o produto é enviado para o nosso armazém.
              </p>
            </div>
          </div>
        </div>
        
        {/* Tabs de Status */}
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/app/assisted-purchase" 
            className="px-5 py-2.5 rounded-xl font-bold transition shadow-sm bg-purple-600 text-white shadow-purple-500/20"
          >
            Todas (0)
          </Link>
          <Link 
            href="/app/assisted-purchase?status=pending" 
            className="px-5 py-2.5 rounded-xl font-semibold transition bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
          >
            Aguardando Cotação (0)
          </Link>
          <Link 
            href="/app/assisted-purchase?status=quoted" 
            className="px-5 py-2.5 rounded-xl font-semibold transition bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
          >
            Aguardando Aprovação (0)
          </Link>
        </div>

        {/* Lista de Solicitações / Empty State */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="p-12 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-violet-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-zinc-500 mb-10 max-w-md mx-auto">
              Você ainda não fez nenhuma solicitação de compra assistida.
            </p>
            
            {/* Passos */}
            <div className="max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-100 text-left shadow-sm">
                <h4 className="font-bold text-zinc-900 mb-5 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-violet-600" />
                  Como solicitar sua compra:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">1</div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Envie os links</p>
                      <p className="text-xs text-zinc-500 mt-1">Cole URLs dos produtos</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">2</div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Receba a cotação</p>
                      <p className="text-xs text-zinc-500 mt-1">Valores completos</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">3</div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Aprove e pague</p>
                      <p className="text-xs text-zinc-500 mt-1">Confirme o pedido</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">4</div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Só aguardar</p>
                      <p className="text-xs text-zinc-500 mt-1">Iremos comprar e cadastrar na seu dock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link 
              href="/app/assisted-purchase/create" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/20"
            >
              <Plus className="w-5 h-5" />
              Fazer Primeira Solicitação
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
