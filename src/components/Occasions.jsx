import React from 'react';
import candlelightMoment from '../assets/candlelight-moment.png';

const CARDS = [
  {
    id: 'urodziny',
    title: 'Urodziny dzieci',
    body: 'Animatorzy, atrakcje, tort i porządek w planie. Spokojne lądowanie dla rodziców.',
  },
  {
    id: 'panienskie',
    title: 'Wieczory panieńskie',
    body: 'Lokal, transfer, scenariusz, pamiątka. Zero gatekeepingu i zero cringe.',
  },
  {
    id: 'wyjazdy',
    title: 'Wyjazdy i weekendy',
    body: 'Transport, nocleg, plan dnia. Zostaje Wam tylko walizka i dobry humor.',
  },
  {
    id: 'rocznice',
    title: 'Rocznice i prywatne okazje',
    body: 'Kameralnie albo hucznie - uzgadniamy scenariusz pod Was i Waszych ludzi.',
  },
];

export default function Occasions() {
  return (
    <section id="occasions" className="occasions" aria-label="Wybór okazji">
      <div className="occasions-visual" aria-hidden="true">
        <img
          src={candlelightMoment}
          alt=""
          className="occasions-visual-img"
          loading="lazy"
        />
        <div className="occasions-visual-overlay" />
      </div>

      <header className="occasions-header" data-fade>
        <h2 className="occasions-title">Wybierz okazję</h2>
        <p className="occasions-subtitle">Dopasujemy wszystko do Ciebie.</p>
      </header>

      <ul className="occasions-grid">
        {CARDS.map((card) => (
          <li className="occasion-card" key={card.id}>
            <h3 className="occasion-card-title">{card.title}</h3>
            <p className="occasion-card-body">{card.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
