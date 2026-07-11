'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch || prefersReducedMotion()) return;

    document.body.classList.add('has-custom-cursor');
    const dot = dotRef.current;
    const ring = ringRef.current;

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

    const move = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const grow = () => ring.classList.add(styles.active);
    const shrink = () => ring.classList.remove(styles.active);

    window.addEventListener('mousemove', move);
    const interactive = () =>
      document.querySelectorAll('a, button, [data-cursor]');
    interactive().forEach((el) => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      interactive().forEach((el) => {
        el.removeEventListener('mouseenter', grow);
        el.removeEventListener('mouseleave', shrink);
      });
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}
