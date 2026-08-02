/* Scroll-to-expand credit hero — vanilla port, on-brand.
   Intercepts wheel/touch while the hero is "collapsed", grows the media
   frame from a card to full-bleed, slides the two title words apart, fades
   the background, then releases to normal scrolling once fully expanded. */
(function () {
  var root = document.querySelector('[data-expand]');
  if (!root) return;

  var media   = root.querySelector('.expand__media');
  var mscrim  = root.querySelector('.expand__mscrim');
  var wordL   = root.querySelector('.expand__word--l');
  var wordR   = root.querySelector('.expand__word--r');
  var bg      = root.querySelector('.expand__bg');
  var chrome  = root.querySelector('.expand__chrome');
  var content = document.querySelector('.expand-content');
  var video   = root.querySelector('.expand__media video');
  var soundBtn = root.querySelector('.expand__sound');
  var replayBtn = root.querySelector('.expand__replay');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var srcReady = false;

  // Attach the source lazily — progressive MP4 first (most reliable), then
  // native HLS (Safari), hls.js, or DASH as fallbacks.
  function ensureSource() {
    if (srcReady || !video) return;
    srcReady = true;
    var mp4Url = video.getAttribute('data-mp4');
    var hlsUrl = video.getAttribute('data-hls');
    var dashUrl = video.getAttribute('data-dash');
    if (mp4Url) {
      video.src = mp4Url;
    } else if (video.canPlayType('application/vnd.apple.mpegurl') && hlsUrl) {
      video.src = hlsUrl;
    } else if (window.Hls && window.Hls.isSupported() && hlsUrl) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (dashUrl) {
      // Last-ditch fallback; most browsers won't decode DASH natively but
      // some Android/Chromecast contexts will.
      video.src = dashUrl;
    }
  }

  var progress = 0;      // 0 = card, 1 = full-bleed
  var expanded = false;  // once true, page scrolls normally
  var touchY = 0;
  var raf = null;

  function isMobile() { return window.innerWidth < 768; }

  function apply() {
    var m = isMobile();
    var w = 300 + progress * (m ? 650 : 1250);
    var h = 400 + progress * (m ? 200 : 400);
    var tx = progress * (m ? 180 : 150); // vw the words travel apart

    media.style.width = w + 'px';
    media.style.height = h + 'px';
    if (wordL) wordL.style.transform = 'translateX(-' + tx + 'vw)';
    if (wordR) wordR.style.transform = 'translateX(' + tx + 'vw)';
    if (bg) bg.style.opacity = String(1 - progress);
    if (chrome) chrome.style.opacity = String(1 - Math.min(1, progress * 1.4));
    if (mscrim) mscrim.style.opacity = String(1 - Math.min(1, progress * 1.6));
  }

  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; apply(); });
  }

  function setExpanded(state) {
    if (state === expanded) return;
    expanded = state;
    document.body.style.overflow = expanded ? '' : 'hidden';
    if (content) content.classList.toggle('is-shown', expanded);
    if (expanded && video) {
      ensureSource();
      if (replayBtn) replayBtn.hidden = true;
      video.muted = true;
      try { video.currentTime = 0; } catch (err) {}
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      if (soundBtn) soundBtn.hidden = false;
    }
  }

  function drive(delta) {
    // delta > 0 grows toward full-bleed; delta < 0 collapses.
    progress = Math.max(0, Math.min(1, progress + delta));
    schedule();
    if (progress >= 1) setExpanded(true);
  }

  function onWheel(e) {
    if (expanded) {
      // Allow collapse only when scrolled back to the very top.
      if (e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
        drive(e.deltaY * 0.0009);
      }
      return;
    }
    e.preventDefault();
    drive(e.deltaY * 0.0009);
    if (!expanded) window.scrollTo(0, 0);
  }

  function onTouchStart(e) { touchY = e.touches[0].clientY; }

  function onTouchMove(e) {
    var y = e.touches[0].clientY;
    var dy = touchY - y; // swipe up => positive
    touchY = y;
    if (expanded) {
      if (dy < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
        drive(dy * 0.008);
      }
      return;
    }
    e.preventDefault();
    drive(dy * (dy < 0 ? 0.005 : 0.008));
    if (!expanded) window.scrollTo(0, 0);
  }

  // "Sound" restarts the short clip from the top with audio, so you always
  // hear the whole thing — the muted autoplay may already be part-way (or
  // fully) through by the time the hero finishes expanding.
  if (soundBtn && video) {
    soundBtn.addEventListener('click', function () {
      if (replayBtn) replayBtn.hidden = true;
      video.muted = false;
      video.volume = 1;
      try { video.currentTime = 0; } catch (err) {}
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      soundBtn.hidden = true;
    });
  }

  // "Replay" restarts from the top, keeping whatever sound state is set. If
  // it's still muted, re-offer the Sound button so audio can be turned on.
  if (replayBtn && video) {
    replayBtn.addEventListener('click', function () {
      replayBtn.hidden = true;
      try { video.currentTime = 0; } catch (err) {}
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      if (soundBtn && video.muted) soundBtn.hidden = false;
    });
  }

  // When the clip finishes, swap the Sound prompt for a Replay button.
  if (video) {
    video.addEventListener('ended', function () {
      if (soundBtn) soundBtn.hidden = true;
      if (replayBtn) replayBtn.hidden = false;
    });
  }

  if (reduce) {
    progress = 1;
    apply();
    setExpanded(true);
    return;
  }

  document.body.style.overflow = 'hidden';
  apply();

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('resize', schedule);
})();

/* Interview reel lightbox — plays an Instagram reel via its /embed iframe,
   loaded only on click and cleared on close so playback stops. */
(function () {
  var lb = document.getElementById('reelLb');
  if (!lb) return;
  var frame = lb.querySelector('iframe');
  var closeBtn = lb.querySelector('.reel-lb__close');
  var cards = document.querySelectorAll('.reel-card');
  var lastFocus = null;

  function open(url, card) {
    lastFocus = card || null;
    frame.src = url;
    lb.hidden = false;
    // next frame so the display:flex applies before the opacity transition
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () { lb.hidden = true; frame.src = 'about:blank'; }, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Instagram does not reliably allow reels to play inside a third-party
  // iframe (it blocks embedding), so open the reel on Instagram in a new tab
  // where it always plays.
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      var href = c.getAttribute('data-href') || c.getAttribute('data-embed');
      if (href) window.open(href, '_blank', 'noopener');
    });
  });
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
  });
})();
