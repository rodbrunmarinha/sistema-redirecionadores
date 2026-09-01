"use client";

import { useState } from "react";
import { Bell, Plus, Package } from "lucide-react";
import Link from "next/link";

export default function PreAlertsClient({ preAlerts, subdomain }: { preAlerts: any[], subdomain: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = preAlerts.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const match = (p.tracking_number || "").toLowerCase().includes(s) ||
                    (p.store_name || "").toLowerCase().includes(s) ||
                    (p.description || "").toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });

  const pendingCount = preAlerts.filter(p => p.status === 'pending').length;
  const arrivedCount = preAlerts.filter(p => p.status === 'received').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              <Bell className="w-5 h-5 text-white" />
            </span>
            Pré-Alertas
          </h1>
          <p className="text-zinc-600 mt-1">Avise o armazém antes da sua encomenda chegar</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-semibold">
              {pendingCount} Aguardando
            </div>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold">
              {arrivedCount} Chegaram
            </div>
          </div>
          <Link href={`/app/pre-alerts/create`} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-colors">
            <Plus className="w-5 h-5" />
            Novo Pré-Alerta
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, loja, rastreio..." 
            className="flex-1 px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors appearance-none pr-10"
          >
            <option value="">Todos</option>
            <option value="pending">Aguardando</option>
            <option value="received">Chegaram</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* List / Empty State */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Bell className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Nenhum pré-alerta encontrado</h3>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">
              Crie um pré-alerta antes de fazer um pedido para que o armazém saiba que uma encomenda está chegando e processe ela mais rápido.
            </p>
            <Link href={`/app/pre-alerts/create`} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-colors">
              <Plus className="w-5 h-5" />
              Novo Pré-Alerta
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Loja</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Rastreio</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Prev. Chegada</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Criado Em</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filtered.map(p => {
                  const createdDate = new Date(p.created_at);
                  const dateStr = createdDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '');
                  const shortId = p.id.split('-')[0].substring(0, 4).toUpperCase();
                  const displayCode = `PA-${dateStr}-${shortId}`;

                  const formatDisplayDate = (dString: string | null) => {
                    if (!dString) return "-";
                    // If it's a date only string from DB (YYYY-MM-DD), add time to prevent timezone shift or just parse properly
                    const d = new Date(dString);
                    // Add timezone offset correction if it's a date-only string like '2026-08-26'
                    if (dString.length === 10) {
                      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
                    }
                    return d.toLocaleDateString('pt-BR');
                  };

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 tracking-wide">
                          {displayCode}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold text-zinc-800">{p.store_name || "-"}</div>
                        {p.order_number && (
                          <div className="text-xs text-zinc-500 mt-0.5 font-medium"># {p.order_number}</div>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-zinc-600 font-medium">{p.tracking_number}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          p.status === 'received' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-zinc-100 text-zinc-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'pending' ? 'bg-amber-500' :
                            p.status === 'received' ? 'bg-emerald-500' :
                            'bg-zinc-400'
                          }`}></span>
                          {p.status === 'pending' ? 'Aguardando' : p.status === 'received' ? 'Recebido' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-zinc-600 font-medium">
                          {formatDisplayDate(p.estimated_arrival)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-zinc-600 font-medium">
                          {formatDisplayDate(p.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <Link href={`/app/pre-alerts/${p.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-indigo-500/20">
                          Ver
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
