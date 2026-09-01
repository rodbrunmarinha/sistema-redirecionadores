"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  User, 
  Plus, 
  Minus, 
  ArrowDownRight, 
  ArrowUpRight,
  Download,
  FileText,
  X,
  AlertCircle
} from "lucide-react";

type TransactionMeta = Record<string, any>;

interface Transaction {
  id: string;
  date: string;
  time: string;
  type: string;
  description: string;
  reference: string;
  value: number;
  balanceAfter: number;
  balanceBefore: number;
  status: string;
  meta: TransactionMeta;
}

interface WalletStats {
  totalIn: number;
  totalOut: number;
  monthIn: number;
  monthOut: number;
}

interface WalletData {
  id: string;
  customerName: string;
  suite: string;
  email: string;
  initials: string;
  availableBalance: number;
  stats: WalletStats;
  transactions: Transaction[];
}

interface WalletDetailClientProps {
  wallet: WalletData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'JPY', // ou BRL dependendo da configuração
  }).format(value);
};

const formatMetaKey = (key: string) => {
  const labels: Record<string, string> = {
    admin_name: 'Operador',
    reason: 'Motivo',
    internal_notes: 'Notas internas',
    ip_address: 'IP',
    company: 'Empresa',
    company_name: 'Empresa',
    glin_remittance_id: 'Remessa Glin',
    glin_status: 'Status Glin',
    glin_amount: 'Valor Glin',
    glin_currency: 'Moeda Glin',
    glin_event: 'Evento Glin',
    glin_payment_id: 'ID Pagamento Glin',
    reference: 'Referência',
    gateway: 'Gateway',
    order_id: 'ID Pedido',
    transaction_id: 'ID Transação',
    payment_method: 'Método de Pagamento',
    shipment_request_id: 'Solicitação de Envio',
    purchase_order_id: 'Ordem de Compra',
  };
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function WalletDetailClient({ wallet }: WalletDetailClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [metaData, setMetaData] = useState<TransactionMeta | null>(null);

  const [addAmount, setAddAmount] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value) { 
      setter(''); 
      return; 
    }
    let numValue = parseInt(value, 10) / 100;
    setter(numValue.toFixed(2));
  };

  const openMetaModal = (meta: TransactionMeta) => {
    setMetaData(meta);
    setIsMetaModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Profile Section */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-6 text-zinc-400" aria-label="Breadcrumb">
            <Link href="/admin/dashboard" className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href="/admin/wallets" className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Créditos
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-100 font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              {wallet.customerName}
            </span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Client Info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-500 font-bold text-xl shadow-lg shrink-0">
                {wallet.initials}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 truncate">{wallet.customerName}</h1>
                <p className="text-zinc-400 text-sm truncate">
                  {wallet.suite} • {wallet.email}
                </p>
                <Link href={`/admin/clients/${wallet.id}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-2.5 py-1 transition">
                  <User className="w-3.5 h-3.5" />
                  Ver ficha do cliente
                </Link>
              </div>
            </div>

            {/* Balance */}
            <div className="shrink-0 lg:text-right">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Saldo Disponível</p>
              <p className="text-3xl sm:text-4xl font-bold text-zinc-100 mt-1">{formatCurrency(wallet.availableBalance)}</p>
              <div className="flex gap-2 mt-3 lg:justify-end">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 hover:bg-amber-600 rounded-xl text-sm font-bold transition shadow-lg active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
                <button 
                  onClick={() => setIsRemoveModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 rounded-xl text-sm font-semibold transition"
                >
                  <Minus className="w-4 h-4" />
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 border-t-2 border-t-emerald-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-xs text-zinc-400">Total Entradas</p>
            </div>
            <p className="text-lg font-bold text-emerald-500">{formatCurrency(wallet.stats.totalIn)}</p>
          </div>
          
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 border-t-2 border-t-red-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
              </div>
              <p className="text-xs text-zinc-400">Total Saídas</p>
            </div>
            <p className="text-lg font-bold text-red-500">{formatCurrency(wallet.stats.totalOut)}</p>
          </div>
          
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 border-t-2 border-t-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <p className="text-xs text-zinc-400">Entradas (mês)</p>
            </div>
            <p className="text-lg font-bold text-zinc-100">{formatCurrency(wallet.stats.monthIn)}</p>
          </div>
          
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 border-t-2 border-t-zinc-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-400">Saídas (mês)</p>
            </div>
            <p className="text-lg font-bold text-zinc-100">{formatCurrency(wallet.stats.monthOut)}</p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="font-semibold text-lg text-zinc-100">Histórico de Movimentações</h3>
              
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition">
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800">
            <form className="flex flex-wrap gap-3" onSubmit={(e) => e.preventDefault()}>
              <select className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none">
                <option value="">Todos os tipos</option>
                <option value="deposit">Depósito</option>
                <option value="spend">Consumo</option>
                <option value="refund">Estorno</option>
                <option value="adjustment">Ajuste</option>
              </select>
              
              <select className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none">
                <option value="">Todos os status</option>
                <option value="confirmed">Confirmado</option>
                <option value="pending">Pendente</option>
                <option value="canceled">Cancelado</option>
              </select>
              
              <select className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" defaultValue="30">
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>

              <div className="relative flex-1 min-w-[200px]">
                <input 
                  type="text" 
                  placeholder="Buscar por descrição ou referência..." 
                  className="w-full pl-3 pr-8 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder:text-zinc-500"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-[10px] font-semibold text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded border border-zinc-600">
                  /
                </kbd>
              </div>
              
              <button type="submit" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition">
                Filtrar
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Saldo após</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/50">
                {wallet.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-zinc-100">{tx.date}</p>
                      <p className="text-xs text-zinc-500">{tx.time}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.type === "spend" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Consumo
                        </span>
                      )}
                      {tx.type === "adjustment" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          Ajuste
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-zinc-100 truncate" title={tx.description}>{tx.description}</p>
                      <p className="text-xs text-zinc-500 font-mono truncate" title={tx.reference}>{tx.reference}</p>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-base font-bold ${tx.value < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        <span className="text-lg">{tx.value < 0 ? '-' : '+'}</span>
                        {formatCurrency(Math.abs(tx.value))}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <p className="text-sm font-semibold text-zinc-100">{formatCurrency(tx.balanceAfter)}</p>
                      <p className="text-xs text-zinc-500">antes: {formatCurrency(tx.balanceBefore)}</p>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {tx.status === "confirmed" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          Confirmado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => openMetaModal(tx.meta)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Credits Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-zinc-100">Adicionar Créditos</h3>
                <p className="text-sm text-zinc-400">Para {wallet.customerName}</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Valor *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">¥</span>
                    <input 
                      type="text" 
                      required 
                      value={addAmount}
                      onChange={(e) => handleAmountChange(e, setAddAmount)}
                      className="w-full pl-8 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-lg font-semibold text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder:text-zinc-600"
                      placeholder="0.00" 
                      inputMode="numeric"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Digite o valor (ex: 2550 = 25.50)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Motivo *</label>
                  <select required className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none">
                    <option value="">Selecione...</option>
                    <option value="bonus">Bônus</option>
                    <option value="pre_deposit">Pré-depósito</option>
                    <option value="compensation">Compensação</option>
                    <option value="correction">Correção</option>
                    <option value="promotion">Promoção</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição para o cliente *</label>
                  <input type="text" required maxLength={255} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder:text-zinc-600" placeholder="Ex: Bônus de boas-vindas" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Notas internas (opcional)</label>
                  <textarea rows={2} maxLength={500} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder:text-zinc-600 resize-none" placeholder="Visível apenas para administradores..."></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl font-bold transition">
                  Adicionar Créditos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Credits Modal */}
      {isRemoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsRemoveModalOpen(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Minus className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-zinc-100">Remover Créditos</h3>
                <p className="text-sm text-zinc-400">Saldo disponível: <strong className="text-emerald-500">{formatCurrency(wallet.availableBalance)}</strong></p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsRemoveModalOpen(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Valor *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">¥</span>
                    <input 
                      type="text" 
                      required 
                      value={removeAmount}
                      onChange={(e) => handleAmountChange(e, setRemoveAmount)}
                      className="w-full pl-8 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-lg font-semibold text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder:text-zinc-600"
                      placeholder="0.00" 
                      inputMode="numeric"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Máximo: {formatCurrency(wallet.availableBalance)} • Digite em centavos (ex: 2550 = 25.50)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Motivo *</label>
                  <select required className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none">
                    <option value="">Selecione...</option>
                    <option value="chargeback">Chargeback</option>
                    <option value="correction">Correção</option>
                    <option value="fee">Taxa</option>
                    <option value="penalty">Penalidade</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição para o cliente *</label>
                  <input type="text" required maxLength={255} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder:text-zinc-600" placeholder="Ex: Correção de valor" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Notas internas (opcional)</label>
                  <textarea rows={2} maxLength={500} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder:text-zinc-600 resize-none" placeholder="Visível apenas para administradores..."></textarea>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-500">Esta ação não pode ser desfeita. O valor será debitado imediatamente.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsRemoveModalOpen(false)} className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition">
                  Remover Créditos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meta Modal */}
      {isMetaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMetaModalOpen(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-100">Detalhes da Transação</h3>
              </div>
              <button onClick={() => setIsMetaModalOpen(false)} className="p-1.5 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-1 text-sm max-h-96 overflow-y-auto pr-1">
              {!metaData || Object.keys(metaData).length === 0 ? (
                <p className="text-center text-zinc-500 py-4">Nenhuma informação adicional.</p>
              ) : (
                Object.entries(metaData).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-3 py-2.5 border-b border-zinc-800/50 last:border-0">
                    <span className="text-zinc-500 text-xs w-36 flex-shrink-0 pt-0.5">{formatMetaKey(key)}</span>
                    <span className="font-mono text-xs text-zinc-300 break-all bg-zinc-950 px-2 py-1 rounded-lg flex-1 border border-zinc-800/50">
                      {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
