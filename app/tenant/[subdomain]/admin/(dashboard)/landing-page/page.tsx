import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LandingPageEditorClient from "./LandingPageEditorClient";

export const dynamic = 'force-dynamic';

export default async function LandingPageAdminPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (!tenant) redirect("/");

  const { data: settings } = await supabase
    .from("tenant_settings")
    .select("landing_page")
    .eq("tenant_id", tenant.id)
    .single();

  const landingPageConfig = settings?.landing_page || {};

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">Landing Page</h1>
          <p className="text-sm text-zinc-400">Personalize a sua página pública de vendas e captação.</p>
        </div>
      </div>
      <LandingPageEditorClient initialData={landingPageConfig} subdomain={subdomain} />
    </div>
  );
}
