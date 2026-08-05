import { useEffect } from 'react';
import { useState } from 'react';

type LightboxPhoto = { image_url?: string; title?: string | null };

export default function PhotoLightbox({ photos }: { photos: LightboxPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') setActive((current) => (current === null ? current : Math.min(current + 1, photos.length - 1)));
      if (event.key === 'ArrowLeft') setActive((current) => (current === null ? current : Math.max(current - 1, 0)));
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, photos.length]);

  return (
    <>
      {photos.map((photo, index) => (
        <figure key={`${photo.image_url}-${index}`}>
          <span className="frame-index">F.{String(index + 1).padStart(2, '0')}</span>
          <button aria-label={`Open ${photo.title ?? 'photograph'}`} className="lightbox-trigger" onClick={() => setActive(index)}>
            <img src={photo.image_url ?? ''} alt={photo.title ?? 'Photograph by Christo Esser'} loading="lazy" />
          </button>
          <figcaption>{photo.title || 'Untitled'}</figcaption>
        </figure>
      ))}
      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Full-screen photograph" onClick={() => setActive(null)}>
          <div className="lightbox-bar">
            <span>{String(active + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
            <button className="lightbox-close" onClick={(event) => { event.stopPropagation(); setActive(null); }}>Esc close</button>
          </div>
          <img
            src={photos[active].image_url ?? ''}
            alt={photos[active].title ?? 'Photograph by Christo Esser'}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
