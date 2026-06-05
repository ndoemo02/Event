import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroAga from '../assets/hero-aga.jpeg';

gsap.registerPlugin(ScrollTrigger);

const CHAOS_WORDS = [
  { text: '#terminy', top: '15%', left: '54%', size: 'lg', color: '#8ddd53', fromX: 70, fromY: -80, outX: 100, outY: -36, rot: -9 },
  { text: 'kalendarz', top: '24%', left: '8%', size: 'xl', color: '#0f8fe8', fromX: -90, fromY: 28, outX: -120, outY: -18, rot: -13 },
  { text: 'telefony', top: '39%', left: '7%', size: 'md', color: '#ff7a2f', fromX: -80, fromY: -12, outX: -96, outY: 28, rot: -6 },
  { text: '#menu', top: '31%', left: '36%', size: 'md', color: '#9b5cff', fromX: 18, fromY: -88, outX: 18, outY: -92, rot: 8 },
  { text: 'transport', top: '31%', left: '8%', size: 'lg', color: '#0984d8', fromX: -100, fromY: -26, outX: -132, outY: 28, rot: 7 },
  { text: 'zaliczki', top: '51%', left: '30%', size: 'sm', color: '#00a985', fromX: 38, fromY: 74, outX: 64, outY: 92, rot: -5 },
  { text: 'odmowy', top: '56%', left: '9%', size: 'sm', color: '#f15bb5', fromX: -88, fromY: 60, outX: -104, outY: 78, rot: -11 },
  { text: 'goście', top: '44%', left: '4%', size: 'xs', color: '#ffb000', fromX: -120, fromY: 24, outX: -160, outY: 62, rot: 10 },
  { text: 'plan B', top: '64%', left: '28%', size: 'md', color: '#16a7c8', fromX: -28, fromY: 108, outX: -54, outY: 112, rot: 7 },
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
      scale: 0.18,
      filter: 'blur(14px)',
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
        scrub: 0.45,
      },
    });

    chaosWords.forEach((item, index) => {
      const at = 0.08 + index * 0.06;
      const fromX = Number(item.dataset.fromX || 0);
      const fromY = Number(item.dataset.fromY || 0);
      const outX = Number(item.dataset.outX || 0);
      const outY = Number(item.dataset.outY || 0);
      const rot = Number(item.dataset.rot || 0);

      chaosTl.fromTo(
        item,
        {
          autoAlpha: 0,
          x: fromX,
          y: fromY,
          scale: 0.22,
          rotate: rot * -0.65,
          filter: 'blur(16px)',
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1.12,
          rotate: rot,
          filter: 'blur(0px)',
          duration: 0.075,
          ease: 'power4.out',
        },
        at
      );

      chaosTl.to(item, {
        autoAlpha: 0,
        x: outX,
        y: outY,
        scale: 1.45,
        rotate: rot * 1.35,
        filter: 'blur(18px)',
        duration: 0.16,
        ease: 'power2.in',
      }, at + 0.075);
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
        duration: 0.22,
        ease: 'back.out(1.55)',
      },
      0.78
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
              data-out-x={word.outX}
              data-out-y={word.outY}
              data-rot={word.rot}
              key={word.text}
              style={{ '--shot-top': word.top, '--shot-left': word.left, '--shot-color': word.color }}
            >
              {word.text}
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
