/* =========================================================================
   Ashley Nicole Singleton — interactions
   GSAP + ScrollTrigger. Degrades gracefully; respects reduced-motion.
   ========================================================================= */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------------------------------------------------------------------
     Split helper: wrap each line's inner text in a moving <span>.
     For [data-split] with multi-line text, each physical text line
     becomes .line > span. For [data-line] the markup already provides
     .line — we just wrap its content.
     --------------------------------------------------------------------- */
  function wrapLines(el) {
    // Split on hard line breaks in the source text (whitespace-collapsed lines)
    const raw = el.textContent.trim().split("\n").map(s => s.trim()).filter(Boolean);
    el.innerHTML = raw
      .map(line => `<span class="line"><span>${line}</span></span>`)
      .join("");
    return $$(".line > span", el);
  }

  function wrapExistingLines(scope) {
    // For pre-authored .line elements, wrap their contents in a moving span.
    $$("[data-line]", scope || document).forEach(line => {
      if (line.querySelector("span")) return; // already has inner span
      line.innerHTML = `<span>${line.innerHTML}</span>`;
    });
  }

  // Enable animated split-line initial state only when JS is running.
  if (hasGSAP && !REDUCED) document.documentElement && document.body && document.body.classList.add("anim");

  /* =====================================================================
     PRELOADER
     ===================================================================== */
  function runPreloader(done, instant) {
    const pre = $("#preloader");
    const countEl = $("#preCount");
    const bar = $("#preBar");
    if (!pre) { done(); return; }

    if (REDUCED || !hasGSAP || instant) {
      countEl.textContent = "100";
      bar.style.width = "100%";
      document.body.classList.remove("is-loading");
      pre.style.display = "none";
      done();
      return;
    }

    let finished = false;
    const obj = { v: 0 };

    function finish() {
      if (finished) return;
      finished = true;
      window.removeEventListener("keydown", onKey);
      countEl.textContent = "100";
      bar.style.width = "100%";
      // Crossfade the loader into the site rather than sliding it away.
      gsap.to(pre, {
        opacity: 0, duration: 1, ease: "power2.inOut", delay: 0.15,
        onStart() { document.body.classList.remove("is-loading"); },
        onComplete() { pre.style.display = "none"; done(); }
      });
    }
    function onKey(e) {
      if (e.key === " " || e.code === "Space" || e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        gsap.killTweensOf(obj);
        finish();
      }
    }
    window.addEventListener("keydown", onKey);

    gsap.to(obj, {
      v: 100, duration: 2, ease: "power1.inOut",
      onUpdate() {
        const n = Math.round(obj.v);
        countEl.textContent = String(n).padStart(2, "0");
        bar.style.width = n + "%";
      },
      onComplete: finish
    });
  }

  /* =====================================================================
     CUSTOM CURSOR
     ===================================================================== */
  function initCursor() {
    if (!FINE || REDUCED) return;
    const cursor = $("#cursor");
    const label = $(".cursor__label", cursor);
    if (!cursor) return;
    document.body.classList.add("cursor-on");

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y;

    window.addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; });

    function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const setState = (type) => {
      cursor.classList.remove("is-hover", "is-media");
      if (type === "hover") cursor.classList.add("is-hover");
      else if (type === "play" || type === "view") {
        cursor.classList.add("is-media");
        label.textContent = type === "view" ? "View" : "Play";
      }
    };

    $$("[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", () => setState(el.getAttribute("data-cursor")));
      el.addEventListener("mouseleave", () => setState(null));
    });
  }

  /* =====================================================================
     NAV: hide on scroll down / show on up + mobile menu
     ===================================================================== */
  function initNav() {
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const menu = $("#menu");
    let last = 0;

    const onScroll = () => {
      const y = window.scrollY;
      // frosted bar whenever we're off the very top
      nav.classList.toggle("is-solid", y > 24);
      // hide on scroll-down, reveal on scroll-up
      if (y > last && y > 400 && !nav.classList.contains("menu-open")) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const closeMenu = () => {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      nav.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
    };
    const openMenu = () => {
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      nav.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.style.overflow = "hidden";
    };

    toggle.addEventListener("click", () => {
      menu.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    $$(".menu__links a", menu).forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  }

  /* =====================================================================
     HERO reveal
     ===================================================================== */
  function initHero() {
    const title = $(".hero__title");
    const spans = title ? wrapLines(title) : [];
    // Title is split into hidden lines now — safe to reveal the container
    // (the .line > span pieces stay offset until the reveal animation plays).
    if (title) title.style.opacity = "1";
    const kickers = $$(".hero__kicker span");

    if (REDUCED || !hasGSAP) {
      spans.forEach(s => (s.style.transform = "none"));
      kickers.forEach(k => (k.style.opacity = "1"));
      return () => {};
    }

    return function play() {
      const tl = gsap.timeline();
      tl.fromTo(spans, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 })
        .to(kickers, { opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.04 }, 0.2)
        .from(".hero__play", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, 0.5)
        .from(".hero__meta, .hero__scroll", { opacity: 0, duration: 0.8, ease: "power2.out" }, 0.6);
    };
  }

  /* =====================================================================
     Generic scroll reveals
     ===================================================================== */
  function initReveals() {
    // Wrap authored [data-line] contents so each line has a moving inner span.
    wrapExistingLines(document);

    if (REDUCED || !hasGSAP || !window.ScrollTrigger) {
      // No animation: make sure everything is visible.
      $$("[data-reveal]").forEach(el => el.classList.add("is-in"));
      return;
    }

    $$("[data-reveal]").forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: "top 85%", once: true,
        onEnter: () => el.classList.add("is-in")
      });
    });

    // Line reveals (statement + bigtype)
    $$("[data-line]").forEach(line => {
      const inner = line.querySelector("span") || line;
      ScrollTrigger.create({
        trigger: line, start: "top 90%", once: true,
        onEnter: () => gsap.fromTo(inner, { yPercent: 110 }, { yPercent: 0, duration: 1.05, ease: "expo.out" })
      });
    });

    // Contact title (split) reveal
    const ct = $(".contact__title");
    if (ct) {
      const s = wrapLines(ct);
      ScrollTrigger.create({
        trigger: ct, start: "top 85%", once: true,
        onEnter: () => gsap.fromTo(s, { yPercent: 110 }, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.08 })
      });
    }
  }

  /* =====================================================================
     Stat counters
     ===================================================================== */
  function initCounters() {
    if (!hasGSAP || !window.ScrollTrigger) return;
    $$("[data-count]").forEach(el => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      if (REDUCED) { el.textContent = target + suffix; return; }
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(obj, {
          v: target, duration: 1.4, ease: "power2.out",
          onUpdate() { el.textContent = Math.round(obj.v) + suffix; }
        })
      });
    });
  }

  /* =====================================================================
     WORK list — cursor-following image reveal
     ===================================================================== */
  function initWork() {
    const img = $("#workHoverImg");
    const rows = $$(".work__row");
    if (!img || !FINE) return;

    let tx = 0, ty = 0, ix = 0, iy = 0, raf = null;
    function follow() {
      ix += (tx - ix) * 0.14;
      iy += (ty - iy) * 0.14;
      img.style.transform = `translate(${ix}px, ${iy}px) translate(-50%, -50%) scale(1)`;
      raf = requestAnimationFrame(follow);
    }

    window.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; });

    rows.forEach(row => {
      row.addEventListener("mouseenter", () => {
        const src = row.getAttribute("data-img");
        if (src) img.style.backgroundImage = `url('${src}')`;
        img.classList.add("is-visible");
        if (!raf) follow();
      });
      row.addEventListener("mouseleave", () => {
        img.classList.remove("is-visible");
      });
    });
  }

  /* =====================================================================
     BIGTYPE parallax (image inside clipped text)
     ===================================================================== */
  function initBigtype() {
    // Play the showreel inside the letters only while the section is on screen.
    const vid = $("#bigtypeVideo");
    if (!vid) return;
    if (REDUCED) return; // respect reduced-motion: leave the poster frame
    let loaded = false;
    const play = () => {
      if (!loaded) { vid.load(); loaded = true; }
      const p = vid.play();
      if (p && p.catch) p.catch(() => {});
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) play(); else vid.pause(); });
      }, { threshold: 0.15 });
      io.observe(vid);
    } else {
      play();
    }
  }

  /* =====================================================================
     SHOWREEL — inline vertical player
     ===================================================================== */
  function initReel() {
    const player = $("#reelPlayer");
    const video = $("#reelVideo");
    const playBtn = $("#reelPlay");
    if (!player || !video) return;

    const start = () => {
      player.classList.add("is-playing");
      video.controls = true;
      const p = video.play();
      if (p && p.catch) p.catch(() => { /* autoplay/gesture guard */ });
    };
    const showOverlay = () => {
      player.classList.remove("is-playing");
      video.controls = false;
      video.load(); // reset back to the poster frame
    };

    if (playBtn) playBtn.addEventListener("click", start);

    // Restore poster/overlay when the reel finishes.
    video.addEventListener("ended", showOverlay);
  }

  /* =====================================================================
     HERO SHOWREEL SOUND — hero video autoplays muted on a loop; this button
     lets viewers turn the audio on/off.
     ===================================================================== */
  function initHeroSound() {
    const v = $("#heroReel");
    const btn = $("#heroPlay");
    if (!v || !btn) return;
    const label = $("span", btn);
    const svg = $("svg", btn);
    const ICON_OFF = '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M23 9l-5 6M18 9l5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    const ICON_ON  = '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15 9a3 3 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 6a7 7 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    btn.addEventListener("click", () => {
      v.muted = !v.muted;
      if (!v.muted) { v.volume = 1; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      btn.setAttribute("aria-pressed", String(!v.muted));
      btn.setAttribute("aria-label", v.muted ? "Turn on sound" : "Mute sound");
      if (label) label.textContent = v.muted ? "Turn on sound" : "Sound on";
      if (svg) svg.innerHTML = v.muted ? ICON_OFF : ICON_ON;
    });

    // Replay: restart the showreel from the top.
    const replay = $("#heroReplay");
    if (replay) replay.addEventListener("click", () => {
      try { v.currentTime = 0; } catch (e) {}
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  }

  /* =====================================================================
     Contact form validation + fake submit
     ===================================================================== */
  function initForm() {
    const form = $("#contactForm");
    if (!form) return;
    const success = $("#contactSuccess");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setErr = (field, msg) => {
      field.classList.toggle("has-error", !!msg);
      const err = $("[data-err]", field);
      if (err) err.textContent = msg || "";
    };

    form.addEventListener("submit", e => {
      e.preventDefault();
      let ok = true, firstBad = null;
      const validate = (id, test, msg) => {
        const input = $("#" + id);
        const field = input.closest(".field");
        if (!test(input.value.trim())) { setErr(field, msg); ok = false; if (!firstBad) firstBad = input; }
        else setErr(field, "");
      };
      validate("cName", v => v.length > 1, "Please enter your name.");
      validate("cEmail", v => emailRe.test(v), "Enter a valid email.");
      validate("cMsg", v => v.length > 4, "A few details, please.");

      if (!ok) { if (firstBad) firstBad.focus(); return; }

      const btn = $("#contactSubmit");
      const error = $("#contactError");
      btn.disabled = true;
      const span = $("span", btn);
      const orig = span.textContent;
      span.textContent = "Sending…";
      if (error) error.hidden = true;

      const done = (okState) => {
        btn.disabled = false;
        span.textContent = orig;
        if (okState) {
          form.reset();
          success.hidden = false;
          success.setAttribute("role", "status");
          // GA4 conversion: a real contact-form submission succeeded.
          try { if (typeof gtag === "function") gtag("event", "contact_submit", { form_name: "Main Contact", value: 10, currency: "USD" }); } catch (e) {}
        } else if (error) {
          error.hidden = false;
          error.setAttribute("role", "status");
        }
      };

      // Real submit to Formspree; native POST fallback if fetch is unavailable.
      if (!window.fetch) { form.submit(); return; }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(res => done(res.ok)).catch(() => done(false));
    });

    // clear error on input
    $$(".field input, .field textarea", form).forEach(inp => {
      inp.addEventListener("input", () => setErr(inp.closest(".field"), ""));
    });
  }

  /* =====================================================================
     Footer year
     ===================================================================== */
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* =====================================================================
     INTRO CTA — align the "Read the story" arrow to the paragraph's real
     right text edge (desktop). Measures actual rendered lines so it's exact
     for the loaded font and re-aligns on resize / font load.
     ===================================================================== */
  function initIntroCta() {
    const copy = $(".statement__copy");
    const cta = $(".statement__cta");
    if (!copy || !cta) return;
    const desktop = window.matchMedia("(min-width: 900px)");

    function align() {
      cta.style.paddingRight = "";
      if (!desktop.matches) return;
      const range = document.createRange();
      range.selectNodeContents(copy);
      let maxRight = 0;
      for (const r of range.getClientRects()) maxRight = Math.max(maxRight, r.right);
      if (!maxRight) return;
      const arrow = cta.querySelector("svg") || cta;
      const delta = arrow.getBoundingClientRect().right - maxRight;
      if (delta > 0.5) cta.style.paddingRight = Math.round(delta) + "px";
    }

    align();
    window.addEventListener("resize", align, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    window.addEventListener("load", align);
  }

  /* =====================================================================
     ROLODEX — "hired by major brands" split-flap logo cycler.
     Reimplements the framer-motion rolodex in vanilla: two static halves
     (revealed) + two flipping halves (rotateX, backface-hidden).
     ===================================================================== */
  function initRolodex() {
    const card = $("#rolodexCard");
    if (!card) return;

    const BRANDS = [
      { src: "img/brands/nfl.png", alt: "NFL" },
      { src: "img/brands/lvmpd.png", alt: "Las Vegas Metropolitan Police Department" },
      { src: "img/brands/apple-tv.png", alt: "Apple TV" },
      { src: "img/brands/prime-video.png", alt: "Prime Video" },
      { src: "img/brands/aws.png", alt: "AWS" },
      { src: "img/brands/adidas.png", alt: "adidas" },
      { src: "img/brands/mlb.png", alt: "Major League Baseball" },
      { src: "img/brands/las-vegas-raiders.png", alt: "Las Vegas Raiders" },
      { src: "img/brands/las-vegas-aces.png", alt: "Las Vegas Aces" },
      { src: "img/brands/wwe.png", alt: "WWE" },
      { src: "img/brands/ufc.png", alt: "UFC" },
      { src: "img/brands/wow.png", alt: "WOW — Women of Wrestling" },
      { src: "img/brands/t-mobile.png", alt: "T-Mobile" },
      { src: "img/brands/gopro.png", alt: "GoPro" },
      { src: "img/brands/optix.png", alt: "Optix Studios" },
      { src: "img/brands/procam.png", alt: "ProCam — Specialty Gear by Chapman/Leonard" },
      { src: "img/brands/frequency.png", alt: "Frequency Pictures" },
      { src: "img/brands/ggl.png", alt: "Global Gaming League" },
      { src: "img/brands/seriesfest.png", alt: "SeriesFest" },
      { src: "img/brands/al-bravo.png", alt: "Al Bravo Studios" },
      { src: "img/brands/nevada-womens-film-fest.png", alt: "Nevada Women's Film Fest" },
      { src: "img/brands/chicano-hollywood.png", alt: "Chicano Hollywood" },
      { src: "img/brands/nevada-arts-council.png", alt: "Nevada Arts Council" },
      { src: "img/brands/vu.png", alt: "Vū" },
      { src: "img/brands/el-cristiano.png", alt: "1761 El Cristiano" },
    ];
    const DELAY = 2600;
    const DUR = 1400;

    const p = (role) => card.querySelector('[data-role="' + role + '"]');
    const st = p("static-top"), sb = p("static-bot"), ft = p("flip-top"), fb = p("flip-bot");
    const imgOf = (panel) => panel.querySelector("img");
    const set = (panel, i) => { imgOf(panel).src = BRANDS[i].src; };

    let cur = 0, busy = false, timer = null;
    // rest state: everything shows BRANDS[0]
    [st, sb, ft, fb].forEach((pn) => set(pn, 0));

    function flip() {
      if (busy) return;
      busy = true;
      const nxt = (cur + 1) % BRANDS.length;

      set(st, nxt);   // revealed top = incoming
      set(ft, cur);   // flipping top = outgoing
      set(fb, nxt);   // flipping bottom = incoming
      // sb (revealed bottom) still shows outgoing until the new bottom lands

      ft.style.transition = "none"; ft.style.transform = "rotateX(0deg)";
      fb.style.transition = "none"; fb.style.transform = "rotateX(180deg)";
      void card.offsetWidth; // reflow so the reset sticks before animating

      ft.style.transition = "transform " + DUR + "ms cubic-bezier(0.76,0,0.24,1)";
      fb.style.transition = "transform " + DUR + "ms cubic-bezier(0.76,0,0.24,1)";
      ft.style.transform = "rotateX(-180deg)";
      fb.style.transform = "rotateX(0deg)";

      window.setTimeout(() => {
        cur = nxt;
        set(sb, cur);   // revealed bottom now shows current
        ft.style.transition = "none"; ft.style.transform = "rotateX(0deg)"; set(ft, cur);
        fb.style.transition = "none"; fb.style.transform = "rotateX(180deg)"; set(fb, cur);
        busy = false;
      }, DUR + 60);
    }

    if (REDUCED) {
      // No 3D flip — just cross-swap the static faces.
      timer = window.setInterval(() => {
        cur = (cur + 1) % BRANDS.length;
        set(st, cur); set(sb, cur);
      }, DELAY);
      return;
    }
    timer = window.setInterval(flip, DELAY);
  }

  /* =====================================================================
     CLAPBOARD — the sign-off letter sits on a film slate; the striped arm
     claps open/closed on click, keyboard, or when it scrolls into view.
     ===================================================================== */
  function initClapboard() {
    const cb = $("#clapboard");
    if (!cb) return;
    let busy = false;
    function clap() {
      if (busy || REDUCED) return;
      busy = true;
      cb.classList.remove("clap");
      void cb.offsetWidth;            // restart the animation
      cb.classList.add("clap");
      window.setTimeout(() => { cb.classList.remove("clap"); busy = false; }, 640);
    }
    cb.addEventListener("click", clap);
    cb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); clap(); }
    });
    // auto-clap once when first revealed
    if (!REDUCED && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { window.setTimeout(clap, 350); io.disconnect(); }
        });
      }, { threshold: 0.4 });
      io.observe(cb);
    }
  }

  /* =====================================================================
     PRELOADER VIDEO (progressive MP4 — native loop)
     ===================================================================== */
  function initPreVideo() {
    const v = $("#preVideo");
    if (!v) return;
    const SRC = "https://customer-awi3sybvxx4bbl65.cloudflarestream.com/c0fcdf723f480595370570881fc5c95b/downloads/default.mp4";
    try { v.src = SRC; } catch (e) { /* poster remains as fallback */ }
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }

  /* =====================================================================
     CUSTOM SELECT — turn the native <select> into a modern dark listbox.
     Progressive enhancement: the real <select> still submits and works with
     no JS; we hide it and drive its value from a styled button + list.
     ===================================================================== */
  function initSelects() {
    document.querySelectorAll("[data-uiselect]").forEach(wrap => {
      const native = wrap.querySelector("select");
      if (!native || wrap.classList.contains("is-enhanced")) return;
      const opts = Array.from(native.options);
      const listId = (native.id || "uiselect") + "-list";

      const label = wrap.parentNode ? wrap.parentNode.querySelector("label") : null;
      if (label && !label.id) label.id = (native.id || "uiselect") + "-label";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "uiselect__button";
      btn.setAttribute("aria-haspopup", "listbox");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", listId);
      if (label) btn.setAttribute("aria-labelledby", label.id);

      const val = document.createElement("span");
      val.className = "uiselect__value";
      val.textContent = (native.value || (opts[0] && opts[0].text) || "").trim();
      btn.appendChild(val);
      btn.insertAdjacentHTML("beforeend",
        '<svg class="uiselect__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>');

      const list = document.createElement("ul");
      list.className = "uiselect__list";
      list.id = listId;
      list.setAttribute("role", "listbox");
      if (label) list.setAttribute("aria-labelledby", label.id);
      list.tabIndex = -1;

      let selected = Math.max(0, opts.findIndex(o => o.selected));
      opts.forEach((o, i) => {
        const li = document.createElement("li");
        li.className = "uiselect__opt";
        li.id = listId + "-" + i;
        li.setAttribute("role", "option");
        li.dataset.index = i;
        li.textContent = o.text;
        if (i === selected) li.setAttribute("aria-selected", "true");
        list.appendChild(li);
      });

      wrap.appendChild(btn);
      wrap.appendChild(list);
      wrap.classList.add("is-enhanced");

      const items = Array.from(list.children);
      let active = selected;

      const setActive = i => {
        active = (i + items.length) % items.length;
        items.forEach(el => el.classList.remove("is-active"));
        const el = items[active];
        el.classList.add("is-active");
        el.scrollIntoView({ block: "nearest" });
        list.setAttribute("aria-activedescendant", el.id);
      };
      const isOpen = () => wrap.classList.contains("is-open");
      const open = () => { wrap.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); setActive(selected); };
      const close = focusBtn => { wrap.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); list.removeAttribute("aria-activedescendant"); if (focusBtn) btn.focus(); };
      const choose = i => {
        selected = i;
        native.selectedIndex = i;
        val.textContent = items[i].textContent;
        items.forEach(el => el.removeAttribute("aria-selected"));
        items[i].setAttribute("aria-selected", "true");
        native.dispatchEvent(new Event("change", { bubbles: true }));
      };

      btn.addEventListener("click", () => { isOpen() ? close(true) : open(); });
      btn.addEventListener("keydown", e => {
        switch (e.key) {
          case "ArrowDown": e.preventDefault(); isOpen() ? setActive(active + 1) : open(); break;
          case "ArrowUp": e.preventDefault(); isOpen() ? setActive(active - 1) : open(); break;
          case "Home": if (isOpen()) { e.preventDefault(); setActive(0); } break;
          case "End": if (isOpen()) { e.preventDefault(); setActive(items.length - 1); } break;
          case "Enter": case " ": e.preventDefault(); if (isOpen()) { choose(active); close(true); } else open(); break;
          case "Escape": if (isOpen()) { e.preventDefault(); close(true); } break;
          case "Tab": if (isOpen()) close(false); break;
        }
      });
      list.addEventListener("click", e => {
        const li = e.target.closest(".uiselect__opt"); if (!li) return;
        choose(+li.dataset.index); close(true);
      });
      list.addEventListener("mousemove", e => {
        const li = e.target.closest(".uiselect__opt"); if (li) setActive(+li.dataset.index);
      });
      document.addEventListener("click", e => { if (!wrap.contains(e.target)) close(false); });
    });
  }

  /* =====================================================================
     BOOT
     ===================================================================== */
  initPreVideo();
  const heroPlay = initHero();
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initCursor();
    initReveals();
    initCounters();
    initWork();
    initBigtype();
    initReel();
    initHeroSound();
    initForm();
    initSelects();
    initYear();
    initIntroCta();
    initRolodex();
    initClapboard();
  });

  window.addEventListener("load", () => {
    // If we arrived from another page pointing at a section (e.g. "All Work"
    // -> index.html#work), skip the loader and land right on that section.
    const hash = location.hash;
    const hashEl = hash && hash.length > 1 ? document.querySelector(hash) : null;
    runPreloader(() => {
      if (heroPlay) heroPlay();
      // Start the hero showreel from the top only once the loader is gone, so
      // the opening seconds aren't hidden behind the preloader.
      const heroVid = document.getElementById("heroReel");
      if (heroVid && !REDUCED) {
        try { heroVid.currentTime = 0; } catch (e) {}
        const hp = heroVid.play();
        if (hp && hp.catch) hp.catch(() => {});
      }
      if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
      if (hashEl) {
        // Re-align a few times: as images/fonts finish loading they shift the
        // layout, so a single early jump can land short (e.g. on the Intro
        // section instead of Credits). Refresh triggers first, then scroll.
        const jumpToHash = () => {
          if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
          hashEl.scrollIntoView({ behavior: "auto", block: "start" });
        };
        requestAnimationFrame(jumpToHash);
        window.setTimeout(jumpToHash, 250);
        window.setTimeout(jumpToHash, 800);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(jumpToHash);
      }
    }, !!hashEl);
  });
})();
