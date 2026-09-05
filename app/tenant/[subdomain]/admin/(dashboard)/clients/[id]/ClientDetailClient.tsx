"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, ArrowLeft, Plus, Wallet, Edit, UserCircle, LayoutDashboard, Box, 
  ShoppingBag, Truck, Wrench, ShoppingCart, Users, MapPin, Store, CreditCard, 
  Activity, AlertCircle, Phone, FileText, Calendar, MessageCircle, Star, ArrowRight, 
  ArrowDownRight, ArrowUpRight
} from 'lucide-react';

export default function ClientDetailClient({ 
  tenant, 
  subdomain,
  clientData
}: { 
  tenant: any, 
  subdomain: string,
  clientData: any
}) {

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      {/* Header Profile */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-800">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <nav className="flex items-center gap-2 text-sm mb-4 text-zinc-400">
            <Link href={`/admin/dashboard`} className="hover:text-white transition-colors truncate">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/admin/clients`} className="hover:text-white transition-colors truncate">Clientes</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-200 font-medium truncate">{clientData.name}</span>
          </nav>
          
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link href={`/admin/clients`} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition shrink-0 border border-zinc-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-xl shadow-lg">
                  {clientData.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{clientData.name}</h1>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Ativo</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-0.5">
                    {clientData.email}
                    <span className="mx-1.5 text-zinc-600">·</span>
                    <span className="font-medium text-amber-400">Dock {clientData.suite}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white transition">
                <Plus className="w-4 h-4" />
                Cadastrar Caixa
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white transition">
                <Wallet className="w-4 h-4" />
                Abrir Carteira
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white transition">
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white transition">
                <UserCircle className="w-4 h-4" />
                Impersonar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/clients/${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition shadow-sm bg-amber-500 text-zinc-950 shadow-amber-500/20">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Visão Geral</span>
          </Link>
          <Link href={`/admin/boxes/${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <Box className="w-4 h-4 shrink-0" />
            <span>Caixas</span>
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">2</span>
          </Link>
          <Link href={`/admin/products?client_id=${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Produtos</span>
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">3</span>
          </Link>
          <Link href={`/admin/shipments/${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <Truck className="w-4 h-4 shrink-0" />
            <span>Envios</span>
          </Link>
          <Link href={`/admin/service-orders?client_id=${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <Wrench className="w-4 h-4 shrink-0" />
            <span>Serviços</span>
          </Link>
          <Link href={`/admin/online-purchases?client_id=${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Compra Assistida</span>
          </Link>
          <Link href={`/admin/purchase-group-orders/${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <Users className="w-4 h-4 shrink-0" />
            <span>Pedidos em Grupo</span>
          </Link>
          <Link href={`/admin/clients/${clientData.id}/addresses`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Endereços</span>
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">0</span>
          </Link>
          <Link href={`/admin/store/orders/${clientData.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
            <Store className="w-4 h-4 shrink-0" />
            <span>Loja</span>
          </Link>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5 hover:border-emerald-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Saldo na Carteira</p>
              <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition">
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-400">¥{clientData.wallet_balance.toFixed(2)}</p>
            <p className="mt-1 text-xs text-zinc-500">2 transações</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Movimentado</p>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">¥{clientData.total_moved.toFixed(2)}</p>
            <p className="mt-1 text-xs text-zinc-500">Compras, envios e solicitações</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Demandas em Aberto</p>
              <div className="p-2 rounded-lg bg-orange-500/10">
                <AlertCircle className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{clientData.open_demands}</p>
            <p className="mt-1 text-xs text-zinc-500">Pendentes e aguardando</p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5 hover:border-violet-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Suíte Disponível</p>
              <div className="p-2 rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition">
                <Box className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{clientData.available_weight.toFixed(3)} kg</p>
            <p className="mt-1 text-xs text-zinc-500">{clientData.available_items} itens disponíveis</p>
          </div>
        </div>

        {/* Main Grid: Left Sidebar (4) & Right Content (8) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* LEFT SIDEBAR */}
          <div className="xl:col-span-4 space-y-5">
            
            {/* User Details */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
              <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-500 font-bold text-lg">
                    {clientData.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{clientData.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{clientData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Telefone</p>
                    <p className="mt-0.5 font-semibold text-zinc-300 break-all">{clientData.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">CPF/Documento</p>
                    <p className="mt-0.5 font-semibold text-zinc-300 break-all">{clientData.document}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Suíte</p>
                    <p className="mt-0.5 font-semibold text-amber-400 break-all">{clientData.suite}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Cadastrado em</p>
                    <p className="mt-0.5 font-semibold text-zinc-300 break-all">{new Date(clientData.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <a href={`https://wa.me/${clientData.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* VIP Status */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-500"></div>
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Assinatura VIP</p>
                    <p className="mt-1 text-lg font-bold text-white">Programa não disponível</p>
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700">
                    Sem VIP
                  </span>
                </div>
                <p className="text-sm text-zinc-400">Este cliente não possui uma assinatura VIP ativa no momento.</p>
                <div className="pt-1">
                  <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition">
                    <Star className="w-3.5 h-3.5" />
                    Gerenciar VIP
                  </button>
                </div>
              </div>
            </div>

            {/* Shortcuts */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm p-5 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Atalhos</p>

              <Link href={`/admin/wallets/${clientData.id}`} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition group border border-transparent hover:border-emerald-500/20">
                <span className="flex-shrink-0 p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10">
                  <Wallet className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left">Abrir Carteira</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition" />
              </Link>
              
              <Link href={`/admin/shipments/${clientData.id}`} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-purple-500/10 hover:text-purple-400 transition group border border-transparent hover:border-purple-500/20">
                <span className="flex-shrink-0 p-1.5 rounded-lg text-purple-400 bg-purple-500/10">
                  <Truck className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left">Ver Envios</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition" />
              </Link>
              
              <Link href={`/admin/purchase-group-orders/${clientData.id}`} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-amber-500/10 hover:text-amber-400 transition group border border-transparent hover:border-amber-500/20">
                <span className="flex-shrink-0 p-1.5 rounded-lg text-amber-400 bg-amber-500/10">
                  <Users className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left">Ver Pedidos em Grupo</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition" />
              </Link>
              
              <Link href={`/admin/store/orders/${clientData.id}`} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-pink-500/10 hover:text-pink-400 transition group border border-transparent hover:border-pink-500/20">
                <span className="flex-shrink-0 p-1.5 rounded-lg text-pink-400 bg-pink-500/10">
                  <Store className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left">Ver Pedidos da Loja</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-pink-400 transition" />
              </Link>
              
              <Link href={`/admin/boxes/${clientData.id}`} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-blue-500/10 hover:text-blue-400 transition group border border-transparent hover:border-blue-500/20">
                <span className="flex-shrink-0 p-1.5 rounded-lg text-blue-400 bg-blue-500/10">
                  <Box className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left">Ver Caixas</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition" />
              </Link>
            </div>

            {/* Financial Summary */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4">Resumo Financeiro</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-zinc-400">Créditos na Carteira</p>
                  <p className="text-xs font-bold text-emerald-400">¥{clientData.wallet_credits?.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-zinc-400">Débitos na Carteira</p>
                  <p className="text-xs font-bold text-red-400">¥{clientData.wallet_debits?.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-zinc-400">Total em Compras em Grupo</p>
                  <p className="text-xs font-bold text-amber-400">¥{clientData.total_groups?.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-zinc-400">Total na Loja</p>
                  <p className="text-xs font-bold text-pink-400">¥{clientData.total_store?.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-zinc-400">Total em Envios</p>
                  <p className="text-xs font-bold text-purple-400">¥{clientData.total_shipments?.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-zinc-400">Total em Solicitações</p>
                  <p className="text-xs font-bold text-indigo-400">¥{clientData.total_assisted?.toFixed(2)}</p>
                </div>
                <div className="pt-3 mt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-zinc-300">Total Movimentado</p>
                  <p className="text-sm font-bold text-white">¥{clientData.total_moved?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div className="xl:col-span-8 space-y-5">
            
            {/* Small Stat Blocks Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Caixas', value: clientData.boxes_count?.toString() || '0', sub: `${clientData.available_weight?.toFixed(2) || '0.00'} kg`, color: 'blue' },
                { label: 'Estoque', value: clientData.available_items?.toString() || '0', sub: `${clientData.products_count || 0} produtos`, color: 'violet' },
                { label: 'Solicitações', value: clientData.assisted_count?.toString() || '0', sub: `${clientData.assisted_count || 0} reg.`, color: 'indigo' },
                { label: 'Envios', value: clientData.shipments_count?.toString() || '0', sub: `${clientData.shipments_count || 0} reg.`, color: 'purple' },
                { label: 'Ped. Grupo', value: clientData.groups_count?.toString() || '0', sub: `${clientData.groups_count || 0} reg.`, color: 'amber' },
                { label: 'Ped. Loja', value: clientData.store_count?.toString() || '0', sub: `${clientData.store_count || 0} reg.`, color: 'pink' }
              ].map(stat => (
                <div key={stat.label} className="group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-4 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between gap-1">
                    <p className={`text-[10px] font-bold uppercase tracking-wide leading-tight text-${stat.color}-400`}>{stat.label}</p>
                    <ArrowRight className={`w-3 h-3 text-${stat.color}-400 opacity-0 group-hover:opacity-100 transition`} />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className={`mt-1 text-[10px] text-${stat.color}-500 leading-tight`}>{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
                  <p className="font-bold text-sm text-zinc-300">Solicitações Recentes</p>
                  <Link href={`/admin/online-purchases?client=${clientData.id}`} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition">Ver todas →</Link>
                </div>
                {clientData.recent_assisted?.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {clientData.recent_assisted.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-0.5"></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-white truncate">{item.product_name || `Req #${item.id.slice(0,6)}`}</p>
                            <span className="flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400">{item.status}</span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                            <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                            <span className="text-zinc-700">·</span>
                            <span>¥{Number(item.total_paid || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-5 text-sm text-zinc-500 italic">Nenhum registro recente encontrado.</div>
                )}
              </div>
              
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
                  <p className="font-bold text-sm text-zinc-300">Envios Recentes</p>
                  <Link href={`/admin/shipments?client=${clientData.id}`} className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition">Ver todas →</Link>
                </div>
                {clientData.recent_shipments?.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {clientData.recent_shipments.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-0.5"></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-white truncate">{item.tracking_number || `Envio #${item.id.slice(0,6)}`}</p>
                            <span className="flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-400">{item.status}</span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                            <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                            <span className="text-zinc-700">·</span>
                            <span>¥{Number(item.total_amount || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-5 text-sm text-zinc-500 italic">Nenhum registro recente encontrado.</div>
                )}
              </div>
              
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
                  <p className="font-bold text-sm text-zinc-300">Pedidos Grupo Recentes</p>
                  <Link href={`/admin/purchase-groups?client=${clientData.id}`} className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition">Ver todas →</Link>
                </div>
                {clientData.recent_groups?.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {clientData.recent_groups.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-0.5"></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-white truncate">{`Grupo #${item.id.slice(0,6)}`}</p>
                            <span className="flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400">{item.status}</span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                            <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                            <span className="text-zinc-700">·</span>
                            <span>¥{Number(item.total_amount || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-5 text-sm text-zinc-500 italic">Nenhum registro recente encontrado.</div>
                )}
              </div>
              
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
                  <p className="font-bold text-sm text-zinc-300">Pedidos da Loja Recentes</p>
                  <Link href={`/admin/store/orders?client=${clientData.id}`} className="text-[10px] font-bold text-pink-400 hover:text-pink-300 transition">Ver todas →</Link>
                </div>
                {clientData.recent_store?.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {clientData.recent_store.map((item: any) => (
                      <Link key={item.id} href={`/admin/store/orders/${item.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-800/50 transition group">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-pink-500 mt-0.5"></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-white truncate group-hover:text-pink-400 transition">{`ORD-${item.id.slice(0,8).toUpperCase()}`}</p>
                            <span className="flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-pink-500/10 text-pink-400">{item.status}</span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                            <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                            <span className="text-zinc-700">·</span>
                            <span>¥{Number(item.total_amount || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-5 text-sm text-zinc-500 italic">Nenhum registro recente encontrado.</div>
                )}
              </div>
            </div>

            {/* Bottom 2 Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
                  <p className="font-bold text-sm text-zinc-300">Últimas Caixas Recebidas</p>
                  <Link href={`/admin/boxes?client=${clientData.id}`} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition">Ver todas →</Link>
                </div>
                {clientData.recent_boxes?.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {clientData.recent_boxes.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-0.5"></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-white truncate">{item.tracking_number || `Caixa #${item.id.slice(0,6)}`}</p>
                            <span className="flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-zinc-800 text-zinc-400">{item.status}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                            <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-5 text-sm text-zinc-500 italic">Nenhuma caixa recente encontrada.</div>
                )}
              </div>

              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
                  <p className="font-bold text-sm text-zinc-300">Transações Recentes Carteira</p>
                  <Link href={`/admin/wallets/${clientData.id}`} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition">Ver todas →</Link>
                </div>
                {clientData.recent_wallet?.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {clientData.recent_wallet.map((item: any) => {
                      const isPositive = Number(item.amount) > 0;
                      return (
                        <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                          <span className={`flex-shrink-0 p-1.5 rounded-lg ${isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            {isPositive ? <ArrowUpRight className={`w-4 h-4 text-emerald-400`} /> : <ArrowDownRight className={`w-4 h-4 text-red-400`} />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-white truncate">{item.description || item.type}</p>
                            <p className="text-[10px] text-zinc-500 font-medium">{new Date(item.created_at).toLocaleString('pt-BR')}</p>
                          </div>
                          <p className={`flex-shrink-0 text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : '-'}¥{Math.abs(Number(item.amount)).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-5 py-5 text-sm text-zinc-500 italic">Nenhuma transação recente.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
