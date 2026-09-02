import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function CustomerLoginPage(props: { params: Promise<{ subdomain: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const searchParams = await props.searchParams;
  const errorParam = typeof searchParams.error === 'string' ? searchParams.error : undefined;

  const supabase = await createClient();
  
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, organization_name')
    .eq('subdomain', subdomain)
    .maybeSingle();

  if (!tenant) {
    notFound();
  }

  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('landing_page')
    .eq('tenant_id', tenant.id)
    .single();

  const themeColor = settings?.landing_page?.themeColor || "amber";

  return <LoginClient organizationName={tenant.organization_name} themeColor={themeColor} initialError={errorParam} />;
}
