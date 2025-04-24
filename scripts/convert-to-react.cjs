// scripts/convert-to-react.cjs
const fs = require('fs');
const path = require('path');
const { transform } = require('@svgr/core');
const svgo = require('svgo');

const INPUT_DIR = path.join(__dirname, '../assets/svg/icons');
const OUTPUT_DIR = path.join(__dirname, '../src/icons');

async function convert() {
  try {
    const files = fs.readdirSync(INPUT_DIR).filter((file) => file.endsWith('.svg'));

    await Promise.all(
      files.map(async (file) => {
        const svgPath = path.join(INPUT_DIR, file);
        const svgCode = fs.readFileSync(svgPath, 'utf8');

        // Optimize SVG using svgo
        const optimized = svgo.optimize(svgCode, { path: svgPath });
        const optimizedSvg = optimized.data;

        // Generate PascalCase component name with "Icon" suffix
        const baseName = path.basename(file, '.svg');
        const componentName =
          baseName.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase()) + 'Icon';

        // Transform SVG into a React component
        const jsxCode = await transform(
          optimizedSvg,
          {
            icon: true,
            typescript: true,
            jsxRuntime: 'automatic',
            prettier: true,
            svgo: false,
          },
          { componentName }
        );

        // Write the .tsx file
        const outputPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
        fs.writeFileSync(outputPath, jsxCode, 'utf8');
        console.log(`✅ Converted ${file} -> ${componentName}.tsx`);
      })
    );
  } catch (err) {
    console.error('❌ Error during conversion:', err);
  }
}

convert();