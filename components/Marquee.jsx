'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { marquee } from '@/lib/content';

export default function Marquee() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current.querySelector('.marquee__track');

      const loop = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 24,
        ease: 'none',
      });

      // Scroll velocity nudges the marquee's direction + speed for a live feel.
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-3, 3, self.getVelocity() / 400);
          loop.timeScale(1 + Math.abs(v));
          gsap.to(track, { skewX: v * 2, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        },
      });

      return () => st.kill();
    },
    { scope: root }
  );

  const words = [...marquee, ...marquee];

  return (
    <div className="marquee" ref={root} aria-hidden="true">
      <div className="marquee__track">
        {words.map((word, i) => (
          <span className="marquee__item" key={i}>
            {word}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
