import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  Plus, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  ArrowRight,
  Tags,
  Ticket,
  Star
} from "lucide-react";

export default async function StoreDashboardPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header Banner */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700 shadow-lg">
                <Store className="w-6 h-6 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-amber-500/80 text-xs font-semibold uppercase tracking-widest">Loja Virtual</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Dashboard da Loja</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Visão geral de vendas, pedidos e estoque</p>
              </div>
            </div>
            <Link 
              href={`/admin/store/products/create`} 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-lg active:scale-95 text-sm shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Novo Produto
            </Link>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Sales */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-zinc-400">Vendas Totais</p>
                          <p className="text-2xl font-bold text-white mt-1">¥0.00</p>
                          <p className="text-sm mt-1 text-green-500 flex items-center gap-1">
                              ↑ 0% vs mês anterior
                          </p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-500" />
                      </div>
                  </div>
              </div>

              {/* Total Orders */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-zinc-400">Total de Pedidos</p>
                          <p className="text-2xl font-bold text-white mt-1">0</p>
                          <p className="text-sm text-zinc-500 mt-1">0 pendentes</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-blue-500" />
                      </div>
                  </div>
              </div>

              {/* Total Products */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-zinc-400">Produtos</p>
                          <p className="text-2xl font-bold text-white mt-1">0</p>
                          <p className="text-sm text-zinc-500 mt-1">0 com estoque baixo</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-purple-500" />
                      </div>
                  </div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-zinc-400">Taxa de Conversão</p>
                          <p className="text-2xl font-bold text-white mt-1">0.0%</p>
                          <p className="text-sm text-zinc-500 mt-1">do carrinho p/ pedido</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-amber-500" />
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm flex flex-col">
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Pedidos Recentes</h2>
                      <Link href={`/admin/store/orders`} className="text-amber-500 hover:text-amber-400 text-sm font-medium flex items-center gap-1">
                          Ver todos <ArrowRight className="w-4 h-4" />
                      </Link>
                  </div>
                  <div className="flex-1 flex flex-col justify-center divide-y divide-zinc-800 min-h-[200px]">
                      <div className="p-8 text-center text-zinc-500">
                          Nenhum pedido ainda
                      </div>
                  </div>
              </div>

              {/* Top Products */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm flex flex-col">
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Produtos Mais Vendidos</h2>
                      <Link href={`/admin/store/products`} className="text-amber-500 hover:text-amber-400 text-sm font-medium flex items-center gap-1">
                          Ver todos <ArrowRight className="w-4 h-4" />
                      </Link>
                  </div>
                  <div className="flex-1 flex flex-col justify-center divide-y divide-zinc-800 min-h-[200px]">
                      <div className="p-8 text-center text-zinc-500">
                          Nenhum produto vendido ainda
                      </div>
                  </div>
              </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <Link href={`/admin/store/categories`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <Tags className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Categorias</p>
                  <p className="text-sm text-zinc-500">0 cadastradas</p>
              </Link>
              
              <Link href={`/admin/store/products`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <Package className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Produtos</p>
                  <p className="text-sm text-zinc-500">0 cadastrados</p>
              </Link>
              
              <Link href={`/admin/store/orders`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <ShoppingBag className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Pedidos</p>
                  <p className="text-sm text-zinc-500">0 pendentes</p>
              </Link>
              
              <Link href={`/admin/coupons`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <Ticket className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Cupons</p>
                  <p className="text-sm text-zinc-500">0 ativos</p>
              </Link>

              <Link href={`/admin/store/reviews`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <Star className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Avaliações</p>
                  <p className="text-sm text-zinc-500">0 pendente(s)</p>
              </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
