"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  TrendingUp, 
  Download,
  Calendar,
  Users,
  Package,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Globe
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function ReportsClient({ subdomain }: { subdomain: string }) {
  const [period, setPeriod] = useState('30d');

  // MOCK DATA for Charts
  const lineData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Envios',
        data: [120, 190, 150, 220],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Compras Assistidas',
        data: [80, 110, 90, 140],
        borderColor: '#06b6d4',
        backgroundColor: 'transparent',
        tension: 0.4,
      }
    ]
  };

  const doughnutData = {
    labels: ['Concluídos', 'Aguardando Pagamento', 'Em Processamento', 'Cancelados'],
    datasets: [{
      data: [65, 15, 12, 8],
      backgroundColor: [
        '#f97316',
        '#3b82f6',
        '#8b5cf6',
        '#ef4444',
      ],
      borderWidth: 0,
      cutout: '75%',
    }]
  };

  const horizontalBarData = {
    labels: ['Brasil', 'Estados Unidos', 'Portugal', 'Espanha', 'Colômbia'],
    datasets: [{
      label: 'Volume de Envios',
      data: [450, 120, 85, 45, 20],
      backgroundColor: '#f97316',
      borderRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#a1a1aa', usePointStyle: true, boxWidth: 6 } },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#fff',
        bodyColor: '#d4d4d8',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    scales: {
      x: { grid: { display: false, color: '#27272a' }, ticks: { color: '#71717a' } },
      y: { grid: { color: '#27272a', borderDash: [4, 4] }, ticks: { color: '#71717a' } }
    }
  };

  const topClients = [
    { name: "João Silva", email: "joao.silva@exemplo.com", spent: "$ 4,520.00", orders: 34, status: "VIP Ouro" },
    { name: "Maria Oliveira", email: "maria.ol@exemplo.com", spent: "$ 3,890.50", orders: 28, status: "VIP Prata" },
    { name: "Carlos Mendes", email: "carlos.m@exemplo.com", spent: "$ 2,150.00", orders: 15, status: "Standard" },
    { name: "Ana Beatriz", email: "ana.bia@exemplo.com", spent: "$ 1,840.25", orders: 12, status: "Standard" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-12">
      {/* Header Gradient */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 relative overflow-hidden">
        <div className="absolute -top-14 -right-14 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin" className="text-orange-100 hover:text-white transition">Dashboard</Link>
            <ChevronRight className="w-4 h-4 text-orange-300" />
            <span className="text-white font-medium">Relatórios Avançados</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold text-white tracking-tight">Relatórios & Insights</h1>
              </div>
              <p className="text-orange-100 max-w-2xl text-sm">
                Analise o desempenho da sua operação, identifique tendências e tome decisões baseadas em dados com o módulo de Business Intelligence.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 text-white rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm cursor-pointer"
                >
                  <option value="7d" className="text-zinc-900">Últimos 7 dias</option>
                  <option value="30d" className="text-zinc-900">Últimos 30 dias</option>
                  <option value="90d" className="text-zinc-900">Últimos 3 meses</option>
                  <option value="1y" className="text-zinc-900">Este Ano</option>
                </select>
                <ChevronDown className="w-4 h-4 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-50 transition shadow-lg">
                <Download className="w-4 h-4" /> Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-6">
        
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Receita Bruta', value: '$ 45,230.00', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Volume de Envios', value: '1,284', trend: '+8.2%', isUp: true, icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: 'Ticket Médio', value: '$ 35.20', trend: '-2.4%', isUp: false, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Novos Clientes', value: '156', trend: '+24.0%', isUp: true, icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          ].map((kpi, i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl p-5 shadow-lg shadow-black/20 border border-zinc-800 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${kpi.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white">Evolução de Operações</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Comparativo de serviços prestados</p>
              </div>
            </div>
            <div className="h-72">
              <Line data={lineData} options={chartOptions as any} />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-zinc-800">
            <div className="mb-6">
              <h3 className="font-semibold text-white">Distribuição de Status</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Visão geral dos pedidos</p>
            </div>
            <div className="h-56 relative flex justify-center">
              <Doughnut data={doughnutData} options={{...chartOptions, plugins: { legend: { display: false } }} as any} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-xs text-zinc-500">Total</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {doughnutData.labels.map((label, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}></span>
                    <span className="text-zinc-400">{label}</span>
                  </div>
                  <span className="text-white font-medium">{doughnutData.datasets[0].data[i]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white">Destinos Principais</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Países com maior volume de envios</p>
              </div>
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Globe className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
            <div className="h-64">
              <Bar 
                data={horizontalBarData} 
                options={{
                  ...chartOptions, 
                  indexAxis: 'y',
                  plugins: { legend: { display: false } }
                } as any} 
              />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl shadow-lg shadow-black/20 border border-zinc-800 flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Top Clientes</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Os clientes que mais movimentam a plataforma</p>
              </div>
              <button className="text-orange-500 hover:text-orange-400 text-xs font-semibold flex items-center gap-1 transition">
                Ver Todos <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 text-zinc-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Cliente</th>
                    <th className="px-6 py-4 font-medium">Pedidos</th>
                    <th className="px-6 py-4 font-medium">Total Gasto</th>
                    <th className="px-6 py-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {topClients.map((client, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20 transition group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{client.name}</div>
                        <div className="text-xs text-zinc-500">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{client.orders}</td>
                      <td className="px-6 py-4 text-emerald-400 font-medium">{client.spent}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          client.status.includes('Ouro') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          client.status.includes('Prata') ? 'bg-zinc-400/10 text-zinc-300 border-zinc-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
