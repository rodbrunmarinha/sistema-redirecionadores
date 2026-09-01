const fs = require('fs');
const file = 'supabase/migrations/20260830164500_create_wallet_system.sql';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/END;\r\n\$;/g, 'END;\r\n$$$$;');
text = text.replace(/END;\n\$;/g, 'END;\n$$$$;');

fs.writeFileSync(file, text, 'utf8');
console.log('Fixed end correctly');
