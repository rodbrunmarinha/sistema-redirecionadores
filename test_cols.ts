
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.from("boxes").select("*").limit(1);
  console.log("Keys:", data ? Object.keys(data[0]) : "No data", error);
}
test();
