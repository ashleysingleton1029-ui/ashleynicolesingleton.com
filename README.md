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
| **Hero video** | `index.html` → `<video id="heroVideo">` | Replace the `<source src="…">` with the real showreel MP4, or swap the block for a YouTube/Vimeo `<iframe>`. |
| **Showreel (modal)** | `index.html` → `<video id="modalVideo">` | Same — point at the full reel, or an embed. |
| **Photography** | `index.html` — `picsum.photos` URLs (hero poster, work rows `data-img`, about portrait, big-type fill, reel poster) | Drop real images into an `img/` folder and update the URLs. Images are rendered grayscale for the monochrome look; recolor in CSS if desired. |
| **Work / credits** | `index.html` → `<ul class="work__list">` | Edit titles, categories, years, and each row's `data-img`. |
| **Copy, stats, press, socials** | `index.html` | Plain text — edit in place. Social links are `#` placeholders. |
| **Contact form** | `js/main.js` → `initForm()` | Currently simulates submission. Wire the `setTimeout` block to a real endpoint (Formspree, Netlify Forms, your API). |
| **Brand colors / spacing / fonts** | `css/styles.css` → `:root` | All tokens live here (`--gold`, `--ink`, `--paper`, type scale, spacing). |

## Design & accessibility notes

- **Responsive** mobile-first; verified at 390 / 768 / 1440. No horizontal scroll.
- **Reduced motion** — all animations disable under `prefers-reduced-motion`.
- **Resilient** — if GSAP, fonts, or images fail to load, all content stays fully
  visible and readable (progressive enhancement).
- **Keyboard & SR** — focusable controls, labelled form fields, `aria` on the video
  modal and menu, `Esc` closes overlays.
- The custom cursor and hover-image effects are desktop-only (fine pointer).
