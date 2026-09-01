import { 
  Search, 
  Share, 
  CheckCircle2, 
  ChevronDown,
  Settings,
  Users,
  Package,
  ShoppingBag,
  Wallet,
  Send,
  Link,
  Box,
  Info
} from "lucide-react";
import NextLink from "next/link";
import { createClient } from "@supabase/supabase-js";
import { DashboardCharts } from "./components/DashboardCharts";
import { DashboardFinancialSummary } from "./components/DashboardFinancialSummary";

function getRelativeTimeString(date: string) {
  const timeMs = new Date(date).getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];
  
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export default async function AdminDashboardPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;

  // Usa o Service Role Key para contornar limitações de RLS nesta página administrativa
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Buscar tenant ID
  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  let totalCustomers = 0;
  let recentCustomers: any[] = [];
  let totalBoxes = 0;
  let totalProducts = 0;
  let recentBoxes: any[] = [];
  let boxesChartData: any[] = [];
  let custChartData: any[] = [];

  if (tenant) {
    // Buscar total de clientes
    const { count: countCust } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .eq('role', 'CUSTOMER');
    totalCustomers = countCust || 0;

    // Buscar clientes recentes
    const { data: cData } = await supabaseAdmin
      .from('profiles')
      .select('full_name, suite_number, created_at')
      .eq('tenant_id', tenant.id)
      .eq('role', 'CUSTOMER')
      .order('created_at', { ascending: false })
      .is('deleted_at', null).limit(5);
    recentCustomers = cData || [];

    // Buscar total de caixas
    const { count: countBoxes } = await supabaseAdmin
      .from('boxes')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).is('deleted_at', null);
    totalBoxes = countBoxes || 0;

    // Buscar total de produtos (sum of quantity might be better, but count of rows is easy)
    const { count: countProds } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).is('deleted_at', null);
    totalProducts = countProds || 0;

    // Buscar caixas recentes
    const { data: bData } = await supabaseAdmin
      .from('boxes')
      .select('tracking_number, created_at, status, store_name, customer:customer_id(full_name)')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
      .is('deleted_at', null).limit(5);
    recentBoxes = bData || [];

    // Dados para graficos (ultimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isoDate = sevenDaysAgo.toISOString();

    const { data: chartBoxes } = await supabaseAdmin
      .from('boxes')
      .select('created_at')
      .eq('tenant_id', tenant.id)
      .gte('created_at', isoDate).is('deleted_at', null);
      
    const { data: chartCust } = await supabaseAdmin
      .from('profiles')
      .select('created_at')
      .eq('tenant_id', tenant.id)
      .eq('role', 'CUSTOMER')
      .gte('created_at', isoDate).is('deleted_at', null);
      
    boxesChartData = chartBoxes || [];
    custChartData = chartCust || [];
  }

  // --- Financial Summary Logic ---
  const months: { label: string, revenue: number, expenses: number, key: string }[] = [];
  const rtf = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' });
  
  // Generate the last 6 months list
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i, 1);
    months.push({
      label: rtf.format(d).replace('. de ', '/').replace(' de ', '/'), // e.g. "ago/26"
      revenue: 0,
      expenses: 0,
      key: d.toISOString().slice(0, 7)
    });
  }

  let currentMonthRevenue = 0;
  let currentMonthExpenses = 0;
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  if (tenant) {
    const startDate = months[0].key + '-01';
    
    // Last day of current month
    const endD = new Date();
    endD.setMonth(endD.getMonth() + 1, 0);
    const endDate = endD.toISOString().split('T')[0];

    const { data: finances } = await supabaseAdmin
      .from('financial_transactions')
      .select('amount, type, transaction_date')
      .eq('tenant_id', tenant.id)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .is('deleted_at', null);

    if (finances) {
      finances.forEach((t: any) => {
        const tMonth = t.transaction_date.slice(0, 7);
        const amount = Number(t.amount);
        
        if (tMonth === currentMonthKey) {
          if (t.type === 'INCOME') currentMonthRevenue += amount;
          else if (t.type === 'EXPENSE') currentMonthExpenses += amount;
        }

        const monthBucket = months.find(m => m.key === tMonth);
        if (monthBucket) {
          if (t.type === 'INCOME') monthBucket.revenue += amount;
          else if (t.type === 'EXPENSE') monthBucket.expenses += amount;
        }
      });
    }
  }

  const currentMonthNetProfit = currentMonthRevenue - currentMonthExpenses;
  const currentMargin = currentMonthRevenue > 0 ? (currentMonthNetProfit / currentMonthRevenue) * 100 : 0;

  const financialSummary = {
    currentMonthRevenue,
    currentMonthExpenses,
    currentMonthNetProfit,
    currentMargin,
    chartLabels: months.map(m => m.label),
    chartRevenue: months.map(m => m.revenue),
    chartExpenses: months.map(m => m.expenses)
  };
  // ---------------------------------

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header com degradê laranja */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-600 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Dashboard</h1>
              <p className="text-orange-100 text-sm mt-0.5 truncate capitalize">{subdomain}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <button type="button" className="flex items-center gap-2 pl-3 pr-4 py-2.5 text-sm rounded-xl border border-white/25 bg-white/15 hover:bg-white/25 text-white/90 transition sm:w-64">
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Buscar cliente, rastreio...</span>
              </button>

              <button type="button" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-white/25 bg-white/15 hover:bg-white/25 text-white/90 transition">
                <Share className="w-4 h-4 flex-shrink-0" />
                <span>Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DashboardFinancialSummary data={financialSummary} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clientes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 shadow-lg">
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Total de Clientes</p>
              <p className="mt-2 text-4xl font-bold text-white">{totalCustomers}</p>
              <p className="mt-1 text-xs text-blue-200">{totalCustomers} ativos</p>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Caixas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 p-5 shadow-lg">
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-200">Total de Caixas</p>
              <p className="mt-2 text-4xl font-bold text-white">{totalBoxes}</p>
              <p className="mt-1 text-xs text-orange-200">{totalProducts} produtos recebidos</p>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Envios */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 p-5 shadow-lg">
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">Envios Pendentes</p>
              <p className="mt-2 text-4xl font-bold text-white">0</p>
              <p className="mt-1 text-xs text-purple-200">Aguardando pagamento</p>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5">
              <Send className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Grupos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 shadow-lg">
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Grupos Ativos</p>
              <p className="mt-2 text-4xl font-bold text-white">0</p>
              <p className="mt-1 text-xs text-emerald-200">0 pedidos pendentes</p>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <DashboardCharts boxesData={boxesChartData} customersData={custChartData} />

      {/* Mini Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Saldo em carteiras</p>
            <p className="text-xl font-bold text-white mt-0.5">$ 0,00</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Envios totais</p>
            <p className="text-xl font-bold text-white mt-0.5">0</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Pedidos totais</p>
            <p className="text-xl font-bold text-white mt-0.5">0</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Ações Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <NextLink href="/admin/clients/create" className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Novo Cliente</span>
          </NextLink>
          <NextLink href="/admin/boxes/create" className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white">
              <Box className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Registrar Caixa</span>
          </NextLink>
          <NextLink href="/admin/purchase-groups/create" className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Novo Grupo</span>
          </NextLink>
          <NextLink href="/admin/wallets" className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-600 text-white">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Carteiras</span>
          </NextLink>
          <NextLink href="/admin/settings" className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white">
              <Settings className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Configurações</span>
          </NextLink>
          <NextLink href="/admin/integrations" className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <Link className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Integrações</span>
          </NextLink>
        </div>
      </div>

      {/* Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clientes Recentes */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
            <h3 className="text-base font-semibold text-white flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-500">
                <Users className="w-4 h-4" />
              </div>
              Clientes Recentes
            </h3>
            <NextLink href="/admin/clients" className="text-xs text-blue-500 font-medium hover:underline">Ver todos</NextLink>
          </div>
          <div className="p-5 flex-1">
            {recentCustomers.length > 0 ? (
              <div className="space-y-4">
                {recentCustomers.map((customer, index) => {
                  const initials = customer.full_name
                    ? customer.full_name.substring(0, 2).toUpperCase()
                    : "UN";
                  
                  return (
                    <div key={index} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{customer.full_name || "Sem Nome"}</p>
                          <p className="text-xs text-zinc-500">Dock: {customer.suite_number || "S/N"}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-zinc-500">{getRelativeTimeString(customer.created_at)}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Ativo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center py-8">
                <p className="text-sm text-zinc-500">Nenhum cliente cadastrado ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Caixas Recentes */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
            <h3 className="text-base font-semibold text-white flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600/20 text-orange-500">
                <Package className="w-4 h-4" />
              </div>
              Caixas Recentes
            </h3>
            <NextLink href="/admin/boxes" className="text-xs text-orange-500 font-medium hover:underline">Ver todas</NextLink>
          </div>
          <div className="p-5 flex-1">{recentBoxes.length > 0 ? (
              <div className="space-y-4">
                {recentBoxes.map((box, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white flex-shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{box.tracking_number || "Sem Rastreio"}</p>
                        <p className="text-xs text-zinc-500 truncate">{box.customer?.full_name || "Sem Cliente"}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-zinc-500">{getRelativeTimeString(box.created_at)}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">{box.status || "RECEBIDA"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Nenhuma caixa recebida ainda</p>
            )}</div>
        </div>
      </div>

    </div>
  );
}
