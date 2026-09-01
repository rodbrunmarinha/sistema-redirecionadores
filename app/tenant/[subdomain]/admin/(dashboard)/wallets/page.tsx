"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, Wallet, Download, Activity, Search, 
  ArrowUpRight, ArrowDownRight, DollarSign, Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function WalletsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncoming, setTotalIncoming] = useState(0);
  const [totalOutgoing, setTotalOutgoing] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [positiveClientsCount, setPositiveClientsCount] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);

    // 1. Get all profiles
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, suite_number, wallet_balance")
      .order("wallet_balance", { ascending: false });

    // 2. Get this month's transactions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: transactions } = await supabase
      .from("wallet_transactions")
      .select("amount, type")
      .gte("created_at", startOfMonth.toISOString());

    if (!profileError && profiles) {
      setClients(profiles);

      // Compute stats
      let totBal = 0;
      let rec = 0;
      let posCount = 0;
      
      profiles.forEach(p => {
        const bal = Number(p.wallet_balance || 0);
        totBal += bal;
        if (bal > 0) posCount++;
        if (bal < 0) rec += Math.abs(bal);
      });

      setTotalBalance(totBal);
      setReceivables(rec);
      setPositiveClientsCount(posCount);
    }

    if (transactions) {
      let inc = 0;
      let out = 0;
      transactions.forEach(t => {
        if (t.type === 'CREDIT') inc += Number(t.amount);
        if (t.type === 'DEBIT') out += Number(t.amount);
      });
      setTotalIncoming(inc);
      setTotalOutgoing(out);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter clients for display
  const filteredClients = clients.filter(c => {
    // Search
    if (search) {
      const s = search.toLowerCase();
      const matchesName = c.full_name?.toLowerCase().includes(s);
      const matchesEmail = c.email?.toLowerCase().includes(s);
      const matchesDock = c.suite_number?.toString().includes(s);
      if (!matchesName && !matchesEmail && !matchesDock) return false;
    }
    // Balance Filter
    const bal = Number(c.wallet_balance || 0);
    if (balanceFilter === "positive" && bal <= 0) return false;
    if (balanceFilter === "zero" && bal !== 0) return false;
    if (balanceFilter === "negative" && bal >= 0) return false;

    return true;
  });

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
            <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-white font-medium">Créditos</span>
          </nav>
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-lg shrink-0 border border-white/10">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gerenciar Wallets</h1>
                <p className="text-orange-100 text-sm mt-1 font-medium">Adicione ou remova créditos dos clientes</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition text-sm">
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
              <Link href="/admin/wallets/transactions" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-zinc-900 hover:bg-white/90 font-bold rounded-xl transition shadow-lg text-sm">
                <Activity className="w-4 h-4" />
                Todas Transações
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Balance */}
          <div className="relative bg-zinc-900 rounded-2xl p-5 border border-zinc-800 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-t-2xl"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Saldo Total</span>
            </div>
            <p className="text-2xl font-bold text-white">${totalBalance.toFixed(2)}</p>
            <p className="text-xs text-zinc-500 mt-1">Total em carteiras</p>
          </div>

          {/* Com Saldo */}
          <button onClick={() => setBalanceFilter("positive")} className={`relative bg-zinc-900 rounded-2xl p-5 border border-zinc-800 overflow-hidden hover:bg-zinc-800/50 transition text-left ${balanceFilter === 'positive' ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Com Saldo</span>
            </div>
            <p className="text-2xl font-bold text-white">{positiveClientsCount}</p>
            <p className="text-xs text-zinc-500 mt-1">clientes</p>
          </button>

          {/* Entradas */}
          <div className="relative bg-zinc-900 rounded-2xl p-5 border border-zinc-800 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Entradas (mês)</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">${totalIncoming.toFixed(2)}</p>
            <p className="text-xs text-zinc-500 mt-1">Este mês</p>
          </div>

          {/* Saídas */}
          <div className="relative bg-zinc-900 rounded-2xl p-5 border border-zinc-800 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 to-red-500 rounded-t-2xl"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-sm">
                <ArrowDownRight className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Saídas (mês)</span>
            </div>
            <p className="text-2xl font-bold text-red-400">${totalOutgoing.toFixed(2)}</p>
            <p className="text-xs text-zinc-500 mt-1">Este mês</p>
          </div>

          {/* A Receber */}
          <button onClick={() => setBalanceFilter("negative")} className={`col-span-2 lg:col-span-1 relative bg-zinc-900 rounded-2xl p-5 border border-zinc-800 overflow-hidden hover:bg-zinc-800/50 transition text-left ${balanceFilter === 'negative' ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-2xl"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">A Receber</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">${receivables.toFixed(2)}</p>
            <p className="text-xs text-zinc-500 mt-1">{receivables > 0 ? "Clientes devedores" : "Nenhum cliente devedor"}</p>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, email ou dock..." 
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            
            <select 
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none sm:w-48"
            >
              <option value="">Todos os saldos</option>
              <option value="positive">Com saldo positivo</option>
              <option value="zero">Saldo zero</option>
              <option value="negative">Saldo negativo</option>
            </select>
            
            <button 
              onClick={() => { setBalanceFilter(""); setSearch(""); }}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 text-center shadow-lg">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-lg font-bold text-white">Nenhum cliente encontrado</h3>
            <p className="text-zinc-500 mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Cliente</th>
                    <th className="px-6 py-4 font-semibold">Dock</th>
                    <th className="px-6 py-4 font-semibold text-right">Saldo</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredClients.map((c) => {
                    const bal = Number(c.wallet_balance || 0);
                    const isZero = bal === 0;
                    const isPos = bal > 0;
                    
                    return (
                      <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                              {c.full_name?.substring(0, 2).toUpperCase() || "??"}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">{c.full_name || "Desconhecido"}</p>
                              <p className="text-xs text-zinc-500">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold tracking-wide border border-zinc-700">
                            #{c.suite_number}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-lg font-bold ${isPos ? 'text-emerald-400' : isZero ? 'text-zinc-500' : 'text-red-400'}`}>
                            ${Math.abs(bal).toFixed(2)}
                            {bal < 0 && ' (Devendo)'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            isPos ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            isZero ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' : 
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPos ? 'bg-emerald-400' : isZero ? 'bg-zinc-400' : 'bg-red-400'}`}></span>
                            {isPos ? 'Positivo' : isZero ? 'Zerado' : 'Negativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            href={`/admin/wallets/${c.id}`} 
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            Gerenciar
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
