import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditServiceClient from "./EditServiceClient";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('tenant_id', profile.tenant_id)
    .is('deleted_at', null)
    .single();

  if (!service) {
        return notFound();
  }

  return <EditServiceClient initialData={service} />;
}
