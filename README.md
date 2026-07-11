# Ashley Nicole Singleton — Official Site

A high-end editorial website for a Las Vegas television host & media personality.
Static, dependency-free (aside from CDN GSAP + Google Fonts), and fast on any device.

**Aesthetic:** editorial brutalism — bone white, near-black, and a single antique-gold
accent. Oversized Archivo display type, Space Mono meta labels, Inter for body.

```
index.html        Markup + content
css/styles.css    All styling (design tokens at the top under :root)
js/main.js         Preloader, cursor, reveals, work hover, video modal, form
```

## Run locally

Any static server works — no build step:

```bash
python3 -m http.server 8099
# then open http://localhost:8099
```

## Deploy

Push to any static host — **GitHub Pages, Netlify, Vercel, Cloudflare Pages**.
Point the host at the repo root; there is nothing to compile.

## Swapping the placeholders

Everything visual is a placeholder meant to be replaced with real assets.

| What | Where | How |
|------|-------|-----|
| **Hero video** | `index.html` → hero `<img class="hero__img">` | Hero currently shows `img/hero.jpg` with a slow Ken-Burns zoom. To make it a video, replace the `<img>` with a muted autoplay `<video poster="img/hero.jpg">`. |
| **Showreel (modal)** | `index.html` → `<video id="modalVideo">` | Placeholder sample MP4. Point `<source src>` at the real reel, or swap for a YouTube/Vimeo `<iframe>`. Poster is `img/spotlight.jpg`. |
| **Photography** | `img/` folder (real photos already wired in) | See the image map below. Only the hero is shown in full color; everything else is rendered B&W for the monochrome system (adjust the `grayscale()` filters in `css/styles.css` to taste). |
| **Work / credits** | `index.html` → `<ul class="work__list">` | Edit titles, categories, years, and each row's `data-img`. |
| **Copy, stats, press, socials** | `index.html` | Plain text — edit in place. Social links are `#` placeholders. |
| **Contact form** | `js/main.js` → `initForm()` | Currently simulates submission. Wire the `setTimeout` block to a real endpoint (Formspree, Netlify Forms, your API). |
| **Brand colors / spacing / fonts** | `css/styles.css` → `:root` | All tokens live here (`--gold`, `--ink`, `--paper`, type scale, spacing). |

## Image map (`img/`)

| File | Photo | Used for |
|------|-------|----------|
| `hero.jpg` | Warm gold close-up | Hero background (full color, Ken-Burns) + a work tile |
| `portrait.jpg` | Leather jacket / purple | About portrait (B&W) + a work tile |
| `editorial-bw.jpg` | B&W palm frond | "Based in Las Vegas" image-filled type + a work tile |
| `studio-red.jpg` | Red backdrop | Work tiles 01 & 06 |
| `spotlight.jpg` | Spotlight / floral dress | Showreel poster + video-modal poster + a work tile |

Swap any file (keep the same name) to change where it appears, or edit the
`data-img` / `src` references in `index.html` to re-map them.

## Design & accessibility notes

- **Responsive** mobile-first; verified at 390 / 768 / 1440. No horizontal scroll.
- **Reduced motion** — all animations disable under `prefers-reduced-motion`.
- **Resilient** — if GSAP, fonts, or images fail to load, all content stays fully
  visible and readable (progressive enhancement).
- **Keyboard & SR** — focusable controls, labelled form fields, `aria` on the video
  modal and menu, `Esc` closes overlays.
- The custom cursor and hover-image effects are desktop-only (fine pointer).
