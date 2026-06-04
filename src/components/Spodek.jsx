import React from 'react';

const frameModules = import.meta.glob('../assets/spodek_frames_webp/*.webp', {
  eager: true,
  import: 'default',
});

export const SPODEK_FRAMES = Object.entries(frameModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export default function Spodek() {
  return (
    <section className="spodek-scene" aria-label="Katowice dzień i noc">
      <div className="spodek-sticky">
        <img
          className="spodek-frame"
          src={SPODEK_FRAMES[0]}
          alt=""
          decoding="async"
          aria-hidden="true"
        />

        <div className="spodek-readable-scrim" aria-hidden="true" />

        <div className="spodek-content">
          <div className="spodek-copy spodek-beat is-first">
            <p className="spodek-kicker">Dzień</p>
            <h2 className="spodek-title">
              Katowice mają <span className="accent">okazję</span>.
            </h2>
            <p className="spodek-lead">Od pomysłu do wieczoru, który się pamięta.</p>
          </div>

          <div className="spodek-copy spodek-beat is-night">
            <p className="spodek-kicker">Noc</p>
            <h2 className="spodek-title">My ogarniamy resztę.</h2>
            <p className="spodek-lead">Miejsce, ludzie, atrakcje i spokojny plan na całość.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
