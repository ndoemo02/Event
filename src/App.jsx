import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero.jsx';
import Spodek, { SPODEK_FRAMES } from './components/Spodek.jsx';
import Occasions from './components/Occasions.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spodekFrame = document.querySelector('.spodek-frame');
    const spodekScene = document.querySelector('.spodek-scene');
    const firstBeat = document.querySelector('.spodek-beat.is-first');
    const nightBeat = document.querySelector('.spodek-beat.is-night');
    const occasionCards = gsap.utils.toArray('.occasion-card');
    let currentFrame = -1;
    let desiredFrame = 0;
    let frameRaf = 0;
    let preloadHandle = 0;
    let framesPreloaded = false;
    let lastScrollY = -1;
    let lastViewportHeight = -1;
    const frameImages = new Map();
    const loadedFrames = new Set([0]);

    if (prefersReduced) {
      if (spodekFrame && SPODEK_FRAMES.length) {
        spodekFrame.src = SPODEK_FRAMES[SPODEK_FRAMES.length - 1];
      }

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      return;
    }

    const setSpodekCopy = (progress) => {
      const firstOpacity = gsap.utils.clamp(0, 1, (0.46 - progress) / 0.14);
      const nightOpacity = gsap.utils.clamp(0, 1, (progress - 0.5) / 0.16);

      if (firstBeat) {
        gsap.set(firstBeat, {
          autoAlpha: firstOpacity,
          y: -18 * (1 - firstOpacity),
        });
      }

      if (nightBeat) {
        gsap.set(nightBeat, {
          autoAlpha: nightOpacity,
          y: 22 * (1 - nightOpacity),
        });
      }
    };

    const applyFrame = (frameIndex) => {
      if (!spodekFrame || !SPODEK_FRAMES.length) return;

      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex;
        spodekFrame.src = SPODEK_FRAMES[frameIndex];
      }
    };

    const preloadFrame = (src, index) => {
      if (frameImages.has(index) || loadedFrames.has(index)) return;

      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        loadedFrames.add(index);

        if (desiredFrame === index) {
          applyFrame(index);
        }
      };
      image.src = src;
      frameImages.set(index, image);

      if (image.complete) {
        loadedFrames.add(index);
      }
    };

    const setFrameByProgress = (progress) => {
      if (!spodekFrame || !SPODEK_FRAMES.length) return;

      const nextFrame = Math.min(
        SPODEK_FRAMES.length - 1,
        Math.max(0, Math.round(progress * (SPODEK_FRAMES.length - 1)))
      );
      desiredFrame = nextFrame;
      preloadFrame(SPODEK_FRAMES[nextFrame], nextFrame);

      if (loadedFrames.has(nextFrame)) {
        applyFrame(nextFrame);
      }
    };

    const preloadFrames = () => {
      if (framesPreloaded) return;
      framesPreloaded = true;

      SPODEK_FRAMES.forEach((src, index) => {
        if (index === 0) return;
        preloadFrame(src, index);
      });
    };

    const updateSpodekFromScroll = () => {
      if (!spodekScene) return;

      const start = spodekScene.offsetTop;
      const distance = Math.max(1, spodekScene.offsetHeight - window.innerHeight);
      const progress = gsap.utils.clamp(0, 1, (window.scrollY - start) / distance);

      setFrameByProgress(progress);
      setSpodekCopy(progress);

      if (spodekFrame) {
        const scale = 1.035 - progress * 0.025;
        spodekFrame.style.transform = `scale(${scale.toFixed(4)})`;
      }
    };

    const runSpodekTicker = () => {
      const nextScrollY = window.scrollY;
      const nextViewportHeight = window.innerHeight;

      if (nextScrollY !== lastScrollY || nextViewportHeight !== lastViewportHeight) {
        lastScrollY = nextScrollY;
        lastViewportHeight = nextViewportHeight;
        updateSpodekFromScroll();
      }

      frameRaf = requestAnimationFrame(runSpodekTicker);
    };

    if (spodekFrame) {
      setFrameByProgress(0);
      setSpodekCopy(0);
      updateSpodekFromScroll();
      frameRaf = requestAnimationFrame(runSpodekTicker);

      preloadHandle =
        'requestIdleCallback' in window
          ? window.requestIdleCallback(preloadFrames, { timeout: 900 })
          : window.setTimeout(preloadFrames, 350);

      ScrollTrigger.create({
        trigger: '.spodek-scene',
        start: 'top 120%',
        once: true,
        onEnter: preloadFrames,
      });
    }

    if (occasionCards.length) {
      gsap.from(occasionCards, {
        y: 28,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.occasions-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    const fadeSections = document.querySelectorAll('[data-fade]');
    fadeSections.forEach((el) => {
      gsap.from(el, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => {
      cancelAnimationFrame(frameRaf);
      if (preloadHandle) {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(preloadHandle);
        } else {
          window.clearTimeout(preloadHandle);
        }
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main>
      <Hero />
      <Spodek />
      <Occasions />
    </main>
  );
}
