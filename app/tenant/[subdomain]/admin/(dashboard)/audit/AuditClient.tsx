"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Filter, 
  Search, 
  ChevronDown,
  FileSearch,
  LayoutGrid,
  Table as TableIcon
} from "lucide-react";

export function AuditClient({ logs, totalLogs, tenant, searchParams }: any) {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  // Format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("pt-BR"),
      time: d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  const fieldLabels: Record<string, any> = {
    "__created__": { label: "Cadastro", color: "emerald" },
    "__deleted__": { label: "Exclusão", color: "red" },
    "__shipped__": { label: "Envio", color: "blue" },
    "name": { label: "Nome", color: "gray" },
    "quantity": { label: "Quantidade", color: "amber" },
    "weight": { label: "Peso", color: "indigo" },
    "barcode": { label: "Código de Barras", color: "purple" },
    "photo_path": { label: "Foto", color: "pink" },
    "notes": { label: "Observações", color: "gray" },
    "created_at": { label: "Data de Cadastro", color: "blue" },
    "received_box_id": { label: "Caixa", color: "orange" },
    "user_id": { label: "Responsável", color: "teal" },
    "dock": { label: "Dock", color: "cyan" },
  };

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3">
            <Link href={`/admin`} className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
            <ChevronDown className="w-3.5 h-3.5 text-white/50 -rotate-90" />
            <span className="text-white font-medium">Auditoria</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Histórico de Auditoria</h1>
                <p className="text-amber-100 text-sm mt-0.5">Controle e rastreamento de todas as alterações realizadas em produtos</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center border border-white/20">
                <p className="text-amber-200 text-[10px] font-semibold uppercase tracking-widest">Total</p>
                <p className="text-2xl font-extrabold text-white">{totalLogs}</p>
              </div>
              <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center border border-white/20">
                <p className="text-amber-200 text-[10px] font-semibold uppercase tracking-widest">Página</p>
                <p className="text-2xl font-extrabold text-white">1<span className="text-sm font-medium text-amber-200">/1</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        
        {/* Filters */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800">
          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)} 
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-900/40 flex items-center justify-center">
                <Filter className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-200">Filtros</span>
            </div>
            <div className="flex items-center gap-3">
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {showFilters && (
            <div>
              <form method="GET" action={`/admin/audit`} className="px-5 pb-5 border-t border-zinc-800 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-300">Produto (ID)</label>
                    <input type="text" name="product_id" defaultValue={searchParams?.product_id} placeholder="UUID do produto" className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm placeholder-zinc-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-300">Campo</label>
                    <select name="field" defaultValue={searchParams?.field} className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white">
                      <option value="">Todos</option>
                      <option value="__created__">✅ Cadastro</option>
                      <option value="__deleted__">🗑️ Exclusão</option>
                      <option value="__shipped__">📤 Envio</option>
                      <option value="name">Nome</option>
                      <option value="quantity">Quantidade</option>
                      <option value="weight">Peso</option>
                      <option value="barcode">Código de Barras</option>
                      <option value="photo_path">Foto</option>
                      <option value="notes">Observações</option>
                      <option value="created_at">Data de Cadastro</option>
                      <option value="received_box_id">Caixa</option>
                      <option value="user_id">Responsável</option>
                      <option value="dock">Dock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-300">Data Inicial</label>
                    <input type="date" name="date_from" defaultValue={searchParams?.date_from} className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-zinc-300">Data Final</label>
                    <input type="date" name="date_to" defaultValue={searchParams?.date_to} className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm shadow-sm transition active:scale-[0.98]">
                      <Search className="w-4 h-4" />
                      Filtrar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Table/Cards */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800 overflow-hidden">
          
          <div className="hidden md:flex justify-end px-5 py-3 border-b border-zinc-800">
            <div className="hidden md:flex items-center rounded-xl border border-zinc-800 p-1 bg-zinc-950">
              <button 
                type="button" 
                onClick={() => setViewMode('table')} 
                className={`rounded-lg p-2 transition-all ${viewMode === 'table' ? 'bg-zinc-800 shadow text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <TableIcon className="h-4 w-4" />
              </button>
              <button 
                type="button" 
                onClick={() => setViewMode('cards')} 
                className={`rounded-lg p-2 transition-all ${viewMode === 'cards' ? 'bg-zinc-800 shadow text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y divide-zinc-800 ${viewMode === 'cards' ? 'block' : ''}`}>
              <thead className="bg-zinc-950/50">
                <tr className={viewMode === 'cards' ? 'hidden' : ''}>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Data/Hora</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Produto</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Campo Alterado</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left hidden lg:table-cell">Valor Anterior</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left hidden lg:table-cell">Novo Valor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Admin</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left hidden xl:table-cell">IP</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-zinc-800 ${viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 divide-y-0' : ''}`}>
                {logs.length > 0 ? logs.map((log: any) => {
                  const { date, time } = formatDate(log.created_at);
                  const fLabel = fieldLabels[log.field] || { label: log.field, color: 'gray' };
                  
                  return (
                    <tr key={log.id} className={`hover:bg-zinc-800/50 transition-colors ${viewMode === 'cards' ? 'flex flex-col border border-zinc-700/60 rounded-xl p-3 bg-zinc-900/50 shadow-sm' : ''}`}>
                      <td className={viewMode === 'cards' ? 'py-1.5 border-b border-zinc-800/50 flex items-center justify-between' : 'px-4 py-3 whitespace-nowrap'}>
                        {viewMode === 'cards' && <span className="text-xs text-zinc-500 uppercase font-semibold">Data/Hora</span>}
                        <div className={viewMode === 'cards' ? 'flex items-center gap-2' : ''}>
                          <p className="text-sm font-semibold text-zinc-200">{date}</p>
                          <p className="text-xs text-zinc-500 font-mono">{time}</p>
                        </div>
                      </td>
                      
                      <td className={viewMode === 'cards' ? 'py-1.5 border-b border-zinc-800/50 flex items-center justify-between gap-2 overflow-hidden' : 'px-4 py-3'}>
                        {viewMode === 'cards' && <span className="text-xs text-zinc-500 uppercase font-semibold shrink-0">Produto</span>}
                        {viewMode === 'cards' ? (
                          <div className="flex items-center gap-2 overflow-hidden justify-end">
                            <Link href={`/admin/products/${log.product_id}/edit`} className="text-sm font-semibold text-amber-500 hover:underline truncate" title={log.product?.name ? `#${log.product.id.split('-')[0]} ${log.product.name}` : `Produto #${log.product_id?.split('-')[0]}`}>
                              {log.product?.name ? `#${log.product.id.split('-')[0]} ${log.product.name}` : `Produto #${log.product_id?.split('-')[0]}`}
                            </Link>
                            <span className="text-xs text-zinc-500 shrink-0">Dock <span className="font-semibold text-zinc-300">{log.product?.customer?.suite_number || "N/A"}</span></span>
                          </div>
                        ) : (
                          <>
                            <Link href={`/admin/products/${log.product_id}/edit`} className="text-sm font-semibold text-amber-500 hover:underline">
                              {log.product?.name ? `#${log.product.id.split('-')[0]} ${log.product.name}` : `Produto #${log.product_id?.split('-')[0]}`}
                            </Link>
                            <p className="text-xs text-zinc-500 mt-0.5">Dock <span className="font-semibold">{log.product?.customer?.suite_number || "N/A"}</span></p>
                          </>
                        )}
                      </td>
                      
                      <td className={viewMode === 'cards' ? 'py-1.5 border-b border-zinc-800/50 flex items-center justify-between' : 'px-4 py-3 whitespace-nowrap'}>
                        {viewMode === 'cards' && <span className="text-xs text-zinc-500 uppercase font-semibold">Campo</span>}
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-${fLabel.color}-500/10 text-${fLabel.color}-400 border border-${fLabel.color}-500/20`}>
                          {fLabel.label}
                        </span>
                      </td>
                      
                      <td className={viewMode === 'cards' ? 'py-1.5 border-b border-zinc-800/50 flex items-center justify-between' : 'px-4 py-3 hidden lg:table-cell max-w-[160px]'}>
                        {viewMode === 'cards' && <span className="text-xs text-zinc-500 uppercase font-semibold shrink-0 mr-2">Valor Anterior</span>}
                        <div className={`font-mono text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 ${viewMode === 'cards' ? 'truncate max-w-[180px] text-right' : 'truncate'}`} title={log.old_value || "(vazio)"}>
                          {log.old_value || "(vazio)"}
                        </div>
                      </td>
                      
                      <td className={viewMode === 'cards' ? 'py-1.5 border-b border-zinc-800/50 flex items-center justify-between' : 'px-4 py-3 hidden lg:table-cell max-w-[160px]'}>
                        {viewMode === 'cards' && <span className="text-xs text-zinc-500 uppercase font-semibold shrink-0 mr-2">Novo Valor</span>}
                        <div className={`font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 ${viewMode === 'cards' ? 'truncate max-w-[180px] text-right' : 'truncate'}`} title={log.new_value || "(vazio)"}>
                          {log.new_value || "(vazio)"}
                        </div>
                      </td>
                      
                      <td className={viewMode === 'cards' ? 'py-1.5 border-b border-zinc-800/50 flex items-center justify-between' : 'px-4 py-3 whitespace-nowrap'}>
                        {viewMode === 'cards' && <span className="text-xs text-zinc-500 uppercase font-semibold">Admin</span>}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                            {log.admin?.full_name ? log.admin.full_name.substring(0, 2).toUpperCase() : "AD"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-zinc-200 truncate max-w-[100px]" title={log.admin?.full_name || "Admin"}>
                              {log.admin?.full_name || "Admin"}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className={viewMode === 'cards' ? 'py-1.5 flex items-center justify-between' : 'px-4 py-3 hidden xl:table-cell whitespace-nowrap'}>
                        {viewMode === 'cards' && <span className="text-xs text-zinc-500 uppercase font-semibold">IP</span>}
                        <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded-md border border-zinc-700">
                          {log.ip_address || "N/A"}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="h-10 w-10 text-zinc-700 mb-3" />
                        <p className="text-sm">Nenhum registro de auditoria encontrado.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
