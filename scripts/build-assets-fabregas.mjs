import sharp from 'sharp';
import { mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC_PDF = join(ROOT, '_source', 'book-fabregas.pdf');
const OUT = join(ROOT, 'src', 'content', 'projects', 'eva-fabregas');
const TMP = '/tmp/opencode/_fabregas';

// Every PDF page is a spread: two landscape A4 panels side by side.
const DPI = 150;
const PANEL_W = 1754;
const PAGE_H = 1241;
const GROUND = { r: 205, g: 154, b: 178 };

const pageFile = (n) => join(TMP, `p-${String(n).padStart(2, '0')}.png`);

// Last page is a single panel, the rest are spreads; read the real width so a
// panel that does not exist is skipped instead of throwing.
async function panel(n, side) {
  const { width } = await sharp(pageFile(n)).metadata();
  const left = side === 'right' ? PANEL_W : 0;
  if (left + PANEL_W > width) return null;
  return { input: pageFile(n), left, top: 0, width: PANEL_W, height: PAGE_H };
}

async function crop(rect, outPath, { width, quality = 86, flatten = '#ffffff', trim = [] } = {}) {
  await mkdir(join(outPath, '..'), { recursive: true });
  let img = sharp(rect.input, { failOn: 'none' }).flatten({ background: flatten });
  if (rect.extract !== false) img = img.extract(rect);
  for (const t of trim) img = img.trim({ background: t.background, threshold: t.threshold ?? 20 });
  if (width) img = img.resize({ width, fit: 'inside', withoutEnlargement: true });
  await img.jpeg({ quality, mozjpeg: true, progressive: true }).toFile(outPath);
}

// Reads the colour bars straight off the palette panel: walk one scanline, find
// the runs that are not the pink ground, then sample the centre of each run.
async function samplePalette() {
  const region = await sharp(pageFile(3))
    .extract({ left: PANEL_W, top: 0, width: PANEL_W, height: PAGE_H })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data } = region;
  const y = Math.round(PAGE_H * 0.45);
  const isGround = (x) => {
    const i = (y * PANEL_W + x) * 3;
    return (
      Math.abs(data[i] - GROUND.r) < 24 &&
      Math.abs(data[i + 1] - GROUND.g) < 24 &&
      Math.abs(data[i + 2] - GROUND.b) < 24
    );
  };
  const runs = [];
  let start = -1;
  for (let x = 0; x < PANEL_W; x++) {
    if (!isGround(x)) {
      if (start < 0) start = x;
    } else if (start >= 0) {
      if (x - start > 40) runs.push([start, x]);
      start = -1;
    }
  }
  if (start >= 0 && PANEL_W - start > 40) runs.push([start, PANEL_W]);

  const hexes = [];
  for (const [a, b] of runs) {
    const cx = Math.round((a + b) / 2);
    const { data: px } = await sharp(pageFile(3))
      .extract({ left: PANEL_W + cx, top: y, width: 1, height: 1 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    hexes.push('#' + [px[0], px[1], px[2]].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase());
  }
  return hexes;
}

async function isBlank(rect) {
  const stats = await sharp(rect.input).extract(rect).stats();
  return stats.channels[0].stdev < 6;
}

// Tight bounding box of everything that is not the given colour inside a region.
// Used instead of trim(), which gives up when a single border pixel differs
// (the page has red lettering sitting on the pink ground).
async function bbox({ input, ...region }, bg, threshold = 30) {
  const { data, info } = await sharp(input).extract(region).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const far =
        Math.abs(data[i] - bg.r) > threshold ||
        Math.abs(data[i + 1] - bg.g) > threshold ||
        Math.abs(data[i + 2] - bg.b) > threshold;
      if (!far) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return null;
  return { input, left: region.left + minX, top: region.top + minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function main() {
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });
  for (const dir of ['tejidos', 'fornituras', 'fichas']) {
    await rm(join(OUT, dir), { recursive: true, force: true });
    await mkdir(join(OUT, dir), { recursive: true });
  }
  execFileSync('pdftoppm', ['-r', String(DPI), '-png', SRC_PDF, join(TMP, 'p')], { stdio: 'ignore' });

  // Moodboard: the full-bleed collage, left panel of page 3.
  await crop(await panel(3, 'left'), join(OUT, 'moodboard.jpg'), { width: PANEL_W, quality: 88, flatten: `rgb(${GROUND.r},${GROUND.g},${GROUND.b})` });

  // Card cover for the projects grid: portrait crop of the same collage.
  await crop({ input: pageFile(3), left: 400, top: 0, width: 931, height: PAGE_H }, join(OUT, 'card-cover.jpg'), { width: 900, quality: 86, flatten: `rgb(${GROUND.r},${GROUND.g},${GROUND.b})` });

  // Line up: the standalone ten-look graphic embedded in the PDF, split in two
  // so each plate stays legible. Cropping the page panel instead would carry
  // the red "LINE UP" lettering over into the site.
  const lineupDir = join(TMP, 'lineup');
  await mkdir(lineupDir, { recursive: true });
  execFileSync('pdfimages', ['-png', '-f', '5', '-l', '5', SRC_PDF, join(lineupDir, 'l')], { stdio: 'ignore' });
  let widest = null;
  for (const f of await readdir(lineupDir)) {
    if (!f.endsWith('.png')) continue;
    const { width, height } = await sharp(join(lineupDir, f)).metadata();
    if (!widest || width * height > widest.area) widest = { file: join(lineupDir, f), width, height, area: width * height };
  }
  if (!widest) throw new Error('line up no encontrada en la pagina 5');
  const half = Math.floor(widest.width / 2);
  for (const [i, left] of [0, half].entries()) {
    await crop(
      { input: widest.file, left, top: 0, width: Math.min(half, widest.width - left), height: widest.height },
      join(OUT, `lineup-0${i + 1}.jpg`),
      { width: 1200, quality: 88 }
    );
  }

  // Fabric swatches: locate the red card on the pink page, then the photograph
  // inside its red frame.
  const fabricRegions = [
    { input: pageFile(4), left: 55, top: 470, width: 545, height: 425 },
    { input: pageFile(4), left: 587, top: 470, width: 545, height: 425 },
    { input: pageFile(4), left: 1134, top: 470, width: 545, height: 425 },
  ];
  for (const [i, region] of fabricRegions.entries()) {
    const card = await bbox(region, GROUND, 30);
    if (!card) throw new Error(`tarjeta de tejido ${i + 1} no encontrada`);
    const frame = await sharp(card.input).extract({ left: card.left + 3, top: card.top + 3, width: 1, height: 1 }).raw().toBuffer();
    const inner = await bbox(card, { r: frame[0], g: frame[1], b: frame[2] }, 45);
    await crop(inner ?? card, join(OUT, 'tejidos', `tejido-${String(i + 1).padStart(2, '0')}.jpg`), { width: 900 });
  }

  // Trims swatches: the red card of each fitting, sitting on the pink page.
  const trimRegions = [
    { input: pageFile(4), left: PANEL_W + 230, top: 250, width: 560, height: 700 },
    { input: pageFile(4), left: PANEL_W + 940, top: 250, width: 560, height: 700 },
  ];
  for (const [i, region] of trimRegions.entries()) {
    const card = await bbox(region, GROUND, 30);
    if (!card) throw new Error(`tarjeta de fornituras ${i + 1} no encontrada`);
    await crop(card, join(OUT, 'fornituras', `fornitura-${String(i + 1).padStart(2, '0')}.jpg`), { width: 900 });
  }

  const palette = await samplePalette();

  // Technical sheets: one per non-blank panel of pages 6-15.
  let n = 0;
  for (let page = 6; page <= 15; page++) {
    for (const side of ['left', 'right']) {
      const rect = await panel(page, side);
      if (!rect || (await isBlank(rect))) continue;
      n++;
      await crop(rect, join(OUT, 'fichas', `ficha-${String(n).padStart(2, '0')}.jpg`), { width: 1500, quality: 84 });
    }
  }

  await rm(TMP, { recursive: true, force: true });
  console.log('palette:', palette.length, palette.join(' '));
  console.log('fichas:', n, '| tejidos: 3 | fornituras: 2 | moodboard + 2 lineup: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
