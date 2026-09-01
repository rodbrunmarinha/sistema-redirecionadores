"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Lightbulb, ShoppingBag } from "lucide-react";

interface ProductItem {
  id: string;
  url: string;
  color: string;
  size: string;
  price: string;
  quantity: number;
  notes: string;
}

export default function CreateAssistedPurchasePage() {
  const [items, setItems] = useState<ProductItem[]>([
    { id: "1", url: "", color: "", size: "", price: "", quantity: 1, notes: "" }
  ]);
  const [generalNotes, setGeneralNotes] = useState("");

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), url: "", color: "", size: "", price: "", quantity: 1, notes: "" }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ProductItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalEstimated = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + (price * (item.quantity || 0));
  }, 0);

  const isSubmitDisabled = items.length === 0 || items.some(item => !item.url || !item.price || item.quantity < 1);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/app/assisted-purchase" 
          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">
          Nova Solicitação de Compra
        </h1>
      </div>

      <div className="space-y-6">
        {/* Dicas */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-violet-100 rounded-xl flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h4 className="font-bold text-violet-900 mb-2">Dicas para sua solicitação</h4>
              <ul className="text-violet-800 text-sm space-y-1.5">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-violet-400 rounded-full"></span> Cole o link direto do produto (não o link de busca)</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-violet-400 rounded-full"></span> Informe o valor unitário em Dólar Americano ($)</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-violet-400 rounded-full"></span> Especifique cor e tamanho quando aplicável</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-violet-400 rounded-full"></span> Use o campo de comentários para informações extras</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          
          {/* Form Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Produtos para Compra
            </h3>
            <p className="text-violet-100 text-sm mt-0.5">Adicione os produtos que deseja que compremos para você</p>
          </div>

          {/* Lista de Itens */}
          <div className="divide-y divide-zinc-100">
            {items.map((item, index) => (
              <div key={item.id} className="p-6 transition-colors hover:bg-zinc-50/50">
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm font-bold rounded-full">
                    Produto #{index + 1}
                  </span>
                  {items.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover produto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Link do Produto */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                      Link do produto <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="url" 
                      value={item.url}
                      onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-zinc-900" 
                      placeholder="https://www.amazon.com/..." 
                    />
                  </div>
                  
                  {/* Cor */}
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Cor</label>
                    <input 
                      type="text" 
                      value={item.color}
                      onChange={(e) => updateItem(item.id, 'color', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-zinc-900" 
                      placeholder="Ex: Preto, Azul Marinho" 
                    />
                  </div>

                  {/* Tamanho */}
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Tamanho</label>
                    <input 
                      type="text" 
                      value={item.size}
                      onChange={(e) => updateItem(item.id, 'size', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-zinc-900" 
                      placeholder="Ex: M, 42, 10.5" 
                    />
                  </div>

                  {/* Valor Estimado */}
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                      Valor Unitário (USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                        required 
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-zinc-900" 
                        placeholder="0.00" 
                      />
                    </div>
                  </div>

                  {/* Quantidade */}
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                      Quantidade <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-zinc-900" 
                    />
                  </div>

                  {/* Comentários */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Comentários Adicionais</label>
                    <textarea 
                      rows={2} 
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-zinc-900 resize-none" 
                      placeholder="Ex: Enviar na caixa original, sem etiqueta de preço..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <div className="p-6 bg-zinc-50/50 border-t border-zinc-100">
            <button 
              type="button" 
              onClick={addItem}
              className="w-full py-4 border-2 border-dashed border-violet-200 rounded-xl text-violet-600 font-bold hover:border-violet-400 hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Novo Produto
            </button>
          </div>
        </form>

        {/* Resumo e Botão Submit */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-violet-50 rounded-xl border border-violet-100 gap-4">
            <div>
              <span className="text-sm font-semibold text-violet-900/70 uppercase tracking-wide">Total Estimado</span>
              <p className="text-3xl font-bold text-violet-600 mt-1">
                ${totalEstimated.toFixed(2)}
              </p>
              <p className="text-xs font-medium text-violet-500 mt-1">* Valor dos produtos sem taxas de serviço</p>
            </div>
            <div className="sm:text-right">
              <span className="text-sm font-semibold text-violet-900/70 uppercase tracking-wide">Total de Produtos</span>
              <p className="text-3xl font-bold text-zinc-900 mt-1">
                {totalItems}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">
              Observações Gerais (opcional)
            </label>
            <textarea 
              rows={3} 
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-zinc-900 resize-none" 
              placeholder="Alguma instrução especial para toda a compra?"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <Link 
              href="/app/assisted-purchase" 
              className="w-full sm:w-auto px-6 py-3.5 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-colors text-center"
            >
              Cancelar
            </Link>
            <button 
              type="button" 
              disabled={isSubmitDisabled}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Enviar Solicitação
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
