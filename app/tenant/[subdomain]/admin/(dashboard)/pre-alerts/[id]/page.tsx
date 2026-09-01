import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PreAlertDetailAdminClient from "./PreAlertDetailAdminClient";

export default async function AdminPreAlertDetailPage({ params }: { params: Promise<{ subdomain: string; id: string }> }) {
  const resolvedParams = await params;
  const { subdomain, id } = resolvedParams;
  const supabase = await createClient();

  const { data: preAlert, error } = await supabase
    .from("pre_alerts")
    .select("*, profiles(id, full_name, suite_number, email, phone), boxes(id, tracking_number, store_name, profiles!boxes_customer_id_fkey(suite_number))")
    .eq("id", id)
    .single();
    
  if (error || !preAlert) {
    redirect("/admin/pre-alerts");
  }

  return (
    <div className="w-full">
      <PreAlertDetailAdminClient preAlert={preAlert} subdomain={subdomain} />
    </div>
  );
}
