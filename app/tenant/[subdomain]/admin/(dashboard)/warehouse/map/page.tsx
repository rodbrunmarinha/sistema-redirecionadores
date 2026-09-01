import { createClient } from "@/utils/supabase/server";
import { requirePermission } from "@/utils/auth";
import WarehouseMapClient from "./WarehouseMapClient";

export default async function WarehouseMapPage() {
  await requirePermission("packages.view");
  const supabase = await createClient();

  // Fetch all locations
  const { data: locations } = await supabase
    .from("warehouse_locations")
    .select("*")
    .order("zone", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("code", { ascending: true });

  // Fetch all active boxes that are assigned to a location
  const { data: boxes } = await supabase
    .from("boxes")
    .select(`
      id,
      tracking_number,
      store_name,
      location_id,
      customer:customer_id(full_name, suite_number)
    `)
    .not("location_id", "is", null)
    .is("deleted_at", null);

  return <WarehouseMapClient locations={locations || []} boxes={boxes || []} />;
}
