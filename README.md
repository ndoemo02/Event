# Event Flow — Landing Page v0.1

Mobile-first, fullscreen storytelling landing page dla organizacji wydarzeń w Katowicach.
**Stack:** Vite + React + GSAP ScrollTrigger + Lenis. Zero bibliotek UI, zero backendu.

## Start

```bash
npm install
npm run dev
```

Vite domyślnie pod `http://localhost:5173`.

## Build produkcyjny

```bash
npm run build
npm run preview
```

## Struktura

```
event-flow/
├── index.html                   # Punkt wejscia HTML
├── package.json
├── src/
│   ├── main.jsx                 # React root + Lenis inicjalizacja + GSAP/ScrollTrigger sync
│   ├── App.jsx                  # Trzy sekcje + globalne animacje scroll
│   ├── styles.css               # Mobile-first CSS, prefers-reduced-motion fallback
│   ├── components/
│   │   ├── Hero.jsx             # Aga — sekcja 1
│   │   ├── Spodek.jsx           # Katowice day→night — sekcja 2
│   │   └── Occasions.jsx        # 4 karty okazji — sekcja 3
│   └── assets/
│       ├── hero-aga.jpeg        # Twoj asset Hero
│       ├── spodek-day.jpeg      # Twoj asset Spodek (dzien)
│       └── candlelight-moment.png # Wygenerowany asset #3 (v0.2)
```

## Kluczowe decyzje v0.1

| Temat | Decyzja | Dlaczego |
|---|---|---|
| **Hero layout** | Tekst na dole (`justify-content: flex-end`) | CTA widoczne bez scrolla, Aga powyżej |
| **Kadrowanie Hero** | `object-position: center 25%` | Twarz w 1/3, tekst w 2/3 swobodny |
| **Spodek day→night** | Jedno zdjęcie + 2 warstwy overlay (multiply + radial glow) | Zdjęcie zostaje 1:1, brak "skakania" spodka, płynna tranzycja |
| **Ring/halo** | SVG absolute, 78vw max 360px | Lekki, GPU-friendly, łatwo dostrajać kolory gradientu |
| **Lenis** | `lerp: 0.085`, `duration: 1.15` | Naturalny "ciągniony" scroll, bez gumki |
| **GSAP sync** | ScrollTrigger przez Lenis ticker | Lenis i GSAP scroll są zsynchronizowane w jednym RAF |
| **Karty** | 1 kol. mobile, 2x2 od 720px | Mobile-first zgodne z brief |
| **Hover** | Tylko `@media (hover: hover)` | Touch (mobile) nie dostaje niechcianego `:hover` stanu |
| **Reduced motion** | GSAP wyłączony, overlay 100%, ring 0° | Pełna dostępność, sekcja wygląda "docelowo" |

## Co zostawić do v0.2

- [ ] Prawdziwy nocny asset Spodka (zamiast CSS overlay)
- [ ] WebP konwersja obu assetów (Hero + Spodek)
- [ ] Sekcja CTA końcowa (formularz kontaktowy / WhatsApp)
- [ ] Realne ikonki w kartach (obecnie: tylko tytuły + body)
- [ ] Finalna typografia (font, wagi, inter)
- [ ] Sub-section "O mnie" (Aga — bio, 1-2 zdania)
- [ ] Realne URL w CTA (obecnie: scroll do `#occasions`)

## Testy do zrobienia

- [ ] Mobile 360px, 412px, 768px, 1024px, 1440px
- [ ] Safari iOS (Lenis + GSAP czasem się gryzą)
- [ ] `prefers-reduced-motion` on/off
- [ ] LCP < 2.5s (mobile 4G)
- [ ] CLS < 0.1 (overlay nie powinien przesuwać treści)

## Assety — uwaga

`spodek-day.jpeg` to **jedyne dzienne** zdjęcie. Noc w tej sekcji to **CSS overlay** (nie drugi asset). Jeśli chcesz prawdziwą noc, wrzuć `spodek-night.jpeg` i podmień w `Spodek.jsx` + dostosuj CSS.
