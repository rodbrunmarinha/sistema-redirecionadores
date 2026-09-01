import { SettingsClient } from "./SettingsClient";
import { createClient } from "@/utils/supabase/server";
import { getTenantSettings } from "./_actions/settings";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Configurações da Empresa",
};

export default async function SettingsPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) {
    redirect("/admin/login");
  }

  const settings = await getTenantSettings(tenant.id) || {};

  return <SettingsClient tenantId={tenant.id} subdomain={subdomain} initialSettings={settings} />;
}
