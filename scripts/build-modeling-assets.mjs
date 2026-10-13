import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] ?? resolve(root, '..'));
const output = resolve(root, 'src/assets/modeling');

await mkdir(output, { recursive: true });
for (const [input, name] of [
  ['lonbali.jpeg', 'lonbali'],
  ['susmies.jpeg', 'susmies'],
  ['Clara.jpeg', 'clara'],
]) {
  await sharp(resolve(source, input))
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true, progressive: true })
    .toFile(resolve(output, `${name}.jpg`));
  console.log(`Modeling asset: ${name}.jpg`);
}
