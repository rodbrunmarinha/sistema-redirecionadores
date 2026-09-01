
import { createAdminClient } from "@/utils/supabase/admin";
async function test() {
  const sb = createAdminClient();
  
  console.log("Fetching tenant...");
  const { data: tenant } = await sb.from("tenants").select("id").eq("slug", "gabidaily").single();
  console.log("Tenant:", tenant);
  
  console.log("Fetching boxes...");
  const { data: boxes, error } = await sb
    .from("boxes")
    .select("id, tracking_number, store_name, created_at, profiles!inner(full_name, suite_number), customer_id")
    .eq("tenant_id", tenant?.id)
    .eq("status", "RECEIVED")
    .order("created_at", { ascending: false })
    .limit(20);
    
  console.log("Boxes:", JSON.stringify(boxes, null, 2));
  console.log("Error:", error);
}
test();
