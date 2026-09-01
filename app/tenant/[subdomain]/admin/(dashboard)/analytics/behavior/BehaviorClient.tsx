"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, Activity, Calendar, Filter, Eye, MousePointerClick, 
  User, FileText, TrendingDown, Clock, BarChart3, PieChart, 
  Smartphone, Monitor, Globe, Award, ArrowRight, LayoutDashboard
} from "lucide-react";

export default function BehaviorClient({ subdomain }: { subdomain: string }) {
  const [dateOpen, setDateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-900 via-violet-800 to-indigo-900 shadow-lg border-b border-zinc-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href={`/admin/dashboard`} className="text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <Link href={`/admin/analytics`} className="text-white/70 hover:text-white transition-colors">
              Analytics
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <span className="text-white font-medium">Comportamento do Cliente</span>
          </nav>
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl shadow-lg shrink-0">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Comportamento do Cliente</h1>
                <p className="text-violet-200 text-sm mt-0.5">Páginas visitadas, dispositivos, horários de pico e atividade dos clientes</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Link 
                href="/admin/analytics?period=30d" 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics Geral</span>
              </Link>

              {/* Period Selector */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg border border-white/20 p-1">
                {['7d', '30d', '90d', '12m'].map((p) => (
                  <Link 
                    key={p}
                    href={`/admin/analytics/behavior?period=${p}`} 
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      p === '30d' ? 'bg-white text-violet-900 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              {/* Custom Date */}
              <div className="relative">
                <button 
                  onClick={() => setDateOpen(!dateOpen)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                {dateOpen && (
                  <div className="absolute right-0 mt-2 bg-zinc-900 rounded-xl border border-zinc-700 p-4 z-50 w-72 shadow-2xl">
                    <form className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Início</label>
                        <input type="date" defaultValue="2026-08-01" className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-violet-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Fim</label>
                        <input type="date" defaultValue="2026-08-30" className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-violet-500 outline-none" />
                      </div>
                      <button type="button" onClick={() => setDateOpen(false)} className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition">
                        Aplicar
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Exclude Form */}
              <form className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5">
                <Filter className="w-4 h-4 text-white/70" />
                <input 
                  type="text" 
                  placeholder="Excluir suíte(s): 1001" 
                  className="w-40 px-2 py-1 bg-transparent text-sm text-white placeholder-white/50 border-none outline-none focus:ring-0" 
                />
                <button type="button" className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition">
                  Filtrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard icon={<Eye />} color="text-cyan-500" bg="from-cyan-500/20 to-cyan-500/5" value="51" label="Visualizações" />
          <KpiCard icon={<MousePointerClick />} color="text-violet-500" bg="from-violet-500/20 to-violet-500/5" value="7" label="Sessões" />
          <KpiCard icon={<User />} color="text-pink-500" bg="from-pink-500/20 to-pink-500/5" value="1" label="Usuários Únicos" />
          <KpiCard icon={<FileText />} color="text-amber-500" bg="from-amber-500/20 to-amber-500/5" value="7,3" label="Págs / Sessão" />
          <KpiCard icon={<TrendingDown />} color="text-rose-500" bg="from-rose-500/20 to-rose-500/5" value="28.6%" label="Taxa Rejeição" negative />
          <KpiCard icon={<Clock />} color="text-emerald-500" bg="from-emerald-500/20 to-emerald-500/5" value="1h 23m" label="Duração Média" />
        </div>

        {/* Views Chart Placeholder */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Acessos ao Longo do Tempo</h3>
              <p className="text-sm text-zinc-400">Visualizações e usuários únicos por dia</p>
            </div>
            <span className="text-xl font-extrabold text-white">51</span>
          </div>
          <div className="h-64 w-full bg-zinc-950/50 rounded-xl border border-zinc-800/50 flex items-center justify-center">
            <span className="text-zinc-600 text-sm">[ Gráfico de Linha Placeholder ]</span>
          </div>
        </div>

        {/* Sections and Pages */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold flex items-center gap-2"><PieChart className="w-5 h-5 text-violet-400" /> Seções Populares</h3>
            </div>
            <div className="p-4 space-y-4">
              <SectionBar name="Envios" value={21} users={1} percent={100} />
              <SectionBar name="Loja Online" value={12} users={1} percent={57} />
              <SectionBar name="Dashboard" value={7} users={1} percent={33} />
              <SectionBar name="Minha Suíte" value={6} users={1} percent={28} />
              <SectionBar name="Caixas Recebidas" value={5} users={1} percent={23} />
            </div>
          </div>

          <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-cyan-400" /> Páginas Mais Visitadas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/50 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Página</th>
                    <th className="px-6 py-4 font-medium text-right">Views</th>
                    <th className="px-6 py-4 font-medium text-right">Usuários</th>
                    <th className="px-6 py-4 font-medium text-right">Sessões</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  <PageRow name="Dashboard" route="app.dashboard" views={7} users={1} sessions={5} />
                  <PageRow name="Minha Suíte" route="app.products.index" views={6} users={1} sessions={2} />
                  <PageRow name="Envios" route="app.shipments.terms" views={5} users={1} sessions={3} />
                  <PageRow name="Envios" route="app.shipments.addresses" views={5} users={1} sessions={3} />
                  <PageRow name="Novo Envio" route="app.shipments.create" views={5} users={1} sessions={3} />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Devices, Browsers, Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DeviceCard title="Dispositivos" icon={<Smartphone className="w-5 h-5" />} item="Desktop" val="100%" />
          <DeviceCard title="Navegadores" icon={<Globe className="w-5 h-5" />} item="Chrome" val="100%" />
          <DeviceCard title="Sistemas" icon={<Monitor className="w-5 h-5" />} item="Windows" val="100%" />
        </div>

        {/* Peak Hours & Navigation */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-amber-400" /> Fluxo de Navegação</h3>
            <div className="space-y-4">
              <FlowRow from="Minha Suíte" to="Envios" count={10} percent={100} />
              <FlowRow from="Envios" to="Minha Suíte" count={8} percent={80} />
              <FlowRow from="Envios" to="Loja Online" count={3} percent={30} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" /> Clientes Mais Ativos</h3>
            <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-medium text-zinc-100">Bruno de Souza</p>
                  <p className="text-xs text-zinc-400">rodbrun_dragon@hotmail.com · Suite 1001</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">51 views</p>
                <p className="text-xs text-zinc-500">7 sessões · 4 dias</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents
function KpiCard({ icon, color, bg, value, label, negative = false }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center`}>
          <div className={color}>{icon}</div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${negative ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
          100%
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs font-medium text-zinc-500 mt-1 uppercase">{label}</p>
      </div>
    </div>
  );
}

function SectionBar({ name, value, users, percent }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-zinc-300 font-medium">{name}</span>
        <div className="flex gap-3">
          <span className="font-bold">{value}</span>
          <span className="text-zinc-500 text-xs">{users} 👤</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function PageRow({ name, route, views, users, sessions }: any) {
  return (
    <tr className="hover:bg-zinc-800/30 transition-colors">
      <td className="px-6 py-3">
        <p className="font-medium text-zinc-200">{name}</p>
        <p className="text-xs text-zinc-500 font-mono">{route}</p>
      </td>
      <td className="px-6 py-3 text-right font-bold">{views}</td>
      <td className="px-6 py-3 text-right text-zinc-400">{users}</td>
      <td className="px-6 py-3 text-right text-zinc-400">{sessions}</td>
    </tr>
  );
}

function DeviceCard({ title, icon, item, val }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-zinc-200">
        <span className="text-zinc-500">{icon}</span> {title}
      </h3>
      <div className="h-32 flex-1 flex items-center justify-center bg-zinc-950/50 rounded-xl border border-zinc-800/50 mb-6">
        <span className="text-zinc-600 text-sm">[ Gráfico Placeholder ]</span>
      </div>
      <div className="flex items-center justify-between text-sm p-3 bg-zinc-950/50 rounded-lg">
        <span className="text-zinc-300">{item}</span>
        <span className="font-bold">{val}</span>
      </div>
    </div>
  );
}

function FlowRow({ from, to, count, percent }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-300">{from}</span>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-300">{to}</span>
        </div>
        <span className="font-bold text-sm">{count}x</span>
      </div>
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
