'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Subtle vertical parallax for editorial imagery.
 * The inner media is scaled slightly and drifts within its clip frame,
 * so it never reveals empty edges. Respects reduced-motion.
 */
export default function Parallax({
  children,
  className = '',
  amount = 12,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const media = ref.current.querySelector('[data-parallax-media]');
      if (!media) return;
      gsap.fromTo(
        media,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
