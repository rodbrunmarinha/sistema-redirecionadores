"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

type Props = {
  data: {
    currentMonthRevenue: number;
    currentMonthExpenses: number;
    currentMonthNetProfit: number;
    currentMargin: number;
    chartLabels: string[];
    chartRevenue: number[];
    chartExpenses: number[];
  };
};

export function DashboardFinancialSummary({ data }: Props) {
  const formatCurrency = (val: number) => {
    return `¥ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartData = {
    labels: data.chartLabels,
    datasets: [
      {
        label: 'Receita',
        data: data.chartRevenue,
        backgroundColor: 'rgba(16, 185, 129, 1)', // emerald-500
        borderRadius: 2,
        barPercentage: 0.2,
        categoryPercentage: 0.5,
      },
      {
        label: 'Despesas',
        data: data.chartExpenses.map(v => v > 0 ? v : 0), 
        backgroundColor: 'rgba(244, 63, 94, 1)', // rose-500
        borderRadius: 2,
        barPercentage: 0.2,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(9, 9, 11, 0.9)',
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(39, 39, 42, 1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(Math.abs(context.parsed.y));
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        display: false,
        grid: { display: false },
        border: { display: false },
        
      },
      x: {
        ticks: { color: '#71717a', font: { size: 10, weight: 'bold' as const } },
        grid: { display: false },
        border: { display: false },
        
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[1.5rem] shadow-lg p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white capitalize">Financeiro De {currentMonthName}</h2>
        <Link href="/admin/financial-module" className="flex items-center gap-1 text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
          Ver módulo financeiro
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        {/* Cards Side */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:w-1/2">
          {/* Receita */}
          <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-center min-w-[140px]">
            <h3 className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-2">Receita do Mês</h3>
            <p className="text-2xl lg:text-3xl font-bold text-emerald-400">{formatCurrency(data.currentMonthRevenue)}</p>
          </div>

          {/* Despesas */}
          <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex flex-col justify-center min-w-[140px]">
            <h3 className="text-[11px] font-bold text-rose-500 uppercase tracking-wider mb-2">Despesas</h3>
            <p className="text-2xl lg:text-3xl font-bold text-rose-400">{formatCurrency(data.currentMonthExpenses)}</p>
          </div>

          {/* Lucro Líquido */}
          <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex flex-col justify-center min-w-[140px]">
            <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-2">Lucro Líquido</h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-400">{formatCurrency(data.currentMonthNetProfit)}</p>
            <p className="text-xs text-blue-500/80 mt-1 font-medium">{data.currentMargin.toFixed(1)}% margem</p>
          </div>
        </div>

        {/* Chart Side */}
        <div className="lg:w-1/2 flex flex-col relative">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Receita x Despesas — Últimos 6 meses</h3>
          <div className="h-32 w-full mt-auto relative">
            <Bar options={options} data={chartData} />
            <div className="absolute bottom-6 left-0 w-full h-[1px] bg-zinc-800/50 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
