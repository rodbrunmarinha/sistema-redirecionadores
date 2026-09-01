import { createAdminClient } from "@/utils/supabase/admin";

export async function logProductAudit(
  tenantId: string,
  productId: string,
  adminId: string,
  field: string,
  oldValue: string | null = null,
  newValue: string | null = null,
  ipAddress: string | null = null
) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('product_audit_logs').insert({
    tenant_id: tenantId,
    product_id: productId,
    admin_id: adminId,
    field,
    old_value: oldValue,
    new_value: newValue,
    ip_address: ipAddress
  });
  if (error) {
    console.error("Failed to insert audit log:", error);
  }
}
