
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.rpc("execute_sql", { query: "ALTER TABLE pre_alerts ADD COLUMN IF NOT EXISTS box_id uuid REFERENCES boxes(id);" });
  console.log("Result:", data, error);
}
test();
