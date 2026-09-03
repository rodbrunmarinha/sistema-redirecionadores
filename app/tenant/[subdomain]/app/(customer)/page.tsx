import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { CreditCard, Package, Scale, Archive, ChevronRight, Inbox, ShoppingBag, Barcode } from "lucide-react";
import { getTenantSettings } from "./_utils/getTenantSettings";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PushNotificationManager } from "@/components/PushNotificationManager";

export default async function CustomerDashboard(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  // Get user
  const { data: { user } } = await supabase.auth.getUser();

  const settings = await getTenantSettings(subdomain);
  const currency = settings?.operations?.currency || "USD";
  const weightUnit = settings?.operations?.weightUnit || "kg";
  const currencySymbol = currency === "BRL" ? "R$" : currency === "EUR" ? "€" : currency === "JPY" ? "¥" : "$";

  let walletBalance = 0;
  let receivedBoxesCount = 0;
  let totalProducts = 0;
  let totalWeight = 0;
  let recentBoxes: any[] = [];

  if (user) {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('customer_id', user.id)
      .eq('tenant_id', settings?.tenant_id)
      .single();
    walletBalance = wallet?.balance || 0;

    const { count: boxesCount } = await supabase
      .from('boxes')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .in('status', ['RECEIVED', 'IN_TREATMENT', 'AWAITING_SHIPPING']);
    receivedBoxesCount = boxesCount || 0;

    const { data: products } = await supabase
      .from('products')
      .select('quantity, total_weight')
      .eq('customer_id', user.id)
      .is('deleted_at', null);
    
    if (products) {
      totalProducts = products.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
      totalWeight = products.reduce((acc, curr) => acc + (curr.total_weight || 0), 0);
    }

    const { data: boxes } = await supabase
      .from('boxes')
      .select('id, tracking_number, store_name, received_at, status, products(id)')
      .eq('customer_id', user.id)
      .order('received_at', { ascending: false })
      .limit(3);
    recentBoxes = boxes || [];
  }

  const metrics = [
    { 
      label: "Saldo Disponível", 
      value: `${currencySymbol}${walletBalance.toFixed(2)}`, 
      icon: <CreditCard className="w-6 h-6 text-white" />, 
      bgColor: "bg-orange-500",
      action: { text: "Ver Transações >", href: "/app/wallet" }
    },
    { 
      label: "Caixas Recebidas", 
      value: receivedBoxesCount.toString(), 
      icon: <Package className="w-6 h-6 text-white" />, 
      bgColor: "bg-blue-500",
      action: { text: "Ver caixas >", href: "/app/boxes" } 
    },
    { 
      label: "Total de Produtos", 
      value: totalProducts.toString(), 
      icon: <Archive className="w-6 h-6 text-white" />, 
      bgColor: "bg-emerald-500",
      action: { text: "Ver produtos >", href: "/app/products" } 
    },
    { 
      label: "Peso Total", 
      value: `${totalWeight.toFixed(3)} ${weightUnit}`, 
      icon: <Scale className="w-6 h-6 text-white" />, 
      bgColor: "bg-fuchsia-500",
      action: null 
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Saldo Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="font-medium text-orange-50 mb-1">Saldo Disponível</p>
            <p className="text-5xl font-bold mb-1">{currencySymbol}{walletBalance.toFixed(2)}</p>
            <p className="text-sm text-orange-100">Use para pagar envios e compras</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link href="/app/wallet" className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/10 font-bold transition-colors text-center">
            Ver Transações
          </Link>
          <Link href="/app/wallet/add-credits" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
            <span>+</span> Adicionar Créditos
          </Link>
        </div>
      </div>

      <PushNotificationManager subdomain={subdomain} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-500 mb-2">{metric.label}</p>
                <p className={`text-3xl font-bold ${idx === 3 ? 'text-fuchsia-600' : idx === 2 ? 'text-emerald-600' : idx === 1 ? 'text-blue-600' : 'text-orange-500'}`}>
                  {metric.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${metric.bgColor}`}>
                {metric.icon}
              </div>
            </div>
            {metric.action && (
              <Link href={metric.action.href || "#"} className={`text-sm font-semibold flex items-center gap-1 hover:underline mt-auto ${idx === 2 ? 'text-emerald-600' : idx === 1 ? 'text-blue-600' : 'text-orange-500'}`}>
                {metric.action.text}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* ÚÚltimas Encomendas Recebidas */}
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 text-[19px]">ÚÚltimas Encomendas Recebidas</h2>
              <p className="text-[14px] text-zinc-500">{totalProducts} produtos no total</p>
            </div>
          </div>
          <Link href="/app/boxes" className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
            Ver Todas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {recentBoxes.length > 0 ? (
          <div className="flex flex-col">
            {/* Table Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-white border-b border-zinc-100 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <div className="col-span-3">Loja</div>
              <div className="col-span-3">Número de Rastreio</div>
              <div className="col-span-2">Produtos</div>
              <div className="col-span-2">Data</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-zinc-50">
              {recentBoxes.map((box) => (
                <div key={box.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-5 items-center bg-white hover:bg-zinc-50/80 transition-colors">
                  
                  {/* Loja */}
                  <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-zinc-500" />
                    </div>
                    <span className="font-bold text-zinc-900 text-[15px] truncate">{box.store_name || "Loja não informada"}</span>
                  </div>

                  {/* Rastreio */}
                  <div className="col-span-1 md:col-span-3 flex items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/80 text-blue-600 text-[13px] font-bold border border-blue-100/50">
                      <Barcode className="w-4 h-4 opacity-70" />
                      <span className="truncate">{box.tracking_number}</span>
                    </div>
                  </div>

                  {/* Produtos */}
                  <div className="col-span-1 md:col-span-2 flex items-center">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50/80 text-emerald-600 text-[13px] font-bold border border-emerald-100/50">
                      {box.products?.length || 0} produtos
                    </span>
                  </div>

                  {/* Data */}
                  <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
                    <span className="text-[15px] font-bold text-zinc-700">
                      {box.received_at ? format(new Date(box.received_at), "dd/MM/yyyy") : '-'}
                    </span>
                    <span className="text-[13px] text-zinc-400 font-medium">
                      {box.received_at ? format(new Date(box.received_at), "HH:mm") : '-'}
                    </span>
                  </div>

                  {/* Ações */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end mt-2 md:mt-0">
                    <Link href={`/app/boxes/${box.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 hover:border-zinc-300 transition-colors">
                      Ver Detalhes <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Nenhuma encomenda ainda</h3>
            <p className="text-sm text-zinc-500">Quando você receber caixas, elas aparecerão aqui.</p>
          </div>
        )}
      </div>

    </div>
  );
}
