import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero.jsx';
import Spodek from './components/Spodek.jsx';
import Occasions from './components/Occasions.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      return;
    }

    const spodekVideo = document.querySelector('.spodek-video');
    const firstBeat = document.querySelector('.spodek-beat.is-first');
    const nightBeat = document.querySelector('.spodek-beat.is-night');
    const occasionCards = gsap.utils.toArray('.occasion-card');
    let videoDuration = 0;
    let targetTime = 0.02;
    let renderedTime = 0.02;
    let smoothFrame = 0;

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

    const smoothVideoScrub = () => {
      if (!spodekVideo || !videoDuration) {
        smoothFrame = 0;
        return;
      }

      const diff = targetTime - renderedTime;

      if (Math.abs(diff) <= 0.008) {
        renderedTime = targetTime;
        spodekVideo.currentTime = renderedTime;
        setSpodekCopy(renderedTime / videoDuration);
        smoothFrame = 0;
        return;
      }

      const dampedStep = gsap.utils.clamp(-0.075, 0.075, diff * 0.18);
      renderedTime += dampedStep;
      spodekVideo.currentTime = renderedTime;
      setSpodekCopy(renderedTime / videoDuration);
      smoothFrame = requestAnimationFrame(smoothVideoScrub);
    };

    const queueSmoothScrub = () => {
      if (!smoothFrame) {
        smoothFrame = requestAnimationFrame(smoothVideoScrub);
      }
    };

    const updateVideoDuration = () => {
      videoDuration = Number.isFinite(spodekVideo?.duration) ? spodekVideo.duration : 0;
      targetTime = Math.min(videoDuration - 0.04, Math.max(0.02, targetTime));
      renderedTime = Math.min(videoDuration - 0.04, Math.max(0.02, renderedTime));
    };

    if (spodekVideo) {
      spodekVideo.pause();
      spodekVideo.addEventListener('loadedmetadata', updateVideoDuration);
      if (spodekVideo.readyState >= 1) updateVideoDuration();

      ScrollTrigger.create({
        trigger: '.spodek-scene',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          updateVideoDuration();

          if (!videoDuration) {
            setSpodekCopy(self.progress);
            return;
          }

          targetTime = Math.min(
            videoDuration - 0.04,
            Math.max(0.02, self.progress * videoDuration)
          );
          queueSmoothScrub();
        },
      });

      gsap.fromTo(
        spodekVideo,
        { scale: 1.035 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.spodek-scene',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
          },
        }
      );
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
      cancelAnimationFrame(smoothFrame);
      if (spodekVideo) {
        spodekVideo.removeEventListener('loadedmetadata', updateVideoDuration);
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
