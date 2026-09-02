# Ashley Nicole Singleton — site notes

## 🔒 ENTIRE SITE LOCKED — do NOT modify anything without explicit unlock

As of 2026-08-03 the **whole website is finished and approved**. Treat every
file in this repository as locked: do **not** edit, restyle, recrop, rename,
move, or delete any HTML, CSS, JS, image, video, or other asset, and do not
change any asset a file references.

**Before making ANY change**, the user must explicitly unlock the specific
file(s) first (e.g. "unlock `index.html`" or "change the footer"). If a
requested change would touch any file, stop and confirm which file(s) to
unlock before proceeding. When in doubt, ask.

The only exception is `scratchpad/` (gitignored working files), which is not
part of the site and may be used freely.

### Extra-sensitive items (locked, with special handling even when unlocked)
- `work/seventh-gear/deck.enc` and `work/seventh-gear/deck-pdf.enc` — AES-encrypted
  pitch deck. **Never** regenerate, decrypt to a tracked path, or commit plaintext.
- `work/seventh-gear.html` — approved film source Cloudflare Stream
  `e0ef0b1bfbd63e11016eaff144ab6300`; cue timings are final — do not retime.
  A logo end-card wipes in (right→left) at the 1:06 mark (`#sgEndLogo`).
- Loader: `.preloader` / `#preVideo` markup in `index.html` and the loader logic
  in `js/main.js` (`runPreloader`, `initPreVideo`, `window.load` hash-skip handler).
- Contact forms email via Formspree only (main site `mkoddzzp`; Seventh Gear
  `mgoggzep`; Seventh Gear pitch-deck access gate `xrpzzozg`, subject "Pitch Deck
  Download"). **Never** print `ashley@ashleynicolesingleton.com` in any page source.
- Seventh Gear deck access: after the password unlocks, an overlay (`#sgAccess`)
  collects name/email/company then shows a confidentiality agreement
  ("I Agree & Continue"); on agree it pings Formspree `xrpzzozg` and opens the deck.
- `img/chair.jpg` (bio portrait) and both gallery pages
  (`gallery/with-the-stars.html`, `gallery/in-front-of-the-lens.html`) with their
  photo sets in `img/gallery/stars/` and `img/gallery/lens/` — names/order approved.

## Conventions
- Static site: hand-written HTML + vanilla CSS + vanilla JS + GSAP (CDN).
- No em dashes in copy — use a middot (·) or rephrase.
- **Mobile video framing:** landscape reels must NOT sit at full-height
  `object-fit:cover` on phones — that over-zooms so you can't see the action.
  Right-size the section toward the reel's shape, e.g.
  `@media (max-width:767px){ height:min(100svh,90vw); object-fit:cover }`, so it
  fills with only a modest crop — no heavy zoom, no big dead letterbox bars.
  (A video framed inside a card, e.g. GGL `.expand__media`, may use
  `object-fit:contain` instead.) Apply this to every future website video.
- **Cache-busting:** local CSS/JS are referenced with a `?v=N` query (currently
  `?v=2`). Whenever you change any file under `css/` or `js/`, bump the version on
  every `href`/`src` that points to it so browsers/CDN fetch the new file — a
  global bump is safe (`?v=2`→`?v=3` across all pages):
  `sed -E -i 's/\?v=[0-9]+"/?v=3"/g' *.html work/*.html gallery/*.html`.
  Inline `<style>`/`<script>` (e.g. `work/seventh-gear.html`) need no version.
- Base branch: `claude/celebrity-media-website-qwvxkr`.
- **Website updates use ONE long-lived branch: `claude/website-updates` → PR #4.**
  Commit + push every change to this branch; it updates the existing PR in place.
  Do NOT create a new branch or a new PR per change.
- Commit trailers:
  ```
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01FEjmKaxiwjKdYgFvJ56WtP
  ```
- `scratchpad/` is gitignored (holds decrypted/working files).
