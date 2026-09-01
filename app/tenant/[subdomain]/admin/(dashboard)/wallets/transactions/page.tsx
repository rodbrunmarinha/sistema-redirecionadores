"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ChevronRight, ArrowUpRight, ArrowDownRight, Wallet, 
  Search, Download, Filter, FileText, Loader2 
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AllTransactionsPage({ params }: { params: Promise<{ subdomain: string }> | { subdomain: string } }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  const resolvedParams = params instanceof Promise ? use(params) : params;

  const fetchTransactions = async () => {
    setLoading(true);
    let query = supabase
      .from("wallet_transactions")
      .select("*, profiles!inner(full_name, suite_number)")
      .order("created_at", { ascending: false });

    // Apply period filter
    if (periodFilter) {
      const days = parseInt(periodFilter);
      const date = new Date();
      date.setDate(date.getDate() - days);
      query = query.gte("created_at", date.toISOString());
    }

    // Apply direction filter
    if (directionFilter === "in") {
      query = query.eq("type", "CREDIT");
    } else if (directionFilter === "out") {
      query = query.eq("type", "DEBIT");
    }

    // Status filter
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching all transactions:", error);
    }
    
    let filteredData = data || [];

    // Search term filtering on client side (or we can use ilike on profiles.full_name, but client side is fine for now)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(t => 
        (t.profiles?.full_name?.toLowerCase().includes(lowerTerm)) ||
        (t.description?.toLowerCase().includes(lowerTerm)) ||
        (t.id?.toLowerCase().includes(lowerTerm))
      );
    }

    setTransactions(filteredData);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [directionFilter, statusFilter, periodFilter]); // Re-fetch when selects change

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  // Calculate filtered stats
  const totalIn = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalOut = transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + Number(t.amount), 0);
  const netBalance = totalIn - totalOut;

  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-white/70">
            <Link href={`/admin`} className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/admin/wallets`} className="hover:text-white transition-colors">Créditos</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-white font-medium truncate">Todas Transações</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-lg shrink-0">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Todas Transações</h1>
                <p className="text-amber-100 text-sm mt-0.5">Histórico completo de movimentações</p>
              </div>
            </div>
            
            <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold rounded-xl transition backdrop-blur-sm text-sm shrink-0">
              <Download className="w-4 h-4 shrink-0" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 border-t-2 border-t-emerald-400 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Entradas (filtrado)</p>
                <p className="text-2xl font-bold text-emerald-400">${totalIn.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 border-t-2 border-t-red-400 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Saídas (filtrado)</p>
                <p className="text-2xl font-bold text-red-400">${totalOut.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 border-t-2 border-t-blue-400 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Saldo Líquido (filtrado)</p>
                <p className="text-2xl font-bold text-blue-400">${netBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente, referência ou descrição..." 
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
              />
            </div>
            
            <select 
              value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="">Todos os tipos</option>
              <option value="deposit">Depósito</option>
              <option value="spend">Consumo</option>
              <option value="refund">Estorno</option>
              <option value="adjustment">Ajuste</option>
            </select>
            
            <select 
              value={directionFilter} onChange={(e) => setDirectionFilter(e.target.value)}
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="">Todas direções</option>
              <option value="in">Entrada</option>
              <option value="out">Saída</option>
            </select>
            
            <select 
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="">Todos os status</option>
              <option value="confirmed">Confirmado</option>
              <option value="pending">Pendente</option>
              <option value="canceled">Cancelado</option>
            </select>
            
            <select 
              value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="">Todo período</option>
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
            </select>
            
            <button type="submit" className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition">
              Filtrar
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                <Filter className="w-8 h-8 text-zinc-500" />
              </div>
              <p className="text-zinc-400">Nenhuma transação encontrada com os filtros atuais.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-950/50 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase text-xs">Data</th>
                    <th className="px-6 py-4 font-semibold uppercase text-xs">Cliente</th>
                    <th className="px-6 py-4 font-semibold uppercase text-xs">Tipo</th>
                    <th className="px-6 py-4 font-semibold uppercase text-xs">Descrição</th>
                    <th className="px-6 py-4 font-semibold uppercase text-xs text-right">Valor</th>
                    <th className="px-6 py-4 font-semibold uppercase text-xs text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {transactions.map(t => {
                    const date = new Date(t.created_at);
                    const isCredit = t.type === 'CREDIT';
                    
                    return (
                      <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-white">{date.toLocaleDateString('pt-BR')}</p>
                          <p className="text-xs text-zinc-400">{date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/wallets/${t.customer_id}`} className="group block">
                            <p className="text-sm font-medium text-white group-hover:text-orange-500 transition">
                              {t.profiles?.full_name || 'Desconhecido'}
                            </p>
                            <p className="text-xs text-zinc-400">#{t.profiles?.suite_number || '---'}</p>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                            isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {isCredit ? 'Ajuste (Entrada)' : 'Ajuste (Saída)'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-white max-w-xs truncate" title={t.description}>{t.description || "N/A"}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-lg font-bold ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isCredit ? '+' : '-'}${Number(t.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                            {t.status || 'Confirmado'}
                          </span>
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
    </div>
  );
}
