import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Link2, CreditCard, Truck, Info } from "lucide-react";

export default async function IntegrationsPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link 
              href={"/admin"} 
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-100 font-medium">Integrações</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <Link2 className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Integrações</h1>
              <p className="text-zinc-400 mt-1">Gerencie suas integrações com serviços externos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Cards de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Meios de Pagamento */}
          <Link href={"/admin/integrations/payments"} className="group bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 block shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <CreditCard className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Meios de Pagamento</h3>
                <p className="text-zinc-400 mb-4 text-sm leading-relaxed">Configure gateways de pagamento para receber de seus clientes.</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    🇧🇷 Parcelado USA
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    🌎 GLIN
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    🧡 Braza
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    💳 Stripe
                  </span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Transportadoras */}
          <Link href={"/admin/integrations/carriers"} className="group bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 block shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Transportadoras</h3>
                <p className="text-zinc-400 mb-4 text-sm leading-relaxed">Integre com transportadoras para cotação e rastreamento automático.</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    📦 ABC Packet
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    🚚 WEXPRESS
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    ☁ Sendcloud
                  </span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

        </div>

        {/* Informações */}
        <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Info className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-1">Sobre as Integrações</h4>
              <p className="text-amber-500/70 text-sm leading-relaxed">
                Configure suas integrações com serviços externos para automatizar processos e oferecer mais opções aos seus clientes. Cada integração possui suas próprias credenciais e configurações específicas para o seu tenant.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
