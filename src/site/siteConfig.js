// ──────────────────────────────────────────────────────────────────────────
//  KONFIGURÁCIA ÚVODNEJ STRÁNKY (landing) — celý projekt sa nastavuje TU.
//
//  • landingEnabled: false  → úvodná stránka sa VYPNE a appka pôjde rovno
//    do prehliadky `defaultTourSrc` (ideálne pre iný projekt bez landingu).
//  • Pre nový projekt stačí prepísať hodnoty nižšie (logo, názov, byty…).
//  • Obrázky kariet sú voliteľné — kým ich nedoplníš, zobrazí sa farebná výplň.
//    Cesty sú relatívne k priečinku `public/`.
// ──────────────────────────────────────────────────────────────────────────

import logo from './logo.svg';

export const siteConfig = {
  // Hlavný prepínač modulu úvodnej stránky:
  landingEnabled: true,

  // Keď je landing vypnutý, appka otvorí rovno túto prehliadku:
  defaultTourSrc: 'tours/demo/tour.json',

  // Odkaz „späť na hlavnú stránku" (prázdne/null = tlačidlo sa nezobrazí):
  mainSiteUrl: 'https://hodzova.sk/',

  brand: {
    name: 'Rezidencia Hodžova',
    logo, // negatív (biele) logo do tmavej hlavičky
  },

  // Nadpis sekcie s kartami:
  sectionTitle: 'Prehliadka bytov',

  // Karty bytov. `tourSrc` = prehliadka, ktorá sa otvorí po kliknutí.
  // Ak je `tourSrc: null`, karta sa zobrazí ako „Pripravujeme" (neklikateľná).
  apartments: [
    {
      id: 'byt-1',
      title: 'Byt 2.3',
      meta: '2+1 · 51,09 m²',
      image: 'landing/byt-1.jpg', // doplň neskôr (voliteľné)
      tourSrc: 'tours/demo/tour.json',
    },
    {
      id: 'byt-2',
      title: 'Byt 2',
      meta: '2-izbový · 56 m²',
      image: 'landing/byt-2.jpg',
      tourSrc: null, // ešte nemá prehliadku
    },
    {
      id: 'byt-3',
      title: 'Byt 3',
      meta: '4-izbový · 102 m²',
      image: 'landing/byt-3.jpg',
      tourSrc: null,
    },
  ],
};
