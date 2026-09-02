import { TenantSettingsProvider } from "./components/TenantSettingsContext";
import { ReactNode } from "react";
import { getTenantSettings } from "./_utils/getTenantSettings";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  Home, Package, Map, Archive, Bell, DollarSign, 
  ShoppingBag, ShoppingCart, MapPin, Calculator, 
  Scale, Headset, User, FileText, ChevronDown, Moon, BellRing, ClipboardList, Store
} from "lucide-react";
import { NavLink } from "./components/NavLink";
import { LogoutButton } from "./components/LogoutButton";
import { Sidebar } from "./components/Sidebar";

export const dynamic = 'force-dynamic';

export default async function CustomerLayout(props: { children: ReactNode, params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const { children } = props;
  const subdomain = params.subdomain;

  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !session) {
    redirect("/app/login");
  }

  // Obter Tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) {
    redirect("/app/login");
  }

  const organizationName = tenant.organization_name || "Dock Drop";

  // Obter Perfil garantindo que o token JWT seja enviado no header para o RLS
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, suite_number, tenant_id')
    .eq('id', user.id)
    .setHeader('Authorization', `Bearer ${session.access_token}`)
    .maybeSingle();

  // Bloqueio rigoroso de Tenant cruzado
  if (profile && profile.tenant_id !== tenant.id) {
    // O usuário pertence a outro tenant. Vamos forçar o logout e redirecionar.
    await supabase.auth.signOut();
    redirect("/app/login?error=cross_tenant_forbidden");
  }

  console.log("=== RLS OFICIAL ===");
  console.log("User ID Node:", user.id);
  console.log("Profile retornado:", profile);
  console.log("Erro retornado:", profileError);

  const fullName = profile?.full_name || "Cliente";
  const firstName = fullName.split(" ")[0];
  const suiteNumber = profile?.suite_number || "----";
  const initials = fullName.substring(0, 2).toUpperCase();

  // Settings
  const settings = await getTenantSettings(subdomain);
  const currency = settings?.operations?.currency || "USD";

  // Data atual formatada (Ex: Domingo, 16 de agosto)
  const today = new Date();
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(today);

  return (
    <TenantSettingsProvider settings={settings}>
      <div className="min-h-screen bg-[#F4F7FB] flex font-sans text-zinc-900">
      <Sidebar 
        organizationName={organizationName}
        firstName={firstName}
        fullName={fullName}
        suiteNumber={suiteNumber}
        initials={initials}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header Superior */}
        <header className="h-20 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8 lg:px-12 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Olá, {firstName}! 👋</h1>
            <p className="text-sm text-zinc-500 capitalize">{dateFormatted}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Moeda Câmbio */}
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-100">
              <DollarSign className="w-4 h-4" /> {currency} <ChevronDown className="w-3 h-3 mx-1" /> R$ 5,22
            </div>
            
            {/* Idioma */}
            <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900">
              <span className="text-base">文A</span> PT <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
              <Moon className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-violet-600 hover:bg-violet-50 rounded-full transition-colors relative">
              <BellRing className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-12">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="mt-auto py-8 px-8 lg:px-12 border-t border-zinc-200/60 text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-lg text-violet-900">
              <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                <span className="text-white text-[10px]">CH</span>
              </div>
              Dock Drop
            </div>
            <div className="border-l border-zinc-300 pl-4">
              <p className="font-semibold text-zinc-700">Powered by Dock Drop</p>
              <p className="text-xs">Sistema de Gestão para Redirecionadores</p>
            </div>
          </div>
          <div className="text-right">
            <p>© 2026 Dock Drop. Todos os direitos reservados.</p>
            <div className="flex gap-3 justify-end mt-1 text-xs">
              <a href="#" className="hover:text-zinc-900 transition-colors">cndck.com.br</a>
              <span>•</span>
              <a href="#" className="hover:text-zinc-900 transition-colors">suporte@cndck.com.br</a>
            </div>
          </div>
        </footer>

      </main>
    </div>
    </TenantSettingsProvider>
  );
}
