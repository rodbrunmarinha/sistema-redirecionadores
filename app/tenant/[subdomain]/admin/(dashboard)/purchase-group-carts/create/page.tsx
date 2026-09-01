"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  ArrowLeft,
  Search,
  X,
  Check
} from "lucide-react";

// Mock Data
const MOCK_CLIENTS = [
  { id: 19677, label: "#1001 · RODRIGO DE SOUZA (rodbrun.marinha@gmail.com)" },
  { id: 19678, label: "#1002 · JOAO SILVA (joao@example.com)" },
];

const MOCK_GROUPS = [
  { id: 1, label: "Grupo Apple Outubro" },
  { id: 2, label: "Grupo Roupas de Inverno" },
];

export default function CreatePurchaseGroupCartPage() {
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

  // Group Dropdown State
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const groupDropdownRef = useRef<HTMLDivElement>(null);

  const selectedGroup = useMemo(() => MOCK_GROUPS.find(g => g.id === selectedGroupId) || null, [selectedGroupId]);

  const filteredGroups = useMemo(() => {
    if (!groupSearch) return MOCK_GROUPS;
    const q = groupSearch.toLowerCase();
    return MOCK_GROUPS.filter(g => g.label.toLowerCase().includes(q));
  }, [groupSearch]);

  const selectGroup = (group: typeof MOCK_GROUPS[0]) => {
    setSelectedGroupId(group.id);
    setGroupSearch("");
    setGroupDropdownOpen(false);
  };

  const clearGroup = () => {
    setSelectedGroupId("");
    setGroupSearch("");
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setClientDropdownOpen(false);
      }
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target as Node)) {
        setGroupDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 flex flex-col relative overflow-x-hidden">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <span className="text-white/50 shrink-0">/</span>
            <Link href="/admin/purchase-group-carts" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Carrinhos em Aberto
            </Link>
            <span className="text-white/50 shrink-0">/</span>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Novo Carrinho
            </span>
          </nav>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                Novo Carrinho para Cliente
              </h1>
            </div>
            <Link 
              href="/admin/purchase-group-carts" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full pb-12">
        <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-6 sm:p-8">
          
          <form className="space-y-6">
            
            {/* Seleção do Cliente */}
            <div ref={clientDropdownRef} className="relative z-20">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Selecionar Cliente
              </label>
              
              <div className="relative">
                {(!selectedClientId || clientDropdownOpen) && (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        setClientDropdownOpen(true);
                      }}
                      onFocus={() => setClientDropdownOpen(true)}
                      placeholder="Digite o nome, e-mail ou dock..." 
                      className="w-full pl-10 pr-8 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
                      autoComplete="off"
                    />
                  </div>
                )}
                
                {(selectedClientId && !clientDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={() => setClientDropdownOpen(true)} 
                    className="w-full flex items-center justify-between rounded-xl border border-orange-500/50 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  >
                    <span className="truncate">{selectedClient?.label}</span>
                  </button>
                )}

                {(selectedClientId && !clientDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); clearClient(); }} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-500 transition p-1 bg-zinc-900 hover:bg-red-500/10 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {clientDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50">
                    {filteredClients.map(c => (
                      <button 
                        key={c.id}
                        type="button" 
                        onClick={() => selectClient(c)} 
                        className={`w-full text-left px-4 py-3 text-sm transition flex items-center gap-2 border-b border-zinc-700/50 last:border-0 ${selectedClientId === c.id ? 'bg-orange-500/10 text-orange-400 font-semibold' : 'text-white hover:bg-zinc-700'}`}
                      >
                        {selectedClientId === c.id && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                        <span className="truncate">{c.label}</span>
                      </button>
                    ))}
                    {filteredClients.length === 0 && clientSearch.length >= 2 && (
                      <div className="px-4 py-4 text-sm text-zinc-500 text-center">Nenhum cliente encontrado</div>
                    )}
                    {filteredClients.length === 0 && clientSearch.length < 2 && (
                      <div className="px-4 py-4 text-sm text-zinc-500 text-center">Digite pelo menos 2 caracteres</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Seleção do Grupo de Compras */}
            <div ref={groupDropdownRef} className="relative z-10">
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Selecionar Grupo de Compras
              </label>
              <p className="mb-3 text-xs text-zinc-500">
                Grupos ativos e grupos finalizados no último mês aparecem aqui.
              </p>
              
              <div className="relative">
                {(!selectedGroupId || groupDropdownOpen) && (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={groupSearch}
                      onChange={(e) => {
                        setGroupSearch(e.target.value);
                        setGroupDropdownOpen(true);
                      }}
                      onFocus={() => setGroupDropdownOpen(true)}
                      placeholder="Buscar grupo..." 
                      className="w-full pl-10 pr-8 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
                      autoComplete="off"
                    />
                  </div>
                )}
                
                {(selectedGroupId && !groupDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={() => setGroupDropdownOpen(true)} 
                    className="w-full flex items-center justify-between rounded-xl border border-orange-500/50 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  >
                    <span className="truncate">{selectedGroup?.label}</span>
                  </button>
                )}

                {(selectedGroupId && !groupDropdownOpen) && (
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); clearGroup(); }} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-500 transition p-1 bg-zinc-900 hover:bg-red-500/10 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {groupDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50">
                    {filteredGroups.map(g => (
                      <button 
                        key={g.id}
                        type="button" 
                        onClick={() => selectGroup(g)} 
                        className={`w-full text-left px-4 py-3 text-sm transition flex items-center gap-2 border-b border-zinc-700/50 last:border-0 ${selectedGroupId === g.id ? 'bg-orange-500/10 text-orange-400 font-semibold' : 'text-white hover:bg-zinc-700'}`}
                      >
                        {selectedGroupId === g.id && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                        <span className="truncate">{g.label}</span>
                      </button>
                    ))}
                    {filteredGroups.length === 0 && (
                      <div className="px-4 py-4 text-sm text-zinc-500 text-center">Nenhum grupo encontrado</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-zinc-800">
              <Link 
                href="/admin/purchase-group-carts" 
                className="px-6 py-3 border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 rounded-xl transition text-center"
              >
                Cancelar
              </Link>
              <button 
                type="submit"
                disabled={!selectedClientId || !selectedGroupId}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
