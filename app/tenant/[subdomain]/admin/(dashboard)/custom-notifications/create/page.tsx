import { createClient } from "@supabase/supabase-js";
import { CreateNotificationClient } from "./CreateNotificationClient";
import { redirect } from "next/navigation";

export default async function CustomNotificationCreatePage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get tenant
  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("id")
    .eq("subdomain", params.subdomain)
    .single();

  if (!tenant) {
    redirect(`/admin/dashboard`);
  }

  // Get clients for this tenant
  const { data: clients } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email")
    .eq("tenant_id", tenant.id)
    .eq("role", "CUSTOMER");

  return (
    <div className="min-h-screen bg-zinc-950">
      <CreateNotificationClient 
        clients={clients || []} 
        subdomain={params.subdomain}
      />
    </div>
  );
}
