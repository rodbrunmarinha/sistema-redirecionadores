"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Settings, 
  Plus, 
  Search, 
  X, 
  CheckCircle, 
  Clock, 
  ShoppingBag, 
  ShoppingCart, 
  AlertCircle,
  Hash,
  ChevronDown,
  Info
} from "lucide-react";

// Mock Data
const MOCK_CLIENTS = [
  { id: 19677, label: "RODRIGO DE SOUZA (rodbrun.marinha@gmail.com)" }
];

export default function OnlinePurchasesPage() {
  // Filters State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  
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

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  // Settings State
  const [productSource, setProductSource] = useState("link");
  const [requirePrice, setRequirePrice] = useState(true);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 flex flex-col relative overflow-x-hidden">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Compras Assistidas
            </span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Compras Online</h1>
                <p className="text-orange-100 text-sm mt-0.5">Gerencie as solicitações de compra assistida dos seus clientes</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                type="button" 
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition shadow-sm active:scale-95 text-sm"
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Configurações</span>
              </button>
              <Link 
                href="/admin/online-purchases/create" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Nova Solicitação</span>
                <span className="sm:hidden">Nova</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6 flex-1 w-full pb-12">
        
        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link href="/admin/online-purchases" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-800 p-4 text-white shadow-lg shadow-zinc-900/25 transition hover:shadow-xl active:scale-95 border border-zinc-700">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-300">Total</p>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Hash className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </Link>
          
          <Link href="/admin/online-purchases?status=pending" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white shadow-lg shadow-amber-500/25 transition hover:shadow-xl active:scale-95 border border-amber-500/20">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-100">Aguardando</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </Link>

          <Link href="/admin/online-purchases?status=quoted" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl active:scale-95 border border-blue-500/20">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">Cotadas</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </Link>

          <Link href="/admin/online-purchases?status=approved" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-xl active:scale-95 border border-emerald-500/20">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">Aprovadas</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </Link>

          <Link href="/admin/online-purchases?status=purchasing" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-lg shadow-purple-500/25 transition hover:shadow-xl active:scale-95 border border-purple-500/20">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-purple-100">Comprando</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </Link>

          <Link href="/admin/online-purchases?urgent=1" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-4 text-white shadow-lg shadow-red-500/25 transition hover:shadow-xl active:scale-95 border border-red-500/20">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-100">Ação</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 border border-zinc-800">
          <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Buscar</label>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Referência, cliente, produto..." 
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm transition"
              />
            </div>
            
            {/* Cliente */}
            <div ref={clientDropdownRef}>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Cliente</label>
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
                    placeholder="Todos os clientes" 
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 pr-8 text-sm transition"
                    autoComplete="off"
                  />
                )}
                
                {(selectedClientId && !clientDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={() => setClientDropdownOpen(true)} 
                    className="w-full flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  >
                    <span className="truncate">{selectedClient?.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 ml-2" />
                  </button>
                )}

                {(selectedClientId && !clientDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); clearClient(); }} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-500 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {clientDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                    <button 
                      type="button" 
                      onClick={() => { clearClient(); setClientDropdownOpen(false); }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-700 border-b border-zinc-700 transition"
                    >
                      Todos os clientes
                    </button>
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm appearance-none transition"
              >
                <option value="">Todos</option>
                <option value="pending">Aguardando Cotação</option>
                <option value="quoted">Cotação Enviada</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
                <option value="purchasing">Comprando</option>
                <option value="purchased">Comprado</option>
                <option value="received">Recebido</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Ordenar por</label>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm appearance-none transition"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigas</option>
              </select>
            </div>

            {/* Filter Action */}
            <div className="flex items-end gap-2">
              <button 
                type="button" 
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-md"
              >
                Filtrar
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Solicitações (Empty State) */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800">
          <div className="flex flex-col items-center justify-center text-center px-6 py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-800 border border-zinc-700 mb-6 shadow-sm">
              <ShoppingCart className="h-10 w-10 text-zinc-500" />
            </div>

            <h3 className="text-lg font-bold text-white">Nenhuma solicitação encontrada</h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-sm">Ainda não há solicitações de compra online.</p>
            
            <Link 
              href="/admin/online-purchases/create" 
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition shadow-md"
            >
              Nova Solicitação
            </Link>
          </div>
        </div>

      </div>

      {/* Settings Sliding Modal */}
      {/* Backdrop */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-zinc-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-zinc-800 ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Panel Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-5 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-white/80" />
              <h2 className="text-white font-bold text-lg">Configurações do Serviço</h2>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(false)} 
            className="text-white/70 hover:text-white transition mt-0.5 flex-shrink-0 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Panel Content */}
        <form className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            <div className="pt-2">
              <label className="block text-sm font-semibold text-zinc-200 mb-1">
                O que o cliente precisa informar
              </label>
              <p className="text-xs text-zinc-400 mb-4">Ajuste conforme a sua operação. Se seus clientes mandam a foto do produto em vez do link, mude aqui — assim eles não precisam inventar um link para enviar o pedido.</p>
          
              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${productSource === 'link' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'}`}>
                  <input 
                    type="radio" 
                    name="product_source" 
                    value="link" 
                    checked={productSource === 'link'}
                    onChange={() => setProductSource('link')}
                    className="mt-0.5 text-orange-500 focus:ring-orange-500 bg-zinc-900 border-zinc-700" 
                  />
                  <span className={`text-sm ${productSource === 'link' ? 'text-orange-400 font-medium' : 'text-zinc-300'}`}>Somente link do produto (padrão)</span>
                </label>
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${productSource === 'photo' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'}`}>
                  <input 
                    type="radio" 
                    name="product_source" 
                    value="photo" 
                    checked={productSource === 'photo'}
                    onChange={() => setProductSource('photo')}
                    className="mt-0.5 text-orange-500 focus:ring-orange-500 bg-zinc-900 border-zinc-700" 
                  />
                  <span className={`text-sm ${productSource === 'photo' ? 'text-orange-400 font-medium' : 'text-zinc-300'}`}>Somente foto do produto</span>
                </label>
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${productSource === 'any' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'}`}>
                  <input 
                    type="radio" 
                    name="product_source" 
                    value="any" 
                    checked={productSource === 'any'}
                    onChange={() => setProductSource('any')}
                    className="mt-0.5 text-orange-500 focus:ring-orange-500 bg-zinc-900 border-zinc-700" 
                  />
                  <span className={`text-sm ${productSource === 'any' ? 'text-orange-400 font-medium' : 'text-zinc-300'}`}>Link ou foto — o cliente escolhe</span>
                </label>
              </div>
          
              <div className="mt-4 flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                <div>
                  <p className="text-sm font-medium text-zinc-300">Exigir valor estimado</p>
                  <p className="mt-1 text-xs text-zinc-500">Desligue se o cliente costuma não saber o preço e você faz a cotação.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    checked={requirePrice}
                    onChange={(e) => setRequirePrice(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 border border-zinc-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-4">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Este texto será exibido para os clientes na tela de nova solicitação de compra. Ele não aparece para clientes que ainda não abriram o painel.
              </p>
            </div>

          </div>

          {/* Panel Footer */}
          <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex items-center gap-3 shrink-0">
            <button 
              type="button" 
              onClick={() => setIsSettingsOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-amber-500 transition shadow-lg active:scale-95 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Salvar Configurações
            </button>
            <button 
              type="button" 
              onClick={() => setIsSettingsOpen(false)} 
              className="px-5 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition font-medium text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
