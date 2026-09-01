
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb.from("services").select("*").limit(1);
  console.log(data);
  console.log(error);
}
test();
