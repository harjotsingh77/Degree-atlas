import { useEffect, useState } from 'react';

export function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear when scrolling past the hero section
      const hero = document.querySelector('.kepler-hero-card') || document.querySelector('.kepler-hero-viewport');
      const threshold = hero ? Math.min(450, hero.offsetHeight * 0.5) : 380;
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHero = () => {
    const hero = document.querySelector('.kepler-hero-viewport') || document.querySelector('.kepler-hero-card');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      className={`scroll-to-top-btn ${visible ? 'visible' : ''}`}
      onClick={scrollToHero}
      aria-label="Scroll back to hero section"
      title="Scroll to top"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
