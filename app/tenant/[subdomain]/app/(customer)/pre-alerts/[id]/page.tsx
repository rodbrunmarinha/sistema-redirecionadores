import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PreAlertDetailClient from "./PreAlertDetailClient";

export default async function PreAlertDetailPage({ params }: { params: Promise<{ id: string, subdomain: string }> }) {
  const resolvedParams = await params;
  const { id, subdomain } = resolvedParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: preAlert } = await supabase
    .from("pre_alerts")
    .select("*, boxes(id, received_at)")
    .eq("id", id)
    .eq("customer_id", user.id)
    .single();

  if (!preAlert) {
    notFound();
  }

  return <PreAlertDetailClient preAlert={preAlert} subdomain={subdomain} />;
}
