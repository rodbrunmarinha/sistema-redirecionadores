import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditLocationClient from "./EditLocationClient";

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.tenant_id) {
    return notFound();
  }

  const { data: location } = await supabase
    .from('warehouse_locations')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('tenant_id', profile.tenant_id)
    .is('deleted_at', null)
    .single();

  if (!location) {
    return notFound();
  }

  return <EditLocationClient initialData={location} />;
}
