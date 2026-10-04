import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { programmes, universities } from '../data.js';
import { useCompare } from '../context/CompareContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { useSearch } from '../context/SearchContext.jsx';
import { UniversityLogo } from './UniversityLogo.jsx';

const TYPEWRITER_PHRASES = [
  'Degrees, universities or specialisations...',
  'Online MBA with top placements...',
  'Chitkara University programmes...',
  'Data Science, AI & Machine Learning...',
  'Lovely Professional University...',
  'Online MCA & BCA degrees...',
  'Chandigarh University...',
  'NIRF Top 10 Indian Universities...',
];

export function KeplerHero({ onSelectCategory, onFilterSearch }) {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const { count, setModalOpen } = useCompare();
  const { count: shortlistCount } = useShortlist();
  const { openSearch } = useSearch();
  const nav = useNavigate();
  const openTimeRef = useRef(0);

  const handleToggleMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      openTimeRef.current = Date.now();
      setMenuOpen(true);
    }
  };

  const handleCloseMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (Date.now() - openTimeRef.current < 350) return;
    setMenuOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (Date.now() - openTimeRef.current < 350) return;
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [menuOpen]);

  // Typewriter effect for animated placeholder text
  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (focus || q) return;

    const currentPhrase = TYPEWRITER_PHRASES[phraseIdx];
    let timer;

    if (!isDeleting) {
      if (charIdx < currentPhrase.length) {
        timer = setTimeout(() => {
          setPlaceholderText(currentPhrase.slice(0, charIdx + 1));
          setCharIdx((prev) => prev + 1);
        }, 65);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => {
          setPlaceholderText(currentPhrase.slice(0, charIdx - 1));
          setCharIdx((prev) => prev - 1);
        }, 32);
      } else {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phraseIdx, focus, q]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const out = [];
    programmes.forEach((p) => {
      const uni = universities.find((u) => u.id === p.universityId);
      const hay = `${p.name} ${p.category} ${uni?.name || ''} ${p.specialisations.join(' ')}`.toLowerCase();
      if (hay.includes(needle)) {
        out.push({
          type: 'Course',
          title: p.name,
          sub: `${uni?.name || 'Online'} · ${p.level}`,
          slug: `/programmes/${p.slug}`,
          uniId: uni?.id,
          uniName: uni?.name,
          uniShort: uni?.short,
        });
      }
    });
    universities.forEach((u) => {
      if (u.name.toLowerCase().includes(needle) || (u.short && u.short.toLowerCase().includes(needle))) {
        out.push({
          type: 'University',
          title: u.name,
          sub: u.location,
          slug: `/universities/${u.slug}`,
          uniId: u.id,
          uniName: u.name,
          uniShort: u.short,
        });
      }
    });
    return out.slice(0, 6);
  }, [q]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (onFilterSearch && q.trim()) {
      onFilterSearch(q.trim());
    }
    const catSection = document.getElementById('popular') || document.getElementById('discover');
    if (catSection) {
      catSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="kepler-hero-viewport">
      <div className="kepler-hero-card">
        {/* Navigation Bar inside Hero Header — DegreeAtlas Style */}
        <header className="kepler-navbar">
          <Link to="/" className="atlas-nav-brand" aria-label="DegreeAtlas home">
            <span className="atlas-brand-title">
              DegreeAtlas
            </span>
          </Link>

          <nav className="kepler-nav-links" aria-label="Main Navigation">
            <Link to="/universities">Universities</Link>
            <Link to="/programmes">Programmes</Link>
            <Link to="/compare" className="atlas-nav-compare" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Compare {count > 0 && <span className="atlas-compare-badge">{count}</span>}
            </Link>
            <Link to="/articles">Articles</Link>
          </nav>

          <div className="kepler-nav-actions">
            {/* Shortlist Button with Heart */}
            <Link
              to="/shortlist"
              className={`atlas-shortlist-btn ${shortlistCount > 0 ? 'has-items' : ''}`}
              title="View Shortlist"
              aria-label="Shortlist"
            >
              <svg
                className="atlas-shortlist-heart"
                viewBox="0 0 24 24"
                fill={shortlistCount > 0 ? '#EF4444' : 'none'}
                stroke={shortlistCount > 0 ? '#EF4444' : 'currentColor'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {shortlistCount > 0 && <span className="atlas-shortlist-badge">{shortlistCount}</span>}
            </Link>

            {/* Simple Login Pill */}
            <button
              className="atlas-login-pill"
              onClick={() => setAuthModal('login')}
            >
              Login
            </button>

            {/* Simple Get Started Button */}
            <a
              href="#popular"
              className="atlas-getstarted-btn"
              onClick={(e) => { e.preventDefault(); scrollToSection('popular'); }}
            >
              Get Started <span aria-hidden="true">→</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="kepler-mobile-toggle"
              onClick={handleToggleMenu}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span className={`kepler-bar ${menuOpen ? 'open-1' : ''}`} />
              <span className={`kepler-bar ${menuOpen ? 'open-2' : ''}`} />
              <span className={`kepler-bar ${menuOpen ? 'open-3' : ''}`} />
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Backdrop & Menu — Portaled to body for flawless top-level overlay */}
        {menuOpen && typeof document !== 'undefined' && createPortal(
          <>
            <div className="kepler-mobile-backdrop" onClick={handleBackdropClick} aria-hidden="true" />
            <div className="kepler-mobile-dropdown" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
              <div className="kepler-mobile-head">
                <span className="atlas-brand-title" style={{ fontSize: 20 }}>DegreeAtlas</span>
                <button
                  type="button"
                  className="kepler-mobile-close-btn"
                  onClick={handleCloseMenu}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <div className="kepler-mobile-links">
                <Link to="/universities" onClick={() => setMenuOpen(false)}>Universities</Link>
                <Link to="/programmes" onClick={() => setMenuOpen(false)}>Programmes</Link>
                <Link to="/shortlist" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>My Shortlist</span>
                  {shortlistCount > 0 && <span className="atlas-shortlist-badge" style={{ position: 'static' }}>{shortlistCount}</span>}
                </Link>
                <Link to="/compare" className="atlas-mobile-compare" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px' }}>
                  <span>Compare</span>
                  {count > 0 && <span className="atlas-compare-badge">{count}</span>}
                </Link>
                <Link to="/articles" onClick={() => setMenuOpen(false)}>Articles & Guides</Link>
                <a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Student Reviews</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>Frequently Asked Questions</a>
              </div>
              <div className="kepler-mobile-auth">
                <button className="atlas-login-pill mobile-auth-btn" onClick={() => { setMenuOpen(false); setAuthModal('login'); }}>
                  Login
                </button>
                <button className="atlas-getstarted-btn mobile-auth-btn" onClick={() => { setMenuOpen(false); scrollToSection('popular'); }}>
                  Get Started →
                </button>
              </div>
            </div>
          </>,
          document.body
        )}

        {/* Hero Center Text & Search */}
        <div className="kepler-hero-content">
          <h1 className="kepler-title">
            The Smartest Way to Choose<br />
            Your Online Degree
          </h1>
          <p className="kepler-subtitle">
            Compare top universities, real fees, and programmes side by side. No sales pressure, just honest clarity.
          </p>

          {/* Search Box */}
          <div className="kepler-search-container">
            <form className="kepler-search-form" onSubmit={handleSearchSubmit}>
              <span className="kepler-search-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                id="kepler-course-search"
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setTimeout(() => setFocus(false), 200)}
                placeholder={focus ? 'Degrees, universities or specialisations...' : (placeholderText || 'Degrees, universities or specialisations...')}
                aria-label="Search degrees, universities or specialisations"
                autoComplete="off"
              />
              {q && (
                <button
                  type="button"
                  className="kepler-search-clear"
                  onClick={() => setQ('')}
                  aria-label="Clear input"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="kepler-search-btn"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {focus && q.trim() && (
              <div className="kepler-suggestions-dropdown" role="listbox">
                {results.length === 0 ? (
                  <div className="kepler-suggestion-empty">
                    <strong>No exact course match for “{q}”</strong>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                      Press enter to explore all catalog results.
                    </div>
                  </div>
                ) : (
                  results.map((r) => (
                    <button
                      key={r.slug + r.title}
                      className="kepler-suggestion-item"
                      onClick={() => nav(r.slug)}
                    >
                      <UniversityLogo id={r.uniId} name={r.uniName} short={r.uniShort} size={36} />
                      <div className="kepler-suggestion-texts">
                        <strong>{r.title}</strong>
                        <span>{r.sub}</span>
                      </div>
                      <span className="kepler-suggestion-badge">{r.type}</span>
                      <span className="kepler-suggestion-arrow">→</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Demo Modal */}
      {authModal && typeof document !== 'undefined' && createPortal(
        <div className="kepler-auth-overlay" onClick={() => setAuthModal(null)}>
          <div className="kepler-auth-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="kepler-auth-header">
              <h3>{authModal === 'login' ? 'Sign In to DegreeAtlas' : 'Create DegreeAtlas Account'}</h3>
              <button className="kepler-modal-close" onClick={() => setAuthModal(null)}>✕</button>
            </div>
            <p className="kepler-auth-sub">
              {authModal === 'login'
                ? 'Welcome back! Access your shortlisted universities and degree comparisons.'
                : 'Join DegreeAtlas today to discover and compare accredited online UG & PG degrees.'}
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert(`Demo: ${authModal === 'login' ? 'Signed in' : 'Account created'} successfully!`); setAuthModal(null); }}>
              {authModal === 'signup' && (
                <div className="kepler-form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Sarah Jenkins" required />
                </div>
              )}
              <div className="kepler-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="family@example.com" required />
              </div>
              <div className="kepler-form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="kepler-auth-submit">
                {authModal === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
