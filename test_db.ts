
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("pre_alerts")
    .select("id, tracking_number, status, tenant_id")
    .limit(5);
  console.log("Data:", data);
  console.log("Error:", error);
}
test();
