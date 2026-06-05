// Prebuild image guard.
//
// Caps oversized source images (e.g. raw camera uploads from the CMS) to a sane
// max width and re-encodes them in place, so we never have to hand-downscale a
// new photo to keep Lighthouse/LCP healthy. Runs before `astro build`.
//
// Idempotent: images already within MAX_WIDTH are skipped. Astro still generates
// the responsive variants from these (now reasonable) sources.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const DIRS = ['src/assets/products', 'src/assets/images'];
const MAX_WIDTH = 2048;
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const encode = (pipeline, format) => {
  switch (format) {
    case 'jpeg':
      return pipeline.jpeg({ quality: 80, mozjpeg: true });
    case 'png':
      return pipeline.png({ compressionLevel: 9 });
    case 'webp':
      return pipeline.webp({ quality: 82 });
    default:
      return pipeline;
  }
};

let resized = 0;

for (const dir of DIRS) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    continue; // dir may not exist
  }

  for (const name of entries) {
    if (!EXTS.has(extname(name).toLowerCase())) continue;

    const path = join(dir, name);
    const input = await readFile(path);
    const meta = await sharp(input).metadata();

    if (!meta.width || meta.width <= MAX_WIDTH) continue;

    const output = await encode(
      sharp(input).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }),
      meta.format,
    ).toBuffer();

    await writeFile(path, output);
    resized += 1;
    const before = (input.length / 1024) | 0;
    const after = (output.length / 1024) | 0;
    console.log(`  ${path}: ${meta.width}px ${before}K -> ${MAX_WIDTH}px ${after}K`);
  }
}

console.log(
  resized > 0
    ? `[optimize-images] resized ${resized} oversized source image(s)`
    : '[optimize-images] all source images within bounds',
);
