import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import LocationsClient from "./LocationsClient";

export default async function LocationsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";

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

  let query = supabase
    .from('warehouse_locations')
    .select('*')
    .eq('tenant_id', profile.tenant_id)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('code', { ascending: true });

  if (search) {
    query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
  }

  const { data: locations } = await query;

  return <LocationsClient initialLocations={locations || []} currentSearch={search} />;
}
