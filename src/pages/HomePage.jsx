import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, homeFaqs, inr, programmes, universities, getProgrammeRating } from '../data.js';
import { SearchBar } from '../components/SearchBar.jsx';
import { Empty, ProgrammeCard, SectionHead } from '../components/Cards.jsx';
import { Faq } from '../components/Widgets.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { KeplerHero } from '../components/KeplerHero.jsx';
import { AnimatedStats } from '../components/AnimatedStats.jsx';
import { StreamCategories } from '../components/StreamCategories.jsx';
import { MarqueeStrip } from '../components/MarqueeStrip.jsx';
import { HowItWorks } from '../components/HowItWorks.jsx';
import { ScholarshipsSection } from '../components/ScholarshipsSection.jsx';
import { UniversityLogoMarquee } from '../components/UniversityLogoMarquee.jsx';
import ReviewsSlider from '../components/ReviewsSlider.jsx';
import FeeSlider from '../components/FeeSlider.jsx';

const quickChips = ['Online MBA', 'Online BBA', 'MCA', 'BCA', 'M.Com', 'MA', 'Data Science'];

// Top 6 diverse programmes across disciplines with Chitkara at #1
const FEATURED_TOP_6_IDS = [
  'chitkara-online-mba',  // 1. Online MBA (Chitkara University)
  'vit-online-mca',       // 2. Online MCA (VIT Online)
  'iitm-bs-data-science', // 3. BS in Data Science & Applications (IIT Madras Online)
  'lpu-online-bba',       // 4. Online BBA (Lovely Professional University)
  'manipal-online-bca',   // 5. Online BCA (Manipal Academy of Higher Education)
  'bits-online-bsc-cs',   // 6. B.Sc in Computer Science (BITS Pilani)
];

function chipToCategory(c) {
  if (c.includes('MBA')) return 'Online MBA';
  if (c.includes('BBA')) return 'Online BBA';
  if (c === 'MCA') return 'Online MCA';
  if (c === 'BCA') return 'Online BCA';
  if (c.includes('M.Com')) return 'Online M.Com';
  if (c === 'MA') return 'Online MA';
  if (c.includes('Data Science')) return 'Data Science';
  return '';
}

export default function HomePage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [catTab, setCatTab] = useState('');
  const [filters, setFilters] = useState({ category: '', university: '', maxFee: '', duration: '', mode: '', eligibility: '', specialisation: '', minRating: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFeedback, setAppliedFeedback] = useState(false);
  const { setModalOpen, count } = useCompare();

  const handleLevelToggle = (l) => {
    setLevels((prev) =>
      prev.includes(l) ? prev.filter((item) => item !== l) : [...prev, l]
    );
  };

  const activeCategory = filters.category || catTab;

  const filtered = useMemo(() => {
    return programmes.filter((p) => {
      // Degree Level (UG / PG)
      if (levels.length > 0 && !levels.includes(p.level)) return false;

      // Category filter (from tab or select)
      if (activeCategory && p.category !== activeCategory) return false;

      // University filter
      if (filters.university && p.universityId !== filters.university) return false;

      // Fee filter
      if (filters.maxFee && Number(filters.maxFee) < 500000 && p.feeTotal > Number(filters.maxFee)) return false;

      // Duration filter
      if (filters.duration === 'short' && p.durationMo > 24) return false;
      if (filters.duration === 'long' && p.durationMo < 36) return false;

      // Learning Mode
      if (filters.mode) {
        if (filters.mode === '100% Online' && !p.mode?.includes('100% Online')) return false;
        if (filters.mode === 'hybrid' && !/hybrid|immersion|blend|campus/i.test(p.mode || '')) return false;
        if (filters.mode === 'distance' && !/distance|odl/i.test(p.mode || '')) return false;
      }

      // Eligibility
      if (filters.eligibility === 'ug10plus2') {
        const match = p.level === 'UG' || /10\+2|class 12/i.test(p.eligibilityShort || '');
        if (!match) return false;
      }
      if (filters.eligibility === 'pg50') {
        const match = p.level === 'PG' || /bachelor|graduation|degree/i.test(p.eligibilityShort || '');
        if (!match) return false;
      }
      if (filters.eligibility === 'technical') {
        const match = /b\.?tech|be\b|gate|mca|bca|math/i.test(p.eligibilityShort || '');
        if (!match) return false;
      }

      // Specialisation & Keyword Search
      if (filters.specialisation) {
        const term = filters.specialisation.trim().toLowerCase();
        const uni = universities.find((u) => u.id === p.universityId);
        const matchName = p.name.toLowerCase().includes(term);
        const matchCat = p.category?.toLowerCase().includes(term);
        const matchSpecs = p.specialisations?.some((s) => s.toLowerCase().includes(term));
        const matchUni = uni?.name?.toLowerCase().includes(term) || uni?.short?.toLowerCase().includes(term);
        if (!matchName && !matchCat && !matchSpecs && !matchUni) return false;
      }

      // Rating filter
      if (filters.minRating) {
        const { rating } = getProgrammeRating(p.id);
        if (rating < Number(filters.minRating)) return false;
      }

      return true;
    });
  }, [levels, activeCategory, filters]);

  const chips = useMemo(() => {
    const c = [];
    levels.forEach((lvl) => {
      c.push({ k: 'level', v: lvl, label: lvl === 'UG' ? 'Undergraduate (UG)' : 'Postgraduate (PG)' });
    });
    if (activeCategory) c.push({ k: 'category', label: activeCategory });
    if (filters.university) c.push({ k: 'university', label: universities.find((u) => u.id === filters.university)?.name });
    if (filters.maxFee && Number(filters.maxFee) < 500000) c.push({ k: 'maxFee', label: `Fee: Up to ${inr(Number(filters.maxFee))}` });
    if (filters.duration) c.push({ k: 'duration', label: filters.duration === 'short' ? '≤ 24 months (PG)' : '36+ months (UG)' });
    if (filters.mode) c.push({ k: 'mode', label: filters.mode });
    if (filters.eligibility) {
      const elLabel = filters.eligibility === 'ug10plus2' ? '10+2 (UG)' : filters.eligibility === 'pg50' ? "Bachelor's (PG)" : 'Technical / GATE';
      c.push({ k: 'eligibility', label: elLabel });
    }
    if (filters.specialisation) c.push({ k: 'specialisation', label: `Keyword: ${filters.specialisation}` });
    if (filters.minRating) c.push({ k: 'minRating', label: `Rating: ${filters.minRating}★+` });
    return c;
  }, [levels, activeCategory, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (levels.length > 0) count += levels.length;
    if (activeCategory) count += 1;
    if (filters.university) count += 1;
    if (filters.maxFee && Number(filters.maxFee) < 500000) count += 1;
    if (filters.duration) count += 1;
    if (filters.eligibility) count += 1;
    if (filters.specialisation) count += 1;
    if (filters.mode) count += 1;
    if (filters.minRating) count += 1;
    return count;
  }, [levels, activeCategory, filters]);

  const displayedProgrammes = useMemo(() => {
    // When no filters/search are active on the homepage, show the 6 diverse top courses across disciplines
    if (activeFilterCount === 0 && !filters.specialisation) {
      const top6 = FEATURED_TOP_6_IDS.map((id) => programmes.find((p) => p.id === id)).filter(Boolean);
      if (top6.length === 6) return top6;
    }
    return filtered.slice(0, 6);
  }, [filtered, activeFilterCount, filters]);

  const clearAll = () => {
    setLevels([]);
    setCatTab('');
    setFilters({ category: '', university: '', maxFee: '', duration: '', mode: '', eligibility: '', specialisation: '', minRating: '' });
    setAppliedFeedback(false);
  };

  const handleExploreAll = () => {
    navigate('/programmes');
  };

  const removeChip = (c) => {
    if (c.k === 'level') {
      setLevels((prev) => prev.filter((item) => item !== c.v));
    } else if (c.k === 'category') {
      setCatTab('');
      setFilters((f) => ({ ...f, category: '' }));
    } else {
      setFilters((f) => ({ ...f, [c.k]: '' }));
    }
  };

  const applyFilters = () => {
    setFilterOpen(false);
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 1400);

    const listEl = document.getElementById('programme-results-list') || document.getElementById('results');
    if (listEl) {
      listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main>
      {/* KEPLER HERO SECTION */}
      <KeplerHero
        onSelectCategory={(cat) => {
          setCatTab(cat);
          setFilters((f) => ({ ...f, category: cat }));
        }}
        onFilterSearch={(query) => {
          setFilters((f) => ({ ...f, specialisation: query }));
        }}
      />

      {/* 02b — ANIMATED STATS STRIP */}
      <AnimatedStats />

      {/* 03 — POPULAR UNIVERSITIES LOGO MARQUEE TICKER */}
      <UniversityLogoMarquee />

      {/* 04 — STREAM CATEGORIES (IMAGE 1 MATCH) */}
      <section className="section" id="popular" style={{ background: '#fff', borderTop: 'none', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <StreamCategories />
        </div>
      </section>


      {/* 06 — SMART FILTERS & SEARCH RESULTS */}
      <section className="section" id="discover" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}><div className="container">
        <SectionHead eyebrow="Search & Filters" title="Popular Online Programmes" sub="Filter by degree level, budget, duration, university, and career specialisation." />
        <div className="discovery-layout" id="results">
          {filterOpen && (
            <div
              className="filter-backdrop"
              onClick={() => setFilterOpen(false)}
              aria-label="Close filter drawer"
            />
          )}
          <aside className={`card filter-panel ${filterOpen ? 'open' : ''}`} aria-label="Smart discovery filters">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--navy)' }}>Smart Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="badge" style={{ fontSize: 11, padding: '2px 8px', background: 'var(--red-soft)', color: 'var(--red)', borderColor: 'var(--red-border)', fontWeight: 700 }}>
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={clearAll}
                    style={{ fontSize: 12.5, color: '#DC2626', fontWeight: 600, background: 'none', border: 0, cursor: 'pointer', padding: 0 }}
                  >
                    Reset
                  </button>
                )}
                <button className="link-btn filter-close-btn" onClick={() => setFilterOpen(false)} aria-label="Close filters">Close ✕</button>
              </div>
            </div>

            <div className="filter-group">
              <div className="fg-title">Degree level</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => handleLevelToggle('UG')}
                  style={{
                    padding: '5px 8px',
                    borderRadius: 8,
                    fontSize: 11.5,
                    fontWeight: levels.includes('UG') ? 700 : 500,
                    border: `1px solid ${levels.includes('UG') ? 'var(--red)' : '#CBD5E1'}`,
                    background: levels.includes('UG') ? 'var(--red-soft)' : '#F8FAFC',
                    color: levels.includes('UG') ? 'var(--red)' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}
                >
                  {levels.includes('UG') ? '✓ ' : ''}UG Degree
                </button>
                <button
                  type="button"
                  onClick={() => handleLevelToggle('PG')}
                  style={{
                    padding: '5px 8px',
                    borderRadius: 8,
                    fontSize: 11.5,
                    fontWeight: levels.includes('PG') ? 700 : 500,
                    border: `1px solid ${levels.includes('PG') ? 'var(--red)' : '#CBD5E1'}`,
                    background: levels.includes('PG') ? 'var(--red-soft)' : '#F8FAFC',
                    color: levels.includes('PG') ? 'var(--red)' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}
                >
                  {levels.includes('PG') ? '✓ ' : ''}PG Degree
                </button>
              </div>
            </div>

            <div className="filter-group">
              <div className="fg-title">Programme</div>
              <select
                value={activeCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setCatTab(val);
                  setFilters((prev) => ({ ...prev, category: val }));
                }}
                aria-label="Programme category"
              >
                <option value="">All programmes</option>
                {categories.map((c) => (<option key={c.name} value={c.name}>{c.name}</option>))}
              </select>
            </div>

            <div className="filter-group">
              <div className="fg-title">University</div>
              <select
                value={filters.university}
                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                aria-label="University"
              >
                <option value="">All universities</option>
                {universities.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
              </select>
            </div>

            <div className="filter-group">
              <FeeSlider
                value={filters.maxFee}
                onChange={(val) => setFilters((prev) => ({ ...prev, maxFee: val === 'All' ? '' : String(val) }))}
              />
            </div>

            <div className="filter-group">
              <div className="fg-title">Duration</div>
              <select
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                aria-label="Duration"
              >
                <option value="">Any duration</option>
                <option value="short">Up to 24 months (PG)</option>
                <option value="long">36+ months (UG)</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="fg-title">Eligibility</div>
              <select
                value={filters.eligibility}
                onChange={(e) => setFilters({ ...filters, eligibility: e.target.value })}
                aria-label="Eligibility"
              >
                <option value="">Any eligibility</option>
                <option value="ug10plus2">10+2 / High School (UG)</option>
                <option value="pg50">Bachelor&apos;s / Graduation (PG)</option>
                <option value="technical">BE / B.Tech / GATE / BCA</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="fg-title">Specialisation / Keyword</div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={filters.specialisation}
                  onChange={(e) => setFilters({ ...filters, specialisation: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
                  placeholder="e.g. Marketing, AI, MBA"
                  aria-label="Specialisation or keyword"
                  style={{ paddingRight: filters.specialisation ? 28 : 11 }}
                />
                {filters.specialisation && (
                  <button
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, specialisation: '' }))}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      fontSize: 14,
                      padding: 4,
                      lineHeight: 1
                    }}
                    aria-label="Clear keyword"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="filter-group">
              <div className="fg-title">Learning mode</div>
              <select
                value={filters.mode}
                onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                aria-label="Learning mode"
              >
                <option value="">Any mode</option>
                <option value="100% Online">100% Online</option>
                <option value="hybrid">Hybrid / Campus Immersion</option>
                <option value="distance">Online / Distance (ODL)</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="fg-title">Student rating</div>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                aria-label="Student rating"
              >
                <option value="">Any rating</option>
                <option value="4.5">★ 4.5 & above (Top rated)</option>
                <option value="4.2">★ 4.2 & above</option>
                <option value="4.0">★ 4.0 & above</option>
                <option value="3.8">★ 3.8 & above</option>
              </select>
            </div>

            <div className="filter-actions" style={{ marginTop: 4, display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{
                  borderRadius: 9999,
                  flex: 1,
                  padding: '8px 12px',
                  background: appliedFeedback ? '#15803D' : 'var(--navy)',
                  borderColor: appliedFeedback ? '#15803D' : 'transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 13
                }}
                onClick={applyFilters}
              >
                {appliedFeedback ? '✓ Applied!' : `Apply (${filtered.length})`}
              </button>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ borderRadius: 9999, padding: '8px 12px', cursor: 'pointer', fontSize: 13 }}
                  onClick={clearAll}
                >
                  Clear
                </button>
              )}
            </div>
          </aside>
          <div id="programme-results-list" tabIndex="-1" style={{ outline: 'none' }}>
            <div className="discovery-header-controls">
              <div className="discovery-count-group">
                <span className="result-count" aria-live="polite">{filtered.length} programme{filtered.length !== 1 ? 's' : ''} available</span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={clearAll}
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)', cursor: 'pointer' }}
                  >
                    Reset all ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="discovery-action-btns">
                <button
                  type="button"
                  className="explore-all-top-btn"
                  onClick={handleExploreAll}
                  title="View all accredited programmes across all universities"
                >
                  Explore All ({programmes.length})
                </button>
                <button
                  type="button"
                  className="home-filter-btn"
                  onClick={() => setFilterOpen(true)}
                  aria-label="Open filter drawer"
                >
                  ☰ Filters ({activeFilterCount > 0 ? activeFilterCount : filtered.length})
                </button>
              </div>
            </div>
            {chips.length > 0 && (
              <div className="active-chips">
                {chips.map((c) => (
                  <span key={c.k + (c.v || '')} className="active-chip">
                    {c.label}
                    <button
                      type="button"
                      onClick={() => removeChip(c)}
                      aria-label={`Remove ${c.label}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="link-btn"
                  onClick={clearAll}
                  style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>
            )}
            {filtered.length === 0 ? (
              <div style={{ marginTop: 20 }}>
                <Empty
                  title="No programmes match those filters."
                  sub="Try raising the fee limit, switching the degree level, or clicking Clear All."
                />
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={clearAll}
                    style={{ borderRadius: 9999, cursor: 'pointer' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="prog-grid">
                  {displayedProgrammes.map((p) => (
                    <ProgrammeCard key={p.id} p={p} />
                  ))}
                </div>

                <div className="explore-all-cta-box">
                  <div className="explore-all-cta-info">
                    <span className="explore-all-counter">
                      Showing top <strong>{Math.min(6, filtered.length)}</strong> of <strong>{programmes.length}</strong> accredited programmes
                    </span>
                    <p className="explore-all-sub">
                      Want to view all {programmes.length} accredited degrees across 78 top universities and colleges with complete fee breakdowns?
                    </p>
                  </div>
                  <button
                    type="button"
                    className="explore-all-expand-btn"
                    onClick={handleExploreAll}
                  >
                    Explore All ({programmes.length} Programmes) →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div></section>

      {/* 06b — INFINITE MARQUEE TICKER STRIP */}
      <MarqueeStrip />

      {/* 07 — HOW IT WORKS (GUIDED EVALUATION PROCESS) */}
      <HowItWorks />

      {/* 08 — SCHOLARSHIPS & FINANCIAL AID (EMI & FEE ASSISTANCE) */}
      <ScholarshipsSection />

      {/* 09 — STUDENT REVIEWS (TRUSTED BY LEARNERS ACROSS INDIA) */}
      <section className="section" id="reviews" style={{ background: '#FAF9F6', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <SectionHead
            eyebrow="Testimonials"
            title="Trusted by Learners Across India"
            sub="Real experiences from working professionals and students who found their university with DegreeAtlas."
          />
          <ReviewsSlider />
        </div>
      </section>

      {/* 11 — FAQs */}
      <section className="section" id="faq" style={{ background: '#FFFFFF', borderTop: '1px solid var(--border)', paddingTop: 56, paddingBottom: 64 }}><div className="container" style={{ textAlign: 'center' }}>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-sub" style={{ margin: '0 auto 32px' }}>Everything you need to know about online degrees, approvals, and admissions.</p>
        <Faq items={homeFaqs} />
      </div></section>

      {/* 12 — FINAL CTA */}
      <section className="final-cta-section">
        <div className="final-cta">
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="section-title">Ready to find your ideal online degree?</h2>
            <p className="section-sub">Explore {programmes.length}+ accredited programmes across {universities.length} top universities or compare your shortlist today.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#popular" className="btn btn-accent">Explore All Programmes →</a>
              <button className="btn btn-ghost" onClick={() => setModalOpen(true)}>
                Compare Degrees{count > 0 ? ` (${count})` : ''}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
