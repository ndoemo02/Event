import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero.jsx';
import Spodek, { SPODEK_FRAMES } from './components/Spodek.jsx';
import Occasions from './components/Occasions.jsx';

gsap.registerPlugin(ScrollTrigger);

// Helper to select an evenly spaced subset of frames
function selectFrames(frames, maxCount) {
  if (frames.length <= maxCount) return frames;
  const result = [];
  const step = (frames.length - 1) / (maxCount - 1);
  for (let i = 0; i < maxCount; i++) {
    const idx = Math.min(frames.length - 1, Math.round(i * step));
    result.push(frames[idx]);
  }
  return result;
}

export default function App() {
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spodekScene = document.querySelector('.spodek-scene');
    const firstBeat = document.querySelector('.spodek-beat.is-first');
    const nightBeat = document.querySelector('.spodek-beat.is-night');
    const occasionCards = gsap.utils.toArray('.occasion-card');

    const preloadedImages = [];
    const lastGoodFrame = { current: null };
    let frameRaf = 0;
    let lastScrollY = -1;
    let lastViewportHeight = -1;
    let isCancelled = false;

    // Helper to draw a frame onto the canvas
    const drawFrame = (index) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = preloadedImages[index];
      if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        lastGoodFrame.current = img;
      } else if (lastGoodFrame.current) {
        ctx.drawImage(lastGoodFrame.current, 0, 0, canvas.width, canvas.height);
      }
    };

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

    // 1. Reduced Motion Fallback
    if (prefersReduced) {
      const finalFrameSrc = SPODEK_FRAMES[SPODEK_FRAMES.length - 1];
      const img = new Image();
      img.src = finalFrameSrc;
      img.decode()
        .then(() => {
          if (isCancelled) return;
          preloadedImages[0] = img;
          setCanvasReady(true);
          drawFrame(0);
        })
        .catch(() => {
          img.onload = () => {
            if (isCancelled) return;
            preloadedImages[0] = img;
            setCanvasReady(true);
            drawFrame(0);
          };
        });

      if (firstBeat) gsap.set(firstBeat, { display: 'none' });
      if (nightBeat) gsap.set(nightBeat, { autoAlpha: 1, y: 0 });

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      return;
    }

    // 2. Select Subset of 48 Frames
    const framesToUse = selectFrames(SPODEK_FRAMES, 48);
    let loadedCount = 0;

    // 3. Preloading and Pre-decoding loop
    const onFrameLoaded = (img, index) => {
      if (isCancelled) return;
      preloadedImages[index] = img;
      loadedCount++;
      if (loadedCount === framesToUse.length) {
        setCanvasReady(true);
        drawFrame(0);
      }
    };

    framesToUse.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        if (isCancelled) return;
        img.decode()
          .then(() => {
            onFrameLoaded(img, index);
          })
          .catch((err) => {
            console.warn(`Failed to decode frame ${index}, using onload fallback:`, err);
            onFrameLoaded(img, index);
          });
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${index}: ${src}`);
        if (isCancelled) return;
        loadedCount++;
        if (loadedCount === framesToUse.length) {
          setCanvasReady(true);
          drawFrame(0);
        }
      };
      img.src = src;
    });

    // 4. Scroll triggered Canvas and copy update
    const updateSpodekFromScroll = () => {
      if (!spodekScene) return;

      const start = spodekScene.offsetTop;
      const distance = Math.max(1, spodekScene.offsetHeight - window.innerHeight);
      const progress = gsap.utils.clamp(0, 1, (window.scrollY - start) / distance);

      // Map progress directly to frame index
      if (preloadedImages.length > 0) {
        const frameIndex = Math.min(
          preloadedImages.length - 1,
          Math.max(0, Math.round(progress * (preloadedImages.length - 1)))
        );
        drawFrame(frameIndex);
      }

      setSpodekCopy(progress);

      // Perform scaling of fallback and canvas
      const scale = 1.035 - progress * 0.025;
      const scaleStr = `scale(${scale.toFixed(4)})`;
      const fallbackImg = document.querySelector('.spodek-fallback');
      const canvas = canvasRef.current;
      if (fallbackImg) fallbackImg.style.transform = scaleStr;
      if (canvas) canvas.style.transform = scaleStr;
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

    // Initialize state
    setSpodekCopy(0);
    frameRaf = requestAnimationFrame(runSpodekTicker);

    // 5. Scroll Animations for other elements
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
      isCancelled = true;
      cancelAnimationFrame(frameRaf);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main>
      <Hero />
      <Spodek canvasRef={canvasRef} canvasReady={canvasReady} />
      <Occasions />
    </main>
  );
}
