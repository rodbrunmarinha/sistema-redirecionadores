"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ShoppingCart, 
  Info, 
  X, 
  Plus, 
  Trash2, 
  Send
} from "lucide-react";

// Mock Data
const MOCK_CLIENTS = [
  { id: 19677, label: "RODRIGO DE SOUZA - Dock #1001 (rodbrun.marinha@gmail.com)" }
];

type ProductItem = {
  id: number;
  url: string;
  name: string;
  color: string;
  size: string;
  available: boolean;
  actual_price: string;
  quantity: number;
  notes: string;
};

export default function CreateOnlinePurchasePage() {
  // Client Dropdown State
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | "">("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  const selectedClient = useMemo(() => MOCK_CLIENTS.find(c => c.id === selectedClientId) || null, [selectedClientId]);

  const filteredClients = useMemo(() => {
    if (!clientSearch) return MOCK_CLIENTS;
    const q = clientSearch.toLowerCase();
    return MOCK_CLIENTS.filter(c => c.label.toLowerCase().includes(q));
  }, [clientSearch]);

  const selectClient = (client: typeof MOCK_CLIENTS[0]) => {
    setSelectedClientId(client.id);
    setClientSearch("");
    setClientDropdownOpen(false);
  };

  const clearClient = () => {
    setSelectedClientId("");
    setClientSearch("");
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setClientDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Items State
  const [items, setItems] = useState<ProductItem[]>([{
    id: Date.now(),
    url: "",
    name: "",
    color: "",
    size: "",
    available: true,
    actual_price: "",
    quantity: 1,
    notes: ""
  }]);

  const addItem = () => {
    setItems([...items, {
      id: Date.now(),
      url: "",
      name: "",
      color: "",
      size: "",
      available: true,
      actual_price: "",
      quantity: 1,
      notes: ""
    }]);
  };

  const removeItem = (idToRemove: number) => {
    setItems(items.filter(item => item.id !== idToRemove));
  };

  const updateItem = (id: number, field: keyof ProductItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Extra Fees State
  const [serviceFee, setServiceFee] = useState("0.00");
  const [shippingCost, setShippingCost] = useState("0.00");
  const [stateTax, setStateTax] = useState("0.00");

  const [adminNotes, setAdminNotes] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Calculations
  const parseAmount = (val: string) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const subtotalProducts = items.reduce((acc, item) => acc + (parseAmount(item.actual_price) * item.quantity), 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = subtotalProducts + parseAmount(serviceFee) + parseAmount(shippingCost) + parseAmount(stateTax);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 pb-8 flex flex-col">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/online-purchases" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Compras Assistidas
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Nova Solicitação de Compra
            </span>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Nova Solicitação de Compra</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        
        {/* Info Box */}
        <div className="mb-6 bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-400 mb-1">Criando solicitação em nome do cliente</h4>
              <p className="text-orange-200/80 text-sm leading-relaxed">
                Use este formulário quando o cliente solicitar a compra por telefone, e-mail ou outro canal. A solicitação será criada com o status "Aguardando Cotação".
              </p>
            </div>
          </div>
        </div>

        <form>
          {/* Seleção do Cliente */}
          <div className="mb-6 bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-6 relative z-10">
            <h3 className="text-lg font-semibold text-white mb-4">Cliente</h3>
            <div ref={clientDropdownRef}>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Selecione o Cliente <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                {(!selectedClientId || clientDropdownOpen) && (
                  <input 
                    type="text" 
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setClientDropdownOpen(true);
                    }}
                    onFocus={() => setClientDropdownOpen(true)}
                    placeholder="Selecione um cliente..." 
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-2.5 text-sm pr-8 transition"
                    autoComplete="off"
                  />
                )}
                
                {(selectedClientId && !clientDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={() => setClientDropdownOpen(true)} 
                    className="w-full flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  >
                    <span className="truncate">{selectedClient?.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500 flex-shrink-0 ml-2" />
                  </button>
                )}

                {(selectedClientId && !clientDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); clearClient(); }} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {clientDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                    {filteredClients.map(c => (
                      <button 
                        key={c.id}
                        type="button" 
                        onClick={() => selectClient(c)} 
                        className={`w-full text-left px-4 py-2.5 text-sm transition ${selectedClientId === c.id ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'text-white hover:bg-zinc-700'}`}
                      >
                        {c.label}
                      </button>
                    ))}
                    {filteredClients.length === 0 && (
                      <div className="px-4 py-3 text-sm text-zinc-500 text-center">Nenhum cliente encontrado</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 overflow-hidden mb-6">
            <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-amber-600">
              <h3 className="text-lg font-semibold text-white">Produtos para Compra</h3>
              <p className="text-orange-100/90 text-sm mt-0.5">Adicione os produtos solicitados pelo cliente</p>
            </div>

            <div className="divide-y divide-zinc-800">
              {items.map((item, index) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-sm font-semibold rounded-full border border-orange-500/20">
                      Produto #{index + 1}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => removeItem(item.id)} 
                      className="text-red-500 hover:text-red-400 transition p-1 bg-red-500/10 hover:bg-red-500/20 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Link do Produto <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="url" 
                        required 
                        value={item.url}
                        onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-2.5 transition" 
                        placeholder="https://www.amazon.com/dp/..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Nome do Produto (opcional)</label>
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-2.5 transition" 
                        placeholder="Ex: iPhone 15 Pro Max 256GB"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Cor</label>
                      <input 
                        type="text" 
                        value={item.color}
                        onChange={(e) => updateItem(item.id, 'color', e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-2.5 transition" 
                        placeholder="Ex: Preto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Tamanho</label>
                      <input 
                        type="text" 
                        value={item.size}
                        onChange={(e) => updateItem(item.id, 'size', e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-2.5 transition" 
                        placeholder="Ex: M, 42"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={item.available}
                          onChange={(e) => updateItem(item.id, 'available', e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900" 
                        />
                        <span className="text-sm font-medium text-emerald-400">Produto Disponível na Loja</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Preço Real (unitário) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                        <input 
                          type="text" 
                          required 
                          value={item.actual_price}
                          onChange={(e) => updateItem(item.id, 'actual_price', e.target.value)}
                          className="w-full pl-8 py-2.5 px-3 rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" 
                          placeholder="0.00" 
                          inputMode="numeric"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Quantidade <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        required 
                        min="1" 
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full py-2.5 px-4 rounded-lg border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" 
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Total do Item</label>
                      <div className="px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                        <span className="text-lg font-bold text-white">
                          ${(parseAmount(item.actual_price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Comentários (opcional)</label>
                      <textarea 
                        rows={2} 
                        value={item.notes}
                        onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-3 transition" 
                        placeholder="Ex: Enviar na caixa original..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-zinc-900 border-t border-zinc-800">
              <button 
                type="button" 
                onClick={addItem} 
                className="w-full px-4 py-4 border-2 border-dashed border-orange-500/30 rounded-xl text-orange-400 font-medium hover:border-orange-500 hover:bg-orange-500/5 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar Mais Um Produto
              </button>
            </div>
          </div>

          {/* Resumo e Observações */}
          <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 overflow-hidden p-6 space-y-6">
            
            {/* Valores da Cotação */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-5">Valores da Cotação</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                
                {/* Subtotal */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Subtotal Produtos</label>
                  <div className="px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg h-[46px] flex items-center">
                    <span className="text-lg font-bold text-white">
                      ${subtotalProducts.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Taxa de Serviço */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Taxa de Serviço <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input 
                      type="text" 
                      value={serviceFee}
                      onChange={(e) => setServiceFee(e.target.value)}
                      className="w-full pl-8 py-2.5 px-3 rounded-lg border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" 
                      inputMode="numeric" 
                      required 
                    />
                  </div>
                </div>

                {/* Frete */}
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-zinc-300 mb-2">
                    Frete até a Empresa
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input 
                      type="text" 
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      className="w-full pl-8 py-2.5 px-3 rounded-lg border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" 
                      inputMode="numeric" 
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1.5">Deixe 0 se a loja oferecer frete grátis</p>
                </div>

                {/* Imposto Estadual */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Imposto Estadual</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input 
                      type="text" 
                      value={stateTax}
                      onChange={(e) => setStateTax(e.target.value)}
                      className="w-full pl-8 py-2.5 px-3 rounded-lg border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" 
                      inputMode="numeric" 
                    />
                  </div>
                </div>
              </div>

              {/* Total Final */}
              <div className="p-5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-orange-200/80">Total de Itens</span>
                    <p className="text-xl font-bold text-white mt-1">
                      {totalItemsCount}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-orange-200/80">TOTAL DA COTAÇÃO</span>
                    <p className="text-3xl sm:text-4xl font-black text-orange-400 mt-1">
                      ${totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-zinc-800" />

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Observações para o Cliente (opcional)
              </label>
              <textarea 
                rows={3} 
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none p-4 transition" 
                placeholder="Informe detalhes sobre a cotação, prazos, condições, etc..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Observações do Cliente (opcional)
              </label>
              <textarea 
                rows={3} 
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none p-4 transition" 
                placeholder="Alguma instrução especial informada pelo cliente?"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
              <Link 
                href="/admin/online-purchases" 
                className="w-full sm:w-auto px-6 py-3 border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 rounded-xl transition text-center"
              >
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={items.length === 0}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Cotação
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
