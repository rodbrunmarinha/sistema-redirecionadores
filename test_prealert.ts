
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.from("pre_alerts").select("*").limit(1);
  console.log("Pre Alerts:", data);
  console.log("Error:", error);
}
test();
