const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const searchStr = `res.setHeader('Access-Control-Allow-Credentials', 'true');\n  res.setHeader('Access-Control-Allow-Origin', '*');`;
      
      const replaceStr = `const origin = req.headers.origin || '*';\n  res.setHeader('Access-Control-Allow-Origin', origin);\n  res.setHeader('Access-Control-Allow-Credentials', 'true');`;
      
      if (content.includes(searchStr)) {
        content = content.replace(searchStr, replaceStr);
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

replaceInDir('d:/Alfalah/api');
console.log('Done');
