const fs = require('fs');
const code = fs.readFileSync('wordpress/ai-course-cms.php', 'utf8');

// Find all function calls: foo_bar(
const calls = new Set();
const regex = /([a-zA-Z0-9_]+)\s*\(/g;
let m;
while ((m = regex.exec(code)) !== null) {
  const fn = m[1];
  if (!['function', 'if', 'for', 'foreach', 'while', 'switch', 'catch', 'array', 'isset', 'empty', 'unset', 'echo', 'print', 'return', 'include', 'require', 'include_once', 'require_once'].includes(fn)) {
    calls.add(fn);
  }
}

console.log('Unique function calls:', Array.from(calls).sort());
