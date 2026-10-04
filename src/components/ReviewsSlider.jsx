import { useState, useEffect, useRef } from 'react';

export const reviewsData = [
  {
    id: 1,
    name: 'Robert D’Souza',
    ageRole: '28 years old, HR Analyst',
    status: 'Working Professional · Bengaluru',
    photo: '/portraits/robert_dsouza.jpg',
    university: 'Chandigarh University · Online MBA',
    motivationTitle: 'Motivation',
    motivationText: 'Wants to earn an accredited MBA without quitting his analyst job, but does not have time for daily transit and was wary of aggressive sales calls pushing unrecognised diplomas.',
    expectationsTitle: 'Expectations',
    expectationsText: 'Expected transparent semester fees, genuine UGC-DEB entitlement, and a flexible weekend LMS schedule that fits alongside work deliverables for reasonable money.'
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    ageRole: '24 years old, Digital Marketer',
    status: 'Online BBA Graduate · New Delhi',
    photo: '/portraits/ananya_sharma.jpg',
    university: 'Amity University Online · BBA',
    motivationTitle: 'Motivation',
    motivationText: 'Needed a fully recognised business degree while freelancing for international clients, but comparing semester costs and accreditations across portals was exhausting.',
    expectationsTitle: 'Expectations',
    expectationsText: 'Expected side-by-side fee clarity and zero-interest EMI options without being bombarded by telecallers harassing her personal phone number.'
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    ageRole: '29 years old, Backend Engineer',
    status: 'Working Professional · Hyderabad',
    photo: '/portraits/rohan_mehta.jpg',
    university: 'DY Patil University · Online MCA',
    motivationTitle: 'Motivation',
    motivationText: 'Aimed to transition into senior solutions architecture via an AICTE-approved MCA, but needed 100% weekend flexibility and verified curriculum quality.',
    expectationsTitle: 'Expectations',
    expectationsText: 'Expected full syllabus transparency with practical cloud computing electives and exams proctored safely from home.'
  },
  {
    id: 4,
    name: 'Priya Kulkarni',
    ageRole: '26 years old, Brand Strategist',
    status: 'MBA Aspirant · Pune',
    photo: '/portraits/priya_kulkarni.jpg',
    university: 'Manipal University Online · MBA Marketing',
    motivationTitle: 'Motivation',
    motivationText: 'Sought honest university rankings and NAAC A+ verification rather than exaggerated 100% placement guarantees and sponsored agent recommendations.',
    expectationsTitle: 'Expectations',
    expectationsText: 'Expected unbiased university comparisons, real alumni reviews, and direct admission application without paying hidden agent brokerage.'
  },
  {
    id: 5,
    name: 'Vikramaditya Rao',
    ageRole: '32 years old, Tech Lead',
    status: 'Executive Track · Chennai',
    photo: '/portraits/vikramaditya_rao.jpg',
    university: 'BITS Pilani WILP · Executive Tech',
    motivationTitle: 'Motivation',
    motivationText: 'Needed statutory certainty that his distance degree would be legally accepted for state PSC exams, UPSC eligibility, and global WES credential evaluation.',
    expectationsTitle: 'Expectations',
    expectationsText: 'Expected rigorous UGC-DEB verification, NIRF rankings proof, and clear guidelines on degree nomenclature equivalence with on-campus programs.'
  },
  {
    id: 6,
    name: 'Sneha Mukherjee',
    ageRole: '27 years old, Senior Talent Partner',
    status: 'HR Specialization · Kolkata',
    photo: '/portraits/sneha_mukherjee.jpg',
    university: 'Chitkara University · Online MBA',
    motivationTitle: 'Motivation',
    motivationText: 'Wanted an executive-friendly online degree offering interactive masterclasses, peer networking, and scholarship assistance for self-funded working professionals.',
    expectationsTitle: 'Expectations',
    expectationsText: 'Expected seamless comparison between top state private universities and direct enrollment through official university channels.'
  }
];

export default function ReviewsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const total = reviewsData.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx) => {
    setActiveIndex(idx);
  };

  // Autoplay functionality - continuously scrolls every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  return (
    <div
      className="coverflow-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Perspective Stage */}
      <div className="coverflow-stage">
        {reviewsData.map((r, i) => {
          // Calculate circular diff
          let diff = i - activeIndex;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isCenter = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;
          const isFarLeft = diff === -2;
          const isFarRight = diff === 2;
          const isVisible = Math.abs(diff) <= 2;

          let cardClass = 'coverflow-card';
          if (isCenter) cardClass += ' card-center';
          else if (isLeft) cardClass += ' card-left';
          else if (isRight) cardClass += ' card-right';
          else if (isFarLeft) cardClass += ' card-far-left';
          else if (isFarRight) cardClass += ' card-far-right';
          else cardClass += ' card-hidden';

          return (
            <div
              key={r.id}
              className={cardClass}
              onClick={() => {
                if (isLeft) prevSlide();
                if (isRight) nextSlide();
              }}
              style={{
                visibility: isVisible ? 'visible' : 'hidden',
              }}
            >
              {/* Card Header (Photo + Name + Role + University in Red) */}
              <div className="coverflow-card-header">
                <img
                  src={r.photo}
                  alt={r.name}
                  className="coverflow-avatar"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to initials if image load fails
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'grid';
                    }
                  }}
                />
                <div className="coverflow-avatar-fallback" style={{ display: 'none' }}>
                  {r.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="coverflow-header-text">
                  <h3 className="coverflow-name">{r.name}</h3>
                  <div className="coverflow-role">{r.ageRole}</div>
                  <div className="coverflow-uni-text">{r.university}</div>
                </div>
              </div>

              {/* Section 1: Motivation */}
              <div className="coverflow-section">
                <div className="coverflow-label">{r.motivationTitle}</div>
                <p className="coverflow-text">{r.motivationText}</p>
              </div>

              {/* Section 2: Expectations */}
              <div className="coverflow-section">
                <div className="coverflow-label">{r.expectationsTitle}</div>
                <p className="coverflow-text">{r.expectationsText}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="coverflow-controls">
        <button
          className="coverflow-nav-btn prev"
          onClick={prevSlide}
          aria-label="Previous card"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="coverflow-dots">
          {reviewsData.map((_, idx) => (
            <button
              key={idx}
              className={`coverflow-dot-btn ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>

        <button
          className="coverflow-nav-btn next"
          onClick={nextSlide}
          aria-label="Next card"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
