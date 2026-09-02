const fs = require('fs');
let content = fs.readFileSync('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', 'utf-8');

content = content.replace('0 cadastradas', '{totalCategories || 0} cadastradas');
content = content.replace('0 cadastrados', '{totalProducts || 0} cadastrados');
content = content.replace('0 pendentes', '{pendingOrders || 0} pendentes');
content = content.replace('0 ativos', '{totalCoupons || 0} ativos');

fs.writeFileSync('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', content, 'utf-8');
