const fs = require('fs');

const code = fs.readFileSync('wordpress/ai-course-cms.php', 'utf8');

// Check line by line and look for any obvious syntax issues or duplicate functions
console.log('File length:', code.length, 'lines:', code.split('\n').length);

// Check if there are any unclosed tags or quotes
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // check for unescaped double quotes or backticks in suspicious contexts
}

// Let's check for any duplicate method names in class
const methodMatches = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/g);
console.log('Total functions/methods:', methodMatches ? methodMatches.length : 0);

if (methodMatches) {
  const counts = {};
  methodMatches.forEach(m => {
    const name = m.replace(/function\s+/, '').replace('(', '').trim();
    counts[name] = (counts[name] || 0) + 1;
  });
  for (let k in counts) {
    if (counts[k] > 1) {
      console.log('DUPLICATE METHOD:', k, counts[k]);
    }
  }
}
