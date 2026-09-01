
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.from("tenants").select("*");
  console.log("Tenants:", data);
  console.log("Error:", error);
}
test();
