"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Info, Search, X, ChevronRight as ChevronRightIcon, ArrowRight } from "lucide-react";

// Mock Data for UI demonstration
const MOCK_CLIENTS = [
  { id: 19677, name: "RODRIGO DE SOUZA", dock: "1001" },
  { id: 19678, name: "GABRIELA SILVA", dock: "1002" },
];

const MOCK_SERVICES = [
  { id: 1, name: "Personal Shopper", icon: "🛍️", price_label: "Preço fixo", price_type: "fixed", base_price: 50.00, requires_pre_deposit: true, pre_deposit_amount: 25.00 },
  { id: 2, name: "Fotos Extras", icon: "📸", price_label: "Por item", price_type: "per_item", base_price: 2.00 },
  { id: 3, name: "Taxa de Compra", icon: "📊", price_label: "Porcentagem", price_type: "percentage", base_price: 10 },
  { id: 4, name: "Frete Especial", icon: "💬", price_label: "Sob Consulta", price_type: "quote", base_price: 0 },
];

export default function CreateServiceOrderPage() {
  // Service selection
  const [serviceId, setServiceId] = useState<number | "">("");
  const selectedService = useMemo(() => MOCK_SERVICES.find(s => s.id === serviceId) || null, [serviceId]);

  // Client selection
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | "">("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedClient = useMemo(() => MOCK_CLIENTS.find(c => c.id === selectedClientId) || null, [selectedClientId]);
  const selectedClientLabel = selectedClient ? `${selectedClient.name} (Dock ${selectedClient.dock})` : "";

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase();
    if (!q) return MOCK_CLIENTS;
    return MOCK_CLIENTS.filter(c => 
      c.name.toLowerCase().includes(q) || String(c.dock).includes(q)
    );
  }, [clientSearch]);

  const [dock, setDock] = useState("");

  const selectClient = (client: typeof MOCK_CLIENTS[0]) => {
    setSelectedClientId(client.id);
    setClientSearch("");
    setClientDropdownOpen(false);
    setDock(client.dock);
  };

  const clearClient = () => {
    setSelectedClientId("");
    setDock("");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setClientDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Values
  const [serviceFee, setServiceFee] = useState("");
  const [discount, setDiscount] = useState("0.00");

  // Update default fee when service changes
  useEffect(() => {
    if (selectedService && selectedService.price_type === 'fixed') {
      setServiceFee(selectedService.base_price.toFixed(2));
    } else {
      setServiceFee("0.00");
    }
  }, [selectedService]);

  // Notes
  const [notes, setNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 pb-8 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/service-orders" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Ordens de Serviço
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Nova Ordem de Serviço
            </span>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/service-orders" className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Nova Ordem de Serviço</h1>
              <p className="text-orange-100 text-sm mt-0.5">Crie uma nova ordem de serviço para um cliente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-12 flex-1">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <form action="/admin/service-orders" method="POST">
            <div className="bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-800">
              
              {/* Passo 1: Serviço */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-white shadow-md text-sm font-black">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-orange-400">Selecione o Serviço</h3>
                    <p className="text-xs text-zinc-400">Escolha o tipo de serviço para esta ordem</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MOCK_SERVICES.map(service => (
                    <label 
                      key={service.id}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${serviceId === service.id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'}`}
                    >
                      <input type="radio" name="service_id" value={service.id} checked={serviceId === service.id} onChange={() => setServiceId(service.id)} className="sr-only" />
                      <span className="text-3xl mb-2">{service.icon}</span>
                      <span className="text-sm font-bold text-white">{service.name}</span>
                    </label>
                  ))}
                </div>

                {/* Service Info Card */}
                {selectedService && (
                  <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20 shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedService.icon}</span>
                      <div>
                        <p className="font-extrabold text-white">{selectedService.name}</p>
                        <p className="text-sm text-zinc-400 font-medium">
                          <span>{selectedService.price_label}</span> · 
                          {selectedService.price_type !== 'quote' && (
                            <span className="ml-1">${selectedService.base_price.toFixed(2)}</span>
                          )}
                          {selectedService.price_type === 'quote' && (
                            <span className="ml-1">Preço definido manualmente</span>
                          )}
                        </p>
                        {selectedService.requires_pre_deposit && (
                          <p className="text-xs text-orange-400 font-semibold mt-1">
                            💵 Pré-depósito: ${selectedService.pre_deposit_amount?.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-zinc-800" />

              {/* Passo 2: Cliente */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 text-white shadow-md text-sm font-black">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-amber-400">Cliente</h3>
                    <p className="text-xs text-zinc-400">Selecione o cliente que solicitou o serviço</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div ref={dropdownRef}>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Cliente <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="hidden" name="user_id" value={selectedClientId} />

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
                            placeholder="Buscar por nome ou número do dock..." 
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm py-2.5 px-3 pr-10 outline-none"
                            autoComplete="off"
                          />
                        )}
                        
                        {(selectedClientId && !clientDropdownOpen) && (
                          <button 
                            type="button" 
                            onClick={() => setClientDropdownOpen(true)} 
                            className="w-full flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          >
                            <span className="truncate">{selectedClientLabel}</span>
                            <ChevronRightIcon className="w-4 h-4 text-zinc-500 flex-shrink-0 ml-2" />
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
                      </div>

                      {clientDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {filteredClients.map(client => (
                            <button 
                              key={client.id}
                              type="button" 
                              onClick={() => selectClient(client)} 
                              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition ${selectedClientId === client.id ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-white hover:bg-zinc-700'}`}
                            >
                              <span>{client.name}</span>
                              <span className="text-xs text-zinc-400 ml-2 flex-shrink-0">Dock {client.dock}</span>
                            </button>
                          ))}
                          {filteredClients.length === 0 && (
                            <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                              Nenhum cliente encontrado
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="dock" className="block text-sm font-medium text-zinc-300 mb-1">Dock</label>
                    <input 
                      type="text" 
                      name="dock" 
                      id="dock" 
                      value={dock}
                      readOnly
                      placeholder="Selecione o cliente" 
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm py-2.5 px-3 outline-none"
                    />
                    <p className="mt-1 text-xs text-zinc-500">Preenchido automaticamente</p>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-800" />

              {/* Passo 3: Valores */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 text-white shadow-md text-sm font-black">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-emerald-400">Valores</h3>
                    <p className="text-xs text-zinc-400">Configure taxa de serviço e desconto</p>
                  </div>
                </div>

                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 shadow-md mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 flex-shrink-0 shadow-sm text-emerald-400">
                      <Info className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-zinc-300">
                      <p className="font-extrabold mb-1 text-emerald-400">Como funciona?</p>
                      <p className="text-zinc-400">1️⃣ Crie a ordem → 2️⃣ Adicione os produtos → 3️⃣ Cliente paga → 4️⃣ Produtos são liberados automaticamente</p>
                    </div>
                  </div>
                </div>

                {selectedService?.price_type === 'percentage' && (
                  <div className="bg-amber-500/10 rounded-xl p-5 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-500 text-xl">
                        📊
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-400 mb-1">Taxa Percentual Automática</h4>
                        <p className="text-sm text-zinc-300 mb-2">
                          A taxa de serviço será calculada automaticamente como <strong>{selectedService.base_price.toFixed(0)}%</strong> do valor total dos produtos adicionados.
                        </p>
                        <div className="bg-zinc-950 rounded-lg p-3 text-xs text-amber-200/80 border border-amber-500/20">
                          <strong>Exemplo:</strong> Se adicionar produtos no valor de $100,00, a taxa será de ${(selectedService.base_price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedService?.price_type !== 'percentage' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="service_fee" className="block text-sm font-medium text-zinc-300 mb-1">Taxa do Serviço (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                        <input 
                          type="number" 
                          name="service_fee" 
                          id="service_fee" 
                          step="0.01" 
                          min="0" 
                          value={serviceFee}
                          onChange={(e) => setServiceFee(e.target.value)}
                          className="w-full pl-8 py-2.5 px-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm outline-none"
                        />
                      </div>
                      {selectedService?.price_type === 'fixed' && <p className="mt-1 text-xs text-zinc-500">Taxa fixa do serviço</p>}
                      {selectedService?.price_type === 'per_item' && <p className="mt-1 text-xs text-zinc-500">Será multiplicado pela quantidade de itens</p>}
                      {selectedService?.price_type === 'per_kg' && <p className="mt-1 text-xs text-zinc-500">Será multiplicado pelo peso total em kg</p>}
                      {selectedService?.price_type === 'quote' && <p className="mt-1 text-xs text-zinc-500">Defina o valor manualmente</p>}
                    </div>
                    <div>
                      <label htmlFor="discount" className="block text-sm font-medium text-zinc-300 mb-1">Desconto (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                        <input 
                          type="number" 
                          name="discount" 
                          id="discount" 
                          step="0.01" 
                          min="0" 
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="w-full pl-8 py-2.5 px-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-zinc-800" />

              {/* Passo 4: Observações */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500 text-white shadow-md text-sm font-black">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-blue-400">Observações</h3>
                    <p className="text-xs text-zinc-400">Opcional — adicione detalhes relevantes sobre a solicitação</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-1">Descrição da Solicitação</label>
                  <textarea 
                    name="notes" 
                    id="notes" 
                    rows={3} 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: O cliente pediu para comprar 2 unidades do produto X..." 
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm p-3 outline-none"
                  />
                  <p className="mt-1 text-xs text-zinc-500">Descreva o que o cliente solicitou. Será visível para o cliente no painel dele.</p>
                </div>

                <div>
                  <button 
                    type="button" 
                    onClick={() => setShowInternalNotes(!showInternalNotes)} 
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${showInternalNotes ? 'rotate-90' : ''}`} />
                    <span className="font-medium">Notas Internas</span>
                    <span className="text-xs text-zinc-500">(visível apenas para a equipe)</span>
                  </button>
                  {showInternalNotes && (
                    <div className="mt-3">
                      <textarea 
                        name="admin_notes" 
                        id="admin_notes" 
                        rows={2} 
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Anotações internas da equipe sobre esta ordem..." 
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm p-3 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* O que acontece a seguir */}
              <div className="p-6 sm:p-8 bg-blue-500/10 border-t border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 text-blue-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    <p className="font-extrabold text-blue-400 mb-1">O que acontece depois?</p>
                    <p>Ao criar a ordem, você será redirecionado para a tela de detalhes onde poderá <strong>adicionar os itens/produtos</strong> adquiridos para o cliente. Os valores serão calculados automaticamente.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 sm:p-8 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-3">
                <Link 
                  href="/admin/service-orders" 
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 text-sm font-extrabold transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Link>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-extrabold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                  Criar Ordem e Adicionar Itens
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
