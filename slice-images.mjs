import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// CONFIG
const INPUT_DIR = './public/projects-originals';
const OUTPUT_WEBP_DIR = './public/projects-webp';
const WEBP_QUALITY = 90;
const MAX_WIDTH = 1280;

// Crea le cartelle di output se non esistono
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Creata cartella: ${dirPath}`);
  }
}

// Raccogli tutti i file JPEG ricorsivamente
function collectImages(dir) {
  const results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...collectImages(fullPath));
    } else if (/\.(jpe?g|png)$/i.test(item)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Processa una singola immagine
async function processImage(srcPath) {
  const relative = path.relative(INPUT_DIR, srcPath);
  const parsed = path.parse(relative);
  const subDir = parsed.dir;
  const baseName = parsed.name;

  const metadata = await sharp(srcPath).metadata();
  const { width, height } = metadata;

  console.log(`\n🖼  ${relative} — ${width}x${height}px`);

  const targetWidth = Math.min(width, MAX_WIDTH);

  const webpPath = path.join(OUTPUT_WEBP_DIR, subDir, `${baseName}.webp`);
  ensureDir(path.dirname(webpPath));
  await sharp(srcPath)
    .rotate()
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(webpPath);

  console.log(`  ✅ → ${baseName}.webp`);
}

// Main
async function main() {
  console.log('🚀 Avvio ottimizzazione immagini...\n');

  ensureDir(OUTPUT_WEBP_DIR);

  const images = collectImages(INPUT_DIR);
  console.log(`📷 Trovate ${images.length} immagini da processare`);

  for (const imgPath of images) {
    await processImage(imgPath);
  }

  console.log('\n🎉 Fatto!');
  console.log(`  ⚡ WebP: ${OUTPUT_WEBP_DIR}`);
}

main().catch(console.error);
