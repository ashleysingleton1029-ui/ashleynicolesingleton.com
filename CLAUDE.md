# Ashley Nicole Singleton — site notes

## 🔒 Locked files — do NOT modify without explicit unlock

The files below are finished and approved. Do **not** edit, restyle, recrop,
rename, move, or delete them, and do not change any asset they reference,
unless the user explicitly says to unlock or change that specific file first.
If a requested change would touch a locked file, stop and ask before proceeding.

**Seventh Gear page (locked in full — page + all assets):**
- `work/seventh-gear.html` (approved film source: Cloudflare Stream
  `1fa20304914fc8b1539f167355b66500`; cue timings are final — do not retime)
- `work/seventh-gear/deck.enc` (AES-encrypted pitch deck — never regenerate/commit plaintext)
- `work/seventh-gear/deck-pdf.enc`
- `img/work/seventh-gear-hero.jpg`
- `img/work/seventh-gear-logo.png`
- `img/work/seventh-gear-thumb.jpg`
- `img/work/seventh-gear-question.jpg`

**Loader (locked):**
- The preloader markup in `index.html` (`.preloader` / `#preVideo` and its children)
- The loader logic in `js/main.js` (`runPreloader`, `initPreVideo`, and the
  `window.load` hash-skip handler)

**Bio image (locked):**
- `img/chair.jpg` (bio portrait)

## Conventions
- Static site: hand-written HTML + vanilla CSS + vanilla JS + GSAP (CDN).
- No em dashes in copy — use a middot (·) or rephrase.
- Work branch: `claude/celebrity-media-website-qwvxkr`. Commit + push after changes.
- Commit trailers:
  ```
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01FEjmKaxiwjKdYgFvJ56WtP
  ```
- `scratchpad/` is gitignored (holds decrypted/working files).
