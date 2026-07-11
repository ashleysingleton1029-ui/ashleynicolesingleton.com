'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { nav } from '@/lib/content';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (open) {
        gsap.set(overlay, { display: 'flex' });
        if (prefersReducedMotion()) {
          gsap.set(overlay, { opacity: 1 });
          gsap.set('.nav-overlay__link > span', { yPercent: 0 });
          return;
        }
        gsap
          .timeline()
          .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
          .fromTo(
            '.nav-overlay__link > span',
            { yPercent: 120 },
            { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 },
            '-=0.1'
          );
      } else {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => gsap.set(overlay, { display: 'none' }),
        });
      }
    },
    { dependencies: [open] }
  );

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand" aria-label="Ashley Nicole Singleton — home">
          ANS<span className="nav__brand-dot">.</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav__link link-underline">
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="nav__cta btn">Book</a>

        <button
          className={`nav__toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span /><span />
        </button>
      </div>

      <div className="nav-overlay" ref={overlayRef} aria-hidden={!open}>
        <nav className="nav-overlay__nav" aria-label="Mobile">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-overlay__link"
              onClick={() => setOpen(false)}
            >
              <span>
                <em className="nav-overlay__index">0{i + 1}</em>
                {item.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="nav-overlay__foot">
          <span className="eyebrow">Las Vegas, NV</span>
          <a href="#contact" className="eyebrow eyebrow--accent link-underline" onClick={() => setOpen(false)}>
            bookings@ashleynicolesingleton.com
          </a>
        </div>
      </div>
    </header>
  );
}
