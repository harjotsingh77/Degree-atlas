import { useState } from 'react';
import { Link } from 'react-router-dom';
import { inr, programmes, universities } from '../data.js';
import { useCompare } from '../context/CompareContext.jsx';
import { UniversityLogo } from './UniversityLogo.jsx';

export function CompareShowcase() {
  const { ids, add, remove, setModalOpen, count } = useCompare();

  const presets = [
    {
      id: 'pg-flagship',
      label: 'Postgraduate: MBA vs MCA',
      tag: 'Most Popular',
      leftId: 'chitkara-online-mba',
      rightId: 'manipal-online-mca',
      note: 'Management vs High-Tech Software Leadership',
    },
    {
      id: 'ug-careers',
      label: 'Undergraduate: BBA vs BCA',
      tag: 'After Class 12',
      leftId: 'chitkara-online-bba',
      rightId: 'lovely-online-bca',
      note: 'Corporate Business Foundations vs Computer Applications',
    },
    {
      id: 'tech-leadership',
      label: 'Advanced Tech: M.Tech vs MCA',
      tag: 'Engineers & Developers',
      leftId: 'bits-online-mtech',
      rightId: 'chitkara-online-mca',
      note: 'Executive Systems Engineering vs Software Development',
    },
  ];

  const [activePreset, setActivePreset] = useState(presets[0]);

  const p1 = programmes.find((p) => p.id === activePreset.leftId) || programmes[0];
  const p2 = programmes.find((p) => p.id === activePreset.rightId) || programmes[1];

  const uni1 = universities.find((u) => u.id === p1.universityId);
  const uni2 = universities.find((u) => u.id === p2.universityId);

  const isP1InCompare = ids.includes(p1.id);
  const isP2InCompare = ids.includes(p2.id);

  return (
    <div className="cmp-showcase-card">
      {/* Top Header & Presets Bar */}
      <div className="cmp-showcase-top">
        <div className="cmp-showcase-title-row">
          <div>
            <h3 className="cmp-showcase-heading">Compare Before You Decide</h3>
            <p className="cmp-showcase-sub">
              Unbiased, side-by-side comparison across verified university fees, UGC approvals, NAAC ratings, and curriculum.
            </p>
          </div>

          <div className="cmp-showcase-actions">
            <button
              className="btn btn-accent btn-sm cmp-main-cta"
              onClick={() => setModalOpen(true)}
              aria-label="Open comparison modal"
            >
              Compare Shortlist{count > 0 ? ` (${count})` : ''} →
            </button>
          </div>
        </div>

        {/* Preset Category Switcher Tabs */}
        <div className="cmp-preset-tabs" role="tablist" aria-label="Comparison degree presets">
          {presets.map((preset) => {
            const active = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                role="tab"
                aria-selected={active}
                className={`cmp-preset-btn ${active ? 'active' : ''}`}
                onClick={() => setActivePreset(preset)}
              >
                <span>{preset.label}</span>
                <span className="cmp-preset-tag">{preset.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Comparison Cards with Center "VS" */}
      <div className="cmp-cards-grid">
        {/* Card 1 */}
        <div className="cmp-degree-card">
          <div className="cmp-card-header">
            <div className="cmp-logo-wrap">
              <UniversityLogo id={p1.universityId} name={uni1?.name} short={uni1?.short} size={48} />
              <div className="cmp-uni-meta">
                <span className="cmp-uni-name">{uni1?.name}</span>
                <span className="cmp-uni-loc">{uni1?.location}</span>
              </div>
            </div>
            <span className="cmp-level-badge">{p1.level}</span>
          </div>

          <div className="cmp-card-body">
            <h4 className="cmp-deg-name">
              <Link to={`/programmes/${p1.slug}`}>{p1.name}</Link>
            </h4>
            <div className="cmp-badges-row">
              <span className="cmp-pill-tag cmp-pill-green">✓ UGC-Entitled</span>
              <span className="cmp-pill-tag cmp-pill-blue">NAAC A+</span>
              <span className="cmp-pill-tag cmp-pill-purple">{p1.mode}</span>
            </div>

            {/* Fee & Duration Feature Box */}
            <div className="cmp-stats-box">
              <div className="cmp-stat-col">
                <span className="cmp-stat-label">TOTAL TUITION</span>
                <strong className="cmp-stat-val">{inr(p1.feeTotal)}</strong>
                <span className="cmp-stat-hint">Approx {inr(Math.round(p1.feeTotal / (p1.durationMo / 6)))}/sem</span>
              </div>
              <div className="cmp-stat-divider" />
              <div className="cmp-stat-col">
                <span className="cmp-stat-label">DURATION</span>
                <strong className="cmp-stat-val">{p1.durationMo} Months</strong>
                <span className="cmp-stat-hint">Flexible Schedule</span>
              </div>
            </div>

            {/* Parameter Rows */}
            <div className="cmp-details-list">
              <div className="cmp-detail-item">
                <span className="cmp-detail-k">Eligibility</span>
                <span className="cmp-detail-v">{p1.eligibilityShort}</span>
              </div>
              <div className="cmp-detail-item">
                <span className="cmp-detail-k">Specialisations</span>
                <span className="cmp-detail-v">
                  {p1.specialisations?.slice(0, 3).join(', ')}
                  {p1.specialisations?.length > 3 ? ` +${p1.specialisations.length - 3} more` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="cmp-card-footer">
            <Link to={`/programmes/${p1.slug}`} className="cmp-btn-view">
              View Syllabus →
            </Link>
            <button
              className={`cmp-btn-shortlist ${isP1InCompare ? 'active' : ''}`}
              onClick={() => (isP1InCompare ? remove(p1.id) : add(p1.id))}
            >
              {isP1InCompare ? '✓ Shortlisted' : '+ Compare'}
            </button>
          </div>
        </div>

        {/* Central VS Badge */}
        <div className="cmp-vs-container" aria-hidden="true">
          <div className="cmp-vs-circle">
            <span>VS</span>
          </div>
          <div className="cmp-vs-line" />
        </div>

        {/* Card 2 */}
        <div className="cmp-degree-card">
          <div className="cmp-card-header">
            <div className="cmp-logo-wrap">
              <UniversityLogo id={p2.universityId} name={uni2?.name} short={uni2?.short} size={48} />
              <div className="cmp-uni-meta">
                <span className="cmp-uni-name">{uni2?.name}</span>
                <span className="cmp-uni-loc">{uni2?.location}</span>
              </div>
            </div>
            <span className="cmp-level-badge">{p2.level}</span>
          </div>

          <div className="cmp-card-body">
            <h4 className="cmp-deg-name">
              <Link to={`/programmes/${p2.slug}`}>{p2.name}</Link>
            </h4>
            <div className="cmp-badges-row">
              <span className="cmp-pill-tag cmp-pill-green">✓ UGC-Entitled</span>
              <span className="cmp-pill-tag cmp-pill-blue">NAAC A++</span>
              <span className="cmp-pill-tag cmp-pill-purple">{p2.mode}</span>
            </div>

            {/* Fee & Duration Feature Box */}
            <div className="cmp-stats-box">
              <div className="cmp-stat-col">
                <span className="cmp-stat-label">TOTAL TUITION</span>
                <strong className="cmp-stat-val">{inr(p2.feeTotal)}</strong>
                <span className="cmp-stat-hint">Approx {inr(Math.round(p2.feeTotal / (p2.durationMo / 6)))}/sem</span>
              </div>
              <div className="cmp-stat-divider" />
              <div className="cmp-stat-col">
                <span className="cmp-stat-label">DURATION</span>
                <strong className="cmp-stat-val">{p2.durationMo} Months</strong>
                <span className="cmp-stat-hint">Self-paced LMS</span>
              </div>
            </div>

            {/* Parameter Rows */}
            <div className="cmp-details-list">
              <div className="cmp-detail-item">
                <span className="cmp-detail-k">Eligibility</span>
                <span className="cmp-detail-v">{p2.eligibilityShort}</span>
              </div>
              <div className="cmp-detail-item">
                <span className="cmp-detail-k">Specialisations</span>
                <span className="cmp-detail-v">
                  {p2.specialisations?.slice(0, 3).join(', ')}
                  {p2.specialisations?.length > 3 ? ` +${p2.specialisations.length - 3} more` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="cmp-card-footer">
            <Link to={`/programmes/${p2.slug}`} className="cmp-btn-view">
              View Syllabus →
            </Link>
            <button
              className={`cmp-btn-shortlist ${isP2InCompare ? 'active' : ''}`}
              onClick={() => (isP2InCompare ? remove(p2.id) : add(p2.id))}
            >
              {isP2InCompare ? '✓ Shortlisted' : '+ Compare'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Summary Strip */}
      <div className="cmp-showcase-footer">
        <div className="cmp-footer-note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>Verified Government Approvals: Both programmes are 100% entitled by UGC-DEB for employment & higher education.</span>
        </div>
        <div className="cmp-footer-cta-group">
          <button className="cmp-open-modal-link" onClick={() => setModalOpen(true)}>
            Open Full Comparison Table{count > 0 ? ` (${count} selected)` : ''} ↗
          </button>
        </div>
      </div>
    </div>
  );
}
