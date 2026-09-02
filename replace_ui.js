const fs = require('fs');
let content = fs.readFileSync('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', 'utf-8');

content = content.replace(/Â?¥0\.00/g, '{new Intl.NumberFormat(\\'pt-BR\\', { style: \\'currency\\', currency: \\'BRL\\' }).format(totalSales)}');
content = content.replace('<p className=\"text-2xl font-bold text-white mt-1\">0</p>', '<p className=\"text-2xl font-bold text-white mt-1\">{totalOrders}</p>');
content = content.replace('0 pendentes', '{pendingOrders} pendentes');
content = content.replace('0 com estoque baixo', '{lowStockProducts} com estoque baixo');
content = content.replace('<p className=\"text-2xl font-bold text-white mt-1\">0</p>', '<p className=\"text-2xl font-bold text-white mt-1\">{totalProducts}</p>');

content = content.replace('0 cadastradas', '{totalCategories || 0} cadastradas');
content = content.replace('0 cadastrados', '{totalProducts || 0} cadastrados');
content = content.replace('0 ativos', '{totalCoupons || 0} ativos');

fs.writeFileSync('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', content, 'utf-8');
console.log('Done!');
