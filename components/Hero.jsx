'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { hero } from '@/lib/content';
import Plate from './Plate';

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const spans = root.current.querySelectorAll('.hero__name .reveal-line > span');

      if (reduce) {
        gsap.set([spans, '[data-hero-fade]', '.hero__plate'], { clearProps: 'all', opacity: 1, yPercent: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.2 });
      tl.fromTo('[data-hero-top]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(spans, { yPercent: 120 }, { yPercent: 0, duration: 1.2, stagger: 0.09 }, '-=0.5')
        .fromTo(
          '.hero__plate',
          { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.3 },
          '-=1'
        )
        .fromTo('[data-hero-fade]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.8');

      // gentle parallax drift on the hero plate
      gsap.to('.hero__plate-media', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="container hero__inner">
        <div className="hero__top" data-hero-top>
          <span className="eyebrow">{hero.location}</span>
          <span className="eyebrow eyebrow--accent">Available for 2025 · 2026</span>
        </div>

        <div className="hero__grid">
          <h1 className="hero__name">
            {hero.nameLines.map((line, i) => (
              <span className="reveal-line" key={i}>
                <span>
                  {line}
                  {i === hero.nameLines.length - 1 && <b className="hero__dot">.</b>}
                </span>
              </span>
            ))}
          </h1>

          <div className="hero__plate" data-cursor>
            <div className="hero__plate-media">
              <Plate index="00" tone="warm" label="Portrait" ratio="3 / 4.2" />
            </div>
            <button className="hero__play" aria-label="Play showreel">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Reel</span>
            </button>
          </div>
        </div>

        <div className="hero__foot">
          <p className="hero__role eyebrow" data-hero-fade>{hero.role}</p>
          <p className="hero__statement" data-hero-fade>{hero.statement}</p>
          <a href="#work" className="hero__scroll" data-hero-fade aria-label="Scroll to work">
            <span className="eyebrow">Scroll</span>
            <span className="hero__scroll-line" />
          </a>
        </div>
      </div>
    </section>
  );
}
