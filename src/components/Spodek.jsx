import React from 'react';
import posterDay from '../assets/spodek-poster-day.jpg';

const frameModules = import.meta.glob('../assets/spodek_frames_webp/*.webp', {
  eager: true,
  import: 'default',
});

export const SPODEK_FRAMES = Object.entries(frameModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export default function Spodek({ canvasRef, canvasReady }) {
  return (
    <section className="spodek-scene" aria-label="Katowice dzień i noc">
      <div className="spodek-sticky">
        {/* Fallback poster image underneath */}
        <img
          className="spodek-frame spodek-fallback"
          src={posterDay}
          alt=""
          decoding="async"
          aria-hidden="true"
          style={{
            opacity: canvasReady ? 0 : 1,
            transition: 'opacity 0.4s ease-in-out',
            pointerEvents: 'none',
          }}
        />

        {/* High performance scroll sequence canvas */}
        <canvas
          ref={canvasRef}
          className="spodek-frame spodek-canvas"
          width={720}
          height={1280}
          style={{
            opacity: canvasReady ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
            pointerEvents: 'none',
          }}
        />

        <div className="spodek-readable-scrim" aria-hidden="true" />
      </div>
    </section>
  );
}
