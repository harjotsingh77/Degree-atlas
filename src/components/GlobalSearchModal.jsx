import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.jsx';
import { universities, programmes, inr } from '../data.js';
import UniversityLogo from './UniversityLogo.jsx';
import '../global-search.css';

const POPULAR_SEARCHES = [
  'Online MBA',
  'Chitkara University',
  'Online MCA',
  'Chandigarh University',
  'BCA',
  'Data Science',
  'LPU Online',
  'BBA',
];

export default function GlobalSearchModal() {
  const { searchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input on open
  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setActiveIndex(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  // Search logic across universities and programmes
  const { matchingUnis, matchingProgs } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { matchingUnis: [], matchingProgs: [] };
    }

    const matchedUnis = universities
      .filter((u) => {
        const nameMatch = u.name?.toLowerCase().includes(q);
        const shortMatch = u.short?.toLowerCase().includes(q);
        const locMatch = u.location?.toLowerCase().includes(q);
        const stateMatch = u.state?.toLowerCase().includes(q);
        return nameMatch || shortMatch || locMatch || stateMatch;
      })
      .slice(0, 5);

    const matchedProgs = programmes
      .filter((p) => {
        const uni = universities.find((u) => u.id === p.universityId);
        const nameMatch = p.name?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const specMatch = p.specialisations?.some((s) => s.toLowerCase().includes(q));
        const uniMatch = uni?.name?.toLowerCase().includes(q);
        return nameMatch || catMatch || specMatch || uniMatch;
      })
      .slice(0, 6);

    return { matchingUnis: matchedUnis, matchingProgs: matchedProgs };
  }, [query]);

  // Combined flat list for arrow key navigation
  const allResults = useMemo(() => {
    const list = [];
    matchingUnis.forEach((u) => {
      list.push({
        type: 'uni',
        id: u.id,
        title: u.name,
        sub: `${u.location || u.state} · ${u.naacGrade || 'Accredited'}`,
        url: `/universities/${u.slug}`,
        uni: u,
      });
    });
    matchingProgs.forEach((p) => {
      const uni = universities.find((u) => u.id === p.universityId);
      list.push({
        type: 'prog',
        id: p.id,
        title: p.name,
        sub: `${uni?.name || 'Accredited'} · ${p.durationMo} Months · ${inr(p.feeTotal)}`,
        url: `/programmes/${p.slug}`,
        uni: uni,
      });
    });
    return list;
  }, [matchingUnis, matchingProgs]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!searchOpen) return null;

  const handleSelect = (url) => {
    closeSearch();
    navigate(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (allResults.length > 0 ? (prev + 1) % allResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (allResults.length > 0 ? (prev - 1 + allResults.length) % allResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[activeIndex]) {
        handleSelect(allResults[activeIndex].url);
      }
    }
  };

  return (
    <div
      className="gsearch-overlay"
      onClick={closeSearch}
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search"
    >
      <div
        className="gsearch-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="gsearch-input-wrap">
          <div className="gsearch-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className="gsearch-input"
            placeholder="Search universities, degrees, MBA, MCA, BCA..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="gsearch-badges">
            {query && (
              <button
                type="button"
                className="gsearch-clear-btn"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              className="gsearch-esc-badge"
              onClick={closeSearch}
            >
              ESC
            </button>
          </div>
        </div>

        {/* Search Body */}
        <div className="gsearch-body">
          {/* Default view when query is empty */}
          {!query.trim() && (
            <>
              {/* Popular Searches */}
              <div className="gsearch-section">
                <div className="gsearch-section-title">Trending & Popular Searches</div>
                <div className="gsearch-chips">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="gsearch-chip"
                      onClick={() => setQuery(item)}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="gsearch-section">
                <div className="gsearch-section-title">Browse Sections</div>
                <div className="gsearch-items-list">
                  <div
                    className="gsearch-item"
                    onClick={() => handleSelect('/universities')}
                  >
                    <div className="gsearch-item-left">
                      <div
                        className="gsearch-item-logo"
                        style={{ background: '#FEF2F2', color: '#DC2626' }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                      <div className="gsearch-item-info">
                        <h4 className="gsearch-item-title">All Universities</h4>
                        <div className="gsearch-item-sub">
                          Browse all 78+ UGC-DEB accredited institutions
                        </div>
                      </div>
                    </div>
                    <span className="gsearch-item-arrow">→</span>
                  </div>

                  <div
                    className="gsearch-item"
                    onClick={() => handleSelect('/programmes')}
                  >
                    <div className="gsearch-item-left">
                      <div
                        className="gsearch-item-logo"
                        style={{ background: '#EFF6FF', color: '#2563EB' }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                      <div className="gsearch-item-info">
                        <h4 className="gsearch-item-title">All Online Programmes</h4>
                        <div className="gsearch-item-sub">
                          Explore MBA, MCA, BCA, BBA, B.Com, Data Science & AI degrees
                        </div>
                      </div>
                    </div>
                    <span className="gsearch-item-arrow">→</span>
                  </div>

                  <div
                    className="gsearch-item"
                    onClick={() => handleSelect('/articles')}
                  >
                    <div className="gsearch-item-left">
                      <div
                        className="gsearch-item-logo"
                        style={{ background: '#F0FDF4', color: '#16A34A' }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div className="gsearch-item-info">
                        <h4 className="gsearch-item-title">Career Guides & Articles</h4>
                        <div className="gsearch-item-sub">
                          Accreditation comparisons, fee guides, and career paths
                        </div>
                      </div>
                    </div>
                    <span className="gsearch-item-arrow">→</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Search Results */}
          {query.trim() && (
            <>
              {/* Universities Section */}
              {matchingUnis.length > 0 && (
                <div className="gsearch-section">
                  <div className="gsearch-section-title">Universities ({matchingUnis.length})</div>
                  <div className="gsearch-items-list">
                    {matchingUnis.map((u) => {
                      const itemIdx = allResults.findIndex((r) => r.id === u.id);
                      const isHighlighted = itemIdx === activeIndex;

                      return (
                        <div
                          key={u.id}
                          className={`gsearch-item ${isHighlighted ? 'active' : ''}`}
                          onClick={() => handleSelect(`/universities/${u.slug}`)}
                          onMouseEnter={() => setActiveIndex(itemIdx)}
                        >
                          <div className="gsearch-item-left">
                            <div className="gsearch-item-logo">
                              <UniversityLogo
                                id={u.id}
                                name={u.name}
                                short={u.short}
                                size={34}
                              />
                            </div>
                            <div className="gsearch-item-info">
                              <h4 className="gsearch-item-title">{u.name}</h4>
                              <div className="gsearch-item-sub">
                                <span>{u.location || u.state}</span>
                                {u.naacGrade && <span>• {u.naacGrade}</span>}
                                {u.nirfRank && <span>• {u.nirfRank.split(' ')[0]} {u.nirfRank.split(' ')[1] || ''}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="gsearch-item-right">
                            <span className="gsearch-type-badge uni">University</span>
                            <span className="gsearch-item-arrow">→</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Programmes Section */}
              {matchingProgs.length > 0 && (
                <div className="gsearch-section">
                  <div className="gsearch-section-title">Degrees & Programmes ({matchingProgs.length})</div>
                  <div className="gsearch-items-list">
                    {matchingProgs.map((p) => {
                      const uni = universities.find((u) => u.id === p.universityId);
                      const itemIdx = allResults.findIndex((r) => r.id === p.id);
                      const isHighlighted = itemIdx === activeIndex;

                      return (
                        <div
                          key={p.id}
                          className={`gsearch-item ${isHighlighted ? 'active' : ''}`}
                          onClick={() => handleSelect(`/programmes/${p.slug}`)}
                          onMouseEnter={() => setActiveIndex(itemIdx)}
                        >
                          <div className="gsearch-item-left">
                            <div className="gsearch-item-logo">
                              {uni ? (
                                <UniversityLogo
                                  id={uni.id}
                                  name={uni.name}
                                  short={uni.short}
                                  size={34}
                                />
                              ) : (
                                <span style={{ fontWeight: 700, color: '#DC2626' }}>DEG</span>
                              )}
                            </div>
                            <div className="gsearch-item-info">
                              <h4 className="gsearch-item-title">{p.name}</h4>
                              <div className="gsearch-item-sub">
                                <span style={{ fontWeight: 600, color: '#1E293B' }}>{uni?.name}</span>
                                <span>• {p.durationMo} mo</span>
                                <span>• {inr(p.feeTotal)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="gsearch-item-right">
                            <span className="gsearch-type-badge prog">{p.level || 'Degree'}</span>
                            <span className="gsearch-item-arrow">→</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty Results */}
              {allResults.length === 0 && (
                <div className="gsearch-empty">
                  <h4>No results found for “{query}”</h4>
                  <p>
                    Try searching by degree level (MBA, MCA, BCA), subject (Data Science), or university name.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer / Shortcuts */}
        <div className="gsearch-footer">
          <div className="gsearch-footer-hints">
            <div className="gsearch-footer-hint">
              <kbd>↑</kbd> <kbd>↓</kbd> <span>to navigate</span>
            </div>
            <div className="gsearch-footer-hint">
              <kbd>↵</kbd> <span>to select</span>
            </div>
            <div className="gsearch-footer-hint">
              <kbd>ESC</kbd> <span>to close</span>
            </div>
          </div>
          <div>DegreeAtlas Universal Search</div>
        </div>
      </div>
    </div>
  );
}
