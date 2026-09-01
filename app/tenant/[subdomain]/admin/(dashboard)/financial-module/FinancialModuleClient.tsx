"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createFinancialTransaction } from '@/app/actions/financialActions';
import toast from 'react-hot-toast';
import { useTransition } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  Calendar,
  Download,
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  X,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  Mail,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function FinancialModuleClient({ subdomain }: { subdomain: string }) {
  const [isPending, startTransition] = useTransition();
  const [period, setPeriod] = useState('month');
  const [customOpen, setCustomOpen] = useState(false);
  const [openExplain, setOpenExplain] = useState(false);

  // Revenue Modal
  const [revenueModalOpen, setRevenueModalOpen] = useState(false);
  const [revenueForm, setRevenueForm] = useState({
    description: '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
  });

  // Expense Modal
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    category: '',
    customCategoryName: '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
  });

  // Chart data
  const monthlyData = {
    labels: ['set/25','out/25','nov/25','dez/25','jan/26','fev/26','mar/26','abr/26','mai/26','jun/26','jul/26','ago/26'],
    datasets: [
      {
        label: 'Receitas',
        data: [0,0,0,0,0,0,0,0,0,0,0,0],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Despesas',
        data: [0,0,0,0,0,0,0,0,0,0,0,0],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#a1a1aa',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#a1a1aa',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 shadow-lg shadow-orange-900/20">
        <div className="absolute -top-14 -right-14 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3">
            <Link href={`/admin`} className="text-white/70 hover:text-white transition-colors truncate">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate">Módulo Financeiro</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm border border-white/20">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                  Módulo Financeiro
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    ⭐ Enterprise
                  </span>
                </h1>
                <p className="text-emerald-100 text-sm mt-0.5">Controle financeiro completo — receitas, despesas e análise de resultados</p>
              </div>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2 flex-wrap relative">
              {['Este mês', 'Mês anterior', 'Trimestre', 'Este ano'].map((label, idx) => (
                <button key={idx} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${idx === 0 ? 'bg-white text-emerald-700 shadow-md' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}>
                  {label}
                </button>
              ))}
              
              <div className="relative">
                <button onClick={() => setCustomOpen(!customOpen)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap bg-white/20 text-white hover:bg-white/30 border border-white/30 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Personalizado
                </button>
                {customOpen && (
                  <div className="absolute right-0 mt-2 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-4 z-50 w-64">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Data inicial</label>
                        <input type="date" defaultValue="2026-08-01" className="w-full mt-1 rounded-lg border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Data final</label>
                        <input type="date" defaultValue="2026-08-31" className="w-full mt-1 rounded-lg border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500" />
                      </div>
                      <button className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg text-sm font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/25">
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/20 text-white hover:bg-white/30 border border-white/30 transition-all duration-200 whitespace-nowrap">
                <Download className="w-3.5 h-3.5" />
                Exportar DRE
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">$0,00</p>
            <p className="text-xs text-zinc-400 mt-1">Receita Total</p>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">$0,00</p>
            <p className="text-xs text-zinc-400 mt-1">Despesas Totais</p>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">$0,00</p>
            <p className="text-xs text-zinc-400 mt-1">Lucro Líquido</p>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-violet-500/10 text-violet-500 border border-violet-500/20">
                <PieChart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">0.0%</p>
            <p className="text-xs text-zinc-400 mt-1">Margem de Lucro</p>
          </div>
        </div>

        {/* Explain Card */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          <button onClick={() => setOpenExplain(!openExplain)} className="w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-zinc-800 transition">
            <span className="flex items-center gap-2.5 min-w-0">
              <Info className="w-5 h-5 text-orange-500 shrink-0" />
              <span className="text-sm font-semibold text-zinc-300 truncate">Como estes números são calculados?</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${openExplain ? 'rotate-180' : ''}`} />
          </button>
          
          {openExplain && (
            <div className="px-5 pb-5 border-t border-zinc-800 pt-4">
              <p className="text-sm text-zinc-400">O módulo considera apenas dinheiro efetivamente movimentado, atribuído ao período pela data do pagamento. Valores reembolsados/estornados e pedidos cancelados ficam de fora automaticamente.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" /> Receitas — o que entra
                  </p>
                  <ul className="space-y-1.5 text-sm text-zinc-300 list-disc list-inside">
                    <li>Envios: valor do frete + taxa de serviço dos envios com pagamento confirmado.</li>
                    <li>Ordens de Serviço: valor total das ordens pagas ou concluídas.</li>
                    <li>Compras Assistidas: taxa de serviço das compras pagas.</li>
                    <li>Grupos de Compra: taxa de serviço dos pedidos pagos.</li>
                    <li>Loja Online: total dos pedidos pagos.</li>
                    <li>Receita Manual: lançamentos de receita registrados neste módulo.</li>
                  </ul>
                </div>
                
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4" /> Despesas — o que entra
                  </p>
                  <ul className="space-y-1.5 text-sm text-zinc-300 list-disc list-inside">
                    <li>Despesas manuais lançadas neste módulo (pela data da transação).</li>
                    <li>Custo de mercadorias e frete das Ordens de Serviço pagas (automático).</li>
                    <li>Custo de transportadora dos envios pagos (automático).</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-4 italic">Lucro Líquido = Receita − Despesas. Margem = Lucro ÷ Receita.</p>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Evolução Mensal</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Receitas vs Despesas — últimos 12 meses</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> Receitas
                </span>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Despesas
                </span>
              </div>
            </div>
            <div className="relative h-64">
              <Bar data={monthlyData} options={chartOptions as any} />
            </div>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
            <div className="mb-4">
              <h3 className="font-semibold text-white">Despesas por Categoria</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Período selecionado</p>
            </div>
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <FileText className="w-10 h-10 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500">Sem despesas registradas</p>
            </div>
          </div>
        </div>

        {/* Revenue & Expense Management */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Revenue Source */}
          <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
            <div className="flex items-start justify-between mb-6 gap-2">
              <div>
                <h3 className="font-semibold text-white">Receitas por Fonte</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Período selecionado</p>
              </div>
              <button onClick={() => setRevenueModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg text-xs font-semibold hover:bg-orange-500/20 transition flex-shrink-0">
                <Plus className="w-3.5 h-3.5" /> Receita
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Envios', color: 'bg-blue-500' },
                { label: 'Ordens de Serviço', color: 'bg-purple-500' },
                { label: 'Compras Assistidas', color: 'bg-cyan-500' },
                { label: 'Grupo de Compras', color: 'bg-amber-500' },
                { label: 'Loja Online', color: 'bg-orange-500' },
                { label: 'Receita Manual', color: 'bg-indigo-500' },
              ].map((src, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 font-medium">{src.label}</span>
                    <span className="font-semibold text-white">—</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${src.color}`} style={{ width: '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div className="lg:col-span-3 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Gestão de Despesas</h3>
                <p className="text-xs text-zinc-500 mt-0.5">0 registros no período</p>
              </div>
              <button onClick={() => setExpenseModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20">
                <Plus className="w-4 h-4" /> Nova Despesa
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-white">Nenhuma despesa registrada</p>
              <p className="text-xs text-zinc-500 mt-1">Clique em "Nova Despesa" para começar</p>
            </div>
          </div>
        </div>

      </div>


      {/* Revenue Modal */}
      {revenueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRevenueModalOpen(false)}></div>
          <div className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-800">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Nova Receita Manual</h3>
              <button onClick={() => setRevenueModalOpen(false)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-4" action={(formData) => {
              formData.append('type', 'revenue');
              startTransition(async () => {
                const result = await createFinancialTransaction(formData);
                if (result.error) {
                  toast.error(result.error);
                } else {
                  toast.success('Receita registrada com sucesso!');
                  setRevenueModalOpen(false);
                  setRevenueForm({...revenueForm, description: '', amount: '', reference: '', notes: ''});
                }
              });
            }}>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição <span className="text-red-500">*</span></label>
                <input type="text" name="description" value={revenueForm.description} onChange={e => setRevenueForm({...revenueForm, description: e.target.value})} required maxLength={500} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" placeholder="Ex.: Consultoria, reembolso recebido..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Valor (USD) <span className="text-red-500">*</span></label>
                  <input type="number" name="amount" value={revenueForm.amount} onChange={e => setRevenueForm({...revenueForm, amount: e.target.value})} required min="0.01" step="0.01" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Data <span className="text-red-500">*</span></label>
                  <input type="date" name="transaction_date" value={revenueForm.transaction_date} onChange={e => setRevenueForm({...revenueForm, transaction_date: e.target.value})} required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Referência</label>
                <input type="text" name="reference" value={revenueForm.reference} onChange={e => setRevenueForm({...revenueForm, reference: e.target.value})} maxLength={100} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" placeholder="NF-001, Contrato..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Observações</label>
                <textarea name="notes" value={revenueForm.notes} onChange={e => setRevenueForm({...revenueForm, notes: e.target.value})} rows={2} maxLength={2000} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-none" placeholder="Informações adicionais..."></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Comprovante</label>
                <input type="file" name="attachment" accept=".jpg,.jpeg,.png,.webp,.pdf" className="block w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20 cursor-pointer" />
                <p className="mt-1 text-xs text-zinc-500">Imagem ou PDF, até 8 MB.</p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setRevenueModalOpen(false)} className="flex-1 py-2.5 border border-zinc-700 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-800 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20">
                  Registrar Receita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExpenseModalOpen(false)}></div>
          <div className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-800">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Nova Despesa</h3>
              <button onClick={() => setExpenseModalOpen(false)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="p-6 space-y-4" action={(formData) => {
              formData.append('type', 'expense');
              if (expenseForm.category === '__new__') {
                formData.set('category', expenseForm.customCategoryName);
              }
              startTransition(async () => {
                const result = await createFinancialTransaction(formData);
                if (result.error) {
                  toast.error(result.error);
                } else {
                  toast.success('Despesa registrada com sucesso!');
                  setExpenseModalOpen(false);
                  setExpenseForm({...expenseForm, description: '', amount: '', reference: '', notes: ''});
                }
              });
            }}>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição <span className="text-red-500">*</span></label>
                <input type="text" name="description" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} required maxLength={500} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" placeholder="Ex: Aluguel do armazém — julho/2025" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Categoria <span className="text-red-500">*</span></label>
                  <select name="category" value={expenseForm.category} onChange={e => {
                    const val = e.target.value;
                    setExpenseForm(prev => ({...prev, category: val, customCategoryName: val !== '__new__' ? '' : prev.customCategoryName}));
                  }} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Selecione...</option>
                    <option value="folha_de_pagamento">Folha de Pagamento</option>
                    <option value="aluguel">Aluguel</option>
                    <option value="marketing">Marketing</option>
                    <option value="operacional">Operacional</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="impostos">Impostos</option>
                    <option value="logistica">Logística</option>
                    <option value="outros">Outros</option>
                    <option value="__new__">✦ Nova categoria...</option>
                  </select>
                  {expenseForm.category === '__new__' && (
                    <div className="mt-2">
                      <input type="text" name="category" value={expenseForm.customCategoryName} onChange={e => setExpenseForm({...expenseForm, customCategoryName: e.target.value})} required maxLength={100} placeholder="Nome da nova categoria" className="w-full rounded-xl border border-orange-500/50 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Valor (USD) <span className="text-red-500">*</span></label>
                  <input type="number" name="amount" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} required min="0.01" step="0.01" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" placeholder="0.00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Data <span className="text-red-500">*</span></label>
                  <input type="date" name="transaction_date" value={expenseForm.transaction_date} onChange={e => setExpenseForm({...expenseForm, transaction_date: e.target.value})} required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Referência</label>
                  <input type="text" name="reference" value={expenseForm.reference} onChange={e => setExpenseForm({...expenseForm, reference: e.target.value})} maxLength={100} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" placeholder="NF-001, Contrato..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Observações</label>
                <textarea name="notes" value={expenseForm.notes} onChange={e => setExpenseForm({...expenseForm, notes: e.target.value})} rows={2} maxLength={2000} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-none" placeholder="Informações adicionais..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Comprovante</label>
                <input type="file" name="attachment" accept=".jpg,.jpeg,.png,.webp,.pdf" className="block w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20 cursor-pointer" />
                <p className="mt-1 text-xs text-zinc-500">Imagem ou PDF, até 8 MB.</p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setExpenseModalOpen(false)} className="flex-1 py-2.5 border border-zinc-700 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-800 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20">
                  Registrar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

