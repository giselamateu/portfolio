# PRODUCT — Gisela Mateu, fashion designer portfolio

## What this is

A bilingual (ES/EN) static portfolio for **Gisela Mateu**, a fashion designer based in
Barcelona, formed at ESDi (Universitat Ramon Llull). It replaces her former Adobe-hosted
portfolio (no longer paid for) and is published from a public GitHub repository on GitHub
Pages.

- **Surface mode:** Experience. The designer leads the first viewport; the work follows.
- **Visitor:** fashion industry — studios, employers, press, stylists, collaborators, clients.
- **Job to be done:** a visitor understands who Gisela is, opens a project to read the
  concept and the craft behind it (concept → moodboard → palette → line-up → editorial →
  process → technical sheets), and makes contact.
- **Success:** the profile reads as a designer with a point of view; contacting her takes
  one tap.

## Structure

- **Home:** no-scroll entry on pure white — small square portrait, name, one-line
  outlook ("Graduada en diseño de moda, con una mirada creativa, conceptual y
  contemporánea"), single profile link. No footer.
- **Proyectos:** even, hierarchy-free grid — all cards equal, small covers, wide
  margins, ordered by `order`. Two entries: DRESSAGE and Eva Fàbregas.
- **Instagram:** own page with the feed (`/instagram`, `/en/instagram`).
- **Project:** hero → sticky chapter index (side rail on desktop, strip on mobile, with
  scrollspy) → concept → moodboard → palette → fabrics → trims → line-up → 3D·CLO
  → editorial → process → technical sheets → back link. Every section is optional in
  the schema (`moodboard`, `paletteBoard`, `processBoard`, `clo`, `editorial`…), so a
  project declares only what it has; missing sections and their index entries disappear.
  No meta sidebar: season/year live in the hero eyebrow only. Projects never link to
  each other.
- **Hero:** full-bleed band. Default crop is a fixed band (3:2 on mobile, `clamp(400px,
  62vh, 720px)` on desktop); a project can set `heroRatio` to keep its own aspect
  instead (used by Eva Fàbregas for the collage).
- **Profile:** first-person bio + portrait + contact.
- **Contact:** message form that emails Gisela, plus direct links.

## Product truth (verified / provided)

- Designer: Gisela Mateu. Based in Barcelona. Formed at ESDi, Universitat Ramon Llull.
- First project: **DRESSAGE. El cuerpo corregido**, graduation collection (TFG),
  season Fall/Winter 27, year 2026.
- Bio text: supplied by Gisela (first person, ES); EN is a translation.
- Project material: 34 editorial photos (all published). Hero/cover image is
  `EDITO DRESSAGE GISELA0980.jpg` (horizontal); the `/proyectos` grid uses
  `cardCover` = `EDITO DRESSAGE GISELA0610.jpg` (vertical). Plus concept text,
  moodboard and 2 line-up plates (rendered from clean lettering-free PDFs),
  colour board, 3 CLO 3D renders, a sketchbook process board, a draping photo,
  and 36 technical sheets (rendered from the high-quality PDF).
- Second project: **Eva Fàbregas**, course project at ESDi, season Fall/Winter 25/26,
  year 2025 — a textile collection read from the sculptural work of the artist.
  Material: moodboard collage (also hero and card cover), 7-colour palette sampled
  straight from the book, 3 fabric swatches, 2 trims, 2 line-up plates (10 looks) and
  19 technical sheets. No photography, no 3D: those sections simply do not exist here.
  Copy ES is from the book; EN is a translation pending Gisela's review.
- Asset sources for `npm run assets`: `TFG/`, `SobreMi/`, `miau/`, `_source/`
  — all gitignored raw material. `npm run assets:fabregas` reads
  `_source/book-fabregas.pdf` (15 pages, 72 dpi art, spreads of two A4 panels).
- Contact email: `gmateulo7@gmail.com` (form service: FormSubmit).
- Instagram: `@ggggisela`.

## Constraints

- Static output, deployed to GitHub Pages via GitHub Actions (daily rebuild scheduled).
- Public repository named `portfolio` under `giselamateu` → base path `/portfolio`,
  URL `https://giselamateu.github.io/portfolio/`.
- No custom domain (for now).
- Full-resolution originals are never committed; `TFG/` and `SobreMi/` are gitignored.
- One markdown entry + one asset folder per project.

## Open / deferred

- **Form:** active. FormSubmit is activated and deliveries reach `gmateulo7@gmail.com`
  (verified end-to-end from the browser form).
- **Instagram feed:** active via Behold.so. `src/config.ts` → `instagramFeedUrl`
  (`https://feeds.behold.so/IsXY8h6NAWbf7ZIRpr5t`). Fetched at build time; the daily cron
  rebuild keeps it fresh. Falls back to a follow link if the fetch fails.
- **Project credits** (photography, models, location) are still "Por definir" / "To be
  defined" in `src/content/projects/tfg-dressage/index.md`.
- Spanish/English project copy and profile copy should be proofread by Gisela.

## Out of scope for v1

- CMS or admin UI. Custom domain and DNS. More projects.
