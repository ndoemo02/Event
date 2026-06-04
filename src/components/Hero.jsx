import React from 'react';
import heroAga from '../assets/hero-aga.jpeg';

export default function Hero() {
  const scrollToOccasions = (event) => {
    event.preventDefault();
    const el = document.querySelector('#occasions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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

      <div className="hero-content">
        <h1 className="hero-title">Event Flow</h1>
        <p className="hero-subtitle">Ogarnij okazję bez stresu.</p>
        <p className="hero-body">
          Pomysły, rezerwacje, atrakcje i logistyka - dopięte w jednym miejscu.
        </p>
        <a href="#occasions" className="hero-cta" onClick={scrollToOccasions}>
          Zobacz okazje
        </a>
      </div>
    </section>
  );
}
