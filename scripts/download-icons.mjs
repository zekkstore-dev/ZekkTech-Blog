import https from 'https';
import fs from 'fs';
import path from 'path';

const ICON_DIR = path.join(process.cwd(), 'public', 'images', 'icon');

const icons = [
  { file: 'figma',            slug: 'figma',              color: '#F24E1E' },
  { file: 'photoshop',        slug: 'adobephotoshop',     color: '#31A8FF' },
  { file: 'illustrator',      slug: 'adobeillustrator',   color: '#FF9A00' },
  { file: 'xd',               slug: 'adobexd',            color: '#FF61F6' },
  { file: 'sketch',           slug: 'sketch',             color: '#F7B500' },
  { file: 'canva',            slug: 'canva',              color: '#00C4CC' },
  { file: 'premiere',         slug: 'adobepremierepro',   color: '#9999FF' },
  { file: 'aftereffects',     slug: 'adobeaftereffects',  color: '#9999FF' },
  { file: 'blender',          slug: 'blender',            color: '#F5792A' },
  { file: 'coreldraw',        slug: 'coreldraw',          color: '#009245' },
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (r) => {
          const chunks = [];
          r.on('data', c => chunks.push(c));
          r.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading SVG + PNG from Simple Icons...\n');

  for (const { file, slug, color } of icons) {
    // Download SVG
    try {
      const svgUrl = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
      let svg = (await download(svgUrl)).toString('utf8');
      svg = svg.replace('<svg ', `<svg fill="${color}" `);
      fs.writeFileSync(path.join(ICON_DIR, `${file}.svg`), svg);
      console.log(`OK SVG: ${file}.svg → ${color}`);
    } catch (e) {
      console.log(`FAIL SVG: ${file} - ${e.message}`);
    }

    // Download PNG (Simple Icons doesn't have PNG, but we can get from shields.io or other CDN)
    // Alternative: use img.shields.io/badge/icon endpoint
    try {
      // Use Simple Icons CDN PNG fallback via jsDelivr (some have it)
      const pngUrl = `https://cdn.simpleicons.org/${slug}`;
      const pngData = await download(pngUrl);
      // Check if it's actually an SVG (simpleicons.org returns SVG by default)
      const text = pngData.toString('utf8');
      if (text.startsWith('<svg')) {
        // simpleicons.org only returns SVG, save as SVG
        let svgContent = text.replace('<svg ', `<svg fill="${color}" `);
        // already saved above, skip
        console.log(`     (${file} PNG not available, SVG already saved)`);
      } else {
        fs.writeFileSync(path.join(ICON_DIR, `${file}.png`), pngData);
        console.log(`OK PNG: ${file}.png (${pngData.length} bytes)`);
      }
    } catch (e) {
      console.log(`     (${file} PNG: ${e.message})`);
    }
  }

  console.log('\nDone!');
}

main();