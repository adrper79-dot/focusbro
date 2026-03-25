#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const IGNORES = ['node_modules', '.git', 'dist', 'build', 'coverage'];

let modifiedFiles = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (IGNORES.includes(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (ent.isFile() && /\.(js|html)$/.test(ent.name)) processFile(full);
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace .catch(err => { console.warn('Failed to parse response JSON:', err); return {}; }) and .catch(err => { console.warn('Failed to parse response JSON:', err); return {}; }) patterns with logged fallback
  // Handle both arrow returning object and empty block
  content = content.replace(/\.catch\(\s*\(\s*\)\s*=>\s*\(\s*\{\s*\}\s*\)\s*\)/g, ".catch(err => { console.warn('Failed to parse response JSON:', err); return {}; })");
  content = content.replace(/\.catch\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*\)/g, ".catch(err => { console.warn('Failed to parse response JSON:', err); return {}; })");
  // Also handle .catch(err => { console.warn('Failed to parse response JSON:', err); return {}; }) without extra spaces
  content = content.replace(/\.catch\(\(\)\s*=>\s*\(\{\}\)\)/g, ".catch(err => { console.warn('Failed to parse response JSON:', err); return {}; })");
  content = content.replace(/\.catch\(\(\)\s*=>\s*\{\s*\}\)/g, ".catch(err => { console.warn('Failed to parse response JSON:', err); return {}; })");

  // Replace empty catch blocks: catch(e) { console.warn('Caught error:', e); } -> catch(e) { console.warn('Caught error:', e); }
  // Only match truly empty braces (no comments or whitespace-only inside)
  content = content.replace(/catch\s*\(\s*([^\)]+)\s*\)\s*\{\s*\}/g, (m, p1) => {
    // Avoid changing 'catch(e) { console.warn('Caught error:', e); }' inside single-line templates that may intentionally be empty? We'll still add a warn.
    return `catch(${p1}) { console.warn('Caught error:', ${p1}); }`;
  });

  if (content !== original) {
    try {
      // Backup original
      fs.copyFileSync(filePath, filePath + '.bak');
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFiles.push(filePath);
      console.log('Modified:', filePath);
    } catch (err) {
      console.error('Failed to write', filePath, err);
    }
  }
}

walk(root);

console.log('\nSummary:');
console.log('Files modified:', modifiedFiles.length);
modifiedFiles.forEach(f => console.log(' -', f));

if (modifiedFiles.length === 0) process.exit(0);
process.exit(0);
