const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const replacements = [
  // Old tokens to New Match palette:
  // Matcha Lime: #A9C632
  // Forest Brew: #1D2E1B
  // Tea Mist: #C8D2A6
  // Bamboo Beige: #E6D4A6
  { from: /#0F2A1D/g, to: '#1D2E1B' },
  { from: /#375534/g, to: '#A9C632' },
  { from: /#2A4429/g, to: '#96B228' },
  { from: /#6B9071/g, to: '#546E50' },
  { from: /#AEC3B0/g, to: '#C8D2A6' },
  { from: /#E3EED4/g, to: '#F7F9F2' },
  { from: /#1A3D2A/g, to: '#1D2E1B' },
  { from: /#2A4A35/g, to: '#243822' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { from, to } of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDir(srcDir);
console.log('Palette migration completed!');
