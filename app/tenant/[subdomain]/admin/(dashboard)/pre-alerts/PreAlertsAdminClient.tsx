"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { Table, LayoutGrid, Trash2, ChevronRight, Package, Calendar, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { deletePreAlertAction } from "@/app/actions/deletePreAlert";
import { useRouter } from "next/navigation";

export default function PreAlertsAdminClient({ preAlerts, subdomain }: { preAlerts: any[], subdomain: string }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [delId, setDelId] = useState("");
  const [delRef, setDelRef] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const generateCode = (id: string, createdAt: string) => {
    const d = new Date(createdAt);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth()+1).padStart(2, '0')}${String(d.getFullYear()).slice(2)}`;
    const shortId = id.split('-')[0].slice(0, 4).toUpperCase();
    return `PA-${dateStr}-${shortId}`;
  };

  const formatDisplayDate = (dString: string | null) => {
    if (!dString) return "-";
    const d = new Date(dString);
    if (dString.length === 10) d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toLocaleDateString('pt-BR');
  };

  const openDeleteModal = (id: string, code: string) => {
    setDelId(id);
    setDelRef(code);
    setShowDelete(true);
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deletePreAlertAction(delId, subdomain);
      if (res.success) {
        toast.success("Pré-alerta excluído com sucesso!");
        setShowDelete(false);
        router.refresh();
      } else {
        toast.error("Erro ao excluir: " + res.error);
      }
    });
  };

  // Metrics
  const today = new Date().toISOString().split('T')[0];
  const aguardandoCount = preAlerts.filter(p => p.status === 'pending').length;
  const chegaramHojeCount = preAlerts.filter(p => p.status === 'received' && p.updated_at?.startsWith(today)).length;
  const atrasadosCount = preAlerts.filter(p => p.status === 'pending' && p.estimated_arrival && p.estimated_arrival < today).length;

  // Filtered List
  const filteredAlerts = useMemo(() => {
    return preAlerts.filter(p => {
      const matchesStatus = statusFilter === "" || p.status === statusFilter;
      if (!matchesStatus) return false;
      if (!searchQuery) return true;
      
      const q = searchQuery.toLowerCase();
      const code = generateCode(p.id, p.created_at).toLowerCase();
      return (
        code.includes(q) ||
        (p.store_name || "").toLowerCase().includes(q) ||
        (p.tracking_number || "").toLowerCase().includes(q) ||
        (p.receiving_code || "").toLowerCase().includes(q) ||
        (p.profiles?.full_name || "").toLowerCase().includes(q) ||
        (p.profiles?.suite_number?.toString() || "").includes(q)
      );
    });
  }, [preAlerts, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Pré-Alertas</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0 text-white">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Pré-Alertas</h1>
                <p className="mt-0.5 text-sm text-orange-50">Encomendas avisadas pelos clientes antes de chegarem</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-sm">
            <div className="text-xl sm:text-2xl font-extrabold text-amber-500">{aguardandoCount}</div>
            <div className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-tight">Aguardando chegada</div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-sm">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-500">{chegaramHojeCount}</div>
            <div className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-tight">Chegaram hoje</div>
          </div>
          <div className="rounded-2xl p-4 sm:p-5 border shadow-sm bg-zinc-900 border-zinc-800">
            <div className="text-xl sm:text-2xl font-extrabold text-zinc-500">{atrasadosCount}</div>
            <div className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-tight">Atrasados</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3 relative">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Código, loja, rastreio, cód. recebimento, dock, cliente..." 
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-zinc-700 bg-zinc-950 text-white text-sm focus:border-indigo-500 focus:ring-indigo-500 transition" 
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border-zinc-700 bg-zinc-950 text-white text-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            >
              <option value="">Todos os status</option>
              <option value="pending">Aguardando</option>
              <option value="received">Chegaram</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>
        </div>

        {/* List / Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* View Toggle */}
          <div className="flex items-center justify-end px-4 pt-4 mb-4">
            <div className="hidden md:flex items-center rounded-xl border border-zinc-800 p-1 bg-zinc-950" role="group">
              <button 
                type="button" 
                onClick={() => setViewMode('table')} 
                className={`rounded-lg p-2 transition-all ${viewMode === 'table' ? 'bg-zinc-800 shadow text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Table className="h-4 w-4" />
              </button>
              <button 
                type="button" 
                onClick={() => setViewMode('cards')} 
                className={`rounded-lg p-2 transition-all ${viewMode === 'cards' ? 'bg-zinc-800 shadow text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="divide-y divide-zinc-800/50">
              {filteredAlerts.map((p) => {
                const code = generateCode(p.id, p.created_at);
                const isNew = p.status === 'pending';
                return (
                  <div key={p.id} className="relative group">
                    <Link href={`/admin/pre-alerts/${p.id}`} className="flex items-start gap-3 px-4 py-4 pr-14 hover:bg-zinc-800/50 transition">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${p.status === 'pending' ? 'bg-amber-500 animate-pulse' : p.status === 'received' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <code className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-xs font-mono font-bold">{code}</code>
                          {isNew && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold">Novo</span>}
                          {p.receiving_code && (
                            <code className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-md text-xs font-mono font-bold">{p.receiving_code}</code>
                          )}
                        </div>
                        <div className="font-semibold text-sm text-white truncate">{p.profiles?.full_name || "Cliente Desconhecido"}</div>
                        <div className="text-xs text-zinc-400 truncate">
                          {p.store_name || "-"} {p.order_number ? `· # ${p.order_number}` : ''} · Dock {p.profiles?.suite_number || "-"}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono truncate mt-0.5">
                          {p.tracking_number}
                          {p.carrier && <span className="not-italic"> · {p.carrier}</span>}
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap mt-2 text-[11px]">
                          <span className={`font-bold ${p.status === 'pending' ? 'text-amber-400' : p.status === 'received' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                            {p.status === 'pending' ? 'Aguardando' : p.status === 'received' ? 'Recebido' : 'Cancelado'}
                          </span>
                          <span className="text-zinc-600 select-none">·</span>
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Prev. chegada: {formatDisplayDate(p.estimated_arrival)}
                          </span>
                          <span className="text-zinc-600 select-none">·</span>
                          <span className="text-zinc-500">Criado: {formatDisplayDate(p.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                    <button 
                      type="button" 
                      onClick={() => openDeleteModal(p.id, code)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {filteredAlerts.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm">Nenhum pré-alerta encontrado.</div>
              )}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto table-scrollbar">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-950">
                  <tr>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Código</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Cliente</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Loja / Pedido</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Rastreio</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-orange-400 uppercase tracking-wider text-left">Cód. Recebimento</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Prev. Chegada</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Criado</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredAlerts.map((p) => {
                    const code = generateCode(p.id, p.created_at);
                    const isNew = p.status === 'pending';
                    return (
                      <tr key={p.id} className="hover:bg-zinc-800/30 transition group">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <code className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-mono font-bold">{code}</code>
                            {isNew && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold">Novo</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-semibold text-white">{p.profiles?.full_name || "Cliente Desconhecido"}</div>
                          <div className="text-xs text-zinc-400">Dock {p.profiles?.suite_number || "-"}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-medium text-white">{p.store_name || "-"}</div>
                          {p.order_number && <div className="text-xs text-zinc-400"># {p.order_number}</div>}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <code className="text-xs font-mono text-zinc-300">{p.tracking_number}</code>
                          {p.carrier && <div className="text-xs text-zinc-500">{p.carrier}</div>}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {p.receiving_code ? (
                            <code className="px-2.5 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-xs font-mono font-bold">{p.receiving_code}</code>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            p.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                            p.status === 'received' ? 'bg-emerald-500/10 text-emerald-400' :
                            'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                              p.status === 'received' ? 'bg-emerald-500' :
                              'bg-zinc-500'
                            }`}></span>
                            {p.status === 'pending' ? 'Aguardando' : p.status === 'received' ? 'Recebido' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-xs text-zinc-400">
                          {formatDisplayDate(p.estimated_arrival)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-xs text-zinc-500">
                          {formatDisplayDate(p.created_at)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link href={`/admin/pre-alerts/${p.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition">
                              Ver
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                            <button type="button" onClick={() => openDeleteModal(p.id, code)} className="inline-flex items-center justify-center w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredAlerts.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm border-t border-zinc-800">Nenhum pré-alerta encontrado.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDelete(false)}></div>
          <div className="relative bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-800">
            <div className="bg-red-500/10 px-6 pt-8 pb-6 text-center border-b border-red-500/20">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 ring-2 ring-red-500/30">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Excluir pré-alerta</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 bg-zinc-950 rounded-2xl px-4 py-3 border border-zinc-800">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Ref.</span>
                <span className="font-mono font-bold text-white text-sm truncate">{delRef}</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tem certeza que deseja excluir este pré-alerta? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-3">
              <button 
                type="button" 
                onClick={() => setShowDelete(false)} 
                className="flex-1 px-5 py-2.5 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-xl font-semibold text-sm transition"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isPending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
