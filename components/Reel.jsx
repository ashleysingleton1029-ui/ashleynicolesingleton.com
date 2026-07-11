'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { reel } from '@/lib/content';
import Plate from './Plate';

export default function Reel() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '.reel__frame',
        { clipPath: 'inset(12% 12% 12% 12%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        }
      );
      gsap.to('.reel__media', {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section className="reel" id="reel" ref={root}>
      <div className="container reel__head">
        <span className="eyebrow eyebrow--accent">{reel.eyebrow}</span>
        <div className="reel__meta">
          {reel.meta.map((m) => (
            <span key={m} className="eyebrow">{m}</span>
          ))}
        </div>
      </div>

      <div className="reel__frame">
        <div className="reel__media">
          <Plate index="R" tone="ink" label="Showreel" ratio="16 / 9" />
        </div>
        <div className="reel__overlay">
          <h2 className="reel__title h-display">The Reel</h2>
          <button className="reel__play" aria-label="Play showreel" data-cursor>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <span className="reel__runtime eyebrow">{reel.runtime}</span>
        </div>
      </div>

      <div className="container reel__caption">
        <p>{reel.copy}</p>
      </div>
    </section>
  );
}
