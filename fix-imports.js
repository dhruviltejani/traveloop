const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') && f !== 'Dashboard.jsx');

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('<Layout>')) {
    if (!content.includes('import Layout from')) {
      content = `import Layout from "../components/Layout";\n` + content;
      fs.writeFileSync(filePath, content);
      console.log(`Added Layout import to ${file}`);
    }
  }
}
