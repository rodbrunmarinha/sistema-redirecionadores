
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.from("pre_alerts").select("*, boxes(id, received_at)").eq("status", "received").limit(1);
  console.log(JSON.stringify(data, null, 2));
  console.log(error);
}
test();
