"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Plus, Search, ExternalLink, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Trash2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { payAssistedPurchase, payExtraAmountAssistedPurchase, deleteAssistedPurchase } from './_actions';
import { useTenantSettings } from '../components/TenantSettingsContext';

function ProductImagePreview({ url }: { url: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  
  React.useEffect(() => {
    import('./_actions').then(m => {
       m.getProductOgImage(url).then(res => {
          if (res) setImgUrl(res);
       });
    });
  }, [url]);

  if (!imgUrl) return (
     <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
       <ShoppingBag className="w-6 h-6 text-zinc-300" />
     </div>
  );
  
  return (
    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-200 bg-white">
      <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
    </div>
  );
}

export default function OnlinePurchasesClient({ 
  tenant, 
  purchases, 
  userId,
  balance
}: { 
  tenant: any; 
  purchases: any[]; 
  userId: string;
  balance: number;
}) {
  const [filter, setFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { settings } = useTenantSettings();
  const currency = settings?.operations?.currency || "USD";

  const handlePay = async (id: string, amount: number) => {
    if (balance < amount) {
      toast.error(`Saldo insuficiente na carteira. Valor necessário: ${currency} ${amount.toFixed(2)}`);
      return;
    }

    setIsProcessing(id);
    const res = await payAssistedPurchase(tenant.id, userId, id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Pagamento realizado! O lojista fará a compra em breve.");
    }
    setIsProcessing(null);
  };

  const handlePayExtra = async (id: string, amount: number) => {
    if (balance < amount) {
      toast.error(`Saldo insuficiente na carteira. Valor necessário: ${currency} ${amount.toFixed(2)}`);
      return;
    }

    setIsProcessing(id);
    const res = await payExtraAmountAssistedPurchase(tenant.id, userId, id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Valor extra pago! A compra seguirá.");
    }
    setIsProcessing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;
    setIsProcessing(id);
    const res = await deleteAssistedPurchase(tenant.id, userId, id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Solicitação excluída com sucesso!");
    }
    setIsProcessing(null);
  };

  const filteredPurchases = purchases.filter(p => filter === 'ALL' || p.status === filter);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING_PAYMENT': return <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">Aguardando Pagamento</span>;
      case 'PAID_PENDING_PURCHASE': return <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">Pago / Aguardando Compra</span>;
      case 'PENDING_EXTRA_PAYMENT': return <span className="px-2 py-1 rounded-md bg-rose-100 text-rose-700 text-xs font-semibold">Aguardando Pgto Extra</span>;
      case 'PURCHASED': return <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-semibold">Compra Efetuada</span>;
      case 'OUT_OF_STOCK': return <span className="px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-semibold">Esgotado (Reembolsado)</span>;
      case 'CANCELLED': return <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-semibold">Cancelado (Reembolsado)</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER CARD - BLUE / LIGHT THEME FOR CLIENT */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-md mb-4 border border-white/10">
            <ShoppingBag className="w-4 h-4 text-blue-100" />
            <span className="text-blue-50">Serviço de</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Compra Assistida</h1>
          <p className="text-blue-100 max-w-xl text-sm sm:text-base">
            Envie o link e deixe que nós compramos para você! Todo o processo é acompanhado diretamente pelo sistema e pago de forma segura com o saldo da sua carteira.
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-3 shrink-0 w-full md:w-auto">
          <Link 
            href="/app/online-purchases/create"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-50 transition shadow-lg w-full justify-center"
          >
            <Plus className="w-5 h-5" />
            Nova Solicitação
          </Link>
          <div className="flex flex-col items-center justify-center w-full bg-black/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm gap-1">
            <span className="text-sm text-blue-100 font-medium">Saldo: <b className="text-white ml-1">{currency} {balance.toFixed(2)}</b></span>
            <Link 
              href="/app/wallet/add-credits" 
              className="text-xs font-bold text-white hover:text-blue-200 transition underline underline-offset-2 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Adicionar
            </Link>
          </div>
        </div>
        
        {/* Decorators */}
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ShoppingBag className="w-64 h-64 transform rotate-12 translate-x-12 -translate-y-12" />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-sm border border-zinc-200 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {['ALL', 'PENDING_PAYMENT', 'PAID_PENDING_PURCHASE', 'PENDING_EXTRA_PAYMENT', 'PURCHASED', 'OUT_OF_STOCK', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === status ? 'bg-blue-50 text-blue-700' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              {status === 'ALL' ? 'Todos' : 
               status === 'PENDING_PAYMENT' ? 'Aguardando Pagamento' : 
               status === 'PAID_PENDING_PURCHASE' ? 'Aguardando Compra' : 
               status === 'PENDING_EXTRA_PAYMENT' ? 'Aguardando Extra' : 
               status === 'PURCHASED' ? 'Comprado' : 
               status === 'OUT_OF_STOCK' ? 'Esgotados' : 'Cancelados'}
            </button>
          ))}
        </div>
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Nenhuma solicitação encontrada</h3>
          <p className="text-zinc-500 mb-6 max-w-md">Você ainda não tem compras assistidas neste status.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPurchases.map(purchase => (
            <div key={purchase.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                {getStatusBadge(purchase.status)}
                <span className="text-xs text-zinc-400 font-medium">
                  {new Date(purchase.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="flex gap-3 mb-3">
                <ProductImagePreview url={purchase.product_url} />
                <div>
                  <h3 className="font-bold text-zinc-900 line-clamp-2 mb-1" title={purchase.product_name}>
                    {purchase.product_name}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-1">
                    {purchase.product_options || 'Sem opções'} • Qtd: {purchase.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-zinc-500">Valor Unitário</span>
                <span className="font-semibold text-zinc-900">{currency} {purchase.unit_price.toFixed(2)}</span>
              </div>

              {purchase.admin_notes && (
                <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2 items-start text-sm text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{purchase.admin_notes}</p>
                </div>
              )}

              <div className="border-t border-zinc-100 pt-4 mt-auto">
                {purchase.status === 'PENDING_PAYMENT' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePay(purchase.id, purchase.unit_price * purchase.quantity)}
                      disabled={isProcessing === purchase.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pagar {currency} {(purchase.unit_price * purchase.quantity).toFixed(2)}
                    </button>
                    <button
                      onClick={() => handleDelete(purchase.id)}
                      disabled={isProcessing === purchase.id}
                      className="flex items-center justify-center shrink-0 w-[44px] h-[44px] bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition disabled:opacity-50"
                      title="Excluir solicitação"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {purchase.status === 'PENDING_EXTRA_PAYMENT' && (
                  <button
                    onClick={() => handlePayExtra(purchase.id, purchase.extra_amount_requested)}
                    disabled={isProcessing === purchase.id}
                    className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-rose-700 transition disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pagar Extra: {currency} {purchase.extra_amount_requested.toFixed(2)}
                  </button>
                )}

                {(purchase.status === 'PAID_PENDING_PURCHASE' || purchase.status === 'PURCHASED' || purchase.status === 'OUT_OF_STOCK' || purchase.status === 'CANCELLED') && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-900">
                      Total Pago: {currency} {purchase.total_paid.toFixed(2)}
                    </span>
                    <a 
                      href={purchase.product_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition"
                      title="Ver Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
