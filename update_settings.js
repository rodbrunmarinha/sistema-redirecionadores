const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('tenant_settings').upsert({
    tenant_id: 'ee275735-ae21-4411-b0bb-1a85bfe60ddb',
    operations: { currency: 'BRL', weightUnit: 'kg' }
  }, { onConflict: 'tenant_id' }).select();
  console.log('Result:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}
run();
