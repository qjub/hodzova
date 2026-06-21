// Úvodná (landing) stránka projektu — minimalistická: logo + karty bytov.
// Riadená konfiguráciou (siteConfig), modulárna (App ju zobrazí len ak je
// `landingEnabled: true`). Klik na kartu → onOpenTour(tourSrc).

import './Landing.css';

export default function Landing({ config, onOpenTour }) {
  const { brand, mainSiteUrl, sectionTitle, apartments } = config;

  // pozadie obrázkom, ak existuje (inak ostane farebná výplň z CSS)
  const bg = (img) => (img ? { backgroundImage: `url(${img})` } : undefined);

  return (
    <div className="landing">
      {/* Hlavička: len logo + odkaz na hlavnú stránku */}
      <header className="landing__header">
        <div className="landing__bar">
          <a href={mainSiteUrl || '#'} className="landing__logo" title={brand.name}>
            <img src={brand.logo} alt={brand.name} />
          </a>
          {mainSiteUrl && (
            <a href={mainSiteUrl} className="landing__back">← Späť na stránku</a>
          )}
        </div>
      </header>

      {/* Karty bytov */}
      <section className="landing__byty" id="byty">
        <h1 className="landing__byty-title">{sectionTitle}</h1>
        <div className="landing__cards">
          {apartments.map((a) => {
            const clickable = Boolean(a.tourSrc);
            return (
              <article
                key={a.id}
                className={`apt-card ${clickable ? 'is-clickable' : 'is-soon'}`}
                onClick={clickable ? () => onOpenTour(a.tourSrc) : undefined}
              >
                <div className="apt-card__img" style={bg(a.image)}>
                  {!a.image && <span className="apt-card__img-ph">{a.title}</span>}
                  {clickable && <span className="apt-card__badge">360°</span>}
                </div>
                <div className="apt-card__body">
                  <h3 className="apt-card__title">{a.title}</h3>
                  <p className="apt-card__meta">{a.meta}</p>
                  {clickable ? (
                    <span className="apt-card__action">Spustiť prehliadku →</span>
                  ) : (
                    <span className="apt-card__soon">Pripravujeme</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
