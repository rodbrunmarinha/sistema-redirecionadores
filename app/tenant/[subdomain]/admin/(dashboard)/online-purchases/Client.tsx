"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, ExternalLink, CreditCard, XCircle, AlertCircle, ShoppingCart, Info, User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { markAsPurchased, requestExtraPayment, markAsOutOfStock } from './_actions';
import { useTenantSettings } from '../../../app/(customer)/components/TenantSettingsContext';

function ProductImagePreview({ url }: { url: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  
  React.useEffect(() => {
    import('../../../app/(customer)/online-purchases/_actions').then(m => {
       m.getProductOgImage(url).then(res => {
          if (res) setImgUrl(res);
       });
    });
  }, [url]);

  if (!imgUrl) return (
     <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
       <ShoppingBag className="w-6 h-6 text-zinc-600" />
     </div>
  );
  
  return (
    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-900">
      <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
    </div>
  );
}

export default function AdminOnlinePurchasesClient({ 
  tenantId, 
  purchases 
}: { 
  tenantId: string; 
  purchases: any[]; 
}) {
  const [filter, setFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Extra payment modal state
  const [extraModalOpen, setExtraModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [extraAmount, setExtraAmount] = useState('');
  const [extraNote, setExtraNote] = useState('');

  const { settings } = useTenantSettings();
  const currency = settings?.operations?.currency || "USD";

  const handlePurchase = async (id: string) => {
    if (!confirm("Confirmar que você já realizou a compra deste produto?")) return;
    setIsProcessing(id);
    const res = await markAsPurchased(tenantId, id);
    if (res?.error) toast.error(res.error);
    else toast.success("Marcado como comprado!");
    setIsProcessing(null);
  };

  const handleOutOfStock = async (id: string) => {
    if (!confirm("O produto está esgotado? O valor será ESTORNADO imediatamente para a carteira do cliente. Confirmar?")) return;
    setIsProcessing(id);
    const res = await markAsOutOfStock(tenantId, id);
    if (res?.error) toast.error(res.error);
    else toast.success("Compra cancelada e estornada com sucesso.");
    setIsProcessing(null);
  };

  const handleOpenExtraModal = (purchase: any) => {
    setSelectedPurchase(purchase);
    setExtraAmount('');
    setExtraNote('');
    setExtraModalOpen(true);
  };

  const handleSubmitExtra = async () => {
    if (!extraAmount || parseFloat(extraAmount) <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    setIsProcessing(selectedPurchase.id);
    const res = await requestExtraPayment(tenantId, selectedPurchase.id, parseFloat(extraAmount), extraNote);
    if (res?.error) toast.error(res.error);
    else toast.success("Cobrança extra enviada ao cliente.");
    setExtraModalOpen(false);
    setIsProcessing(null);
  };

  const filteredPurchases = purchases.filter(p => filter === 'ALL' || p.status === filter);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING_PAYMENT': return <span className="px-2 py-1 rounded-md bg-amber-100/10 text-amber-500 border border-amber-500/20 text-xs font-semibold">Aguardando Pagamento do Cliente</span>;
      case 'PAID_PENDING_PURCHASE': return <span className="px-2 py-1 rounded-md bg-emerald-100/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold">Aguardando Sua Compra</span>;
      case 'PENDING_EXTRA_PAYMENT': return <span className="px-2 py-1 rounded-md bg-rose-100/10 text-rose-500 border border-rose-500/20 text-xs font-semibold">Aguardando Pgto Extra do Cliente</span>;
      case 'PURCHASED': return <span className="px-2 py-1 rounded-md bg-blue-100/10 text-blue-500 border border-blue-500/20 text-xs font-semibold">Compra Efetuada</span>;
      case 'OUT_OF_STOCK': return <span className="px-2 py-1 rounded-md bg-zinc-100/10 text-zinc-500 border border-zinc-500/20 text-xs font-semibold">Esgotado (Reembolsado)</span>;
      case 'CANCELLED': return <span className="px-2 py-1 rounded-md bg-red-100/10 text-red-500 border border-red-500/20 text-xs font-semibold">Cancelado (Reembolsado)</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER CARD - DARK / AMBER THEME FOR ADMIN */}
      <div className="bg-zinc-950 rounded-3xl p-8 sm:p-10 text-white border border-zinc-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-black/50">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full text-sm font-medium border border-amber-500/20 mb-4 text-amber-500">
            <ShoppingBag className="w-4 h-4" />
            <span>Gestão de</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Compra Assistida</h1>
          <p className="text-zinc-400 max-w-xl text-sm sm:text-base">
            Gerencie as solicitações de compra dos clientes. Após o cliente pagar o valor estimado, o pedido aparecerá como "Aguardando Sua Compra". Se o custo real for maior, você pode cobrar a diferença diretamente na carteira dele.
          </p>
        </div>
        
        {/* Decorators */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShoppingCart className="w-64 h-64 transform rotate-12 translate-x-12 -translate-y-12" />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-zinc-900 rounded-2xl p-2 border border-zinc-800 overflow-x-auto">
        {['ALL', 'PAID_PENDING_PURCHASE', 'PENDING_PAYMENT', 'PENDING_EXTRA_PAYMENT', 'PURCHASED', 'OUT_OF_STOCK', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${filter === status ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            {status === 'ALL' ? 'Todos' : 
             status === 'PENDING_PAYMENT' ? 'Aguard. Cliente (Inicial)' : 
             status === 'PAID_PENDING_PURCHASE' ? 'Aguard. Sua Compra' : 
             status === 'PENDING_EXTRA_PAYMENT' ? 'Aguard. Cliente (Extra)' : 
             status === 'PURCHASED' ? 'Finalizados' :
             status === 'OUT_OF_STOCK' ? 'Esgotados' : 'Cancelados'}
          </button>
        ))}
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma solicitação encontrada</h3>
          <p className="text-zinc-400 mb-6 max-w-md">Não há pedidos de compra assistida neste status no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPurchases.map(purchase => (
            <div key={purchase.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 hover:border-zinc-700 transition flex flex-col">
              <div className="flex justify-between items-start mb-3">
                {getStatusBadge(purchase.status)}
                <span className="text-xs text-zinc-500 font-medium shrink-0 ml-2">
                  {new Date(purchase.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-3 text-sm text-zinc-300">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="font-semibold">{purchase.profiles?.full_name}</span>
                <span className="text-zinc-500 text-xs bg-zinc-800 px-2 py-0.5 rounded-full">Dock {purchase.profiles?.suite_number}</span>
              </div>

              <div className="flex gap-3 mb-3">
                <ProductImagePreview url={purchase.product_url} />
                <div>
                  <h3 className="font-bold text-white line-clamp-2 mb-1" title={purchase.product_name}>
                    {purchase.product_name}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-1">
                    {purchase.product_options || 'Sem opções'} • Qtd: {purchase.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Total Pré-Pago</span>
                <span className="font-bold text-emerald-400">{currency} {purchase.total_paid.toFixed(2)}</span>
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-auto">
                {purchase.status === 'PAID_PENDING_PURCHASE' && (
                  <div className="flex flex-col gap-2">
                    <a 
                      href={purchase.product_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-700 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Acessar Loja
                    </a>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePurchase(purchase.id)}
                        disabled={isProcessing === purchase.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-zinc-950 px-4 py-2.5 rounded-xl font-bold hover:bg-amber-400 transition disabled:opacity-50"
                      >
                        Já Comprei
                      </button>
                      <button
                        onClick={() => handleOpenExtraModal(purchase)}
                        disabled={isProcessing === purchase.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-700 transition disabled:opacity-50"
                      >
                        Cobrar Extra
                      </button>
                    </div>
                    <button
                      onClick={() => handleOutOfStock(purchase.id)}
                      disabled={isProcessing === purchase.id}
                      className="w-full flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-2.5 rounded-xl font-bold hover:bg-rose-500/20 transition disabled:opacity-50 mt-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Esgotado (Estornar)
                    </button>
                  </div>
                )}

                {purchase.status !== 'PAID_PENDING_PURCHASE' && (
                  <a 
                    href={purchase.product_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-700 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver Link do Produto
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra Payment Modal */}
      {extraModalOpen && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setExtraModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Cobrar Valor Extra</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Houve diferença de frete ou taxas na loja? Cobre a diferença. O cliente será notificado e a compra ficará aguardando esse novo pagamento.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Valor Extra ({currency})</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={extraAmount}
                  onChange={e => setExtraAmount(e.target.value)}
                  placeholder="Ex: 5.00"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Motivo / Observação</label>
                <textarea 
                  value={extraNote}
                  onChange={e => setExtraNote(e.target.value)}
                  placeholder="Ex: Frete interno da loja de .00 não incluso no valor inicial."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 px-4 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none h-24"
                ></textarea>
              </div>

              <button
                onClick={handleSubmitExtra}
                disabled={isProcessing === selectedPurchase.id}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-zinc-950 px-6 py-3.5 rounded-xl font-bold hover:bg-amber-400 transition mt-2 disabled:opacity-50"
              >
                Enviar Cobrança Extra
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
