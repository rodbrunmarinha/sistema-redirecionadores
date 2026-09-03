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
import { CustomerMainWrapper } from "./components/CustomerMainWrapper";

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
      <CustomerMainWrapper
        firstName={firstName}
        dateFormatted={dateFormatted}
        currency={currency}
      >
        {children}
      </CustomerMainWrapper>
    </div>
    </TenantSettingsProvider>
  );
}
