import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import PublicLandingPage from "./components/PublicLandingPage";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }) {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenant) return { title: "Página não encontrada" };

  const { data: settings } = await supabase
    .from("tenant_settings")
    .select("landing_page")
    .eq("tenant_id", tenant.id)
    .single();

  const lp = settings?.landing_page || {};

  return {
    title: lp.seoTitle || `${subdomain.toUpperCase()} | Plataforma de Redirecionamento`,
    description: lp.seoDescription || "Compre no exterior e receba no Brasil.",
  };
}

export default async function TenantLandingPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  // If no tenant is found for the subdomain, show 404
  if (!tenant) {
    notFound();
  }

  // Get landing page settings
  const { data: settings } = await supabase
    .from("tenant_settings")
    .select("landing_page")
    .eq("tenant_id", tenant.id)
    .single();

  // Se o lojista não configurou nada, você pode optar por enviar para o /login
  // redirect(`/tenant/${subdomain}/admin/login`); // (Opcional, se você não quiser exibir landing page por padrão)

  const landingPageConfig = settings?.landing_page || {};

  return <PublicLandingPage config={landingPageConfig} subdomain={subdomain} />;
}
