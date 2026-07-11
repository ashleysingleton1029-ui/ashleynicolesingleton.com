'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const PHRASES = ['BASED IN VEGAS', 'WORKING WORLDWIDE', 'ON CAMERA. IN PRINT.'];

export default function Statement() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current.querySelector('.statement__text');
      const reduce = prefersReducedMotion();

      // entrance
      gsap.from(el, {
        yPercent: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
      });

      if (reduce) return;

      // drifting footage inside the letterforms
      gsap.to(el, {
        backgroundPositionX: '100%',
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // cycle the statement
      let i = 0;
      const swap = () => {
        i = (i + 1) % PHRASES.length;
        gsap
          .timeline()
          .to(el, {
            yPercent: -28,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => { el.textContent = PHRASES[i]; },
          })
          .set(el, { yPercent: 28 })
          .to(el, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out' });
      };
      const id = setInterval(swap, 2900);
      return () => clearInterval(id);
    },
    { scope: ref }
  );

  return (
    <section className="statement" ref={ref} aria-label="Ashley Nicole Singleton — based in Las Vegas, working worldwide">
      <div className="container">
        <span className="eyebrow eyebrow--accent statement__eyebrow">Las Vegas · Worldwide</span>
        <h2 className="statement__text text-clip h-display" aria-hidden="true">{PHRASES[0]}</h2>
      </div>
    </section>
  );
}
