import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { universities, programmes, getUniversityBadges, getUniversityRating } from '../data.js';
import { UniversityLogo } from '../components/UniversityLogo.jsx';
import { Empty } from '../components/Cards.jsx';
import { StarRating } from '../components/StarRating.jsx';

export default function AllUniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');

  // Available states
  const states = useMemo(() => {
    const set = new Set();
    universities.forEach((u) => {
      if (u.state) set.add(u.state);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.name.toLowerCase().includes(q) || (u.short && u.short.toLowerCase().includes(q));
        const matchLoc = u.location?.toLowerCase().includes(q) || u.state?.toLowerCase().includes(q);
        const matchRank = u.nirfRank?.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchRank) return false;
      }

      // Type / Kind
      if (selectedType === 'colleges' && u.institutionKind !== 'college') return false;
      if (selectedType === 'universities' && u.institutionKind === 'college') return false;
      if (selectedType === 'central' && !u.type?.toLowerCase().includes('central')) return false;
      if (selectedType === 'state' && !u.type?.toLowerCase().includes('state')) return false;

      // State
      if (selectedState !== 'All' && u.state !== selectedState) return false;

      // Rating
      if (selectedRating !== 'All') {
        const { rating } = getUniversityRating(u.id);
        if (rating < Number(selectedRating)) return false;
      }

      return true;
    });
  }, [searchQuery, selectedType, selectedState, selectedRating]);

  return (
    <div className="all-progs-page">
      {/* 01 — HERO HEADER */}
      <section className="all-progs-hero">
        <div className="container">
          <nav className="all-progs-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Universities</span>
          </nav>

          <div className="all-progs-header-box">
            <h1 className="all-progs-title">Explore Top Universities & Colleges</h1>
            <p className="all-progs-subtitle">
              Discover NIRF-ranked Indian institutions, NAAC A++ accredited universities, and premier colleges offering recognized online and distance education degrees.
            </p>

            {/* Search Input + Filter Tabs in the SAME Row */}
            <div className="all-progs-search-tabs-row">
              <div className="all-progs-search-input-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by university name, city, state, or NIRF rank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search universities"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="all-progs-clear-btn"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Inline Filter Tabs Strip alongside Search */}
              <div className="all-progs-tabs-inline" role="tablist" aria-label="Institution type filters">
                {[
                  { id: 'All', label: 'All Institutions', count: universities.length },
                  { id: 'universities', label: 'Universities', count: universities.filter((u) => u.institutionKind !== 'college').length },
                  { id: 'colleges', label: 'Colleges', count: universities.filter((u) => u.institutionKind === 'college').length },
                  { id: 'central', label: 'Central Universities & IITs', count: universities.filter((u) => u.type?.toLowerCase().includes('central') || u.type?.toLowerCase().includes('importance')).length },
                  { id: 'state', label: 'State Universities', count: universities.filter((u) => u.type?.toLowerCase().includes('state')).length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`all-progs-cat-pill ${selectedType === tab.id ? 'active' : ''}`}
                    onClick={() => setSelectedType(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className="all-progs-cat-count">{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics under Search Bar - Plain Text without circle / pill styling */}
            <div className="all-progs-metrics-text-row">
              <span className="all-progs-metric-text">
                <strong>{universities.length}</strong> Total Institutions
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>65</strong> Universities (Central, State, Deemed)
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>13</strong> Colleges
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>100%</strong> UGC-DEB Entitled
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — MAIN GRID CONTENT */}
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Results count & State dropdown */}
        <div className="all-unis-top-controls-bar">
          <div className="all-unis-count-label">
            Showing <strong>{filteredUniversities.length}</strong> of <strong>{universities.length}</strong> institutions
          </div>

          <div className="all-unis-filter-controls-row">
            <div className="all-unis-filter-field">
              <label htmlFor="rating-filter" className="all-unis-filter-lbl">
                Rating:
              </label>
              <select
                id="rating-filter"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="all-progs-sort-select"
              >
                <option value="All">All Ratings</option>
                <option value="4.5">★ 4.5 & above</option>
                <option value="4.2">★ 4.2 & above</option>
                <option value="4.0">★ 4.0 & above</option>
              </select>
            </div>

            <div className="all-unis-filter-field">
              <label htmlFor="state-filter" className="all-unis-filter-lbl">
                State:
              </label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="all-progs-sort-select"
              >
                <option value="All">All States ({states.length})</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        {filteredUniversities.length === 0 ? (
          <div className="all-progs-empty-box">
            <Empty
              title="No universities match your search."
              sub="Try searching for a different keyword or reset filters."
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => { setSearchQuery(''); setSelectedType('All'); setSelectedState('All'); setSelectedRating('All'); }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="all-unis-card-grid">
            {filteredUniversities.map((u) => {
              const uniProgrammes = programmes.filter((p) => p.universityId === u.id);
              const { rating, ratingCount } = getUniversityRating(u.id);
              return (
                <article
                  key={u.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#DC2626';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(220, 38, 38, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
                  }}
                >
                  <div>
                    {/* Header: Logo on Left, Details (Name, Location, Text Info) on Right */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
                      <UniversityLogo id={u.id} name={u.name} short={u.short} size={84} />
                      <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 84 }}>
                        <h2 style={{ fontSize: 16.5, fontWeight: 700, margin: 0, color: '#0F172A', lineHeight: 1.25 }}>
                          <Link to={`/universities/${u.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {u.name}
                          </Link>
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 12.5, marginTop: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{u.location}</span>
                        </div>

                        {/* Recognition Info: Strictly Type · NAAC · NIRF */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 5, fontSize: 12, color: '#0F172A', marginTop: 5, lineHeight: 1.35, fontWeight: 600 }}>
                          {getUniversityBadges(u).map((badge, idx, arr) => (
                            <span key={badge} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <span>{badge}</span>
                              {idx < arr.length - 1 && (
                                <span style={{ color: '#94A3B8', fontWeight: 400, userSelect: 'none' }}>·</span>
                              )}
                            </span>
                          ))}
                        </div>

                        {/* Star Rating */}
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center' }}>
                          <StarRating rating={rating} count={ratingCount} size={13} />
                        </div>
                      </div>
                    </div>

                    {/* Description Tagline */}
                    <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                      {u.tagline || u.description}
                    </p>
                  </div>

                  {/* Bottom Footer & CTAs */}
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10, marginTop: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: '#64748B' }}>
                      <span>
                        <strong>{uniProgrammes.length}</strong> accredited degree{uniProgrammes.length !== 1 ? 's' : ''}
                      </span>
                      <span>Est. {u.established}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link
                        to={`/universities/${u.slug}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                      >
                        Explore University →
                      </Link>
                      <Link
                        to={`/programmes?uni=${u.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ justifyContent: 'center', textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        View Degrees
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
