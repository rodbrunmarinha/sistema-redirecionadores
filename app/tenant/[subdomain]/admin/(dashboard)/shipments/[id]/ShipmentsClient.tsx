"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ArrowLeft, 
  List, 
  LayoutGrid, 
  Package, 
  ShoppingBag, 
  Send, 
  Wrench, 
  ShoppingCart, 
  Users, 
  MapPin, 
  Store,
  Search,
  ChevronDown,
  Save,
  Inbox,
  X,
  AlertCircle,
  Clock,
  PackageOpen,
  CheckCircle2,
  Settings,
  Truck,
  Flag,
  XCircle
} from "lucide-react";

interface ShipmentsClientProps {
  client: {
    id: string;
    name: string;
    email: string;
    suite: string;
    initials: string;
    status: string;
  };
  stats: {
    pendingPayment: number;
    awaiting: number;
    paid: number;
    processing: number;
    shipped: number;
    completed: number;
    cancelled: number;
  };
}

export default function ShipmentsClient({ client, stats }: ShipmentsClientProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sfSaveOpen, setSfSaveOpen] = useState(false);
  
  // Bulk actions state
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  // Client search dropdown inside filters (simplified for React)
  const [clientSearchQ, setClientSearchQ] = useState("");
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState({ id: client.id, label: client.name });

  const bulkClear = () => setBulkIds([]);
  const bulkIsCancel = bulkStatus === 'cancelled';

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      
      {/* Header Profile Section */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm mb-6 text-zinc-400" aria-label="Breadcrumb">
            <Link href="/admin/dashboard" className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href="/admin/clients" className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Clientes
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/admin/clients/${client.id}`} className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              {client.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-100 font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Gerenciar Envios
            </span>
          </nav>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link href={`/admin/clients/${client.id}`} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition shrink-0 border border-zinc-700" title="Voltar ao cliente">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-amber-500 shrink-0">
                {client.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 truncate">{client.name}</h1>
                  {client.status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">Ativo</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mt-0.5">
                  {client.email} <span className="mx-1 opacity-60">·</span> {client.suite}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href="/admin/shipments" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-semibold rounded-xl transition shadow-sm active:scale-95 text-sm">
                <List className="w-4 h-4 shrink-0" />
                Ver lista completa
              </Link>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link href={`/admin/clients/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Visão Geral</span>
            </Link>
            <Link href={`/admin/boxes?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <Package className="w-4 h-4 shrink-0" />
              <span>Caixas</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">2</span>
            </Link>
            <Link href={`/admin/products?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Produtos</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">3</span>
            </Link>
            <Link href={`/admin/shipments/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20">
              <Send className="w-4 h-4 shrink-0" />
              <span>Envios</span>
            </Link>
            <Link href={`/admin/service-orders?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Serviços</span>
            </Link>
            <Link href={`/admin/online-purchases?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Compra Assistida</span>
            </Link>
            <Link href={`/admin/purchase-group-orders?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <Users className="w-4 h-4 shrink-0" />
              <span>Pedidos em Grupo</span>
            </Link>
            <Link href={`/admin/clients/${client.id}/addresses`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Endereços</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">0</span>
            </Link>
            <Link href={`/admin/store/orders?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
              <Store className="w-4 h-4 shrink-0" />
              <span>Loja</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <Link href={`/admin/shipments/${client.id}?group=pending`} className="relative group rounded-2xl bg-zinc-900/80 backdrop-blur border-2 border-zinc-800 hover:border-yellow-500/50 transition-all hover:-translate-y-0.5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-yellow-500/10 text-yellow-500">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-zinc-100">{stats.pendingPayment}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Pagamento Pendente</p>
            </div>
          </Link>

          <Link href={`/admin/shipments/${client.id}?group=awaiting`} className="relative group rounded-2xl bg-zinc-900/80 backdrop-blur border-2 border-zinc-800 hover:border-amber-500/50 transition-all hover:-translate-y-0.5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-amber-500/10 text-amber-500">
                  <PackageOpen className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-zinc-100">{stats.awaiting}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Em Preparação</p>
            </div>
          </Link>

          <Link href={`/admin/shipments/${client.id}?group=paid`} className="relative group rounded-2xl bg-zinc-900/80 backdrop-blur border-2 border-zinc-800 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-zinc-100">{stats.paid}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Pago</p>
            </div>
          </Link>

          <Link href={`/admin/shipments/${client.id}?group=processing`} className="relative group rounded-2xl bg-zinc-900/80 backdrop-blur border-2 border-zinc-800 hover:border-blue-500/50 transition-all hover:-translate-y-0.5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-blue-500/10 text-blue-500">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-zinc-100">{stats.processing}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Processando</p>
            </div>
          </Link>

          <Link href={`/admin/shipments/${client.id}?group=shipped`} className="relative group rounded-2xl bg-zinc-900/80 backdrop-blur border-2 border-zinc-800 hover:border-purple-500/50 transition-all hover:-translate-y-0.5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-purple-500/10 text-purple-400">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-zinc-100">{stats.shipped}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Enviados</p>
            </div>
          </Link>

          <Link href={`/admin/shipments/${client.id}?group=completed`} className="relative group rounded-2xl bg-zinc-900/80 backdrop-blur border-2 border-zinc-800 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-emerald-500/10 text-emerald-500">
                  <Flag className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-zinc-100">{stats.completed}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Concluídos</p>
            </div>
          </Link>

          <Link href={`/admin/shipments/${client.id}?group=cancelled`} className="relative group rounded-2xl bg-zinc-900/80 backdrop-blur border-2 border-zinc-800 hover:border-red-500/50 transition-all hover:-translate-y-0.5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-red-500/10 text-red-500">
                  <XCircle className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-zinc-100">{stats.cancelled}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 leading-snug break-words">Cancelados</p>
            </div>
          </Link>
        </div>

        {/* Filter Section */}
        <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800">
          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)} 
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Search className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold text-zinc-100">Buscar</span>
            </div>
            <div className="flex items-center gap-3">
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {showFilters && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={(e) => e.preventDefault()} className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Buscar</label>
                    <input type="text" placeholder="ID, tracking, nome..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
                  </div>

                  {/* Client Select (Disabled/Readonly in this specific view but kept for consistency) */}
                  <div className="relative">
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Cliente</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={selectedClient.label} 
                        readOnly 
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none opacity-80 cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Suíte</label>
                    <input type="text" placeholder="Nº da suíte" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Status</label>
                    <select className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                      <option value="">Todos</option>
                      <option value="awaiting_box_assembly">Aguardando Montagem da Caixa (0)</option>
                      <option value="awaiting_quote">Aguardando Orçamento (0)</option>
                      <option value="awaiting_measurement">Aguardando Medição (0)</option>
                      <option value="pending_payment">Pagamento Pendente (0)</option>
                      <option value="awaiting_payment_confirmation">Confirmando Pagamento (0)</option>
                      <option value="paid">Pago (0)</option>
                      <option value="processing">Processando (0)</option>
                      <option value="forwarded_to_carrier">Encaminhado para Transportadora (0)</option>
                      <option value="collected">Coletado (0)</option>
                      <option value="shipped">Enviado (0)</option>
                      <option value="in_transit">Em Trânsito (0)</option>
                      <option value="delivered">Entregue (0)</option>
                      <option value="cancelled">Cancelado (0)</option>
                      <option value="refunded">Reembolsado (0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Período</label>
                    <select className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                      <option value="">Todo período</option>
                      <option value="7">Últimos 7 dias</option>
                      <option value="30">Últimos 30 dias</option>
                      <option value="90">Últimos 90 dias</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-semibold text-sm transition active:scale-[0.98]">
                      <Search className="w-4 h-4" />
                      Filtrar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-zinc-800">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Método de Frete</label>
                    <select className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                      <option value="">Todos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Método de Pagamento</label>
                    <select className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                      <option value="">Todos</option>
                      <option value="wallet">Créditos</option>
                      <option value="pix">PIX</option>
                      <option value="credit_card">Cartão de Crédito</option>
                      <option value="boleto">Boleto</option>
                      <option value="parcelado_usa">Parcelado USA</option>
                      <option value="global_pays">Global Pays</option>
                      <option value="glin">Glin</option>
                      <option value="manual">Comprovante Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Alterado de</label>
                    <input type="date" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Alterado até</label>
                    <input type="date" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 [color-scheme:dark]" />
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
            <button 
              type="button" 
              onClick={() => setSfSaveOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed border-zinc-700 text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar filtro atual
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center px-6 py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-800/50 mb-6 shadow-sm border border-zinc-800">
              <Inbox className="h-10 w-10 text-zinc-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Nenhum envio encontrado</h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm">Os envios dos clientes aparecerão aqui assim que forem criados.</p>
          </div>
        </div>
      </div>

      {/* Save Filter Modal */}
      {sfSaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSfSaveOpen(false)}></div>
          <div className="relative w-full max-w-sm rounded-2xl bg-zinc-900 shadow-xl p-6 border border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-100">Salvar este filtro</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Fica só para você, nesta listagem. Salvar com um nome já usado atualiza aquele filtro.
            </p>
            <input 
              type="text" 
              maxLength={60} 
              required 
              placeholder="Ex.: Pagos deste mês" 
              className="mt-4 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setSfSaveOpen(false)} 
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={() => setSfSaveOpen(false)} 
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-semibold transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Fixed Bottom Bar */}
      {bulkIds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-zinc-900 border-t border-zinc-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-zinc-300 font-medium">
                <b className="text-zinc-100">{bulkIds.length}</b> envio(s) selecionado(s)
              </p>
              <div className="h-6 w-px bg-zinc-800"></div>
              <button 
                type="button" 
                onClick={() => setBulkConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 hover:bg-amber-600 rounded-lg text-sm font-semibold transition"
              >
                <Settings className="w-4 h-4" />
                Alterar status...
              </button>
            </div>
            <button 
              type="button" 
              onClick={bulkClear} 
              className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
              title="Limpar seleção"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Confirm Modal */}
      {bulkConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBulkConfirmOpen(false)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-100">Alterar status...</h3>
            <p className="mt-1 text-sm text-zinc-400">
              <span className="text-zinc-100 font-medium">{bulkIds.length}</span> envio(s) selecionado(s)
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setBulkConfirmOpen(false); bulkClear(); }} className="mt-4">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Novo Status
              </label>
              <select 
                required 
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Alterar status...</option>
                <optgroup label="Antes do pagamento" className="bg-zinc-900 text-zinc-400">
                  <option value="pending_payment" className="text-zinc-100">Pagamento Pendente</option>
                  <option value="awaiting_payment_confirmation" className="text-zinc-100">Confirmando Pagamento</option>
                  <option value="awaiting_box_assembly" className="text-zinc-100">Aguardando Montagem da Caixa</option>
                  <option value="awaiting_quote" className="text-zinc-100">Aguardando Orçamento</option>
                  <option value="awaiting_measurement" className="text-zinc-100">Aguardando Medição</option>
                </optgroup>
                <optgroup label="Preparação e envio" className="bg-zinc-900 text-zinc-400">
                  <option value="paid" className="text-zinc-100">Pago</option>
                  <option value="processing" className="text-zinc-100">Processando</option>
                  <option value="forwarded_to_carrier" className="text-zinc-100">Encaminhado para Transportadora</option>
                  <option value="collected" className="text-zinc-100">Coletado</option>
                  <option value="shipped" className="text-zinc-100">Enviado</option>
                  <option value="in_transit" className="text-zinc-100">Em Trânsito</option>
                  <option value="delivered" className="text-zinc-100">Entregue</option>
                </optgroup>
                <optgroup label="Encerramento" className="bg-zinc-900 text-zinc-400">
                  <option value="cancelled" className="text-zinc-100">Cancelado</option>
                </optgroup>
              </select>

              {bulkIsCancel && (
                <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-sm text-red-500">
                    Cancelar devolve os produtos destes envios ao estoque do cliente. Esta ação não pode ser desfeita.
                  </p>
                </div>
              )}

              <p className="mt-3 text-xs text-zinc-500">
                Envios cujo status atual não permite esta mudança serão ignorados e reportados no resultado.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setBulkConfirmOpen(false)} 
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={!bulkStatus} 
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
