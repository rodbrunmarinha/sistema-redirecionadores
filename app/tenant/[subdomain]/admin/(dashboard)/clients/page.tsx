"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { usePermissions } from "@/app/providers/PermissionsProvider";
import { 
  ChevronRight, 
  Users, 
  Plus, 
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Mail,
  Phone,
  Eye,
  Edit,
  UserCheck,
  X,
  AlertTriangle,
  Info,
  ExternalLink,
  CheckCircle2,
  Package,
  Loader2
} from "lucide-react";

export default function ClientsPage() {
  const supabase = createClient();
  const { hasPermission } = usePermissions();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Impersonate Modal State
  const [impersonateModalOpen, setImpersonateModalOpen] = useState(false);
  const [clientToImpersonate, setClientToImpersonate] = useState<{name: string, url: string} | null>(null);

  // Data State
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Busca clientes e o número de caixas associadas
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          suite_number,
          created_at,
          role,
          is_active,
          boxes!boxes_customer_id_fkey ( count )
        `)
        .eq('role', 'CUSTOMER');

      if (error) {
        console.error("Error fetching clients:", error);
        return;
      }

      if (data) {
        // Format data to match our UI expectations
        const formatted = data.map(client => ({
          id: client.id,
          dock: client.suite_number || "N/A",
          name: client.full_name || "Sem Nome",
          initial: client.full_name ? client.full_name.charAt(0).toUpperCase() : "?",
          since: new Date(client.created_at).toLocaleDateString('pt-BR'),
          email: client.email || "Sem e-mail",
          phone: client.phone || "Sem telefone",
          boxes: client.boxes && client.boxes[0] ? client.boxes[0].count : 0,
          status: client.is_active === false ? "Inativo" : "Ativo"
        }));
        setClients(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openImpersonate = (name: string, url: string) => {
    setClientToImpersonate({ name, url });
    setImpersonateModalOpen(true);
  };

  const closeImpersonate = () => {
    setImpersonateModalOpen(false);
    setTimeout(() => setClientToImpersonate(null), 200); // Wait for transition
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.dock.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Clientes
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg border border-white/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Meus Clientes</h1>
                <p className="text-orange-100 text-sm mt-0.5">
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Carregando...</span>
                  ) : (
                    <>{clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}</>
                  )}
                </p>
              </div>
            </div>
            <Link 
              href="/admin/clients/create" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Novo Cliente</span>
              <span className="sm:hidden">Novo</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente..." 
              className="w-full pl-10 pr-10 py-3 border border-zinc-800 rounded-xl bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-base outline-none"
            />
            <kbd className="absolute top-1/2 right-3 -translate-y-1/2 hidden sm:inline-flex items-center justify-center px-2 py-0.5 border border-zinc-700 rounded bg-zinc-800 text-zinc-400 text-xs font-mono pointer-events-none">
              /
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode */}
            <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-sm">
              <button 
                onClick={() => setViewMode("cards")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  viewMode === "cards" ? "bg-orange-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                title="Cards"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button 
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  viewMode === "table" ? "bg-orange-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                title="Tabela"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Tabela</span>
              </button>
            </div>

            <button className="hidden sm:block px-4 py-3 rounded-xl font-medium transition active:scale-95 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20">
              Padrão atual
            </button>

            {/* Filters Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-medium transition active:scale-95 flex items-center justify-center gap-2 border ${
                showFilters 
                  ? 'bg-orange-500/10 text-orange-500 border-orange-500/50 ring-1 ring-orange-500' 
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>

            {/* Sort */}
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={() => setShowSort(!showSort)} 
                className="w-full sm:w-auto px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl font-medium transition active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="hidden sm:inline">Ordenar</span>
              </button>
              
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)}></div>
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => setShowSort(false)} className="w-full text-left block px-4 py-3 hover:bg-zinc-800 transition bg-orange-500/10 text-orange-500 font-semibold border-b border-zinc-800/50">
                      📦 Por Dock (crescente)
                    </button>
                    <button onClick={() => setShowSort(false)} className="w-full text-left block px-4 py-3 hover:bg-zinc-800 transition text-zinc-300 border-b border-zinc-800/50">
                      🔤 Por Nome (A-Z)
                    </button>
                    <button onClick={() => setShowSort(false)} className="w-full text-left block px-4 py-3 hover:bg-zinc-800 transition text-zinc-300 border-b border-zinc-800/50">
                      📊 Mais Caixas
                    </button>
                    <button onClick={() => setShowSort(false)} className="w-full text-left block px-4 py-3 hover:bg-zinc-800 transition text-zinc-300">
                      🕒 Mais Recentes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-zinc-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-zinc-800 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Status</label>
                  <select className="w-full rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 outline-none px-3 py-2.5">
                    <option value="">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="suspended">Suspensos</option>
                    <option value="inactive">Inativos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Assinatura VIP</label>
                  <select className="w-full rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 outline-none px-3 py-2.5">
                    <option value="">Todos</option>
                    <option value="active">VIP ativo</option>
                    <option value="not_active">Sem VIP ativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Caixas (mínimo)</label>
                  <input type="number" min="0" placeholder="Ex: 5" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 outline-none px-3 py-2.5 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Caixas (máximo)</label>
                  <input type="number" min="0" placeholder="Ex: 50" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 outline-none px-3 py-2.5 placeholder-zinc-600" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2 border-t border-zinc-800/50 mt-4">
                <button className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 transition active:scale-95 shadow-lg shadow-orange-500/20">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {viewMode === "table" ? (
          <div className="bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-zinc-800">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-950">
                  <tr>
                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Dock</th>
                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Cliente</th>
                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Contato</th>
                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Caixas</th>
                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Status</th>
                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                        Carregando clientes...
                      </td>
                    </tr>
                  ) : filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  ) : filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-zinc-800/30 transition">
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-sm">
                          #{client.dock}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                            {client.initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate">{client.name}</div>
                            <div className="text-xs text-zinc-500">Cliente desde {client.since}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1.5">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Mail className="w-4 h-4 shrink-0" />
                            <span className="truncate max-w-[200px]">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Phone className="w-4 h-4 shrink-0" />
                            <Link href={`https://wa.me/${client.phone.replace('+', '')}`} target="_blank" className="text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-2">
                              {client.phone}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700">
                          <Package className="w-4 h-4 text-zinc-500" />
                          {client.boxes}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            client.status === "Ativo" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {client.status === "Ativo" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            {client.status}
                          </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/admin/clients/${client.id}`} className="p-2 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 rounded-lg transition" title="Ver Detalhes">
                            <Eye className="w-5 h-5" />
                          </Link>
                          {hasPermission('users.edit') && (
                            <Link href={`/admin/clients/${client.id}/edit`} className="p-2 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 rounded-lg transition" title="Editar">
                              <Edit className="w-5 h-5" />
                            </Link>
                          )}
                          <button 
                            onClick={() => openImpersonate(client.name, `/admin/clients/${client.id}/impersonate`)}
                            className="p-2 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 rounded-lg transition inline-block" 
                            title="Acessar como Cliente (Suporte)"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full py-12 text-center text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-500" />
                Carregando clientes...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-500">
                Nenhum cliente encontrado.
              </div>
            ) : filteredClients.map((client) => (
              <div key={client.id} className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden hover:border-zinc-700 transition group flex flex-col">
                <div className="bg-zinc-950 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-sm font-bold rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      #{client.dock}
                    </span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                        client.status === "Ativo" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {client.status}
                      </span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {client.boxes}
                  </span>
                </div>
                
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                      {client.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-base truncate" title={client.name}>{client.name}</div>
                      <div className="text-xs text-zinc-500">Desde {client.since}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mail className="w-4 h-4 shrink-0 text-zinc-500" />
                      <span className="truncate" title={client.email}>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Phone className="w-4 h-4 shrink-0 text-zinc-500" />
                      <Link href={`https://wa.me/${client.phone.replace('+', '')}`} target="_blank" className="text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-2">
                        {client.phone}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 border-t border-zinc-800 bg-zinc-950/50">
                  <Link href={`/admin/clients/${client.id}`} className="flex-1 py-2 text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 rounded-xl transition text-sm font-medium text-center flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Ver
                  </Link>
                  {hasPermission('users.edit') && (
                    <Link href={`/admin/clients/${client.id}/edit`} className="flex-1 py-2 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition text-sm font-medium text-center flex items-center justify-center gap-1.5">
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>
                  )}
                  <button 
                    onClick={() => openImpersonate(client.name, `/admin/clients/${client.id}/impersonate`)}
                    className="flex-[0.5] py-2 text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition flex items-center justify-center" 
                    title="Acessar como Cliente"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Impersonate Modal */}
      {impersonateModalOpen && clientToImpersonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeImpersonate}></div>
          <div className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0 border border-white/20">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Acessar Conta</h3>
                  <p className="text-purple-200 text-sm mt-0.5">Modo Suporte Técnico</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">Você vai acessar a conta de:</p>
                  <p className="text-lg font-bold text-white mt-0.5">{clientToImpersonate.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-zinc-300">A conta será aberta em uma <strong>nova aba</strong> do navegador</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <p className="text-sm text-zinc-300">Você permanecerá logado no painel administrativo</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-sm text-zinc-300">Esta ação será <strong>registrada no log</strong> de acessos do sistema</p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-500">Use apenas para suporte</p>
                  <p className="text-xs text-amber-500/80 mt-1">O acesso deve ser realizado exclusivamente quando necessário para resolver problemas ou ajudar o cliente.</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
              <button 
                onClick={closeImpersonate}
                className="px-5 py-2.5 bg-zinc-900 border border-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-800 transition text-center"
              >
                Cancelar
              </button>
              <Link 
                href={clientToImpersonate.url} 
                target="_blank" 
                onClick={closeImpersonate}
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition shadow-lg flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                Acessar Conta do Cliente
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
