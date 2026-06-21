// Koreň appky = jednoduchý prepínač medzi úvodnou stránkou a prehliadkou.
//
//   • landing zapnutý + žiadny ?tour  → Landing (úvodná stránka)
//   • klik na kartu / ?tour=<cesta>    → Tour (prehliadka)
//   • landing vypnutý                  → rovno Tour (defaultTourSrc)
//
// Stav držíme v URL (?tour=…, ?edit=1), takže funguje aj refresh, späť aj zdieľanie.
import { useEffect, useState } from 'react';
import Tour from './tour/Tour.jsx';
import Landing from './site/Landing.jsx';
import { siteConfig } from './site/siteConfig.js';
import './App.css';

function readParams() {
  const p = new URLSearchParams(window.location.search);
  return { edit: p.get('edit') === '1', tour: p.get('tour') };
}

export default function App() {
  const [{ edit, tour }, setNav] = useState(readParams());

  // synchronizácia s tlačidlom Späť v prehliadači
  useEffect(() => {
    const onPop = () => setNav(readParams());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function openTour(src) {
    const u = new URL(window.location.href);
    u.searchParams.set('tour', src);
    window.history.pushState(null, '', u);
    setNav(readParams());
    window.scrollTo(0, 0);
  }

  function backToLanding() {
    const u = new URL(window.location.href);
    u.searchParams.delete('tour');
    u.searchParams.delete('edit');
    window.history.pushState(null, '', u);
    setNav(readParams());
  }

  function toggleEdit() {
    const u = new URL(window.location.href);
    if (edit) u.searchParams.delete('edit');
    else u.searchParams.set('edit', '1');
    window.history.replaceState(null, '', u);
    setNav(readParams());
  }

  // ktorá prehliadka je aktívna (ak vôbec)
  const activeTour = tour || (!siteConfig.landingEnabled ? siteConfig.defaultTourSrc : null);

  if (activeTour) {
    return (
      <div className="app-tour">
        <Tour src={activeTour} edit={edit} />
        <div className="app-topbar">
          {siteConfig.landingEnabled && (
            <button type="button" className="app-pill" onClick={backToLanding}>
              ← Späť na byty
            </button>
          )}
          {/* prepínač editora len počas vývoja (alebo keď už beží) */}
          {(import.meta.env.DEV || edit) && (
            <button type="button" className="app-pill" onClick={toggleEdit}>
              {edit ? 'Zavrieť editor' : 'EDIT'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return <Landing config={siteConfig} onOpenTour={openTour} />;
}
