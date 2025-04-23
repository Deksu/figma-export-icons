const fs = require('fs');
const path = require('path');
const { transform } = require('@svgr/core');

const inputDir = path.resolve(__dirname, '../assets/svg/icons');
const outputDir = path.resolve(__dirname, '../src/icons');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.svg'));

  for (const file of files) {
    const svgPath = path.join(inputDir, file);
    const svgCode = fs.readFileSync(svgPath, 'utf8');

    const componentName = path.basename(file, '.svg')
      .replace(/(^\w|-\w)/g, s => s.replace('-', '').toUpperCase());

    const jsxCode = await transform(svgCode, { icon: true }, { componentName });

    fs.writeFileSync(path.join(outputDir, `${componentName}.tsx`), jsxCode);
  }

  const exportLines = files.map(file => {
    const name = path.basename(file, '.svg')
      .replace(/(^\w|-\w)/g, s => s.replace('-', '').toUpperCase());
    return `export { default as ${name} } from './${name}';`;
  });

  fs.writeFileSync(path.join(outputDir, 'index.ts'), exportLines.join('\n'));

  console.log('✅ SVGs converted to React components.');
  console.log('✅ Generated src/icons/index.ts');
})();