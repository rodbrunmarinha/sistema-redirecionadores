"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, ArrowLeft, Link as LinkIcon, DollarSign, ListPlus, Hash, Save, CreditCard, Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createAssistedPurchase, payAssistedPurchase } from '../_actions';
import { useTenantSettings } from '../../components/TenantSettingsContext';

export default function CreatePurchaseClient({ 
  tenantId, 
  userId,
  balance
}: { 
  tenantId: string; 
  userId: string;
  balance: number;
}) {
  const router = useRouter();
  const { settings } = useTenantSettings();
  const currency = settings?.operations?.currency || "USD";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_url: '',
    product_name: '',
    product_options: '',
    quantity: 1,
    unit_price: ''
  });

  const total = (parseFloat(formData.unit_price) || 0) * formData.quantity;

  const handleSubmit = async (payNow: boolean) => {
    if (!formData.product_url || !formData.product_name || !formData.unit_price) {
      toast.error("Preencha o link, nome e valor do produto.");
      return;
    }

    if (payNow && balance < total) {
      toast.error(`Saldo insuficiente. Recarregue sua carteira ou salve a solicitação para pagar depois.`);
      return;
    }

    setLoading(true);
    const createRes = await createAssistedPurchase(tenantId, userId, {
      ...formData,
      unit_price: parseFloat(formData.unit_price) || 0
    });

    if (createRes.error || !createRes.purchase) {
      toast.error(createRes.error || "Erro ao criar solicitação.");
      setLoading(false);
      return;
    }

    if (payNow) {
      const payRes = await payAssistedPurchase(tenantId, userId, createRes.purchase.id);
      if (payRes.error) {
        toast.error("Solicitação criada, mas falha no pagamento: " + payRes.error);
        router.push('/app/online-purchases');
        return;
      }
      toast.success("Solicitação criada e paga com sucesso!");
    } else {
      toast.success("Solicitação salva! Você pode pagar mais tarde.");
    }
    
    router.push('/app/online-purchases');
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/app/online-purchases"
          className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Nova Solicitação</h1>
          <p className="text-sm text-zinc-500">Preencha os detalhes do produto que deseja comprar.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Link do Produto</label>
            <div className="relative">
              <LinkIcon className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="url"
                value={formData.product_url}
                onChange={e => setFormData({...formData, product_url: e.target.value})}
                placeholder="Ex: https://amazon.com/produto-xyz"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Nome do Produto</label>
            <input 
              type="text"
              value={formData.product_name}
              onChange={e => setFormData({...formData, product_name: e.target.value})}
              placeholder="Ex: Tênis Nike Air Max"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Opções (Cor, Tamanho, etc)</label>
            <div className="relative">
              <ListPlus className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={formData.product_options}
                onChange={e => setFormData({...formData, product_options: e.target.value})}
                placeholder="Ex: Cor Preto, Tamanho 42"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Quantidade</label>
              <div className="relative">
                <Hash className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Valor Unitário ({currency})</label>
              <div className="relative">
                <DollarSign className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_price}
                  onChange={e => setFormData({...formData, unit_price: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Resumo e Ações */}
        <div className="bg-zinc-50 border-t border-zinc-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <p className="text-sm text-zinc-500 font-medium mb-1">Total a Pagar Agora</p>
              <p className="text-3xl font-bold text-blue-600">{currency} {total.toFixed(2)}</p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-zinc-400">Saldo Atual: {currency} {balance.toFixed(2)}</p>
                <Link 
                  href="/app/wallet/add-credits" 
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Adicionar Saldo
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm max-w-sm">
              <p className="font-semibold mb-1 flex items-center gap-1"><ShoppingBag className="w-4 h-4"/> Aviso Importante</p>
              O valor acima será descontado do seu saldo. Caso haja diferença de frete interno ou taxas da loja, o lojista poderá solicitar um pagamento extra posteriormente.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-zinc-700 border border-zinc-200 px-6 py-3.5 rounded-xl font-bold hover:bg-zinc-50 hover:border-zinc-300 transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Apenas Salvar
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading || balance < total}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <CreditCard className="w-5 h-5" />
              Pagar e Solicitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
