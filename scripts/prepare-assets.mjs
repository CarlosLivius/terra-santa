import sharp from 'sharp';
import { Buffer } from 'node:buffer';
import console from 'node:console';
import process from 'node:process';
import { access, copyFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetDirectory = path.join(projectRoot, 'public', 'assets');
const conceptSourceDirectory = path.resolve(projectRoot, process.argv[2] ?? 'work');
const widths = [400, 700, 1100];
const names = ['exterior', 'living', 'kitchen', 'bedroom', 'bath'];
const exists = async (file) => { try { await access(file); return true; } catch { return false; } };
const absolute = (file) => path.join(projectRoot, file);
const reports = [];
await mkdir(assetDirectory, { recursive: true });

async function inspect(file, expectedWidth, expectedFormat) {
  const metadata = await sharp(file).metadata();
  const size = (await stat(file)).size;
  if (expectedWidth && metadata.width !== expectedWidth) throw new Error(`Invalid width for ${file}: ${metadata.width}`);
  if (expectedFormat && metadata.format !== expectedFormat) throw new Error(`Invalid format for ${file}: ${metadata.format}`);
  if (!metadata.width || !metadata.height || size === 0) throw new Error(`Empty or unreadable derivative: ${file}`);
  reports.push({ file: path.relative(projectRoot, file).replaceAll('\\', '/'), width: metadata.width, height: metadata.height, format: metadata.format, bytes: size, alpha: !!metadata.hasAlpha });
}

async function prepareBrand() {
  const logo = absolute('src/assets/terra-santa-logo-source.jpeg');
  const tree = path.join(assetDirectory, 'brand-tree.webp');
  const fullLogo = path.join(assetDirectory, 'brand-logo.webp');
  if (await exists(logo)) {
    const { data, info } = await sharp(logo).extract({ left: 309, top: 178, width: 690, height: 526 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const cornerIndexes = [0, (info.width - 1) * 3, (info.height - 1) * info.width * 3, (info.width * info.height - 1) * 3];
    const background = [0, 1, 2].map((channel) => cornerIndexes.reduce((sum, index) => sum + data[index + channel], 0) / cornerIndexes.length);
    const rgba = Buffer.alloc(info.width * info.height * 4);
    // Estimate the original terracotta ink from opaque tree pixels.
    const inkChannels = [[], [], []];
    for (let offset = 0; offset < data.length; offset += 3) {
      if (data[offset] < 205 && data[offset + 1] < 130 && data[offset + 2] < 100) {
        for (let channel = 0; channel < 3; channel++) inkChannels[channel].push(data[offset + channel]);
      }
    }
    const ink = inkChannels.map((values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)]);
    for (let pixel = 0; pixel < info.width * info.height; pixel++) {
      const offset = pixel * 3;
      const outputOffset = pixel * 4;
      // Green gives a stable matte despite red JPEG ringing around small leaves.
      const estimatedAlpha = (background[1] - data[offset + 1]) / (background[1] - ink[1]);
      const alpha = estimatedAlpha < 0.06 ? 0 : Math.min(1, estimatedAlpha);
      for (let channel = 0; channel < 3; channel++) {
        // Remove the pale JPEG matte from partially covered edge pixels.
        const color = alpha >= 0.96 ? data[offset + channel] : ink[channel];
        rgba[outputOffset + channel] = Math.round(Math.max(0, Math.min(255, color)));
      }
      rgba[outputOffset + 3] = Math.round(alpha * 255);
    }
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).resize({ width: 420 }).webp({ quality: 90 }).toFile(tree);
    await sharp(logo).resize({ width: 640 }).webp({ quality: 86 }).toFile(fullLogo);
  } else if (!await exists(tree) || !await exists(fullLogo)) throw new Error('Missing preserved logo source and brand derivatives.');
  await inspect(tree, 420, 'webp');
  await inspect(fullLogo, 640, 'webp');
  const plan = absolute('src/assets/floor-plan-reference-provisional.png');
  const planDerivative = path.join(assetDirectory, 'floor-plan-reference-provisional.webp');
  if (await exists(plan)) await sharp(plan).trim({ threshold: 25 }).resize({ width: 1600 }).webp({ quality: 90 }).toFile(planDerivative);
  else if (!await exists(planDerivative)) throw new Error('Missing preserved floor-plan source and derivative.');
  await inspect(planDerivative, 1600, 'webp');
}

async function prepareConcept(name) {
  const source = path.join(conceptSourceDirectory, `concept-${name}-source.png`);
  const base = path.join(assetDirectory, `concept-${name}.webp`);
  const fallback = path.join(assetDirectory, `concept-${name}.jpg`);
  const variants = widths.map((width) => ({ width, file: path.join(assetDirectory, `concept-${name}-${width}.webp`) }));
  if (await exists(source)) {
    for (const variant of variants) {
      await sharp(source).rotate().resize({ width: variant.width }).webp({ quality: variant.width === 1100 ? 83 : 79, effort: 5 }).toFile(variant.file);
    }
    await copyFile(variants[2].file, base);
    await sharp(source).rotate().resize({ width: 1100 }).jpeg({ quality: 83, mozjpeg: true }).toFile(fallback);
  } else {
    const complete = (await Promise.all([base, fallback, ...variants.map((variant) => variant.file)].map(exists))).every(Boolean);
    if (!complete) throw new Error(`Missing ${path.relative(projectRoot, source)} and incomplete derivatives for ${name}.`);
    console.log(`Keeping complete derivatives for ${name}; optional conceptual source omitted.`);
  }
  for (const variant of variants) await inspect(variant.file, variant.width, 'webp');
  await inspect(base, 1100, 'webp');
  await inspect(fallback, 1100, 'jpeg');
}

await prepareBrand();
for (const name of names) await prepareConcept(name);
for (const report of reports) console.log(JSON.stringify(report));
console.log(`Prepared and verified ${reports.length} derivatives. Original sources preserved.`);
