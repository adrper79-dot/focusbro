const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf-8');
// Escape backticks in the HTML
const escaped = html.replace(/`/g, '\\`');
const content = `// Auto-generated HTML content - do not edit
const htmlContent = \`${escaped}\`;

export default htmlContent;
`;
fs.writeFileSync('api/src/html.js', content);
console.log('Created api/src/html.js with HTML embedded (' + html.length + ' bytes)');
