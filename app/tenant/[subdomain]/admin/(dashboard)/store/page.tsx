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

  const tenantId = tenant.id;

  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('operations')
    .eq('tenant_id', tenantId)
    .single();
  const currency = settings?.operations?.currency || 'BRL';

  // 1. Orders
  const { data: orders } = await supabase
    .from('store_orders')
    .select('id, total_amount, status, created_at, profiles(full_name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
    
  const allOrders = orders || [];
  const totalSales = allOrders.filter(o => o.status !== 'CANCELLED').reduce((sum, order) => sum + Number(order.total_amount), 0);
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === 'PENDING').length;
  const recentOrders = allOrders.slice(0, 5);

  // 2. Products
  const { data: products, error: productsError } = await supabase
    .from('store_products')
    .select('id, name, price, stock_quantity, track_stock, main_image')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error("Store Dashboard - Error fetching products:", productsError);
  }

  const allProducts = products || [];
  const totalProducts = allProducts.length;
  const lowStockProducts = allProducts.filter(p => p.track_stock && p.stock_quantity <= 5).length;
  const topProducts = allProducts.slice(0, 5);

  // 3. Categories
  const { count: totalCategories, error: catError } = await supabase
    .from('store_categories')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId);

  if (catError) {
    console.error("Store Dashboard - Error fetching categories:", catError);
  }

  // 4. Coupons
  const { count: totalCoupons } = await supabase
    .from('store_coupons')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('status', 'ACTIVE');



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
                          <p className="text-2xl font-bold text-white mt-1">{new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency }).format(totalSales)}</p>
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
                          <p className="text-2xl font-bold text-white mt-1">{totalOrders}</p>
                          <p className="text-sm text-zinc-500 mt-1">{pendingOrders} pendentes</p>
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
                          <p className="text-2xl font-bold text-white mt-1">{totalProducts}</p>
                          <p className="text-sm text-zinc-500 mt-1">{lowStockProducts} com estoque baixo</p>
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
                  <div className="flex-1 flex flex-col min-h-[200px]">
                      {recentOrders.length === 0 ? (
                          <div className="p-8 text-center text-zinc-500 m-auto">
                              Nenhum pedido ainda
                          </div>
                      ) : (
                          <div className="divide-y divide-zinc-800">
                              {recentOrders.map((order: any) => (
                                  <Link href={`/admin/store/orders/${order.id}`} key={order.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition cursor-pointer">
                                      <div>
                                          <p className="text-white font-medium">Pedido #{order.id.split('-')[0].toUpperCase()}</p>
                                          <p className="text-zinc-400 text-sm">{Array.isArray(order.profiles) ? order.profiles[0]?.full_name : order.profiles?.full_name || "Cliente Desconhecido"}</p>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-white font-bold">{new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency }).format(Number(order.total_amount))}</p>
                                          <span className="inline-flex items-center rounded-md bg-zinc-500/10 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-500/20 mt-1">{order.status}</span>
                                      </div>
                                  </Link>
                              ))}
                          </div>
                      )}
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
                  <div className="flex-1 flex flex-col min-h-[200px]">
                      {topProducts.length === 0 ? (
                          <div className="p-8 text-center text-zinc-500 m-auto">
                              Nenhum produto cadastrado ainda
                          </div>
                      ) : (
                          <div className="divide-y divide-zinc-800">
                              {topProducts.map((product: any) => (
                                  <Link href={`/admin/store/products/${product.id}/edit`} key={product.id} className="p-4 flex items-center gap-4 hover:bg-zinc-800/50 transition cursor-pointer">
                                      {product.main_image ? (
                                        <img src={product.main_image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0" />
                                      ) : (
                                        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                          <Package className="w-5 h-5 text-zinc-600" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                          <p className="text-white font-medium truncate" title={product.name}>{product.name}</p>
                                          <p className="text-zinc-400 text-sm">
                                            {product.track_stock ? `${product.stock_quantity} em estoque` : "Estoque livre"}
                                          </p>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-white font-bold">{new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency }).format(Number(product.price))}</p>
                                      </div>
                                  </Link>
                              ))}
                          </div>
                      )}
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
                  <p className="text-sm text-zinc-500">{totalCategories || 0} cadastradas</p>
              </Link>
              
              <Link href={`/admin/store/products`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <Package className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Produtos</p>
                  <p className="text-sm text-zinc-500">{totalProducts || 0} cadastrados</p>
              </Link>
              
              <Link href={`/admin/store/orders`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <ShoppingBag className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Pedidos</p>
                  <p className="text-sm text-zinc-500">{pendingOrders || 0} pendentes</p>
              </Link>
              
              <Link href={`/admin/coupons`} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition group">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition">
                      <Ticket className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition" />
                  </div>
                  <p className="font-semibold text-white">Cupons</p>
                  <p className="text-sm text-zinc-500">{totalCoupons || 0} ativos</p>
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
