# -*- coding: utf-8 -*-
with open('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replacements for Stats Cards
content = content.replace('Â¥0.00', '{new Intl.NumberFormat(\'pt-BR\', { style: \'currency\', currency: \'BRL\' }).format(totalSales)}')
content = content.replace('¥0.00', '{new Intl.NumberFormat(\'pt-BR\', { style: \'currency\', currency: \'BRL\' }).format(totalSales)}')
content = content.replace('<p className=\"text-2xl font-bold text-white mt-1\">0</p>', '<p className=\"text-2xl font-bold text-white mt-1\">{totalOrders}</p>', 1)
content = content.replace('0 pendentes', '{pendingOrders} pendentes')
content = content.replace('0 com estoque baixo', '{lowStockProducts} com estoque baixo')
content = content.replace('<p className=\"text-2xl font-bold text-white mt-1\">0</p>', '<p className=\"text-2xl font-bold text-white mt-1\">{totalProducts}</p>', 1)

# Quick Links bottom row
content = content.replace('0 cadastradas', '{totalCategories || 0} cadastradas')
content = content.replace('0 cadastrados', '{totalProducts || 0} cadastrados')
content = content.replace('0 ativos', '{totalCoupons || 0} ativos')

with open('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Placeholders updated.')
