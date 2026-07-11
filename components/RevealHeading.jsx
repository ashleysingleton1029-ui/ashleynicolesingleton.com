'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Editorial line-by-line clip reveal.
 * Pass `lines` as an array of strings; each renders in an overflow-hidden row
 * and rises into place on scroll. Use `as` to control the heading level.
 */
export default function RevealHeading({
  lines = [],
  as: Tag = 'h2',
  className = '',
  stagger = 0.08,
  delay = 0,
  start = 'top 85%',
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const spans = ref.current.querySelectorAll('.reveal-line > span');
      gsap.set(spans, { yPercent: 115 });
      gsap.to(spans, {
        yPercent: 0,
        duration: 1.05,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: { trigger: ref.current, start },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span className="reveal-line" key={i}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
