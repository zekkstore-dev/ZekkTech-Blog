import * as fs from 'fs';
import * as path from 'path';

const CERT_DIR = path.join(process.cwd(), 'public/images/SertifikatasiZekk');

function listFiles(dir: string, list: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      listFiles(fullPath, list);
    } else {
      if (file !== 'desktop.ini') {
        list.push(fullPath);
      }
    }
  }
  return list;
}

try {
  const allFiles = listFiles(CERT_DIR);
  console.log(`Found ${allFiles.length} files:`);
  allFiles.forEach(f => {
    const rel = path.relative(CERT_DIR, f);
    console.log(`- ${rel} (${fs.statSync(f).size} bytes)`);
  });
} catch (e: any) {
  console.error('Error listing files:', e.message);
}
