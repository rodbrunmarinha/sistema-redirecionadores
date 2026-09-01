import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AccountClientPage from "./AccountClientPage";

export default async function AccountPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!tenant || !profile) redirect("/admin/login");

  return (
    <AccountClientPage 
      tenant={tenant}
      profile={profile}
      subdomain={subdomain}
    />
  );
}
