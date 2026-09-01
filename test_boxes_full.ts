
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.rpc("get_schema_info", { table_name: "boxes" });
  console.log("Schema:", data, error);
}
test();
