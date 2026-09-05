
const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Replaces
  newContent = newContent.replace(/Minha Suite/g, 'Meu Dock');
  newContent = newContent.replace(/minha suite/gi, 'meu dock');
  newContent = newContent.replace(/Sua Suite/g, 'Seu Dock');
  newContent = newContent.replace(/sua suite/gi, 'seu dock');
  newContent = newContent.replace(/Sua Suíte/g, 'Seu Dock');
  newContent = newContent.replace(/sua suíte/gi, 'seu dock');
  newContent = newContent.replace(/Numero da Suite/g, 'Número do Dock');
  newContent = newContent.replace(/numero da suite/gi, 'número do dock');
  newContent = newContent.replace(/Número da Suite/g, 'Número do Dock');
  newContent = newContent.replace(/número da suite/gi, 'número do dock');
  newContent = newContent.replace(/Número da Suíte/g, 'Número do Dock');
  newContent = newContent.replace(/número da suíte/gi, 'número do dock');
  newContent = newContent.replace(/Suite/g, 'Dock');
  newContent = newContent.replace(/suite_number/g, 'suite_number'); // do not change variable names!
  
  // Actually, 'Suite' to 'Dock' might be too aggressive.
  // We can just use the specific terms.
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      replaceInFile(full);
    }
  }
}

walk('app/tenant/[subdomain]');
console.log('Suite replacement done.');

