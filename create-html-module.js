const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf-8');

// Use JSON.stringify to properly escape the HTML string, avoiding backtick escaping issues
const jsonString = JSON.stringify(html);
const content = `// Auto-generated HTML content - do not edit
const htmlContent = ${jsonString};

export default htmlContent;
`;
fs.writeFileSync('api/src/html.js', content);
console.log('Created api/src/html.js with HTML embedded (' + html.length + ' bytes)');
