"use client";

import Link from "next/link";
import { 
  ArrowLeft,
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Crown,
  Percent,
  ListOrdered,
  Info,
  CheckCircle2,
  CalendarDays,
  Lock,
  Zap
} from "lucide-react";

export default function PurchaseGroupsCommissionsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 flex flex-col relative overflow-x-hidden">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <span className="text-white/50 shrink-0">/</span>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Comissões da Plataforma
            </span>
          </nav>
          
          <div className="flex items-center gap-4 min-w-0">
            <Link 
              href="/admin/purchase-groups" 
              className="w-14 h-14 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-lg shrink-0 transition"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Comissões da Plataforma</h1>
              <p className="mt-0.5 text-sm text-orange-100 truncate">Taxas e faturamento do módulo de grupos de compras</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 flex-1 w-full pb-12">
        <div className="max-w-5xl mx-auto">

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Total Vendido no Mês */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-zinc-700/50 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-zinc-300" />
                  </div>
                  <span className="text-sm font-semibold bg-zinc-800 border border-zinc-700 px-4 py-1.5 rounded-full text-zinc-300">
                    ago/2026
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mb-1">Total Vendido no Mês</p>
                <p className="text-4xl font-bold text-white">$0,00</p>
              </div>
            </div>

            {/* Taxa de Comissão Atual */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Percent className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-full">
                    Taxa Atual
                  </span>
                </div>
                <p className="text-sm text-amber-100 mb-1">Comissão da Plataforma</p>
                <p className="text-4xl font-bold text-white">2,00%</p>
                <p className="text-xs text-amber-200/80 mt-2">Plano: Starter</p>
              </div>
            </div>

            {/* Comissão a Pagar */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-full">
                    A Pagar
                  </span>
                </div>
                <p className="text-sm text-orange-100 mb-1">Comissão do Mês</p>
                <p className="text-4xl font-bold text-white">$0,00</p>
              </div>
            </div>
          </div>

          {/* Informações do Plano */}
          <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden mb-8">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Seu Plano e Comissão</h3>
                  <p className="text-sm text-zinc-400">Taxa de comissão definida no seu plano de assinatura</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Plano Atual */}
                <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">Plano Ativo</p>
                      <h4 className="text-lg font-bold text-white">Starter</h4>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Tudo que você precisa para começar a operar redirecionamento, personal shopper e grupo de compras sem quebrar a cabeça.
                  </p>
                </div>

                {/* Taxa de Comissão */}
                <div className="bg-orange-500/5 rounded-xl p-6 border border-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-orange-400 font-semibold">Taxa de Comissão Progressiva</p>
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-bold border border-orange-500/20">
                      Mensal
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-5xl font-black text-orange-500">2,00</p>
                    <span className="text-2xl font-bold text-orange-400">%</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Taxa atual baseada no volume de vendas
                  </p>
                </div>
              </div>

              {/* Tabela de Faixas de Comissão */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-zinc-500" />
                  Tabela de Comissões por Faixa de Vendas
                </h4>
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-zinc-900 border-b border-zinc-800">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Faixa de Vendas
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Taxa de Comissão
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        <tr className="bg-zinc-950">
                          <td className="px-4 py-4 text-sm text-zinc-300">
                            Até <span className="font-semibold text-white">R$ 0,00</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                              2,00%
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-xs text-zinc-500">Próxima faixa</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="mt-4 text-xs text-zinc-400 flex items-start gap-2 max-w-3xl">
                  <Info className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                  <span>Quanto mais você vende, menor é a taxa de comissão. As faixas são calculadas automaticamente com base no volume total de vendas pagas do mês.</span>
                </p>
              </div>
              
              {/* Como Funciona Box */}
              <div className="mt-8 p-5 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-white mb-2">Como funciona:</p>
                    <ul className="space-y-1.5 text-zinc-400">
                      <li>• A comissão é cobrada sobre as <strong className="text-zinc-300">vendas pagas</strong> do mês</li>
                      <li>• Fatura gerada dia <strong className="text-zinc-300">10 do mês seguinte</strong></li>
                      <li>• Vencimento: <strong className="text-zinc-300">dia 15</strong> do mesmo mês</li>
                      <li>• Taxa fixa do seu plano: <strong className="text-zinc-300">2,00%</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Como Funciona Details */}
            <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Info className="w-5 h-5 text-zinc-300" />
                </div>
                <h4 className="text-lg font-bold text-white">Detalhamento</h4>
              </div>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Taxa <strong className="text-zinc-300">fixa e previsível</strong> definida no plano</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Planos superiores podem ter <strong className="text-zinc-300">taxas menores</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Cobrança apenas sobre <strong className="text-zinc-300">vendas efetivamente pagas</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Histórico completo de <strong className="text-zinc-300">faturas e pagamentos</strong></span>
                </li>
              </ul>
            </div>

            {/* Upsell Banner (similar structure to Automation page) */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <span className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Lock className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-white">
                      Quer uma taxa menor?
                    </p>
                    <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                      Planos mais avançados podem incluir taxas de comissão reduzidas. Consulte os planos disponíveis e faça upgrade para maximizar seus lucros!
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link 
                    href="/admin/my-subscription/upgrade" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition shadow-lg shadow-amber-500/20 w-full sm:w-auto"
                  >
                    Ver Planos Disponíveis
                    <Zap className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico Mensal */}
          <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Histórico de Comissões</h4>
                  <p className="text-sm text-zinc-400">Últimos 6 meses</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-800">
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Mês</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Vendas</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Taxa</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Comissão</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  
                  {['mar/2026', 'abr/2026', 'mai/2026', 'jun/2026', 'jul/2026'].map((month) => (
                    <tr key={month} className="hover:bg-zinc-800/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-zinc-300">{month}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-zinc-400">$0,00</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-zinc-500">2,00%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-orange-500">$0,00</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                            <Info className="w-3.5 h-3.5" />
                            Não faturado
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Current Month */}
                  <tr className="bg-orange-500/5 hover:bg-orange-500/10 transition">
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">ago/2026</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-white">$0,00</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-zinc-300">2,00%</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-orange-500">$0,00</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/20">
                          <CalendarDays className="w-3.5 h-3.5" />
                          Mês atual
                        </span>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
