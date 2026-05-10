const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') && f !== 'Dashboard.jsx');

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it imports Sidebar
  if (content.includes('import Sidebar from')) {
    // Remove Navbar and Sidebar imports
    content = content.replace(/import Navbar from ["'][^"']+["'];?\n?/g, '');
    content = content.replace(/import Sidebar from ["'][^"']+["'];?\n?/g, '');
    
    // Add Layout import if not present
    if (!content.includes('import Layout from')) {
      content = content.replace(/(import .*?\n)+/, match => `${match}import Layout from "../components/Layout";\n`);
    }

    // Replace <div className="min-h-screen bg-slate-950 flex"> ... <Sidebar /> ... <div className="flex-1"> ... <Navbar />
    // This regex needs to be careful.
    // Actually, maybe it's easier to just do it via AST or simple string replacement.
    
    const wrapperStartRegex = /<div className="min-h-screen bg-slate-950 flex">\s*\{\/\*.*?\*\/\}\s*<Sidebar \/>\s*\{\/\*.*?\*\/\}\s*<div className="flex-1">\s*<Navbar \/>/gs;
    const wrapperStartRegex2 = /<div className="min-h-screen bg-slate-950 flex">\s*<Sidebar \/>\s*<div className="flex-1">\s*<Navbar \/>/gs;
    
    // Another pattern from ViewTrip.jsx:
    // <div className="min-h-screen bg-slate-950 flex">
    //   {/* SIDEBAR */}
    //   <Sidebar />
    //   {/* MAIN */}
    //   <div className="flex-1">
    //     <Navbar />

    // We can just replace the outer tags and remove the inner <Sidebar /> and <Navbar />.
    
    let replaced = false;

    // Pattern 1
    const p1 = /<div className="min-h-screen[^>]*>\s*(?:\{\/\*.*?\*\/\}\s*)?<Sidebar \/>\s*(?:\{\/\*.*?\*\/\}\s*)?<div className="flex-1">\s*(?:\{\/\*.*?\*\/\}\s*)?<Navbar \/>/g;
    
    if (p1.test(content)) {
        content = content.replace(p1, '<Layout>');
        // Since we replaced two opening <div>s with one <Layout>, we need to remove one closing </div> at the end.
        // Usually the end of the file is:
        //       </div>
        //     </div>
        //   );
        // }
        // We'll replace the last two </div> with one </Layout>
        content = content.replace(/<\/div>\s*<\/div>\s*\)\s*;/g, '</Layout>\n  );');
        replaced = true;
    }
    
    if (!replaced) {
        // Try less strict
        console.log(`Failed to match wrapper in ${file}`);
    } else {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
  }
}
