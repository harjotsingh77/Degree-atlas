import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const STREAM_DISCIPLINES = [
  {
    id: 'business',
    name: 'Business & Management',
    count: 70,
    link: '/programmes?stream=business',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    degreeSummary: 'MBA • BBA • Exec MBA',
  },
  {
    id: 'computers-it',
    name: 'Computer & IT',
    count: 62,
    link: '/programmes?stream=computers-it',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    degreeSummary: 'MCA • BCA • B.Tech / B.Sc',
  },
  {
    id: 'commerce-finance',
    name: 'Commerce & Finance',
    count: 31,
    link: '/programmes?stream=commerce-finance',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    degreeSummary: 'B.Com • M.Com • Banking',
  },
  {
    id: 'data-science-ai',
    name: 'Data Science & AI',
    count: 6,
    link: '/programmes?stream=data-science-ai',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    degreeSummary: 'BS Data Science • AI & ML',
  },
  {
    id: 'humanities',
    name: 'Arts & Humanities',
    count: 16,
    link: '/programmes?stream=humanities',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    degreeSummary: 'MA • BA Hons • Journalism',
  },
];

export function StreamCategories() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 480;
    const offset = direction === 'left' ? -scrollAmount : scrollAmount;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="stream-categories-wrap">
      {/* Section Header with Left/Right Navigation */}
      <div className="stream-categories-head">
        <div className="section-head-wrap" style={{ margin: 0, textAlign: 'left' }}>
          <h2 className="section-title" style={{ margin: '0 0 8px' }}>
            Explore Programmes by Category
          </h2>
          <p className="section-sub" style={{ margin: 0 }}>
            Discover 185+ accredited online degrees across India's most in-demand career streams.
          </p>
        </div>

        {/* Horizontal Navigation Controls */}
        <div className="carousel-nav-arrows" aria-label="Browse categories">
          <button
            type="button"
            className={`carousel-nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
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
            aria-label="Scroll categories right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div 
        className="stream-categories-track" 
        ref={scrollRef} 
        role="region" 
        aria-label="Horizontal list of study categories"
      >
        {STREAM_DISCIPLINES.map((item) => (
          <div
            key={item.id}
            className="stream-discipline-img-card"
            onClick={() => navigate(item.link)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(item.link);
            }}
          >
            {/* Background Discipline Image */}
            <img
              src={item.image}
              alt={item.name}
              className="discipline-card-bg-img"
              loading="lazy"
            />

            {/* Black Frame & Dark Tint Overlay */}
            <div className="discipline-card-overlay" />
            <div className="discipline-black-frame" />

            {/* Center Content: Discipline Name + Hover Programmes Count */}
            <div className="discipline-center-content">
              <h3 className="discipline-center-title">
                {item.name}
              </h3>

              {/* Revealed on hover */}
              <div className="discipline-hover-sub">
                <span className="discipline-hover-count">
                  {item.count} Programmes
                </span>
                <span className="discipline-hover-degrees">
                  {item.degreeSummary}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
