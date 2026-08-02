/* Photo-gallery lightbox — click a tagged photo to enlarge, with prev/next
   navigation (arrows, keyboard) and a name caption. Progressive enhancement:
   without JS the photos still show inline with their hover name tags. */
(function () {
  var lb = document.getElementById('pgLb');
  if (!lb) return;
  var img = document.getElementById('pgLbImg');
  var cap = document.getElementById('pgLbCap');
  var closeBtn = lb.querySelector('.pg-lb__close');
  var prevBtn = lb.querySelector('.pg-lb__nav--prev');
  var nextBtn = lb.querySelector('.pg-lb__nav--next');
  var btns = [].slice.call(document.querySelectorAll('.pg-fig__btn'));
  if (!btns.length) return;
  var i = -1, lastFocus = null;

  function show(n) {
    i = (n + btns.length) % btns.length;
    var b = btns[i];
    var thumb = b.querySelector('img');
    img.src = b.getAttribute('data-full');
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = b.getAttribute('data-name') || '';
  }
  function open(n) {
    lastFocus = document.activeElement;
    show(n);
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () { lb.hidden = true; img.src = ''; }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  btns.forEach(function (b, idx) {
    b.addEventListener('click', function () { open(idx); });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(i - 1); });
  nextBtn.addEventListener('click', function () { show(i + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(i - 1);
    else if (e.key === 'ArrowRight') show(i + 1);
  });
})();
