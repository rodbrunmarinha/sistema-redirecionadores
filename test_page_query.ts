
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("pre_alerts")
    .select("*, profiles(id, full_name, suite_number, email, phone), boxes(id, tracking_number, store_name, profiles(suite_number))")
    .eq("id", "75eae71e-d48e-4fe3-944e-994c7d50f3f7")
    .single();
    
  console.log("Data:", data);
  console.log("Error:", error);
}
test();
