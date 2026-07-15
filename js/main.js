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
  function runPreloader(done) {
    const pre = $("#preloader");
    const countEl = $("#preCount");
    const bar = $("#preBar");
    if (!pre) { done(); return; }

    if (REDUCED || !hasGSAP) {
      countEl.textContent = "100";
      bar.style.width = "100%";
      document.body.classList.remove("is-loading");
      pre.style.display = "none";
      done();
      return;
    }

    const obj = { v: 0 };
    gsap.to(obj, {
      v: 100, duration: 1.6, ease: "power2.inOut",
      onUpdate() {
        const n = Math.round(obj.v);
        countEl.textContent = String(n).padStart(2, "0");
        bar.style.width = n + "%";
      },
      onComplete() {
        gsap.to(pre, {
          yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.15,
          onStart() { document.body.classList.remove("is-loading"); },
          onComplete() { pre.style.display = "none"; done(); }
        });
      }
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
    // Big-type uses background-size:contain to show the whole image intact,
    // so no background-position parallax (it would slide the image and leave gaps).
    return;
  }

  /* =====================================================================
     SHOWREEL — inline vertical player
     ===================================================================== */
  function initReel() {
    const player = $("#reelPlayer");
    const video = $("#reelVideo");
    const playBtn = $("#reelPlay");
    const heroBtn = $("#heroPlay");
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
    };

    if (playBtn) playBtn.addEventListener("click", start);

    // Hero "Watch the reel" → smooth-scroll to the player, then start it.
    if (heroBtn) heroBtn.addEventListener("click", () => {
      const target = document.getElementById("showreel");
      if (target) target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
      // wait for scroll to settle before playing
      window.setTimeout(start, REDUCED ? 0 : 650);
    });

    // Restore poster/overlay when the reel finishes.
    video.addEventListener("ended", showOverlay);
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
      btn.disabled = true;
      const span = $("span", btn);
      const orig = span.textContent;
      span.textContent = "Sending…";
      // Simulated async submit (wire to a real endpoint/Formspree/Netlify here)
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        span.textContent = orig;
        success.hidden = false;
        success.setAttribute("role", "status");
      }, 900);
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
      { src: "img/brands/apple-tv.png", alt: "Apple TV" },
      { src: "img/brands/prime-video.png", alt: "Prime Video" },
      { src: "img/brands/aws.png", alt: "AWS" },
      { src: "img/brands/adidas.png", alt: "adidas" },
      { src: "img/brands/mlb.png", alt: "Major League Baseball" },
      { src: "img/brands/las-vegas-raiders.png", alt: "Las Vegas Raiders" },
      { src: "img/brands/las-vegas-aces.png", alt: "Las Vegas Aces" },
      { src: "img/brands/wwe.png", alt: "WWE" },
      { src: "img/brands/ufc.png", alt: "UFC" },
      { src: "img/brands/t-mobile.png", alt: "T-Mobile" },
      { src: "img/brands/gopro.png", alt: "GoPro" },
      { src: "img/brands/optix.png", alt: "Optix Studios" },
      { src: "img/brands/procam.png", alt: "ProCam — Specialty Gear by Chapman/Leonard" },
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
     BOOT
     ===================================================================== */
  const heroPlay = initHero();
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initCursor();
    initReveals();
    initCounters();
    initWork();
    initBigtype();
    initReel();
    initForm();
    initYear();
    initIntroCta();
    initRolodex();
    initClapboard();
  });

  window.addEventListener("load", () => {
    runPreloader(() => {
      if (heroPlay) heroPlay();
      if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
})();
