import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import heroAga from '../assets/hero-aga.jpeg';

// Split text into individual word spans for stagger animation
function WordSplit({ text, className }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="hero-word-wrap" aria-hidden="true">
          <span className="hero-word">{word}</span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const contentRef = useRef(null);

  const scrollToOccasions = (event) => {
    event.preventDefault();
    const el = document.querySelector('#occasions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = contentRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.hero-word');
    const tagline = el.querySelector('.hero-tagline');
    const cta = el.querySelector('.hero-cta');
    const eyebrow = el.querySelector('.hero-eyebrow');

    if (prefersReduced) {
      // Skip animation, show everything immediately
      gsap.set([words, tagline, cta, eyebrow], { opacity: 1, y: 0 });
      return;
    }

    // Set initial hidden state
    gsap.set(words, { opacity: 0, y: 28, willChange: 'transform, opacity' });
    gsap.set([tagline, cta, eyebrow], { opacity: 0, y: 18, willChange: 'transform, opacity' });

    const tl = gsap.timeline({ delay: 0.15 });

    // Eyebrow first — small label fades in fast
    tl.to(eyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
    });

    // Headline words stagger in
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.62,
      ease: 'power3.out',
      stagger: 0.06,
    }, '-=0.28');

    // Tagline fades in after headline finishes
    tl.to(tagline, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
    }, '-=0.15');

    // CTA slides up last with slight extra delay
    tl.to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.52,
      ease: 'back.out(1.4)',
    }, '-=0.1');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="hero" aria-label="Wstęp - Event Flow">
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

      <div className="hero-content" ref={contentRef}>
        <p className="hero-eyebrow">Katowice · organizacja wydarzeń</p>

        <h1 className="hero-headline" aria-label="Twoje wydarzenie, dobrze zaplanowane.">
          <WordSplit text="Twoje wydarzenie," className="hero-headline-line" />
          {' '}
          <WordSplit text="dobrze zaplanowane." className="hero-headline-line" />
        </h1>

        <p className="hero-tagline">
          Pomysły, rezerwacje, atrakcje i logistyka&nbsp;—<br />
          wszystko dopięte. Ty tylko się cieszysz.
        </p>

        <a href="#occasions" className="hero-cta" onClick={scrollToOccasions}>
          Zobacz okazje
        </a>
      </div>
    </section>
  );
}
