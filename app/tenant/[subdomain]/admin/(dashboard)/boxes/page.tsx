"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { usePermissions } from "@/app/providers/PermissionsProvider";
import { useSearchParams } from "next/navigation";
import { 
  Inbox, 
  Tags, 
  Plus, 
  CheckCircle, 
  Calendar, 
  Filter, 
  List, 
  Grid, 
  ChevronDown,
  Search,
  PackageX,
Eye, Edit2, Package, Printer, Download, Users
} from "lucide-react";

import { Suspense } from "react";

function BoxesContent() {
  const supabase = createClient();
  const { hasPermission } = usePermissions();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]);
  const [bulkTransferOpen, setBulkTransferOpen] = useState(false);

  const [transferSearch, setTransferSearch] = useState("");
  const [transferResults, setTransferResults] = useState<any[]>([]);
  const [transferAllCustomers, setTransferAllCustomers] = useState<any[]>([]);
  const [transferSearchError, setTransferSearchError] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const [boxes, setBoxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState("all");

  
  const boxesListadas = boxes.length;
  const caixasComCliente = boxes.filter(b => b.customer).length;
  const last7Days = boxes.filter(b => {
    const diffTime = Math.abs(new Date().getTime() - new Date(b.created_at).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7;
  }).length;
  const semProdutos = boxes.filter(b => !b.products || b.products.length === 0).length;
  const comPendencia = boxes.filter(b => !b.customer).length;

  const displayedBoxes = boxes.filter(b => {
    if (quickFilter === "pending") return !b.customer;


    if (quickFilter === "empty") return !b.products || b.products.length === 0;
    return true;
  });
 // assuming pendencia = sem cliente


  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchBoxes() {
      setLoading(true);
      setFetchError(null);
      
      let query = supabase
        .from('boxes')
        .select(`
          id, tracking_number, store_name, status, created_at, photos,
          customer:customer_id(full_name, suite_number),
          warehouse_locations(code),
          products(id, photos, total_weight)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      const clientName = searchParams.get('client_name');
      const boxId = searchParams.get('box_id');
      const dock = searchParams.get('dock');
      const tracking = searchParams.get('tracking');
      const store = searchParams.get('store');
      const period = searchParams.get('period');

      // boxId filtered locally
      if (tracking) query = query.ilike('tracking_number', `%${tracking}%`);
      if (store) query = query.ilike('store_name', `%${store}%`);
      if (period) {
        const d = new Date();
        d.setDate(d.getDate() - parseInt(period));
        query = query.gte('created_at', d.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching boxes:', error);
        setFetchError(error.message || JSON.stringify(error));
        setBoxes([]);
      } else {
        let filtered = data || [];
        
        // Manual filter for relational fields since PostgREST makes it complex to filter top-level by relation in a single pass without inner join config
        
        if (boxId) {
           filtered = filtered.filter(b => b.id.toLowerCase().includes(boxId.replace('#', '').toLowerCase()));
        }
        if (clientName) {
           filtered = filtered.filter(b => b.customer && (Array.isArray(b.customer) ? (b.customer[0] as any)?.full_name : (b.customer as any).full_name)?.toLowerCase().includes(clientName.toLowerCase()));
        }
        if (dock) {
           filtered = filtered.filter(b => b.customer && String((Array.isArray(b.customer) ? (b.customer[0] as any)?.suite_number : (b.customer as any).suite_number)) === dock);
        }
        
        setBoxes(filtered);
      }
      setLoading(false);
    }
    fetchBoxes();
  }, [searchParams]);

  
  const toggleBoxSelection = (id: string) => {
    setSelectedBoxes(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };
  
  const toggleAllSelection = () => {
    if (selectedBoxes.length === displayedBoxes.length && displayedBoxes.length > 0) {
      setSelectedBoxes([]);
    } else {
      setSelectedBoxes(displayedBoxes.map(b => b.id));
    }
  };

  useEffect(() => {
    if (!bulkTransferOpen) {
      setTransferSearch("");
      setTransferResults([]);
      setTransferAllCustomers([]);
    } else {
      // Load all customers when modal opens!
      const loadCustomers = async () => {
        setTransferLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, suite_number')
          .eq('role', 'CUSTOMER')
          .limit(1000);
          
        if (error) {
          console.error("Error loading customers:", error);
          setTransferSearchError(error.message);
        } else {
          setTransferSearchError(null);
          setTransferAllCustomers(data || []);
          setTransferResults(data || []); // Show all by default, or empty if you prefer
        }
        setTransferLoading(false);
      };
      loadCustomers();
    }
  }, [bulkTransferOpen]);

  const searchCustomers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSearch.trim()) {
      setTransferResults(transferAllCustomers);
      return;
    }
    
    const searchVal = transferSearch.trim().toLowerCase();
    const filtered = transferAllCustomers.filter(c => 
      (c.full_name && c.full_name.toLowerCase().includes(searchVal)) ||
      (c.suite_number && String(c.suite_number) === searchVal)
    );
    
    setTransferResults(filtered);
  };

  const executeBulkTransfer = async (newCustomerId: string) => {
    if (!confirm("Tem certeza que deseja transferir estas caixas e TODOS os seus produtos para este novo cliente?")) return;
    setTransferring(true);
    
    // Update boxes
    const { error: boxErr } = await supabase
      .from('boxes')
      .update({ customer_id: newCustomerId })
      .in('id', selectedBoxes);
      
    if (boxErr) {
      toast.error("Erro ao transferir caixas.");
      setTransferring(false);
      return;
    }
    
    // Cascade to products
    await supabase
      .from('products')
      .update({ customer_id: newCustomerId })
      .in('box_id', selectedBoxes);
      
    toast.success("Caixas transferidas com sucesso!");
    setBulkTransferOpen(false);
    setSelectedBoxes([]);
    setTransferring(false);
    window.location.reload(); // reload list
  };
  // Compute filtered results on the fly!
  const displayedCustomers = transferSearch.trim() === "" 
    ? transferAllCustomers 
    : transferAllCustomers.filter(c => 
        (c.full_name && c.full_name.toLowerCase().includes(transferSearch.trim().toLowerCase())) ||
        (c.suite_number && String(c.suite_number) === transferSearch.trim())
      );





  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Caixas Recebidas</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <Inbox className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Caixas Recebidas</h1>
                <p className="text-orange-100 text-sm mt-0.5">Gerencie as encomendas recebidas</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              
              
              <Link 
                href="/admin/boxes/create" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Nova Caixa
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 text-white shadow-lg border border-zinc-700">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Caixas listadas</p>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Inbox className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{boxesListadas}</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-4 text-white shadow-lg border border-emerald-500/30">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-emerald-500/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Caixas com cliente</p>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{caixasComCliente}</p>
            </div>
          </div>
                          
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-4 text-white shadow-lg border border-orange-500/30">
              <div className="absolute -right-3 -top-3 w-20 h-20 bg-orange-500/10 rounded-full"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">Recebidas em 7 dias</p>
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-orange-400" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold tracking-tight">{last7Days}</p>
              </div>
            </div>

            <div 
              onClick={() => setQuickFilter("pending")}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-600/20 p-4 text-white shadow-lg border cursor-pointer transition-all hover:scale-[1.02] ${quickFilter === 'pending' ? 'border-red-500 ring-2 ring-red-500/30' : 'border-red-500/30 hover:border-red-500/60'}`}
            >
              <div className="absolute -right-3 -top-3 w-20 h-20 bg-red-500/10 rounded-full"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Caixas sem cliente</p>
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-red-400" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold tracking-tight">{comPendencia}</p>
              </div>
            </div>
        </div>

        

        {fetchError && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-xl mb-4 text-red-200">
            <strong>Erro ao carregar caixas:</strong> {fetchError}
          </div>
        )}
        



        {/* Quick Filters */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800">
          <button 
            type="button" 
            onClick={() => setFiltersOpen(!filtersOpen)} 
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Filter className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <span className="text-sm font-semibold text-white">Filtros rápidos</span>
            </div>
            <div className="flex items-center gap-3">
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {filtersOpen && (
            <form method="GET" action="/admin/boxes" className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 border-t border-zinc-800 pt-4">
              
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Nome do Cliente</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="client_name"
                    defaultValue={searchParams.get("client_name") || ""}
                    placeholder="Buscar por cliente" 
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-zinc-400">ID da Caixa</label>
                <input 
                  type="text" 
                  name="box_id"
                  defaultValue={searchParams.get("box_id") || ""}
                  placeholder="#" 
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Dock</label>
                <input 
                  type="text" 
                  name="dock"
                  defaultValue={searchParams.get("dock") || ""}
                  placeholder="Ex: 1234" 
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Rastreio</label>
                <input 
                  type="text" 
                  name="tracking"
                  defaultValue={searchParams.get("tracking") || ""}
                  placeholder="BR123456789" 
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Loja</label>
                <input 
                  type="text" 
                  name="store"
                  defaultValue={searchParams.get("store") || ""}
                  placeholder="Amazon" 
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-zinc-400">Período</label>
                <select name="period" defaultValue={searchParams.get("period") || ""} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition">
                  <option value="">Todos</option>
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                </select>
              </div>
              
              <div className="flex items-end lg:col-span-3 xl:col-span-2 gap-3">
                <button type="submit" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]">
                  <Search className="h-4 w-4" />
                  Filtrar
                </button>
                <Link href="/admin/boxes" onClick={() => setQuickFilter("all")} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-300 shadow-sm transition active:scale-[0.98]">
                  Limpar
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* List Section */}
        <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800 overflow-hidden">
          
          {/* List Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-zinc-800">
            <div>
              <p className="text-sm font-semibold text-white">Lista de recebimentos</p>
              <p className="text-xs text-zinc-400">{displayedBoxes.length} caixa(s) encontrada(s)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center rounded-xl border border-zinc-700 p-1 bg-zinc-950">
                <button 
                  type="button" 
                  onClick={() => setViewMode('table')} 
                  className={`rounded-lg p-2 transition-all ${
                    viewMode === 'table' ? 'bg-zinc-800 shadow text-orange-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Ver como tabela"
                >
                  <List className="h-4 w-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setViewMode('cards')} 
                  className={`rounded-lg p-2 transition-all ${
                    viewMode === 'cards' ? 'bg-zinc-800 shadow text-orange-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Ver como cards"
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>

              {hasPermission('packages.create') && (
                <Link 
                  href="/admin/boxes/create" 
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  Nova Caixa
                </Link>
              )}
            </div>
          </div>

          {/* Filtros Rapidos */}
          <div className="flex items-center gap-2 overflow-x-auto px-5 py-3 border-b border-zinc-800 bg-zinc-950/50">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Filtrar</span>
            <button 
              onClick={() => setQuickFilter("all")}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition shadow-sm ${quickFilter === 'all' ? 'bg-zinc-200 text-zinc-900 border-zinc-200' : 'bg-transparent text-zinc-400 border-zinc-800 hover:bg-zinc-900'}`}>
              Todas
            </button>
            <button 
              onClick={() => setQuickFilter("pending")}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${quickFilter === 'pending' ? 'bg-orange-900/40 border-orange-500 text-orange-400' : 'border-orange-900/50 text-orange-400 hover:bg-orange-900/20'}`}>
              Com pendência
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none bg-zinc-800 text-zinc-300">{comPendencia}</span>
            </button>
            <button 
              onClick={() => setQuickFilter("empty")}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${quickFilter === 'empty' ? 'bg-orange-900/40 border-orange-500 text-orange-400' : 'border-orange-900/50 text-orange-400 hover:bg-orange-900/20'}`}>
              sem produtos
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none bg-zinc-800 text-zinc-300">{semProdutos}</span>
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-zinc-400 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : boxes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-800 border border-zinc-700 mb-6 shadow-sm">
                <PackageX className="h-10 w-10 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Nenhuma caixa encontrada</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-sm">Comece registrando a primeira caixa recebida e organize suas encomendas.</p>
              
              {hasPermission('packages.create') && (
                <Link 
                  href="/admin/boxes/create" 
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition"
                >
                  Registrar Primeira Caixa
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* TABLE VIEW */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-900">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-left w-10">
                          <input type="checkbox" checked={selectedBoxes.length === displayedBoxes.length && displayedBoxes.length > 0} onChange={toggleAllSelection} className="rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500" />
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-left w-[80px]">ID</th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-center w-11">
                          <CheckCircle className="h-3.5 w-3.5 inline-block" />
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-left">Cliente / Dock</th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-left">Rastreio</th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-left">Loja</th>
<th scope="col" className="px-3 py-3 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Localização</th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-center">Produtos</th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-left">Peso Total</th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {displayedBoxes.map((box) => (
                        <tr key={box.id} className="group hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3.5">
                            <input type="checkbox" checked={selectedBoxes.includes(box.id)} onChange={() => toggleBoxSelection(box.id)} className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500" />
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <Link href={`/admin/boxes/${box.id}`} className="font-mono text-xs font-bold text-orange-500 hover:underline">
                              #{box.id.substring(0,6)}
                            </Link>
                          </td>
                          <td className="px-2 py-3.5 text-center">
                            <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-bold leading-none bg-orange-900/40 text-orange-400">
                              <CheckCircle className="h-3 w-3 shrink-0" /> 1
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="shrink-0 inline-flex items-center rounded-full bg-orange-600 px-2.5 py-0.5 text-xs font-bold text-white">
                                {box.customer?.suite_number || '---'}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {new Date(box.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-white leading-snug">
                              {box.customer?.full_name || 'Desconhecido'}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-sm text-zinc-300">
                            {box.tracking_number}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-zinc-300">
                            {box.store_name || <span className="text-zinc-600">—</span>}
                          </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-zinc-300">
                              {box.warehouse_locations?.code ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  {box.warehouse_locations.code}
                                </span>
                              ) : (
                                <span className="text-xs text-zinc-600">—</span>
                              )}
                            </td>

                          <td className="px-4 py-3.5">
                            <div className="flex -space-x-1.5 justify-center">
                              {box.products && box.products.length > 0 ? (
                                box.products.slice(0, 3).map((p: any) => (
                                  p.photos && p.photos.length > 0 ? (
                                    <img key={p.id} src={p.photos[0].startsWith("http") ? p.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${p.photos[0]}`} className="w-8 h-8 rounded-lg object-cover ring-2 ring-zinc-900 shrink-0 bg-zinc-800" />
                                  ) : (
                                    <div key={p.id} className="w-8 h-8 rounded-lg ring-2 ring-zinc-900 shrink-0 bg-zinc-800 flex items-center justify-center">
                                      <PackageX className="w-4 h-4 text-zinc-500" />
                                    </div>
                                  )
                                ))
                              ) : (
                                <div className="w-8 h-8 rounded-lg ring-2 ring-zinc-900 shrink-0 bg-zinc-800 flex items-center justify-center">
                                  <span className="text-[10px] text-zinc-400">0</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-medium text-zinc-300 whitespace-nowrap">
                            {box.products ? box.products.reduce((acc: number, p: any) => acc + (p.total_weight || 0), 0).toFixed(3).replace('.', ',') : '0,000'} kg
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <Link href={`/admin/boxes/${box.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-900/30 text-orange-400 hover:bg-orange-900/60 transition">
                                <Inbox className="h-4 w-4" />
                              </Link>
                              {hasPermission('packages.edit') && (
                                <Link href={`/admin/boxes/${box.id}/edit`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition">
                                  <Tags className="h-4 w-4" />
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CARDS VIEW */}
              {viewMode === 'cards' && (
                <div className="p-3 sm:p-5">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {displayedBoxes.map((box) => (
                      <article key={box.id} className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm hover:border-orange-500/50 transition-all duration-200 overflow-hidden">
                <div className="flex flex-col px-4 py-3 border-b border-zinc-800">
                  {/* Top Row */}
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <label className="shrink-0 flex items-center cursor-pointer opacity-40 group-hover:opacity-100 transition-opacity">
                      <input type="checkbox" checked={selectedBoxes.includes(box.id)} onChange={() => toggleBoxSelection(box.id)} className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500" />
                    </label>
                    
                    <Link href={`/admin/boxes/${box.id}`} className="shrink-0 px-2.5 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow hover:bg-orange-600 transition">
                      <span className="text-xs font-bold text-white tracking-tight">#{box.id.substring(0,4)}</span>
                    </Link>

                    <span className="inline-flex items-center rounded-full bg-orange-900/40 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                      Dock {box.customer?.suite_number || '---'}
                    </span>

                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">hoje</span>
                      <button type="button" className="h-7 w-7 rounded-full bg-emerald-900/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-900/40 transition">
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="ml-[42px]">
                    <p className="text-[13px] font-bold text-white truncate uppercase">
                      {box.customer?.full_name || 'Desconhecido'}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {box.store_name || '-'}
                    </p>
                  </div>
                </div>

                {/* Images */}
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3 overflow-x-auto hide-scrollbar">
                  {/* Box Photo */}
                  <div className="relative shrink-0">
                    <div className="h-[60px] w-[60px] rounded-xl border-[2px] border-amber-500 overflow-hidden flex items-center justify-center bg-zinc-800">
                      {box.photos && box.photos.length > 0 ? (
                         <img src={box.photos[0].startsWith("http") ? box.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/boxes/${box.photos[0]}`} className="h-full w-full object-cover" alt="Caixa" />
                      ) : (
                         <Package className="h-6 w-6 text-zinc-600" />
                      )}
                    </div>
                    <span className="absolute -bottom-1.5 left-1 rounded bg-amber-500 px-1.5 py-[1px] text-[9px] font-bold text-white uppercase shadow-sm leading-none">
                      caixa
                    </span>
                  </div>

                  {/* Product Photos */}
                  {box.products && box.products.length > 0 && box.products.slice(0, 4).map((p: any, idx: number) => (
                    <div key={idx} className="h-[50px] w-[50px] shrink-0 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center relative">
                      {p.photos && p.photos.length > 0 ? (
                        <img src={p.photos[0].startsWith("http") ? p.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${p.photos[0]}`} className="h-full w-full object-cover" alt="Produto" />
                      ) : (
                        <PackageX className="h-5 w-5 text-zinc-600" />
                      )}
                    </div>
                  ))}
                  
                  {box.products && box.products.length > 4 && (
                    <div className="h-[50px] w-[50px] shrink-0 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-xs font-bold text-zinc-400">
                      +{box.products.length - 4}
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="flex gap-3 px-4 py-3">
                  <div className="flex-1 rounded-xl bg-emerald-900/10 border border-emerald-900/20 px-3 py-2.5 flex flex-col items-center justify-center text-center">
                    <p className="text-[17px] font-extrabold text-emerald-400 leading-none mb-1">{box.products?.length || 0}</p>
                    <p className="text-[10px] font-semibold text-emerald-500/70">Produtos</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-orange-900/10 border border-orange-900/20 px-3 py-2.5 flex flex-col items-center justify-center text-center">
                    <p className="text-[17px] font-extrabold text-orange-400 leading-none mb-1">
                      {box.products ? box.products.reduce((acc: number, p: any) => acc + (p.total_weight || 0), 0).toFixed(3).replace('.', ',') : '0,000'} kg
                    </p>
                    <p className="text-[10px] font-semibold text-orange-500/70">Peso Total</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex border-t border-zinc-800 mt-auto">
                  <Link href={`/admin/boxes/${box.id}`} className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-orange-500 hover:bg-zinc-800 transition">
                    <Eye className="h-4 w-4 shrink-0" /> Ver
                  </Link>
                  {hasPermission('packages.edit') && (
                    <>
                      <div className="w-px bg-zinc-800 self-stretch"></div>
                      <Link href={`/admin/boxes/${box.id}/edit`} className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 transition">
                        <Edit2 className="h-4 w-4 shrink-0" /> Editar
                      </Link>
                    </>
                  )}
                </div>
              </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination (Mock) */}
              <div className="border-t border-zinc-800 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span>Por página:</span>
                  <select className="rounded-lg border-zinc-700 bg-zinc-900 text-zinc-200 text-sm py-1.5 px-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* BULK ACTION BAR */}
      {selectedBoxes.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl p-2 flex items-center gap-3 sm:gap-4">
            <div className="pl-4 pr-2 flex items-center gap-2">
              <span className="flex items-center justify-center bg-orange-500 text-white font-bold w-6 h-6 rounded-full text-xs">
                {selectedBoxes.length}
              </span>
              <span className="text-zinc-300 text-sm font-medium hidden sm:inline">caixa(s) selecionada(s)</span>
            </div>
            
            <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <a href={`/admin/boxes/bulk-labels?ids=${selectedBoxes.join(',')}`} target="_blank" className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors">
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimir</span>
              </a>
              
              <button onClick={() => setBulkTransferOpen(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Transferir</span>
              </button>
              
              <a href={`/admin/boxes/bulk-export?ids=${selectedBoxes.join(',')}`} target="_blank" className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </a>
            </div>
            
            <button onClick={() => setSelectedBoxes([])} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-xl hover:bg-zinc-800 ml-1 sm:ml-2" title="Limpar seleção">
              <PackageX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* BULK TRANSFER MODAL */}
      {bulkTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setBulkTransferOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <PackageX className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white mb-2">Transferir Caixas</h3>
            <p className="text-zinc-400 text-sm mb-6">Você está prestes a transferir <b>{selectedBoxes.length}</b> caixa(s). Produtos contidos nelas também serão transferidos. Busque o novo dono:</p>
            
            <form onSubmit={searchCustomers} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={transferSearch}
                onChange={e => setTransferSearch(e.target.value)}
                placeholder="Nome ou Dock"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
              <button type="submit" disabled={transferLoading} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition">
                Buscar
              </button>
            </form>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {displayedCustomers.length === 0 && !transferLoading && transferSearch && (
                transferSearchError ? <p className="text-red-500 text-sm text-center py-4">{transferSearchError}</p> : <p className="text-zinc-500 text-sm text-center py-4">Nenhum cliente encontrado (buscou por: "{transferSearch}"). Tente outro termo.</p>
              )}
              {displayedCustomers.map(cust => (
                <div key={cust.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-orange-500/50 transition">
                  <div>
                    <p className="text-white font-bold text-sm truncate w-40 sm:w-56">{cust.full_name}</p>
                    <p className="text-orange-500 text-xs font-semibold mt-0.5">Dock {cust.suite_number}</p>
                  </div>
                  <button onClick={() => executeBulkTransfer(cust.id)} disabled={transferring} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition disabled:opacity-50">
                    Selecionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


export default function BoxesPage() {

  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Carregando...</div>}>
      <BoxesContent />
    </Suspense>
  );
}
