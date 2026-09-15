const fs = require('fs');

const f1 = fs.readFileSync('wordpress/pooja-saree-draping-cms.php', 'utf8');
const f2 = fs.readFileSync('wordpress/ai-course-cms.php', 'utf8');

// Find all defined functions outside classes (if any)
function findGlobalFns(code) {
  const fns = [];
  const lines = code.split('\n');
  let inClass = false;
  lines.forEach((line, i) => {
    if (/^\s*class\s+/.test(line)) inClass = true;
    if (inClass && /^}/.test(line.trim())) inClass = false;
    const m = line.match(/^\s*function\s+([a-zA-Z0-9_]+)\s*\(/);
    if (m && !inClass) fns.push({ name: m[1], line: i + 1 });
  });
  return fns;
}

console.log('Global fns in f1:', findGlobalFns(f1));
console.log('Global fns in f2:', findGlobalFns(f2));

// Check any constants or global vars
console.log('f1 constants:', f1.match(/define\s*\(\s*['"][^'"]+['"]/g));
console.log('f2 constants:', f2.match(/define\s*\(\s*['"][^'"]+['"]/g));
