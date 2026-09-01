import { createClient } from "@supabase/supabase-js";
import { AuditClient } from "./AuditClient";

export default async function AuditPage(props: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const subdomain = params.subdomain;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  let logs: any[] = [];
  let totalLogs = 0;

  if (tenant) {
    let query = supabaseAdmin
      .from('product_audit_logs')
      .select('*, product:product_id(id, name, customer:customer_id(suite_number)), admin:admin_id(full_name)', { count: 'exact' })
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (searchParams.product_id) {
      query = query.eq('product_id', searchParams.product_id as string);
    }
    if (searchParams.field) {
      query = query.eq('field', searchParams.field as string);
    }
    if (searchParams.date_from) {
      query = query.gte('created_at', searchParams.date_from as string);
    }
    if (searchParams.date_to) {
      // Add 1 day to include the end date fully
      const toDate = new Date(searchParams.date_to as string);
      toDate.setDate(toDate.getDate() + 1);
      query = query.lte('created_at', toDate.toISOString());
    }

    const { data, count } = await query;
    logs = data || [];
    totalLogs = count || 0;
  }

  return <AuditClient logs={logs} totalLogs={totalLogs} tenant={tenant} searchParams={searchParams} />;
}
