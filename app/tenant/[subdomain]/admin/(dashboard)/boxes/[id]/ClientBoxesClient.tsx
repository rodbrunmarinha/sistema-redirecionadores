"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ArrowLeft, 
  LayoutDashboard, 
  Box as BoxIcon, 
  ShoppingBag, 
  Truck, 
  Wrench, 
  ShoppingCart, 
  Users, 
  MapPin, 
  Store,
  List,
  Plus,
  Eye,
  Edit,
  Printer,
  ChevronDown,
  ChevronUp,
  Table,
  LayoutGrid,
  Filter,
  Package,
  PackageCheck,
  Map,
  Calendar,
  X
} from "lucide-react";

interface ProductImage {
  image: string;
  isBox: boolean;
}

interface BoxItem {
  id: string;
  date: string;
  tracking: string;
  store: string;
  location: string | null;
  products: ProductImage[];
  weight: string;
}

interface ClientBoxesClientProps {
  client: {
    id: string;
    name: string;
    email: string;
    suite: string;
    initials: string;
    status: string;
  };
  boxes: BoxItem[];
}

export default function ClientBoxesClient({ client, boxes }: ClientBoxesClientProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === boxes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(boxes.map(b => b.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

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
              Caixas Recebidas
            </span>
          </nav>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link href={`/admin/clients/${client.id}`} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition shrink-0 border border-zinc-700" title="Voltar ao cliente">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-amber-500 shrink-0 shadow-lg">
                {client.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 truncate">{client.name}</h1>
                  {client.status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Ativo</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mt-0.5">
                  {client.email} <span className="mx-1 opacity-60">·</span> {client.suite}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href={`/admin/boxes/create?client_id=${client.id}`} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-95 text-sm">
                <Plus className="w-4 h-4 shrink-0" />
                Nova Caixa
              </Link>
              <Link href="/admin/boxes" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-semibold rounded-xl transition shadow-sm active:scale-95 text-sm">
                <List className="w-4 h-4 shrink-0" />
                Ver lista completa
              </Link>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link href={`/admin/clients/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Visão Geral</span>
            </Link>
            <Link href={`/admin/boxes/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition shadow-sm bg-amber-500 text-zinc-950 shadow-amber-500/20">
              <BoxIcon className="w-4 h-4 shrink-0" />
              <span>Caixas</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-900/20 text-zinc-900">2</span>
            </Link>
            <Link href={`/admin/products?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Produtos</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">3</span>
            </Link>
            <Link href={`/admin/shipments/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Truck className="w-4 h-4 shrink-0" />
              <span>Envios</span>
            </Link>
            <Link href={`/admin/service-orders?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Serviços</span>
            </Link>
            <Link href={`/admin/online-purchases?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Compra Assistida</span>
            </Link>
            <Link href={`/admin/purchase-group-orders?client_id=${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Users className="w-4 h-4 shrink-0" />
              <span>Pedidos em Grupo</span>
            </Link>
            <Link href={`/admin/clients/${client.id}/addresses`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Endereços</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300">0</span>
            </Link>
            <Link href={`/admin/store/orders/${client.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 border border-zinc-800">
              <Store className="w-4 h-4 shrink-0" />
              <span>Loja</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Caixas listadas</p>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-white">2</p>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Caixas c/ cliente</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <PackageCheck className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-white">2</p>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Localizadas</p>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Map className="w-4 h-4 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-white">1</p>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Rec. em 7 dias</p>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-white">2</p>
          </div>
        </div>

        {/* Filters Toggle */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
          <button 
            type="button" 
            onClick={() => setFiltersOpen(!filtersOpen)} 
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Filter className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Filtros rápidos</span>
            </div>
            {filtersOpen ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
          </button>

          {filtersOpen && (
            <div className="px-5 pb-5 pt-2 border-t border-zinc-800">
              <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Nome do Cliente</label>
                  <input type="text" placeholder="Buscar por cliente" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">ID da Caixa</label>
                  <input type="text" placeholder="#" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Suíte</label>
                  <input type="text" placeholder="Ex: 1234" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Rastreio</label>
                  <input type="text" placeholder="BR1234..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-amber-500 outline-none" />
                </div>
                <div className="flex items-end lg:col-start-4">
                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-white px-5 py-2 text-sm font-bold text-zinc-950 transition active:scale-95">
                    Filtrar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-zinc-800">
            <div>
              <p className="text-sm font-bold text-zinc-100">Lista de recebimentos</p>
              <p className="text-xs text-zinc-500 mt-0.5">{boxes.length} caixa(s) encontrada(s)</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center rounded-xl border border-zinc-800 p-1 bg-zinc-950">
                <button 
                  onClick={() => setViewMode('table')} 
                  className={`rounded-lg p-2 transition-all ${viewMode === 'table' ? 'bg-zinc-800 text-amber-500 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Ver como tabela"
                >
                  <Table className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('cards')} 
                  className={`rounded-lg p-2 transition-all ${viewMode === 'cards' ? 'bg-zinc-800 text-amber-500 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Ver como cards"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
              <Link href={`/admin/boxes/create?client_id=${client.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-sm font-bold text-zinc-950 shadow-sm transition active:scale-95">
                <Plus className="w-4 h-4" />
                Nova Caixa
              </Link>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-950/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.size === boxes.length && boxes.length > 0}
                        onChange={toggleAll}
                        className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/20"
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-left">ID</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-left">Cliente / Suíte</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-left">Rastreio</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-left">Loja</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-left">Localização</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">Produtos</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-left">Peso</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {boxes.map(box => (
                    <tr key={box.id} className={`hover:bg-zinc-800/50 transition-colors ${selectedIds.has(box.id) ? 'bg-amber-500/5' : ''}`}>
                      <td className="px-4 py-3.5 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(box.id)}
                          onChange={() => toggleSelection(box.id)}
                          className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Link href={`/admin/boxes/${box.id}`} className="font-mono text-xs font-bold text-amber-500 hover:underline">
                          #{box.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="shrink-0 inline-flex items-center rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-xs font-bold text-zinc-300">
                            {client.suite.replace('Suíte ', '')}
                          </span>
                          <span className="text-xs text-zinc-500">{box.date}</span>
                        </div>
                        <Link href={`/admin/clients/${client.id}`} className="text-sm font-bold text-zinc-200 hover:text-amber-500 hover:underline transition-colors">
                          {client.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block max-w-full truncate rounded-lg bg-zinc-950 border border-zinc-800 px-2.5 py-1 text-xs font-mono font-bold text-zinc-300">
                          {box.tracking}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-zinc-300">
                        {box.store}
                      </td>
                      <td className="px-4 py-3.5">
                        {box.location ? (
                          <span className="inline-flex items-center rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs font-bold text-purple-400">
                            {box.location}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs font-bold text-yellow-400">
                            Sem localização
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex -space-x-2 justify-center">
                          {box.products.map((p, idx) => (
                            <div key={idx} className="relative">
                              <img src={p.image} className="w-8 h-8 rounded-lg object-cover ring-2 ring-zinc-900 bg-zinc-800 shrink-0" alt="Produto" />
                              {p.isBox && (
                                <span className="absolute bottom-0 left-0 text-[8px] font-bold bg-amber-500 text-zinc-950 px-1 py-0.5 rounded-sm leading-none">
                                  caixa
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-zinc-300 whitespace-nowrap">
                        {box.weight}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link href={`/admin/boxes/${box.id}`} className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-500 hover:bg-zinc-700 flex items-center justify-center transition">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/boxes/edit/${box.id}`} className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-blue-400 hover:bg-zinc-700 flex items-center justify-center transition">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700 flex items-center justify-center transition">
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {boxes.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-zinc-500 text-sm">
                        Nenhuma caixa encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="p-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {boxes.map(box => (
                <article key={box.id} className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-amber-500/50 transition-colors overflow-hidden">
                  <div className="flex items-start gap-3 px-4 py-4 border-b border-zinc-800/50">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(box.id)}
                      onChange={() => toggleSelection(box.id)}
                      className="mt-1 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-amber-500 tracking-tight">#{box.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300">{client.suite}</span>
                        <span className="text-[10px] text-zinc-500 ml-auto">{box.date.split(' ')[0]}</span>
                      </div>
                      <p className="text-sm font-bold text-zinc-100 truncate">{client.name}</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-xs text-zinc-400">
                        <span className="font-mono text-zinc-300">{box.tracking}</span>
                        <span>·</span>
                        <span>{box.store}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-zinc-800/50 scrollbar-hide">
                    {box.products.map((p, idx) => (
                      <div key={idx} className="relative shrink-0">
                        <img src={p.image} className="w-14 h-14 rounded-xl object-cover bg-zinc-800 border border-zinc-700" alt="Produto" />
                        {p.isBox && (
                          <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-amber-500 text-zinc-950 px-1 py-0.5 rounded-sm leading-none">
                            caixa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 px-4 py-4">
                    <div className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-3 text-center">
                      <p className="text-lg font-black text-zinc-200 leading-none">{box.products.length}</p>
                      <p className="text-[10px] font-bold text-zinc-500 mt-1.5 uppercase tracking-wider">Produtos</p>
                    </div>
                    <div className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-3 text-center">
                      <p className="text-sm font-black text-zinc-200 leading-none mt-1">{box.weight}</p>
                      <p className="text-[10px] font-bold text-zinc-500 mt-1.5 uppercase tracking-wider">Peso Total</p>
                    </div>
                    <div className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-3 text-center flex flex-col justify-center">
                      {box.location ? (
                        <p className="text-sm font-black text-purple-400 leading-none">{box.location}</p>
                      ) : (
                        <p className="text-sm font-black text-yellow-500 leading-none">—</p>
                      )}
                      <p className="text-[10px] font-bold text-zinc-500 mt-1.5 uppercase tracking-wider">
                        {box.location ? 'Local' : 'Sem local'}
                      </p>
                    </div>
                  </div>

                  <div className="flex border-t border-zinc-800/50 mt-auto">
                    <Link href={`/admin/boxes/${box.id}`} className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-amber-500 hover:bg-zinc-800 transition">
                      <Eye className="w-4 h-4" />
                      Ver
                    </Link>
                    <div className="w-px bg-zinc-800 self-stretch"></div>
                    <Link href={`/admin/boxes/edit/${box.id}`} className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition">
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8">
          <div className="bg-zinc-800 border border-zinc-700 shadow-2xl rounded-2xl py-3 px-5 flex items-center gap-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs">
                {selectedIds.size}
              </span>
              <span className="font-bold text-zinc-100">Selecionadas</span>
            </div>
            
            <div className="w-px h-6 bg-zinc-700"></div>

            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition">
                <Package className="w-4 h-4" />
                Guardar
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition">
                <Users className="w-4 h-4" />
                Transferir
              </button>
            </div>

            <button onClick={clearSelection} className="ml-2 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition" title="Limpar seleção">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
