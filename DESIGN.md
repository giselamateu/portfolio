# DESIGN — dossier restraint

The visual system of the Gisela Mateu portfolio, recorded from the built site.

## World

A collection presented as a **technical dossier**. The garment is treated as structure;
the page inherits the discipline of the designer's own working material — sketchbook
plates, colour board and technical sheets — instead of the editorial-serif portfolio
default. White, measured, typographic; no separator lines, spacing does the work.

Source of the palette: the collection's own colour board (`palette.jpg` in the project).

## Colour

| Token | Hex | Role |
| --- | --- | --- |
| `--negro` | `#FFFFFF` | Page ground (pure white) |
| `--carbon` | `#FFFFFF` | Image placeholders (invisible until load) |
| `--grafito` | `#33302F` | Deep neutral, from the board |
| `--tierra` | `#3A2610` | Deep brown |
| `--cuero` | `#583B1C` | Scrollbar thumb, deep accent |
| `--taupe` | `#7B6651` | Hairlines (via `--line`), decorative |
| `--bone` | `#16110C` | Primary text (ink) |
| `--bone-dim` | `#5E564A` | Secondary text / metadata (≥ 4.5:1 on ground) |
| `--accent` | `#EB9BB7` | Interaction: hover, focus, active language, selection — pink pinned by brief (~2.1:1 on white, decorative rather than text-safe) |

A `.theme-dark` variant keeps the original drenched ground for any section that ever
needs it. The lightbox viewer always stays dark so plates keep their punch.

Selection, caret-free inputs, scrollbar, and focus ring are themed from this palette
(`::selection` uses `--accent`; focus ring is `--accent`).

## Type

- **Display:** `Impact` in uppercase (system face, pinned by brief), `Arial Black` then
  `Archivo` as fallback, weight 400, tracking `0.01em`.
- **Body:** `Neue Montreal` first in the stack (commercial — renders only where licensed;
  otherwise the free metric-near twin `Inter Variable`, self-hosted). Weight 380–420.
- **Labels:** same body face, uppercase, `0.06em`–`0.08em` tracking (`.mono`, `.link`,
  nav, captions). Only two typefaces ship: Impact for titles, Neue Montreal for
  everything else.
- Scale: fluid `clamp()` steps `--step--1 … --step-4`. Body measure ≤ 62ch (`--measure`).

## Layout

- Sticky header: name + role, nav (Proyectos · Instagram · Perfil · Contacto),
  ES/EN switch. Wraps to two rows on small screens.
- **Home entry:** single viewport, no scroll, no footer. Centred column: small square
  ID-style portrait (face-framed), name at display scale, one-line outlook, one profile
  link.
- **Proyectos:** even, hierarchy-free grid — all cards equal, small covers (≤ 260 px),
  wide gutters and outer margins, deliberately a touch empty. Three columns on desktop,
  one centred column on mobile. Each card uses `cardCover` (falling back to `cover`),
  cropped 3:4.

- **Instagram:** own page reusing the feed section (build-time Behold fetch, follow-link
  fallback).
- **Project:** hero as a full-bleed editorial band (3:2 on mobile, `clamp(400px,
  62vh, 720px)` on desktop, cropped to the figure — no floating plate, no frame)
  followed by a masthead row on the content grid: eyebrow (season · year), title
  at display scale, subtitle right-aligned to the same baseline; then concept
  → moodboard → 6-up palette
  → line-up → 3-up 3D/CLO → 3-col editorial gallery → process (sketchbook board + draping
  plate, each captioned) → 4-col technical-sheet gallery (36 sheets, dark lightbox) →
  next project. Empty blocks hide automatically.
- **Profile:** bio left, small square portrait right; contact block with direct email and
  Instagram.
- **Contact:** message form (name / email / message) posting via AJAX to FormSubmit, with
  a direct-email aside.
- `section-head` block above each section, section name as the heading itself
  (no eyebrow/kicker, no rule).
- Footer: name, contact, image rights.

## Components

`SiteHeader`, `SiteFooter`, `ProjectCard`, `Gallery` (with lightbox), `Plate`,
`InstagramSection`, and the view templates `HomeView` / `ProjectView` / `AboutView` /
`ContactView`. Content is a single Astro content collection (`projects`), one `index.md`
per project with co-located images; the profile portrait lives in `src/assets/`.

## Motion

One authored moment: a single scroll-reveal (`[data-reveal]`, `translateY` + opacity,
exponential ease-out, staggered ≤ 45 ms) via `IntersectionObserver`, disabled under
`prefers-reduced-motion`. Image hover is a slow 0.9 s scale. No scattered effects.

## Content model

`src/content/projects/<slug>/index.md` — frontmatter holds project meta, image lists and
a nested `i18n: { es, en }` for subtitle, tagline, concept paragraphs and credits.
Adding a project = new folder + `index.md`, listed in `src/content.config.ts` schema.
