import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC_PHOTOS = join(ROOT, 'TFG', 'Fotos TFG');
const SRC_BOOK = join(ROOT, 'TFG', 'Book TFG');
const SRC_PROFILE = join(ROOT, 'SobreMi', 'perfil.jpeg');
const SRC_MIAU = join(ROOT, 'miau');
const SRC_RAW = join(ROOT, '_source');
const OUT = join(ROOT, 'src', 'content', 'projects', 'tfg-dressage');
const OUT_ASSETS = join(ROOT, 'src', 'assets');

const photos = (n) => {
  const pad = String(n).padStart(4, '0');
  const file = readdirSync(SRC_PHOTOS).find((f) => f.endsWith(`GISELA${pad}.jpg`) || f.endsWith(`GISELA${pad} correg.jpg`));
  if (!file) throw new Error(`foto no encontrada: ${n}`);
  return join(SRC_PHOTOS, file);
};

const cap = (stamp) => {
  const file = readdirSync(SRC_BOOK).find((f) => f.includes(stamp));
  return join(SRC_BOOK, file);
};

const EDITORIAL = [113, 161, 167, 173, 219, 226, 228, 266, 373, 394, 418, 430, 452, 468, 475, 503, 610, 616, 665, 730, 767, 807, 815, 825, 866, 895, 946, 968, 980, 1021, 1028, 1051, 1056, 1097];
const COVER = 980;
const CARD = 610;

async function save(input, outPath, { width = 2400, quality = 82, fit = 'inside', flatten } = {}) {
  let img = sharp(input, { failOn: 'none' }).rotate();
  if (flatten) img = img.flatten({ background: flatten });
  await img
    .resize({ width, fit, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true, progressive: true })
    .toFile(outPath);
  return outPath;
}

async function renderPdf(pdfPath, prefix, dpi, outputs) {
  const tmp = join('/tmp/opencode', `_render_${prefix}`);
  await rm(tmp, { recursive: true, force: true });
  await mkdir(tmp, { recursive: true });
  execFileSync('pdftoppm', ['-r', String(dpi), '-png', pdfPath, join(tmp, 'p')], { stdio: 'ignore' });
  const pages = readdirSync(tmp)
    .filter((f) => f.endsWith('.png'))
    .sort();
  if (pages.length !== outputs.length) {
    throw new Error(`${pdfPath}: ${pages.length} páginas, se esperaban ${outputs.length}`);
  }
  for (let i = 0; i < pages.length; i++) {
    await save(join(tmp, pages[i]), outputs[i].out, { ...outputs[i], flatten: '#ffffff' });
  }
  await rm(tmp, { recursive: true, force: true });
}

async function main() {
  await rm(join(OUT, 'editorial'), { recursive: true, force: true });
  await rm(join(OUT, 'fichas'), { recursive: true, force: true });
  await rm(join(OUT, 'clo'), { recursive: true, force: true });
  await mkdir(join(OUT, 'editorial'), { recursive: true });
  await mkdir(join(OUT, 'fichas'), { recursive: true });
  await mkdir(join(OUT, 'clo'), { recursive: true });

  await save(photos(COVER), join(OUT, 'cover.jpg'), { width: 2600, quality: 84 });
  await save(photos(CARD), join(OUT, 'card-cover.jpg'), { width: 1200, quality: 84 });
  for (let i = 0; i < EDITORIAL.length; i++) {
    const name = `editorial-${String(i + 1).padStart(2, '0')}.jpg`;
    await save(photos(EDITORIAL[i]), join(OUT, 'editorial', name));
  }

  // Moodboard (A3, no lettering) and line-up (2 A4 pages, no lettering) come from
  // the clean PDFs the designer supplied, not the annotated screenshots.
  await renderPdf(join(SRC_RAW, 'moodboard.pdf'), 'mood', 200, [
    { out: join(OUT, 'moodboard.jpg'), width: 2400, quality: 86 },
  ]);
  await renderPdf(join(SRC_RAW, 'lineup.pdf'), 'lineup', 150, [
    { out: join(OUT, 'lineup-01.jpg'), width: 1600, quality: 86 },
    { out: join(OUT, 'lineup-02.jpg'), width: 1600, quality: 86 },
  ]);

  await save(cap('13.06.20'), join(OUT, 'palette.jpg'), { width: 2000 });

  // Technical sheets: rendered from the high-quality PDF (36 A4 pages).
  execFileSync('pdftoppm', ['-r', '150', '-png', join(SRC_MIAU, 'fichas tecnicas.pdf'), '/tmp/opencode/_ficha'], { stdio: 'ignore' });
  const pdfPages = readdirSync('/tmp/opencode')
    .filter((f) => f.startsWith('_ficha') && f.endsWith('.png'))
    .sort();
  for (let i = 0; i < pdfPages.length; i++) {
    const name = `ficha-${String(i + 1).padStart(2, '0')}.jpg`;
    await save(join('/tmp/opencode', pdfPages[i]), join(OUT, 'fichas', name), { width: 1200, quality: 82, flatten: '#ffffff' });
    await rm(join('/tmp/opencode', pdfPages[i]), { force: true });
  }

  // 3D renders (CLO) and the draping/pattern-making process photo.
  const cloFiles = ['CLO.png', 'CLO2.png', 'CLO3.png'];
  for (let i = 0; i < cloFiles.length; i++) {
    const name = `clo-${String(i + 1).padStart(2, '0')}.jpg`;
    await save(join(SRC_MIAU, cloFiles[i]), join(OUT, 'clo', name), { width: 1300, quality: 84, flatten: '#ffffff' });
  }
  const moulageFile = readdirSync(SRC_MIAU).find((f) => f.startsWith('Senza titolo'));
  if (moulageFile) {
    await save(join(SRC_MIAU, moulageFile), join(OUT, 'process-moulage.jpg'), { width: 2000, quality: 84, flatten: '#ffffff' });
  }

  const tmpBoard = '/tmp/opencode/_board.jpg';
  execFileSync('pdfimages', ['-j', '-f', '1', '-l', '1', join(SRC_BOOK, 'Sketchbook_Gisela_Mateu.pdf'), '/tmp/opencode/_board'], { stdio: 'ignore' });
  const boardFile = readdirSync('/tmp/opencode').find((f) => f.startsWith('_board') && (f.endsWith('.jpg') || f.endsWith('.ppm')));
  await save(join('/tmp/opencode', boardFile), join(OUT, 'process-board.jpg'), { width: 2400, quality: 84 });
  await rm(tmpBoard, { force: true });

  await mkdir(OUT_ASSETS, { recursive: true });
  await save(SRC_PROFILE, join(OUT_ASSETS, 'profile.jpg'), { width: 1400, quality: 86 });

  console.log('editorial:', EDITORIAL.length, '| fichas:', pdfPages.length, '| clo:', cloFiles.length, '| moodboard+palette+2 lineup+board+moulage+profile: ok');
  console.log('out:', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
