import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  Layers, 
  Eye, 
  Clock, 
  CheckCircle,
  FolderOpen
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ServiceCard from "./ServiceCard";

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tenantId = "";
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single();
    if (profile) tenantId = profile.tenant_id;
  }

  // Busca os serviços
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const activeServicesCount = services?.filter(s => s.is_active).length || 0;

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
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Catálogo de Serviços</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Catálogo de Serviços</h1>
                <p className="text-orange-100 text-sm mt-0.5">Gerencie os serviços oferecidos aos clientes</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/services/create" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Novo Serviço
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 text-white shadow-lg border border-zinc-700">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Serviços</p>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{services?.length || 0}</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 text-white shadow-lg border border-zinc-700">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Visíveis</p>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{activeServicesCount}</p>
            </div>
          </div>
          
          <Link href="/admin/service-orders" className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 text-white shadow-lg border border-orange-500/30 transition hover:scale-[1.02]">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-orange-500/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">Em andamento</p>
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </Link>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 text-white shadow-lg border border-teal-500/30">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-teal-500/10 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">Concluídas</p>
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">0</p>
            </div>
          </div>
        </div>

        {/* Services List or Empty State */}
        {(!services || services.length === 0) ? (
          <div className="rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800 overflow-hidden">
            <div className="flex flex-col items-center justify-center text-center px-6 py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-800 border border-zinc-700 mb-6 shadow-sm">
                <FolderOpen className="h-10 w-10 text-zinc-500" />
              </div>

              <h3 className="text-lg font-bold text-white">Nenhum serviço cadastrado</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto">Crie serviços personalizados que seus clientes podem solicitar, como Personal Shopper, Retirada de Malas e muito mais.</p>
              
              <Link 
                href="/admin/services/create" 
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm transition active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Criar Primeiro Serviço
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
