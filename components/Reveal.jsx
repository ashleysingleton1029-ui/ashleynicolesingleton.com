'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/** Fade + rise on scroll. Optional stagger over direct children. */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 44,
  duration = 1,
  delay = 0,
  stagger = 0,
  start = 'top 88%',
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const targets = stagger ? ref.current.children : ref.current;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
