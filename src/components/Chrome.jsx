import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { useSearch } from '../context/SearchContext.jsx';

export function Header() {
  const { count, setModalOpen } = useCompare();
  const { count: shortlistCount } = useShortlist();
  const { openSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const openTimeRef = useRef(0);

  const handleToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (open) {
      setOpen(false);
    } else {
      openTimeRef.current = Date.now();
      setOpen(true);
    }
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (Date.now() - openTimeRef.current < 350) return;
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Sync body scroll and menu-open class
  useEffect(() => {
    if (open) {
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
  }, [open]);

  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/universities">Universities</NavLink>
          <NavLink to="/programmes">Programmes</NavLink>
          <NavLink to="/compare" className="nav-compare">
            Compare {count > 0 && <span className="nav-count">{count}</span>}
          </NavLink>
          <NavLink to="/articles">Articles</NavLink>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Search" onClick={openSearch} title="Search (Cmd+K or /)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <Link to="/shortlist" className={`shortlist-btn ${shortlistCount > 0 ? 'has-items' : ''}`} title="View Shortlist" aria-label="Shortlist">
            <svg
              className="shortlist-heart-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={shortlistCount > 0 ? '#EF4444' : 'none'}
              stroke={shortlistCount > 0 ? '#EF4444' : 'currentColor'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {shortlistCount > 0 && <span className="shortlist-badge">{shortlistCount}</span>}
          </Link>
          <Link to="/#faq" className="login-btn">Login</Link>
          <Link to="/#discover" className="getstarted-btn">Get Started <span aria-hidden="true">→</span></Link>
          <button
            type="button"
            className="hamburger"
            onClick={handleToggle}
            onPointerDown={(e) => e.stopPropagation()}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div className="site-mobile-backdrop" onClick={handleClose} aria-hidden="true" />
          <div className={`mobile-menu ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation Menu">
            <div className="mobile-menu-head">
              <Logo />
              <button type="button" className="mobile-menu-close" onClick={handleClose} aria-label="Close menu">✕</button>
            </div>
            <div className="mobile-menu-search">
              <button onClick={() => { openSearch(); setOpen(false); }} className="mobile-search-trigger">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <span>Search Universities & Degrees</span>
              </button>
            </div>
            <nav className="mobile-nav-links">
              <Link to="/universities" onClick={() => setOpen(false)}>Universities</Link>
              <Link to="/programmes" onClick={() => setOpen(false)}>Programmes</Link>
              <Link to="/shortlist" onClick={() => setOpen(false)} className="mobile-shortlist-link">
                <span>My Shortlist</span>
                {shortlistCount > 0 && <span className="shortlist-badge" style={{ position: 'static' }}>{shortlistCount}</span>}
              </Link>
              <Link to="/compare" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Compare</span>
                {count > 0 && <span className="nav-count" style={{ position: 'static' }}>{count}</span>}
              </Link>
              <Link to="/articles" onClick={() => setOpen(false)}>Articles & Guides</Link>
              <Link to="/#reviews" onClick={() => setOpen(false)}>Reviews</Link>
              <Link to="/#faq" onClick={() => setOpen(false)}>FAQs</Link>
            </nav>
            <div className="mobile-menu-cta-block">
              <Link to="/#faq" className="login-btn mobile-auth-action" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/#discover" className="getstarted-btn mobile-auth-action" onClick={() => setOpen(false)}>Get Started →</Link>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & About */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="atlas-brand-title" style={{ fontSize: 24, color: '#ffffff', letterSpacing: '-0.02em' }}>
                DegreeAtlas<span style={{ color: '#DC2626' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.65, color: '#94A3B8' }}>
              India's student-first discovery portal for accredited online higher education. Explore, compare side by side, and enrol with verified fee transparency and zero spam.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {[
                {
                  label: 'Twitter / X',
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )
                },
                {
                  label: 'LinkedIn',
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  )
                },
                {
                  label: 'YouTube',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )
                },
                {
                  label: 'Instagram',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  )
                }
              ].map((s) => (
                <span
                  key={s.label}
                  title={s.label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#DC2626';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = '#DC2626';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#94A3B8';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {s.svg}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Discover Navigation */}
          <div>
            <h4>Discover Degrees</h4>
            <Link to="/programmes">Explore All Programmes</Link>
            <Link to="/universities">Universities & Colleges</Link>
            <Link to="/articles">Articles & Career Guides</Link>
            <Link to="/#popular">Top Rated Programmes</Link>
            <Link to="/#reviews">Student Testimonials</Link>
          </div>

          {/* Col 3: Popular Disciplines */}
          <div>
            <h4>Top Streams</h4>
            <Link to="/programmes?category=Online MBA">Online MBA</Link>
            <Link to="/programmes?category=Online MCA">Online MCA</Link>
            <Link to="/programmes?category=Online BBA">Online BBA</Link>
            <Link to="/programmes?category=Online BCA">Online BCA</Link>
            <Link to="/programmes?category=Data Science">Data Science & AI</Link>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4>Trust & Regulatory</h4>
            <Link to="/articles/ugc-deb-online-degree-regulations">UGC-DEB Recognition</Link>
            <Link to="/articles/ugc-deb-online-degree-regulations">NAAC Accreditation Guide</Link>
            <Link to="/#faq">Admissions FAQs</Link>
            <Link to="/articles">Privacy & Terms</Link>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <span className="footer-copyright">
            © 2026 DegreeAtlas · A product by{' '}
            <a
              href="https://www.doloyal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="doloyal-link"
            >
              DOLOYAL
            </a>
          </span>
          <span className="footer-locale-tag">INR · Verified UGC-DEB Online Degrees</span>
        </div>
      </div>
    </footer>
  );
}
