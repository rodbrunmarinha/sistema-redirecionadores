
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.from("boxes").select("*").not("pre_alert_id", "is", null).limit(1);
  console.log("Linked Boxes:", data);
  console.log("Error:", error);
}
test();
