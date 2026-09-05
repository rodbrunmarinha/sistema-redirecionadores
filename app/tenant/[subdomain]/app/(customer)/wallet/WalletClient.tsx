'use client';

import React, { useState, useTransition } from 'react';
import { 
  Wallet, Plus, ArrowDownRight, ArrowUpRight, 
  RefreshCcw, Info, Star, CreditCard, X, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { processDeposit } from './_actions/deposit';
import { useRouter } from 'next/navigation';
import { payInvoice } from './_actions/invoice';
import { Receipt } from 'lucide-react';

type Transaction = {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  created_at: string;
  reference_type?: string | null;
  reference_id?: string | null;
};

export default function WalletClient({
  tenant,
  subdomain,
  currency,
  initialBalance,
  transactions,
  userId
}: {
  tenant: any;
  subdomain: string;
  currency: string;
  initialBalance: number;
  transactions: Transaction[];
  userId: string;
  pendingInvoices?: any[];
}) {
  const router = useRouter();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isPending, startTransition] = useTransition();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  
  const handlePayInvoice = (invoiceId: string) => {
    startTransition(async () => {
      try {
        const res = await payInvoice(invoiceId);
        if (res.success) {
          toast.success("Fatura paga com sucesso!");
          router.refresh();
        } else {
          toast.error(res.error || "Erro ao pagar fatura");
        }
      } catch (err: any) {
        toast.error(err.message || "Erro ao pagar fatura");
      }
    });
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Insira um valor válido maior que zero.");
      return;
    }

    startTransition(async () => {
      const res = await processDeposit(subdomain, { amount: amountNum });
      if (res.success) {
        toast.success(`Recarga de ${formatCurrency(amountNum)} realizada com sucesso!`);
        setIsDepositModalOpen(false);
        setDepositAmount('');
        router.refresh();
      } else {
        toast.error(res.error || "Erro ao recarregar saldo.");
      }
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><ArrowDownRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>;
      case 'PURCHASE':
        return <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0"><ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" /></div>;
      case 'REFUND':
        return <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><RefreshCcw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>;
      case 'SUBSCRIPTION':
        return <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0"><Star className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div>;
      default:
        return <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0"><Info className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'Depósito Recebido';
      case 'PURCHASE': return 'Compra Aprovada';
      case 'REFUND': return 'Reembolso';
      case 'SUBSCRIPTION': return 'Assinatura VIP';
      case 'ADJUSTMENT': return 'Ajuste Manual';
      default: return 'Transação';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-500" />
            Minha Carteira
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie seu saldo e veja o histórico de transações.</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-zinc-950 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wallet className="w-48 h-48 -rotate-12 translate-x-12 -translate-y-8" />
        </div>
        
        <div className="relative z-10">
          <p className="font-semibold mb-1 opacity-90 text-sm">Saldo Disponível</p>
          <h2 className="text-5xl font-black mb-8 tracking-tight">{formatCurrency(initialBalance)}</h2>
          
          <button 
            onClick={() => setIsDepositModalOpen(true)}
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Adicionar Saldo
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-white">Últimas Transações</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Você ainda não realizou nenhuma transação.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                  <div className="flex items-start sm:items-center gap-4">
                    {getTransactionIcon(tx.type)}
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{getTransactionLabel(tx.type)}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {tx.description || 'Transação na carteira'}
                        {tx.reference_type === 'STORE_ORDER' && tx.reference_id && (
                          <span className="inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                            ORD-{tx.reference_id.split('-')[0].toUpperCase()}
                          </span>
                        )}
                        {tx.reference_type === 'SHIPMENT' && tx.reference_id && (
                          <span className="inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                            ENV-{tx.reference_id.split('-')[0].toUpperCase()}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    ['DEPOSIT', 'REFUND'].includes(tx.type) 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-zinc-900 dark:text-white'
                  }`}>
                    {['DEPOSIT', 'REFUND'].includes(tx.type) ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
                  </p>
                  {tx.status === 'PENDING' && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                      PENDENTE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDepositModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                Adicionar Saldo
              </h3>
              <button 
                onClick={() => setIsDepositModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="p-6 space-y-6">
              
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex gap-3 text-sm text-amber-800 dark:text-amber-400">
                <Info className="w-5 h-5 shrink-0" />
                <p>O valor adicionado ficará imediatamente disponível na sua carteira para pagamento de envios ou compras na loja.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                  Valor da Recarga
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-zinc-500 font-bold">{currency === 'USD' ? '$' : currency === 'BRL' ? 'R$' : '¥'}</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    disabled={isPending}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xl font-bold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[50, 100, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      disabled={isPending}
                      onClick={() => setDepositAmount(val.toString())}
                      className="py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition disabled:opacity-50"
                    >
                      +{val}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? (
                  <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    Confirmar Pagamento
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
