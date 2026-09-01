"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  TrendingUp, 
  Link as LinkIcon, 
  Activity, 
  Globe, 
  Target, 
  Users, 
  LineChart, 
  PieChart, 
  Megaphone, 
  MonitorSmartphone, 
  UserPlus, 
  Code2
} from "lucide-react";

export default function MarketingDashboardPage() {
  const [period, setPeriod] = useState("30d");

  // Mock KPIs
  const kpis = {
    visits: 0,
    sources: 0,
    conversions: 0,
    conversionRate: "0%",
    totalRegistrations: 1
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute top-4 right-32 w-20 h-20 rounded-full bg-white/10 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Marketing
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shrink-0 border border-white/20">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Marketing & Tráfego</h1>
                <p className="mt-0.5 text-sm text-orange-100">Acompanhe suas campanhas, origens de tráfego e conversões</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link 
                href="/admin/marketing/pixels" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur text-white border border-white/20 text-sm font-semibold transition-colors shadow-sm"
              >
                <Code2 className="w-4 h-4" />
                Pixels
              </Link>
              <Link 
                href="/admin/marketing/links" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
              >
                <LinkIcon className="w-4 h-4" />
                Criar Link UTM
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Period Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: "7d", label: "7 dias" },
            { id: "30d", label: "30 dias" },
            { id: "90d", label: "90 dias" },
            { id: "year", label: "Este ano" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                period === p.id 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 border-transparent" 
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg transition hover:border-blue-500/50 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-blue-500/5 rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-blue-400">Visitas</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <Activity className="w-4 h-4 text-zinc-400 group-hover:text-blue-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{kpis.visits}</p>
              <p className="text-xs text-zinc-500 mt-1">Visitas com UTM</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg transition hover:border-purple-500/50 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-purple-500/5 rounded-full group-hover:bg-purple-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-purple-400">Fontes</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <Globe className="w-4 h-4 text-zinc-400 group-hover:text-purple-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{kpis.sources}</p>
              <p className="text-xs text-zinc-500 mt-1">Fontes de Tráfego</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg transition hover:border-emerald-500/50 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-emerald-500/5 rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-emerald-400">Conversões</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <Target className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{kpis.conversions}</p>
              <p className="text-xs text-zinc-500 mt-1">Cadastros via UTM</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg transition hover:border-amber-500/50 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-amber-500/5 rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-amber-400">Taxa</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <TrendingUp className="w-4 h-4 text-zinc-400 group-hover:text-amber-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{kpis.conversionRate}</p>
              <p className="text-xs text-zinc-500 mt-1">Conversão UTM</p>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg transition hover:border-orange-500/50 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-orange-500/5 rounded-full group-hover:bg-orange-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-orange-400">Total</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <Users className="w-4 h-4 text-zinc-400 group-hover:text-orange-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{kpis.totalRegistrations}</p>
              <p className="text-xs text-zinc-500 mt-1">Cadastros totais (período)</p>
            </div>
          </div>

        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-500" />
              Visitas por Dia
            </h3>
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <LineChart className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Nenhuma visita UTM registrada neste período</p>
              <p className="text-xs mt-1 text-zinc-600">Crie links UTM e divulgue suas campanhas</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Fontes de Tráfego
            </h3>
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <PieChart className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Nenhuma fonte rastreada ainda</p>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              Campanhas
            </h3>
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <Megaphone className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Nenhuma campanha rastreada ainda</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MonitorSmartphone className="w-5 h-5 text-cyan-500" />
              Dispositivos
            </h3>
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <MonitorSmartphone className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Nenhum dado de dispositivo</p>
            </div>
          </div>
        </div>

        {/* Conversions Table */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-500" />
            Últimas Conversões (Cadastros via UTM)
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <UserPlus className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium text-zinc-400">Nenhuma conversão registrada ainda</p>
            <p className="text-xs mt-1 text-zinc-600">Quando visitantes de campanhas UTM se cadastrarem, aparecerão aqui</p>
          </div>
        </div>

        {/* Quick Status / Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <Link href="/admin/marketing/pixels" className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6 hover:border-orange-500/50 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">Pixels de Rastreamento</h4>
                <p className="text-sm text-zinc-500 mt-1">0 ativo(s) de 0 configurado(s)</p>
              </div>
              <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <Code2 className="w-6 h-6" />
              </div>
            </div>
          </Link>
          
          <Link href="/admin/marketing/links" className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6 hover:border-orange-500/50 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">Links UTM</h4>
                <p className="text-sm text-zinc-500 mt-1">0 link(s) · 0 cliques totais</p>
              </div>
              <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <LinkIcon className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
