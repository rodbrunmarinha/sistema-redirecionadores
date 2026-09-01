import { createClient } from "@/utils/supabase/server";
import PreAlertsAdminClient from "./PreAlertsAdminClient";
import { redirect } from "next/navigation";

export default async function AdminPreAlertsPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/tenant/${subdomain}/admin/login`);
  }

  const { data: preAlerts, error } = await supabase
    .from("pre_alerts")
    .select("*, profiles(full_name, suite_number)")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching pre-alerts:", error);
  }

  return (
    <div className="w-full">
      <PreAlertsAdminClient preAlerts={preAlerts || []} subdomain={subdomain} />
    </div>
  );
}
