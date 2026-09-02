import re

with open('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

data_fetching = '''
  const tenantId = tenant.id;

  // 1. Orders
  const { data: orders } = await supabase
    .from('store_orders')
    .select('id, total_amount, status, created_at, profiles(full_name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
    
  const allOrders = orders || [];
  const totalSales = allOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === 'PENDING').length;
  const recentOrders = allOrders.slice(0, 5);

  // 2. Products
  const { data: products } = await supabase
    .from('store_products')
    .select('id, name, price, stock_quantity, track_stock, main_image')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  const allProducts = products || [];
  const totalProducts = allProducts.length;
  const lowStockProducts = allProducts.filter(p => p.track_stock && p.stock_quantity <= 5).length;
  const topProducts = allProducts.slice(0, 5);

  // 3. Categories
  const { count: totalCategories } = await supabase
    .from('store_categories')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId);

  // 4. Coupons
  const { count: totalCoupons } = await supabase
    .from('store_coupons')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('status', 'ACTIVE');

'''

if 'const tenantId = tenant.id;' not in content:
    content = content.replace('if (!tenant) redirect("/admin/login");', 'if (!tenant) redirect("/admin/login");\n' + data_fetching)

with open('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Data fetching injected.')
