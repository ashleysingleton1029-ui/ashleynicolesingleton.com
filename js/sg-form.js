/* Seventh Gear inquiry forms — submit to Formspree via fetch and show an
   inline thank-you in place of the form (no redirect to Formspree's page).
   Falls back to a normal POST if fetch is unavailable. */
(function () {
  if (!window.fetch) return; // no-JS / old browser: native POST + Formspree page
  var forms = document.querySelectorAll('form.sgf-form');
  Array.prototype.forEach.call(forms, function (form) {
    var thanks = form.parentNode.querySelector('.sgf-thanks');
    var btn = form.querySelector('.sgf-submit');

    function showError(msg) {
      var el = form.querySelector('.sgf-error');
      if (!el) { el = document.createElement('p'); el.className = 'sgf-error'; form.appendChild(el); }
      el.textContent = msg;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          // GA4 conversion: a Seventh Gear inquiry was submitted successfully.
          try {
            if (typeof gtag === 'function') {
              var subjEl = form.querySelector('[name="_subject"]');
              gtag('event', 'seventh_gear_inquiry', { form_name: (subjEl && subjEl.value) || 'Seventh Gear Inquiry', value: 50, currency: 'USD' });
            }
          } catch (e) {}
          if (thanks) {
            form.hidden = true;
            thanks.hidden = false;
            thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            form.reset();
          }
        } else {
          res.json().then(function (data) {
            var msg = (data && data.errors && data.errors.map(function (x) { return x.message; }).join(', ')) || 'Something went wrong. Please try again.';
            showError(msg);
          }).catch(function () { showError('Something went wrong. Please try again.'); });
          if (btn) { btn.disabled = false; btn.textContent = original; }
        }
      }).catch(function () {
        showError('Network error. Please try again.');
        if (btn) { btn.disabled = false; btn.textContent = original; }
      });
    });
  });
})();

/* Nav frosted bar: fade it in only while scrolling, out shortly after it stops. */
(function () {
  var nav = document.querySelector('.sgf-nav');
  if (!nav) return;
  var t;
  window.addEventListener('scroll', function () {
    nav.classList.add('is-scrolling');
    clearTimeout(t);
    t = setTimeout(function () { nav.classList.remove('is-scrolling'); }, 450);
  }, { passive: true });
})();
