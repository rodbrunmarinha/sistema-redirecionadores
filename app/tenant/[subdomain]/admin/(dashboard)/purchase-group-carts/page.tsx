"use client";

import Link from "next/link";
import { 
  ShoppingCart, 
  UserPlus, 
  Package, 
  Plus, 
  Filter
} from "lucide-react";
import { useState } from "react";

export default function PurchaseGroupCartsPage() {
  const [selectedGroup, setSelectedGroup] = useState("");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 flex flex-col relative overflow-x-hidden">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <span className="text-white/50 shrink-0">/</span>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Carrinhos em Aberto dos Clientes
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                  Carrinhos em Aberto
                </h1>
                <p className="mt-0.5 text-sm text-orange-100 truncate">
                  Acompanhe os carrinhos dos clientes e monte pedidos por eles
                </p>
              </div>
            </div>
            <Link 
              href="/admin/purchase-group-carts/create" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Novo Carrinho
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full pb-12">
        
        {/* Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-800 p-4 text-white shadow-lg shadow-zinc-900/25 border border-zinc-700">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-zinc-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest truncate">Carrinhos com itens</p>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 text-white shadow-lg shadow-emerald-500/25">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-emerald-100 text-[10px] sm:text-xs font-semibold uppercase tracking-widest truncate">Criados pelo admin</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white shadow-lg shadow-blue-500/25">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-100 text-[10px] sm:text-xs font-semibold uppercase tracking-widest truncate">Itens no total</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4">
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <select 
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full rounded-xl text-sm border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-2.5 px-3 appearance-none transition"
              >
                <option value="">Todos os grupos</option>
                {/* Aqui virão os options reais do banco */}
              </select>
            </div>
            <button 
              type="button" 
              className="px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition whitespace-nowrap font-medium flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </form>
        </div>

        {/* Empty State */}
        <div className="text-center py-16 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 shadow-sm">
            <ShoppingCart className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Nenhum carrinho em aberto</h3>
          <p className="text-zinc-400 mb-6 max-w-sm mx-auto">
            Os carrinhos aparecerão aqui quando clientes adicionarem produtos, ou você pode criar um carrinho para um cliente.
          </p>
          <Link 
            href="/admin/purchase-group-carts/create" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Novo Carrinho para Cliente
          </Link>
        </div>

      </div>
    </div>
  );
}
