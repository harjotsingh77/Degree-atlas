import { Link } from 'react-router-dom';
import { inr, universities, getUniversityBadges, getProgrammeRating, getUniversityRating } from '../data.js';
import { useCompare } from '../context/CompareContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { UniversityLogo } from './UniversityLogo.jsx';
import { StarRating } from './StarRating.jsx';

export function SectionHead({ title, sub }) {
  return (
    <div className="section-head-wrap">
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

export function ProgrammeCard({ p }) {
  const { ids, add, remove } = useCompare();
  const { isShortlisted, toggleShortlist } = useShortlist();
  const uni = universities.find((u) => u.id === p.universityId);
  const on = ids.includes(p.id);
  const isHearted = isShortlisted(p.id);
  const { rating, ratingCount } = getProgrammeRating(p.id);

  return (
    <article className="horiz-prog-card">
      {/* Red Bookmark Ribbon (Top hanging with bottom V-cutout notch) */}
      <div className="square-ribbon-tag horiz-ribbon-tag" aria-label={`Degree level: ${p.level}`}>
        <span>{p.level}</span>
      </div>

      {/* Heart Shortlist Button directly under PG/UG ribbon */}
      <button
        type="button"
        className={`card-shortlist-heart-btn horiz-card-heart ${isHearted ? 'active' : ''}`}
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

      {/* Left / Main Content Area */}
      <div className="horiz-prog-main">
        {/* University Header Row (Links to University Page) */}
        <Link
          to={uni ? `/universities/${uni.slug}` : '#'}
          className="horiz-prog-header horiz-prog-header-link"
          title={uni ? `View ${uni.name} Profile` : 'View University'}
        >
          <UniversityLogo id={p.universityId} name={uni?.name} short={uni?.short} size={46} />
          <div className="horiz-uni-info">
            <span className="horiz-uni-name">{uni?.name}</span>
            <div className="horiz-uni-meta-row">
              <span className="horiz-badge-online">100% Online</span>
              <span className="horiz-badge-ugc">UGC-Entitled</span>
              <span className="horiz-uni-loc">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {uni?.location}
              </span>
            </div>
          </div>
        </Link>

        {/* Degree Title & Description */}
        <div className="horiz-prog-body">
          <h3 className="horiz-prog-title">
            <Link to={`/programmes/${p.slug}`}>{p.name}</Link>
          </h3>
          <p className="horiz-prog-desc">{p.desc}</p>
          <div className="horiz-prog-rating-wrap">
            <StarRating rating={rating} count={ratingCount} size={13} />
          </div>
        </div>

        {/* Highlights Row (Eligibility & Specialisations) */}
        <div className="horiz-prog-meta-row">
          <div className="horiz-meta-item">
            <span className="horiz-meta-label">Eligibility</span>
            <span className="horiz-meta-val">{p.eligibilityShort}</span>
          </div>
          {p.specialisations && p.specialisations.length > 0 && (
            <div className="horiz-meta-item">
              <span className="horiz-meta-label">Specialisations</span>
              <div className="horiz-spec-chips">
                {p.specialisations.slice(0, 3).map((spec) => (
                  <span key={spec} className="horiz-spec-chip">{spec}</span>
                ))}
                {p.specialisations.length > 3 && (
                  <span className="horiz-spec-more">+{p.specialisations.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right / Pricing & CTA Panel */}
      <div className="horiz-prog-side">
        <div className="horiz-fee-duration-row">
          <div className="horiz-fee-container">
            <span className="horiz-fee-label">TOTAL PROGRAMME FEE</span>
            <div className="horiz-fee-val">{inr(p.feeTotal)}</div>
            <span className="horiz-fee-note">Inclusive of exams & LMS</span>
          </div>

          <div className="horiz-duration-pill">
            {p.durationMo} Months
          </div>
        </div>

        <div className="horiz-actions">
          <Link to={`/programmes/${p.slug}`} className="btn-horiz-view">
            View Details <span aria-hidden="true">→</span>
          </Link>
          <button
            className={`btn-horiz-compare ${on ? 'active' : ''}`}
            onClick={() => (on ? remove(p.id) : add(p.id))}
            aria-pressed={on}
          >
            {on ? '✓ Shortlisted' : '+ Compare'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function UniversityCard({ u, reason }) {
  const { rating, ratingCount } = getUniversityRating(u.id);
  return (
    <article className="similar-uni-card">
      <div>
        <div className="similar-uni-header">
          <div className="similar-uni-logo-box">
            <UniversityLogo id={u.id} name={u.name} short={u.short} size={58} />
          </div>
          <div className="similar-uni-header-text">
            <h3 className="similar-uni-title">
              <Link to={`/universities/${u.slug}`}>
                {u.name}
              </Link>
            </h3>
            <span className="similar-uni-loc">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {u.location}
            </span>
            <div className="similar-uni-badges">
              {getUniversityBadges(u).map((badge, idx, arr) => (
                <span key={badge} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span>{badge}</span>
                  {idx < arr.length - 1 && (
                    <span style={{ color: '#94A3B8', fontWeight: 400, userSelect: 'none' }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="similar-uni-desc" style={{ marginTop: 12 }}>{u.tagline || u.description}</p>
        <div style={{ marginTop: 8 }}>
          <StarRating rating={rating} count={ratingCount} size={14} />
        </div>
      </div>

      <div className="similar-uni-actions" style={{ marginTop: 14 }}>
        <Link to={`/universities/${u.slug}`} className="similar-uni-btn-primary">
          Explore University →
        </Link>
        <Link to={`/universities/${u.slug}#programmes`} className="similar-uni-btn-ghost">
          View Degrees
        </Link>
      </div>
    </article>
  );
}

export function Breadcrumbs({ trail }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {trail.map((t, i) => (
        <span key={t.label}>{i > 0 && ' / '}{t.to ? <Link to={t.to}>{t.label}</Link> : <span aria-current="page">{t.label}</span>}</span>
      ))}
    </nav>
  );
}

export function Empty({ title, sub }) {
  return <div className="empty"><strong>{title}</strong><div style={{ fontSize: 14, marginTop: 6 }}>{sub}</div></div>;
}
