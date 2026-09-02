import re

with open('app/tenant/[subdomain]/admin/(dashboard)/store/products/_actions/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

generator_helper = '''
function generateSKU() {
  return \"SKU-\" + Date.now().toString(36).toUpperCase() + \"-\" + Math.random().toString(36).substring(2, 6).toUpperCase();
}
'''
if 'generateSKU()' not in content:
    content = content.replace('export async function', generator_helper + '\nexport async function', 1)

content = content.replace('sku: productData.sku || null,', 'sku: (productData.sku && productData.sku.trim() !== \"\") ? productData.sku.trim() : generateSKU(),')
content = content.replace('sku: v.sku || null,', 'sku: (v.sku && v.sku.trim() !== \"\") ? v.sku.trim() : generateSKU(),')

with open('app/tenant/[subdomain]/admin/(dashboard)/store/products/_actions/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success!')
