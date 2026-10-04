import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { inr, universities, getProgrammeRating } from '../data.js';
import { useCompare } from '../context/CompareContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { UniversityLogo } from './UniversityLogo.jsx';
import { StarRating } from './StarRating.jsx';

export function SquareProgrammeCard({ p }) {
  const { ids, add, remove } = useCompare();
  const { isShortlisted, toggleShortlist } = useShortlist();
  const uni = universities.find((u) => u.id === p.universityId);
  const on = ids.includes(p.id);
  const isHearted = isShortlisted(p.id);
  const { rating, ratingCount } = getProgrammeRating(p.id);

  // Clean university name for neat single-line display
  const cleanUniName = uni?.name
    ? uni.name.split(',')[0].replace(/\s*\([^)]*\)/g, '').trim()
    : uni?.short || '';

  // Short clean NAAC grade (e.g. NAAC A++)
  const naacShort = uni?.naacGrade
    ? uni.naacGrade.split('(')[0].replace(' Grade', '').trim()
    : null;

  // Ensure specialisation chips always stay in 1 single clean line
  const firstSpec = p.specialisations?.[0];
  const secondSpec = p.specialisations?.[1];
  const canFitTwo = firstSpec && secondSpec && (firstSpec.length + secondSpec.length <= 18);
  const visibleSpecs = canFitTwo ? [firstSpec, secondSpec] : (firstSpec ? [firstSpec] : []);
  const remainingCount = p.specialisations ? p.specialisations.length - visibleSpecs.length : 0;

  return (
    <article className="square-prog-card">
      {/* Red Bookmark Ribbon (Top hanging with bottom V-cutout notch) */}
      <div className="square-ribbon-tag" aria-label={`Degree level: ${p.level}`}>
        <span>{p.level}</span>
      </div>

      {/* Heart Shortlist Button directly under PG/UG ribbon */}
      <button
        type="button"
        className={`card-shortlist-heart-btn square-card-heart ${isHearted ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleShortlist(p.id);
        }}
        aria-label={isHearted ? 'Remove from shortlist' : 'Add to shortlist'}
        title={isHearted ? 'Shortlisted (click to remove)' : 'Shortlist programme'}
      >
        <svg
          viewBox="0 0 24 24"
          fill={isHearted ? '#EF4444' : 'none'}
          stroke={isHearted ? '#EF4444' : 'currentColor'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="card-heart-icon"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Top Header: Logo + University Name + Meta (Links to University Page) */}
      <Link
        to={uni ? `/universities/${uni.slug}` : '#'}
        className="square-card-top square-card-top-link"
        title={uni ? `View ${uni.name} Profile` : 'View University'}
      >
        <UniversityLogo id={p.universityId} name={uni?.name} short={uni?.short} size={40} />
        <div className="square-card-uni">
          <span className="square-uni-name" title={uni?.name}>{cleanUniName}</span>
          <div className="square-uni-meta">
            {naacShort && (
              <span className="square-trust-tag">{naacShort}</span>
            )}
            <span className="square-mode-tag">{p.mode}</span>
          </div>
        </div>
      </Link>

      {/* Middle: Degree Title & Single-Line Spec Chips */}
      <div className="square-card-body">
        <h3 className="square-prog-title">
          <Link to={`/programmes/${p.slug}`}>{p.name}</Link>
        </h3>
        <div className="square-spec-chips">
          {visibleSpecs.length > 0 ? (
            <>
              {visibleSpecs.map((s) => (
                <span key={s} className="square-chip">{s}</span>
              ))}
              {remainingCount > 0 && (
                <span className="square-chip square-chip-count">+{remainingCount} more</span>
              )}
            </>
          ) : (
            <span className="square-chip">UGC-DEB Entitled</span>
          )}
        </div>
        <StarRating rating={rating} count={ratingCount} size={12} />
      </div>

      {/* Important Metrics Box (Total Fee & Duration - Clean & Simple) */}
      <div className="square-metrics-box">
        <div className="square-metric">
          <span className="square-metric-label">TOTAL FEE</span>
          <span className="square-metric-val">{inr(p.feeTotal)}</span>
        </div>
        <div className="square-metric-divider" aria-hidden="true" />
        <div className="square-metric">
          <span className="square-metric-label">DURATION</span>
          <span className="square-metric-val duration">
            {p.durationMo} Months
          </span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="square-card-bottom">
        <Link to={`/programmes/${p.slug}`} className="square-btn-view">
          <span>View Details</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <button
          className={`square-btn-compare ${on ? 'active' : ''}`}
          onClick={() => (on ? remove(p.id) : add(p.id))}
          aria-label={on ? 'Remove from compare' : 'Add to compare'}
          title={on ? 'Shortlisted for comparison' : 'Add to compare'}
        >
          {on ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}

export function ProgrammesCarousel({ items }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const cardStep = 296; // 280px card + 16px gap
    const offset = direction === 'left' ? -cardStep * 2 : cardStep * 2;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="programmes-carousel-wrap">
      {/* Header with Title and Nav Arrows */}
      <div className="carousel-top-bar">
        <div className="section-head-wrap" style={{ margin: 0, textAlign: 'left' }}>
          <h2 className="section-title" style={{ margin: '0 0 8px' }}>Popular Online Programmes</h2>
          <p className="section-sub" style={{ margin: 0 }}>Real fees, course duration, and eligibility side by side. Verified syllabus details.</p>
        </div>

        {/* Carousel Arrow Buttons */}
        <div className="carousel-nav-arrows" aria-label="Browse programmes carousel">
          <button
            type="button"
            className={`carousel-nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <button
            type="button"
            className={`carousel-nav-btn ${!canScrollRight ? 'disabled' : ''}`}
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="carousel-horizontal-track" ref={scrollRef}>
        {items.map((p) => (
          <SquareProgrammeCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
