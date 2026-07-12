/* Scroll-to-expand credit hero — vanilla port, on-brand.
   Intercepts wheel/touch while the hero is "collapsed", grows the media
   frame from a card to full-bleed, slides the two title words apart, fades
   the background, then releases to normal scrolling once fully expanded. */
(function () {
  var root = document.querySelector('[data-expand]');
  if (!root) return;

  var media   = root.querySelector('.expand__media');
  var wordL   = root.querySelector('.expand__word--l');
  var wordR   = root.querySelector('.expand__word--r');
  var bg      = root.querySelector('.expand__bg');
  var chrome  = root.querySelector('.expand__chrome');
  var content = document.querySelector('.expand-content');
  var video   = root.querySelector('.expand__media video');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (expanded && video && video.paused) { video.play().catch(function () {}); }
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
