const fs = require('fs');
let content = fs.readFileSync('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', 'utf-8');
content = content.replace(/new Intl\.NumberFormat\('pt-BR', \{ style: 'currency', currency: 'BRL' \}\)/g, "new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency })");
fs.writeFileSync('app/tenant/[subdomain]/admin/(dashboard)/store/page.tsx', content, 'utf-8');
