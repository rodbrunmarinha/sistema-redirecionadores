"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  BarChart2, 
  Download, 
  Users, 
  Calendar,
  CircleDollarSign,
  ArrowRightLeft,
  UserPlus,
  ShoppingCart,
  Tag,
  Package,
  Truck,
  UserCheck,
  Archive,
  Box,
  Wallet,
  LineChart,
  PieChart,
  Trophy,
  Activity,
  CreditCard
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [period, setPeriod] = useState("30d");
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Analytics
            </span>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0 border border-white/20">
                <BarChart2 className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Analytics</h1>
                <p className="text-orange-100 text-sm mt-0.5">Visão geral do desempenho do seu negócio</p>
              </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full lg:w-auto">
              <button className="px-3 sm:px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap backdrop-blur-sm shadow-sm">
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
              <Link href="/admin/analytics/behavior" className="px-3 sm:px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap backdrop-blur-sm shadow-sm">
                <Users className="w-4 h-4" />
                Comportamento
              </Link>
              
              <div className="relative flex-1 sm:flex-initial">
                <div className="overflow-x-auto custom-scrollbar pb-1 -mb-1">
                  <div className="flex items-center gap-2 min-w-max">
                    {[
                      { id: '7d', label: '7d' },
                      { id: '30d', label: '30d' },
                      { id: '90d', label: '90d' },
                      { id: '12m', label: '12m' },
                      { id: 'ytd', label: 'Ano' }
                    ].map(p => (
                      <button 
                        key={p.id}
                        onClick={() => { setPeriod(p.id); setCustomOpen(false); }}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 ${
                          period === p.id 
                            ? 'bg-white text-orange-600 font-bold shadow-lg' 
                            : 'bg-white/15 hover:bg-white/25 border border-white/25 text-white backdrop-blur-sm'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                    
                    <div className="relative shrink-0">
                      <button 
                        onClick={() => setCustomOpen(!customOpen)}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                          period === 'custom' 
                            ? 'bg-white text-orange-600 font-bold shadow-lg' 
                            : 'bg-white/15 hover:bg-white/25 border border-white/25 text-white backdrop-blur-sm'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Personalizado</span>
                      </button>

                      {customOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setCustomOpen(false)}></div>
                          <div className="absolute right-0 mt-2 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-4 z-50 w-72 animate-in fade-in slide-in-from-top-2">
                            <form onSubmit={(e) => { e.preventDefault(); setPeriod('custom'); setCustomOpen(false); }}>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-xs font-semibold text-zinc-400 uppercase">Data Início</label>
                                  <input type="date" defaultValue="2026-07-19" className="w-full mt-1.5 rounded-lg border-zinc-700 bg-zinc-950 text-white text-sm focus:border-orange-500 focus:ring-orange-500/50 outline-none px-3 py-2" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-zinc-400 uppercase">Data Fim</label>
                                  <input type="date" defaultValue="2026-08-17" className="w-full mt-1.5 rounded-lg border-zinc-700 bg-zinc-950 text-white text-sm focus:border-orange-500 focus:ring-orange-500/50 outline-none px-3 py-2" />
                                </div>
                                <button type="submit" className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-500 transition shadow-lg">
                                  Aplicar Filtro
                                </button>
                              </div>
                            </form>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm hover:border-orange-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <CircleDollarSign className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">$0,00</p>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider group-hover:text-orange-400 transition-colors">Sua Receita</p>
            <p className="text-[11px] leading-snug text-zinc-500 mt-1">O que fica com você: taxas, frete e ordens</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm hover:border-blue-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <ArrowRightLeft className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">$0,00</p>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider group-hover:text-blue-400 transition-colors">Volume Transacionado</p>
            <p className="text-[11px] leading-snug text-zinc-500 mt-1">Tudo que clientes pagaram, incluindo produtos</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm hover:border-emerald-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +100%
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">1</p>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Novos Clientes</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm hover:border-purple-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">0</p>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider group-hover:text-purple-400 transition-colors">Pedidos</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm hover:border-amber-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                <Tag className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">$0,00</p>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider group-hover:text-amber-400 transition-colors">Ticket Médio</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm hover:border-pink-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-5 h-5 text-pink-500" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">0</p>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider group-hover:text-pink-400 transition-colors">Caixas Recebidas</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm hover:border-indigo-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">0</p>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Envios</p>
          </div>
        </div>

        {/* SNAPSHOT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 translate-y-1/4">
              <UserCheck className="w-24 h-24 text-orange-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Clientes Ativos</p>
              </div>
              <p className="text-2xl font-extrabold text-white">1</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 translate-y-1/4">
              <Archive className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Archive className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Caixas (Total)</p>
              </div>
              <p className="text-2xl font-extrabold text-white">0</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 translate-y-1/4">
              <Box className="w-24 h-24 text-amber-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Box className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Produtos (Total)</p>
              </div>
              <p className="text-2xl font-extrabold text-white">0</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 translate-y-1/4">
              <Wallet className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Saldo Carteiras</p>
              </div>
              <p className="text-2xl font-extrabold text-white">$0,00</p>
            </div>
          </div>
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-orange-500" />
                  Receita ao Longo do Tempo
                </h3>
                <p className="text-sm text-zinc-500 mt-1">Comparativo por canal de vendas</p>
              </div>
              <span className="text-xl font-extrabold text-white">$0,00</span>
            </div>
            <div className="h-[320px] flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
              <div className="text-center text-zinc-500">
                <LineChart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sem dados suficientes no período</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-orange-500" />
                Receita por Canal
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Distribuição de receita</p>
            </div>
            <div className="h-[220px] flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 mb-6">
              <div className="text-center text-zinc-500">
                <PieChart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sem dados</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Grupos de Compras', color: 'bg-purple-500' },
                { label: 'Loja Online', color: 'bg-indigo-500' },
                { label: 'Compras Assistidas', color: 'bg-pink-500' },
                { label: 'Envios', color: 'bg-teal-500' }
              ].map((channel, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${channel.color}`}></div>
                    <span className="text-zinc-400">{channel.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">$0,00</span>
                    <span className="text-xs text-zinc-600 w-10 text-right">0%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHARTS ROW 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-500" />
                  Novos Clientes
                </h3>
                <p className="text-sm text-zinc-500 mt-1">Crescimento de base</p>
              </div>
              <span className="text-xl font-extrabold text-white">1</span>
            </div>
            <div className="h-[260px] flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
              <div className="text-center text-zinc-500">
                <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Gráfico indisponível</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-500" />
                  Caixas Recebidas
                </h3>
                <p className="text-sm text-zinc-500 mt-1">Volume de recebimentos</p>
              </div>
              <span className="text-xl font-extrabold text-white">0</span>
            </div>
            <div className="h-[260px] flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
              <div className="text-center text-zinc-500">
                <Activity className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Gráfico indisponível</p>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS ROW 3 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-500" />
                Métodos de Pagamento
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Distribuição dos pagamentos</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
              <p className="text-sm">Sem dados de pagamento no período</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Archive className="w-5 h-5 text-indigo-500" />
                Status dos Pedidos
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Grupos de compras no período</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
              <p className="text-sm">Sem pedidos no período</p>
            </div>
          </div>
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top Clientes
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Por volume de gastos no período</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-zinc-500 bg-zinc-950/50">
              <p className="text-sm">Sem dados de clientes no período</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
                Top Grupos de Compras
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Maior receita no período</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-zinc-500 bg-zinc-950/50">
              <p className="text-sm">Sem dados de grupos no período</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
