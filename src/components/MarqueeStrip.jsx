export function MarqueeStrip() {
  const items = [
    'Empower Yourself Through Learning',
    'Discover, Learn, Achieve Success',
    'Learn Anytime, Anywhere',
    '100% UGC-Entitled Online Degrees',
    'Top NAAC A+ Accredited Universities',
    'Accelerate Your Career with DegreeAtlas',
    'Affordable Flexible Learning for All',
    'Global Career Opportunities',
  ];

  // Repeat items for seamless, continuous infinite loop
  const repeated = [...items, ...items];

  return (
    <div className="marquee-strip-wrapper" aria-label="Learning highlights ticker">
      <div className="marquee-track">
        {repeated.map((text, idx) => (
          <span key={idx} className="marquee-item">
            <svg
              className="marquee-bolt"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="marquee-text">{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
