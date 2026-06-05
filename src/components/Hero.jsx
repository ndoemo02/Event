import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroAga from '../assets/hero-aga.jpeg';

gsap.registerPlugin(ScrollTrigger);

const CHAOS_WORDS = [
  { text: 'terminy', top: '14%', left: '54%', size: 'md', color: '#8ed95b', fromX: 62, fromY: -76, floatX: 16, floatY: -24, outX: 26, outY: -82, rot: -8, splash: 'splash-lg' },
  { text: 'kalendarz', top: '20%', left: '10%', size: 'lg', color: '#1792f1', fromX: -84, fromY: 18, floatX: -26, floatY: -28, outX: -58, outY: -92, rot: -10, splash: 'splash-xl' },
  { text: 'menu', top: '26%', left: '44%', size: 'md', color: '#8f5cfb', fromX: 18, fromY: -96, floatX: 10, floatY: -30, outX: 38, outY: -88, rot: 8, splash: 'splash-sm' },
  { text: 'transport', top: '29%', left: '8%', size: 'md', color: '#0b84d8', fromX: -94, fromY: -8, floatX: -18, floatY: -24, outX: -48, outY: -76, rot: 6, splash: 'splash-md' },
  { text: 'telefony', top: '38%', left: '9%', size: 'sm', color: '#ff7d3a', fromX: -74, fromY: 12, floatX: -20, floatY: -18, outX: -42, outY: -62, rot: -7, splash: 'splash-sm' },
  { text: 'goscie', top: '42%', left: '14%', size: 'sm', color: '#ffb21f', fromX: -56, fromY: 36, floatX: -14, floatY: -18, outX: -30, outY: -58, rot: 8, splash: 'splash-xs' },
  { text: 'zaliczki', top: '48%', left: '31%', size: 'sm', color: '#16b489', fromX: 34, fromY: 58, floatX: 12, floatY: -18, outX: 22, outY: -52, rot: -5, splash: 'splash-xs' },
  { text: 'odmowy', top: '56%', left: '8%', size: 'sm', color: '#f15cb0', fromX: -68, fromY: 70, floatX: -16, floatY: -20, outX: -34, outY: -60, rot: -11, splash: 'splash-md' },
  { text: 'plan B', top: '63%', left: '26%', size: 'sm', color: '#1bb0c7', fromX: -14, fromY: 104, floatX: -6, floatY: -18, outX: -18, outY: -56, rot: 7, splash: 'splash-sm' },
];

export default function Hero() {
  const heroRef = useRef(null);
  const chaosRef = useRef(null);
  const reliefRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = heroRef.current;
    if (!hero) return;

    const chaosWords = chaosRef.current?.querySelectorAll('.hero-chaos-word') || [];
    const relief = reliefRef.current;

    if (prefersReduced) {
      gsap.set(chaosWords, { autoAlpha: 0 });
      gsap.set(relief, { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)' });
      return;
    }

    gsap.set(chaosWords, {
      autoAlpha: 0,
      scale: 0.28,
      filter: 'blur(16px)',
      willChange: 'transform, opacity, filter',
    });
    gsap.set(relief, {
      autoAlpha: 0,
      scale: 0.88,
      y: 18,
      filter: 'blur(16px)',
      willChange: 'transform, opacity, filter',
    });

    const chaosTl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });

    chaosWords.forEach((item, index) => {
      const at = 0.1 + index * 0.065;
      const fromX = Number(item.dataset.fromX || 0);
      const fromY = Number(item.dataset.fromY || 0);
      const floatX = Number(item.dataset.floatX || 0);
      const floatY = Number(item.dataset.floatY || 0);
      const outX = Number(item.dataset.outX || 0);
      const outY = Number(item.dataset.outY || 0);
      const rot = Number(item.dataset.rot || 0);

      chaosTl.fromTo(
        item,
        {
          autoAlpha: 0,
          x: fromX,
          y: fromY,
          scale: 0.34,
          rotate: rot * -0.65,
          filter: 'blur(18px)',
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1.05,
          rotate: rot,
          filter: 'blur(0px)',
          duration: 0.14,
          ease: 'power4.out',
        },
        at
      );

      chaosTl.to(
        item,
        {
          autoAlpha: 1,
          x: floatX,
          y: floatY,
          scale: 1.03,
          rotate: rot * 0.92,
          filter: 'blur(0px)',
          duration: 0.16,
          ease: 'sine.inOut',
        },
        at + 0.14
      );

      chaosTl.to(
        item,
        {
          autoAlpha: 0,
          x: outX,
          y: outY,
          scale: 1.12,
          rotate: rot * 1.08,
          filter: 'blur(15px)',
          duration: 0.18,
          ease: 'power2.inOut',
        },
        at + 0.34
      );
    });

    chaosTl.fromTo(
      relief,
      {
        autoAlpha: 0,
        y: 20,
        scale: 0.82,
        filter: 'blur(18px)',
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.24,
        ease: 'back.out(1.4)',
      },
      0.84
    );

    return () => {
      chaosTl.kill();
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-label="Event Flow">
      <div className="hero-frame">
        <picture>
          <img
            src={heroAga}
            alt=""
            className="hero-image"
            loading="eager"
            fetchpriority="high"
          />
        </picture>

        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />

        <div className="hero-chaos" ref={chaosRef} aria-hidden="true">
          {CHAOS_WORDS.map((word) => (
            <span
              className={`hero-chaos-word is-${word.size}`}
              data-from-x={word.fromX}
              data-from-y={word.fromY}
              data-float-x={word.floatX}
              data-float-y={word.floatY}
              data-out-x={word.outX}
              data-out-y={word.outY}
              data-rot={word.rot}
              key={word.text}
              style={{ '--shot-top': word.top, '--shot-left': word.left, '--shot-color': word.color }}
            >
              <span className={`hero-chaos-splash ${word.splash}`} />
              <span className="hero-chaos-label">{word.text}</span>
            </span>
          ))}
        </div>

        <p className="hero-relief" ref={reliefRef}>
          Zostaw to Adze!
        </p>
      </div>
    </section>
  );
}
