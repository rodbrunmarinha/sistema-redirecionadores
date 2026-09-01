import { createClient } from "@/utils/supabase/server";
import PreAlertsClient from "./PreAlertsClient";

export default async function PreAlertsPage({ params }: any) {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Não autorizado</div>;

  const { data: preAlerts } = await supabase
    .from("pre_alerts")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return <PreAlertsClient preAlerts={preAlerts || []} subdomain={subdomain} />;
}
