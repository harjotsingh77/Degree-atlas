import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { programmes, universities, inr, getProgrammeRating } from '../data.js';
import { ProgrammeCard, Empty } from '../components/Cards.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import FeeSlider from '../components/FeeSlider.jsx';

export default function AllProgrammesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { count, setModalOpen } = useCompare();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All');
  const [selectedKind, setSelectedKind] = useState('All'); // 'All' | 'university' | 'college'
  const [selectedUniversity, setSelectedUniversity] = useState(searchParams.get('uni') || 'All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedFeeMax, setSelectedFeeMax] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  // Tabs Carousel Scrolling
  const tabsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkTabsScroll = () => {
    if (tabsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  const scrollTabs = (direction) => {
    if (tabsScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      tabsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkTabsScroll, 250);
    }
  };

  useEffect(() => {
    checkTabsScroll();
    window.addEventListener('resize', checkTabsScroll);
    return () => window.removeEventListener('resize', checkTabsScroll);
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category or stream from URL if changed
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
      setCurrentPage(1);
    } else if (searchParams.get('stream')) {
      setSelectedCategory('All');
      setCurrentPage(1);
    }
  }, [searchParams]);

  const handleCategoryTabClick = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.delete('stream');
    setSearchParams(newParams);
  };

  // Unique lists for filter dropdowns
  const availableStates = useMemo(() => {
    const states = new Set();
    universities.forEach((u) => {
      if (u.state) states.add(u.state);
    });
    return Array.from(states).sort();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { All: programmes.length };
    programmes.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const topCategories = [
    'All',
    'Online MBA',
    'Online MCA',
    'Online BBA',
    'Online BCA',
    'Online B.Com',
    'Online MA',
    'Online M.Com',
    'Computer Science',
    'Data Science',
    'Arts & Humanities',
  ];

  // Stream mapping for career disciplines
  const STREAM_MAP = {
    business: ['Online MBA', 'Online BBA'],
    'computers-it': ['Online MCA', 'Online BCA', 'Computer Science'],
    'commerce-finance': ['Online B.Com', 'Online M.Com'],
    'data-science-ai': ['Data Science'],
    humanities: ['Online MA', 'Arts & Humanities'],
  };

  // Filtering Logic
  const filteredProgrammes = useMemo(() => {
    const streamParam = searchParams.get('stream');
    return programmes.filter((p) => {
      const uni = universities.find((u) => u.id === p.universityId);

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        const matchUni = uni?.name?.toLowerCase().includes(q) || uni?.short?.toLowerCase().includes(q);
        const matchLoc = uni?.location?.toLowerCase().includes(q) || uni?.state?.toLowerCase().includes(q);
        const matchSpec = p.specialisations?.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchUni && !matchLoc && !matchSpec) return false;
      }

      // Stream Filter
      if (streamParam && STREAM_MAP[streamParam] && selectedCategory === 'All') {
        if (!STREAM_MAP[streamParam].includes(p.category)) return false;
      }

      // Category Filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Degree Level Filter
      if (selectedLevel !== 'All' && p.level !== selectedLevel) {
        return false;
      }

      // Institution Kind Filter (University vs Autonomous College)
      if (selectedKind !== 'All') {
        const kind = uni?.institutionKind || 'university';
        if (kind !== selectedKind) return false;
      }

      // University Filter
      if (selectedUniversity !== 'All' && p.universityId !== selectedUniversity) {
        return false;
      }

      // State Filter
      if (selectedState !== 'All' && uni?.state !== selectedState) {
        return false;
      }

      // Fee Filter
      if (selectedFeeMax !== 'All') {
        const fee = p.feeTotal;
        const numLimit = Number(selectedFeeMax);
        if (!isNaN(numLimit)) {
          if (numLimit < 500000 && fee > numLimit) return false;
        } else if (selectedFeeMax === 'under50k' && fee > 50000) {
          return false;
        } else if (selectedFeeMax === '50k-100k' && (fee < 50000 || fee > 100000)) {
          return false;
        } else if (selectedFeeMax === '100k-200k' && (fee < 100000 || fee > 200000)) {
          return false;
        } else if (selectedFeeMax === 'above200k' && fee < 200000) {
          return false;
        }
      }

      // Duration Filter
      if (selectedDuration !== 'All') {
        if (selectedDuration === 'short' && p.durationMo > 24) return false;
        if (selectedDuration === 'long' && p.durationMo < 36) return false;
      }

      // Mode Filter
      if (selectedMode !== 'All' && p.mode !== selectedMode) {
        return false;
      }

      // Rating Filter
      if (selectedRating !== 'All') {
        const { rating } = getProgrammeRating(p.id);
        if (rating < Number(selectedRating)) return false;
      }

      return true;
    });

    // Sorting Logic
    if (sortBy === 'fee-asc') {
      result = [...result].sort((a, b) => a.feeTotal - b.feeTotal);
    } else if (sortBy === 'fee-desc') {
      result = [...result].sort((a, b) => b.feeTotal - a.feeTotal);
    } else if (sortBy === 'duration-asc') {
      result = [...result].sort((a, b) => a.durationMo - b.durationMo);
    } else if (sortBy === 'alpha') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'recommended' retains the curated order with Chitkara at #1

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedLevel,
    selectedKind,
    selectedUniversity,
    selectedState,
    selectedFeeMax,
    selectedDuration,
    selectedMode,
    selectedRating,
    sortBy,
    searchParams,
  ]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    selectedLevel,
    selectedKind,
    selectedUniversity,
    selectedState,
    selectedFeeMax,
    selectedDuration,
    selectedMode,
    selectedRating,
    sortBy,
  ]);

  // Active filters list for chips
  const activeChips = useMemo(() => {
    const list = [];
    if (searchQuery.trim()) {
      list.push({ key: 'q', label: `Search: "${searchQuery}"`, clear: () => setSearchQuery('') });
    }
    if (selectedCategory !== 'All') {
      list.push({ key: 'category', label: `Category: ${selectedCategory}`, clear: () => setSelectedCategory('All') });
    }
    if (selectedLevel !== 'All') {
      list.push({ key: 'level', label: `Level: ${selectedLevel === 'UG' ? 'Undergraduate' : 'Postgraduate'}`, clear: () => setSelectedLevel('All') });
    }
    if (selectedKind !== 'All') {
      list.push({ key: 'kind', label: selectedKind === 'college' ? 'Colleges' : 'Universities', clear: () => setSelectedKind('All') });
    }
    if (selectedUniversity !== 'All') {
      const u = universities.find((x) => x.id === selectedUniversity);
      list.push({ key: 'uni', label: u?.short || u?.name, clear: () => setSelectedUniversity('All') });
    }
    if (selectedState !== 'All') {
      list.push({ key: 'state', label: `State: ${selectedState}`, clear: () => setSelectedState('All') });
    }
    if (selectedFeeMax !== 'All') {
      const numLimit = Number(selectedFeeMax);
      if (!isNaN(numLimit)) {
        if (numLimit < 500000) {
          list.push({
            key: 'fee',
            label: `Fee: Up to ${inr(numLimit)}`,
            clear: () => setSelectedFeeMax('All'),
          });
        }
      } else {
        const labels = {
          under50k: 'Under ₹50,000',
          '50k-100k': '₹50,000 - ₹1,00,000',
          '100k-200k': '₹1,00,000 - ₹2,00,000',
          above200k: 'Above ₹2,00,000',
        };
        if (labels[selectedFeeMax]) {
          list.push({ key: 'fee', label: labels[selectedFeeMax], clear: () => setSelectedFeeMax('All') });
        }
      }
    }
    if (selectedDuration !== 'All') {
      list.push({ key: 'dur', label: selectedDuration === 'short' ? '≤ 24 Months' : '36+ Months', clear: () => setSelectedDuration('All') });
    }
    if (selectedMode !== 'All') {
      list.push({ key: 'mode', label: `Mode: ${selectedMode}`, clear: () => setSelectedMode('All') });
    }
    if (selectedRating !== 'All') {
      list.push({ key: 'rating', label: `Rating: ${selectedRating}★+`, clear: () => setSelectedRating('All') });
    }
    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedLevel,
    selectedKind,
    selectedUniversity,
    selectedState,
    selectedFeeMax,
    selectedDuration,
    selectedMode,
    selectedRating,
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedKind('All');
    setSelectedUniversity('All');
    setSelectedState('All');
    setSelectedFeeMax('All');
    setSelectedDuration('All');
    setSelectedMode('All');
    setSelectedRating('All');
    setSortBy('recommended');
  };

  // Pagination slice
  const totalItems = filteredProgrammes.length;
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(totalItems / pageSize);
  const startIndex = pageSize === 'all' ? 0 : (currentPage - 1) * pageSize;
  const endIndex = pageSize === 'all' ? totalItems : Math.min(startIndex + pageSize, totalItems);
  const paginatedProgrammes = filteredProgrammes.slice(startIndex, endIndex);

  return (
    <div className="all-progs-page">
      {/* 01 — HERO HEADER */}
      <section className="all-progs-hero">
        <div className="container">
          <nav className="all-progs-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">All Programmes</span>
          </nav>

          <div className="all-progs-header-box">
            <h1 className="all-progs-title">Explore All Accredited Online & Distance Programmes</h1>
            <p className="all-progs-subtitle">
              Browse, filter, and compare authentic tuition fees, semester breakdowns, NIRF rankings, and eligibility criteria across {universities.length} premier universities and top colleges in India.
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
                  placeholder="Search by degree name, university, or specialisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search programmes"
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

              {/* Inline Filter Tabs Strip alongside Search with Left/Right Scroll Arrows */}
              <div className={`all-progs-tabs-carousel-wrapper ${canScrollLeft ? 'has-left' : ''} ${canScrollRight ? 'has-right' : ''}`}>
                {canScrollLeft && (
                  <button
                    type="button"
                    className="all-progs-tab-arrow left"
                    onClick={() => scrollTabs('left')}
                    aria-label="Scroll categories left"
                    title="Previous categories"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}

                <div
                  ref={tabsScrollRef}
                  onScroll={checkTabsScroll}
                  className="all-progs-tabs-inline"
                  role="tablist"
                  aria-label="Programme categories"
                >
                  {topCategories.map((cat) => {
                    const countForCat = categoryCounts[cat] || 0;
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`all-progs-cat-pill ${isActive ? 'active' : ''}`}
                        onClick={() => handleCategoryTabClick(cat)}
                      >
                        <span>{cat === 'All' ? 'All Programmes' : cat}</span>
                        <span className="all-progs-cat-count">{countForCat}</span>
                      </button>
                    );
                  })}
                </div>

                {canScrollRight && (
                  <button
                    type="button"
                    className="all-progs-tab-arrow right"
                    onClick={() => scrollTabs('right')}
                    aria-label="Scroll categories right"
                    title="Next categories"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Metrics under Search Bar - Plain Text Row matching Image 1 */}
            <div className="all-progs-metrics-text-row">
              <span className="all-progs-metric-text">
                <strong>{programmes.length}</strong> Total Programmes
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>{universities.length}</strong> Premier Institutions
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>100%</strong> UGC-DEB Entitled
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>AICTE</strong> & NAAC Approved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — MAIN CONTENT DUAL-PANEL (FILTERS + RESULTS) */}
      <main className="container all-progs-main-layout">
        {/* Mobile filter backdrop */}
        {mobileFilterOpen && (
          <div
            className="filter-backdrop"
            onClick={() => setMobileFilterOpen(false)}
            aria-label="Close filter drawer"
          />
        )}
        {/* LEFT SIDEBAR: FILTERS (Matching HomePage filter-panel) */}
        <aside className={`card filter-panel ${mobileFilterOpen ? 'open' : ''}`} aria-label="Smart discovery filters">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Smart Filters</h3>
              {activeChips.length > 0 && (
                <span
                  className="badge"
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    background: 'var(--red-soft)',
                    color: 'var(--red)',
                    borderColor: 'var(--red-border)',
                    fontWeight: 700,
                  }}
                >
                  {activeChips.length} active
                </span>
              )}
            </div>
            {activeChips.length > 0 && (
              <button
                type="button"
                className="link-btn"
                onClick={clearAllFilters}
                style={{
                  fontSize: 12.5,
                  color: '#DC2626',
                  fontWeight: 600,
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Reset
              </button>
            )}
            <button
              type="button"
              className="link-btn filter-close-btn"
              onClick={() => setMobileFilterOpen(false)}
              aria-label="Close filters"
            >
              Close ✕
            </button>
          </div>

          {/* Degree Level */}
          <div className="filter-group">
            <div className="fg-title">Degree level</div>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={selectedLevel === 'UG'}
                onChange={() => setSelectedLevel(selectedLevel === 'UG' ? 'All' : 'UG')}
              />
              <span>Undergraduate (UG)</span>
            </label>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={selectedLevel === 'PG'}
                onChange={() => setSelectedLevel(selectedLevel === 'PG' ? 'All' : 'PG')}
              />
              <span>Postgraduate (PG)</span>
            </label>
          </div>

          {/* Programme Category */}
          <div className="filter-group">
            <div className="fg-title">Programme</div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Programme category"
            >
              <option value="All">All programmes ({programmes.length})</option>
              {topCategories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c} {categoryCounts[c] ? `(${categoryCounts[c]})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* University / College */}
          <div className="filter-group">
            <div className="fg-title">University / College</div>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              aria-label="University"
            >
              <option value="All">All universities & colleges ({universities.length})</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.state ? `(${u.state})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* State / Region */}
          <div className="filter-group">
            <div className="fg-title">State / Region</div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              aria-label="State or region"
            >
              <option value="All">All states in India</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Total Fees Slider */}
          <div className="filter-group">
            <FeeSlider
              value={selectedFeeMax}
              onChange={(val) => setSelectedFeeMax(val)}
            />
          </div>

          {/* Duration */}
          <div className="filter-group">
            <div className="fg-title">Duration</div>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="progDuration"
                checked={selectedDuration === 'All'}
                onChange={() => setSelectedDuration('All')}
              /> Any duration
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="progDuration"
                checked={selectedDuration === 'short'}
                onChange={() => setSelectedDuration('short')}
              /> Up to 24 months (PG)
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="progDuration"
                checked={selectedDuration === 'long'}
                onChange={() => setSelectedDuration('long')}
              /> 36+ months (UG)
            </label>
          </div>

          {/* Specialisation / Keyword */}
          <div className="filter-group">
            <div className="fg-title">Specialisation / Keyword</div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Marketing, AI, Finance, Data"
                aria-label="Specialisation or keyword"
                style={{ paddingRight: searchQuery ? 28 : 11 }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
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
                    lineHeight: 1,
                  }}
                  aria-label="Clear keyword"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Learning Mode */}
          <div className="filter-group">
            <div className="fg-title">Learning mode</div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              aria-label="Learning mode"
            >
              <option value="All">Any mode</option>
              <option value="100% Online">100% Online</option>
              <option value="Online / Distance">Online / Distance (ODL)</option>
              <option value="Hybrid (Live Virtual + Campus Immersion)">Hybrid / Campus Immersion</option>
              <option value="Autonomous Blend">Autonomous Blend</option>
              <option value="Campus Academic Excellence">Campus Academic Excellence</option>
            </select>
          </div>

          {/* Student Rating */}
          <div className="filter-group">
            <div className="fg-title">Student rating</div>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              aria-label="Student rating"
            >
              <option value="All">Any rating</option>
              <option value="4.5">★ 4.5 & above (Top rated)</option>
              <option value="4.2">★ 4.2 & above</option>
              <option value="4.0">★ 4.0 & above</option>
              <option value="3.8">★ 3.8 & above</option>
            </select>
          </div>

          {/* Actions */}
          <div className="filter-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: 9999,
                flex: 1,
                padding: '10px 16px',
                background: 'var(--navy)',
                borderColor: 'transparent',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
              }}
              onClick={() => {
                setMobileFilterOpen(false);
                document.getElementById('programme-results-list')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Apply ({filteredProgrammes.length})
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: 9999, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </div>

          {/* Quick Compare Callout */}
          {count > 0 && (
            <div style={{ marginTop: 14, padding: '10px 12px', background: '#FEF2F2', borderRadius: 12, border: '1px solid #FECACA', textAlign: 'center' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#991B1B' }}>
                {count} programme{count > 1 ? 's' : ''} in comparison
              </span>
              <button
                type="button"
                className="btn btn-accent btn-sm"
                onClick={() => setModalOpen(true)}
                style={{ width: '100%', marginTop: 8, padding: '6px 12px', fontSize: 12.5 }}
              >
                View Side-by-Side Comparison →
              </button>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN LIST */}
        <section className="all-progs-content">
          {/* Top Bar: Count, Sort, and Mobile Filter Button */}
          <div className="all-progs-results-bar">
            <div className="all-progs-count-info">
              <span className="all-progs-main-count">
                Showing <strong>{totalItems === 0 ? 0 : startIndex + 1}–{endIndex}</strong> of <strong>{totalItems}</strong> accredited programmes
              </span>
              {selectedCategory !== 'All' && (
                <span className="all-progs-category-indicator">in {selectedCategory}</span>
              )}
            </div>

            <div className="all-progs-controls-right">
              {/* Mobile Filter Opener */}
              <button
                type="button"
                className="all-progs-mobile-filter-trigger"
                onClick={() => setMobileFilterOpen(true)}
              >
                ☰ Filters {activeChips.length > 0 ? `(${activeChips.length})` : ''}
              </button>

              {/* Sort By Dropdown */}
              <div className="all-progs-sort-box">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  className="all-progs-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended (Chitkara #1)</option>
                  <option value="fee-asc">Tuition Fee: Low to High</option>
                  <option value="fee-desc">Tuition Fee: High to Low</option>
                  <option value="duration-asc">Duration: Shortest First</option>
                  <option value="alpha">Degree Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Chips Strip */}
          {activeChips.length > 0 && (
            <div className="all-progs-chips-strip">
              <span className="all-progs-chips-label">Active:</span>
              {activeChips.map((c) => (
                <span key={c.key} className="all-progs-active-chip">
                  {c.label}
                  <button type="button" onClick={c.clear} aria-label={`Remove ${c.label}`}>
                    ✕
                  </button>
                </span>
              ))}
              <button type="button" onClick={clearAllFilters} className="all-progs-clear-all-link">
                Clear All ({activeChips.length})
              </button>
            </div>
          )}

          {/* Programme Cards List */}
          {totalItems === 0 ? (
            <div className="all-progs-empty-box">
              <Empty
                title="No programmes match your current filter selections."
                sub="Try clearing your budget threshold, selecting 'All Levels', or removing keyword search terms."
              />
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={clearAllFilters}
                  style={{ borderRadius: 9999, padding: '12px 28px' }}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="prog-grid">
              {paginatedProgrammes.map((p) => (
                <ProgrammeCard key={p.id} p={p} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalItems > 0 && totalPages > 1 && pageSize !== 'all' && (
            <div className="all-progs-pagination-bar">
              <button
                type="button"
                className="all-progs-page-btn prev-btn"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
              >
                ← Previous
              </button>

              <div className="all-progs-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2
                    );
                  })
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;
                    return (
                      <span key={page} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {showEllipsis && <span className="all-progs-ellipsis">...</span>}
                        <button
                          type="button"
                          className={`all-progs-page-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                        >
                          {page}
                        </button>
                      </span>
                    );
                  })}
              </div>

              <button
                type="button"
                className="all-progs-page-btn next-btn"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
              >
                Next →
              </button>

              <div className="all-progs-per-page-select">
                <span>View:</span>
                <button
                  type="button"
                  className={`all-progs-view-count-btn ${pageSize === 12 ? 'active' : ''}`}
                  onClick={() => setPageSize(12)}
                >
                  12
                </button>
                <button
                  type="button"
                  className={`all-progs-view-count-btn ${pageSize === 24 ? 'active' : ''}`}
                  onClick={() => setPageSize(24)}
                >
                  24
                </button>
                <button
                  type="button"
                  className={`all-progs-view-count-btn ${pageSize === 'all' ? 'active' : ''}`}
                  onClick={() => setPageSize('all')}
                >
                  All ({totalItems})
                </button>
              </div>
            </div>
          )}

          {/* UGC-DEB Trust & Academic Equivalence Notice Box */}
          <section className="all-progs-trust-card">
            <div className="all-progs-trust-icon">⚖️</div>
            <div className="all-progs-trust-text">
              <h4>UGC Academic Equivalence & Legal Validity</h4>
              <p>
                As gazetted by the <strong>University Grants Commission (Open and Distance Learning Programmes and Online Programmes) Regulations</strong>, degrees, diplomas, and certificates conferred through UGC-DEB approved online and distance education are treated as <strong>equivalent</strong> to corresponding degrees awarded through traditional on-campus mode. They are fully recognized for UPSC, Central & State Government recruitments, PSU appointments, corporate careers, and international academic admissions.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
