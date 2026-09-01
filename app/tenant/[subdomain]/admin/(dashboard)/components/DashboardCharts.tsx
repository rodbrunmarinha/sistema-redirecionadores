"use client";

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
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function DashboardCharts({ boxesData, customersData }: { boxesData: any[], customersData: any[] }) {
  // Aggregate boxes by date (last 7 days)
  const last7Days = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const boxesCount = last7Days.map(dateStr => {
    return boxesData.filter(b => b.created_at.startsWith(dateStr)).length;
  });

  const customersCount = last7Days.map(dateStr => {
    return customersData.filter(c => c.created_at.startsWith(dateStr)).length;
  });

  const labels = last7Days.map(dateStr => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  });

  const boxesChartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Caixas Recebidas',
        data: boxesCount,
        borderColor: 'rgb(249, 115, 22)', // orange-500
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
      },
    ],
  };
  
  const custChartData = {
    labels,
    datasets: [
      {
        label: 'Novos Clientes',
        data: customersCount,
        backgroundColor: 'rgb(59, 130, 246)', // blue-500
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(9, 9, 11, 0.9)',
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(39, 39, 42, 1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#71717a' },
        grid: { color: 'rgba(39, 39, 42, 0.5)' },
        border: { display: false }
      },
      x: {
        ticks: { color: '#71717a' },
        grid: { display: false },
        border: { display: false }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg">
        <h3 className="text-base font-semibold text-white mb-4">Caixas Recebidas (Últimos 7 dias)</h3>
        <div className="h-64">
          <Line options={options} data={boxesChartData} />
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg">
        <h3 className="text-base font-semibold text-white mb-4">Novos Clientes (Últimos 7 dias)</h3>
        <div className="h-64">
          <Bar options={options} data={custChartData} />
        </div>
      </div>
    </div>
  );
}
