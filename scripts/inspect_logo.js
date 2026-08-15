const fs = require('fs');
const content = fs.readFileSync('logo.svg', 'utf8');
const dMatches = content.match(/d="([^"]+)"/g) || [];
console.log('Total paths:', dMatches.length);

const frames = [
  { name: 'Frame 1', start: 0, end: 749.5 },
  { name: 'Frame 2', start: 749.5, end: 1499 },
  { name: 'Frame 3', start: 1499, end: 2248.5 },
  { name: 'Frame 4', start: 2248.5, end: 2998 }
];

console.log('Frames:', frames);
