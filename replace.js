
const fs = require('fs');
let file = 'app/tenant/[subdomain]/admin/(dashboard)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Envios Pendentes
content = content.replace(
  /<p className=\"text-xs font-semibold uppercase tracking-wider text-purple-200\">Envios Pendentes<\/p>\s*<p className=\"mt-2 text-4xl font-bold text-white\">0<\/p>/g,
  '<p className=\"text-xs font-semibold uppercase tracking-wider text-purple-200\">Envios Pendentes</p>\n              <p className=\"mt-2 text-4xl font-bold text-white\">{pendingShipments}</p>'
);

// Grupos Ativos
content = content.replace(
  /<p className=\"text-xs font-semibold uppercase tracking-wider text-emerald-200\">Grupos Ativos<\/p>\s*<p className=\"mt-2 text-4xl font-bold text-white\">0<\/p>\s*<p className=\"mt-1 text-xs text-emerald-200\">0 pedidos pendentes<\/p>/g,
  '<p className=\"text-xs font-semibold uppercase tracking-wider text-emerald-200\">Grupos Ativos</p>\n              <p className=\"mt-2 text-4xl font-bold text-white\">{activeGroups}</p>\n              <p className=\"mt-1 text-xs text-emerald-200\">Monitoramento ativo</p>'
);

// Saldo em carteiras
content = content.replace(
  /<p className=\"text-xs uppercase tracking-wider font-semibold text-zinc-500\">Saldo em carteiras<\/p>\s*<p className=\"text-xl font-bold text-white mt-0\.5\">\$ 0,00<\/p>/g,
  '<p className=\"text-xs uppercase tracking-wider font-semibold text-zinc-500\">Saldo em carteiras</p>\n            <p className=\"text-xl font-bold text-white mt-0.5\">{currency} {walletBalanceTotal.toFixed(2)}</p>'
);

// Envios totais
content = content.replace(
  /<p className=\"text-xs uppercase tracking-wider font-semibold text-zinc-500\">Envios totais<\/p>\s*<p className=\"text-xl font-bold text-white mt-0\.5\">0<\/p>/g,
  '<p className=\"text-xs uppercase tracking-wider font-semibold text-zinc-500\">Envios totais</p>\n            <p className=\"text-xl font-bold text-white mt-0.5\">{totalShipments}</p>'
);

// Pedidos totais
content = content.replace(
  /<p className=\"text-xs uppercase tracking-wider font-semibold text-zinc-500\">Pedidos totais<\/p>\s*<p className=\"text-xl font-bold text-white mt-0\.5\">0<\/p>/g,
  '<p className=\"text-xs uppercase tracking-wider font-semibold text-zinc-500\">Pedidos totais</p>\n            <p className=\"text-xl font-bold text-white mt-0.5\">{totalOrders}</p>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');

