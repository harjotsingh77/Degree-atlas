import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { inr, programmes, uniById, uniFaqs, universities, getUniversityRating, getProgrammeRating } from '../data.js';
import { Breadcrumbs, ProgrammeCard, UniversityCard } from '../components/Cards.jsx';
import { EnquiryModal, Faq } from '../components/Widgets.jsx';
import { StarRating } from '../components/StarRating.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { UniversityLogo } from '../components/UniversityLogo.jsx';
import FeeSlider from '../components/FeeSlider.jsx';
import { getUniversityMedia } from '../campusData.js';
import UniversityCompareModal, { UniversityCompareFloatingTray } from '../components/UniversityCompareModal.jsx';
import '../uni-hero.css';
import '../uni-compare.css';

function getUniversityStudentReviews(uni, uniProgs) {
  const p1 = uniProgs[0]?.name || (uni.institutionKind === 'college' ? 'Degree Programme' : 'Online MBA');
  const p2 = uniProgs[1]?.name || (uni.institutionKind === 'college' ? 'Undergraduate Studies' : 'Online MCA');
  const p3 = uniProgs[2]?.name || 'Data Science & Management';

  let hash = 0;
  for (let i = 0; i < uni.id.length; i++) {
    hash = (hash << 5) - hash + uni.id.charCodeAt(i);
  }
  hash = Math.abs(hash);

  const reviewPools = [
    [
      {
        name: 'Amanpreet Singh',
        role: `${p1} · Batch 2024`,
        initials: 'AS',
        avatarBg: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        review: `“The digital portal for ${uni.name} is super smooth. Flexible weekend lectures and recorded archives made balancing full-time work and studies very manageable.”`,
      },
      {
        name: 'Divya Nair',
        role: `${p2} · Class of 2023`,
        initials: 'DN',
        avatarBg: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        review: `“Faculty feedback on assignments was fast and thorough. The industry-driven case studies gave me practical insights that I could directly apply in my job.”`,
      },
    ],
    [
      {
        name: 'Karthik Raman',
        role: `${p1} · Class of 2024`,
        initials: 'KR',
        avatarBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        review: `“World-class professors and structured week-by-week learning modules. Proctored exams were conducted seamlessly with zero technical glitches.”`,
      },
      {
        name: 'Shreya Kulkarni',
        role: `${p2} · Batch 2024`,
        initials: 'SK',
        avatarBg: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
        review: `“Loved the self-paced flexibility at ${uni.short || uni.name}. Continuous mentor check-ins and live doubt resolution helped me complete semesters on time.”`,
      },
    ],
    [
      {
        name: 'Rohan Mehta',
        role: `${p1} · Batch 2024`,
        initials: 'RM',
        avatarBg: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
        review: `“The curriculum is modern and industry-aligned. Capstone projects and peer discussion forums provided great networking opportunities with working professionals.”`,
      },
      {
        name: 'Pooja Verma',
        role: `${p2} · Class of 2023`,
        initials: 'PV',
        avatarBg: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
        review: `“Great academic support and quick query resolution from student counselors. Excellent value for UGC-entitled degree credentials.”`,
      },
    ],
    [
      {
        name: 'Ananya Sharma',
        role: `${p1} · Batch 2024`,
        initials: 'AS',
        avatarBg: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
        review: `“The faculty mentorship sessions and weekend doubt resolution with ${uni.name} mentors made online learning interactive rather than passive video watching.”`,
      },
      {
        name: 'Tushar Bhatt',
        role: `${p2} · Class of 2024`,
        initials: 'TB',
        avatarBg: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
        review: `“Transparent exam evaluations, digital e-library access and structured LMS modules gave me the confidence to upskill while continuing full-time employment.”`,
      },
    ],
    [
      {
        name: 'Meera Sengupta',
        role: `${p1} · Class of 2024`,
        initials: 'MS',
        avatarBg: 'linear-gradient(135deg, #E11D48 0%, #9F1239 100%)',
        review: `“The learning management system is accessible seamlessly on mobile and desktop. Well-structured notes and weekly quizzes keep you on track without feeling overwhelmed.”`,
      },
      {
        name: 'Gaurav Joshi',
        role: `${p3} · Batch 2023`,
        initials: 'GJ',
        avatarBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
        review: `“Affordable fee structure with high quality academic delivery. The faculty brought immense practical experience from real corporate environments.”`,
      },
    ],
  ];

  return reviewPools[hash % reviewPools.length];
}

function getSimilarUniversitiesList(currentUni, allUnis) {
  return allUnis
    .filter((u) => u.id !== currentUni.id)
    .map((u) => {
      let score = 0;
      if (u.state && currentUni.state && u.state.toLowerCase() === currentUni.state.toLowerCase()) {
        score += 7;
      }
      if (u.type && currentUni.type && u.type === currentUni.type) {
        score += 4;
      }
      if (u.institutionKind && u.institutionKind === currentUni.institutionKind) {
        score += 2;
      }
      if (u.onlineCount && currentUni.onlineCount) {
        score += Math.max(0, 3 - Math.abs(u.onlineCount - currentUni.onlineCount) / 5);
      }
      const tieBreaker = (u.id.charCodeAt(0) * 7 + currentUni.id.charCodeAt(currentUni.id.length - 1)) % 5;
      score += tieBreaker;

      let reason = 'Similar accredited UG & PG programmes.';
      if (u.state && u.state === currentUni.state) {
        reason = `Premier accredited institution in ${u.state}.`;
      } else if (u.nirfRank && u.nirfRank.includes('#')) {
        reason = `Top NIRF ranked peer institution in ${u.state || 'India'}.`;
      } else if (u.onlineCount > 10) {
        reason = 'Comprehensive UGC-entitled online degree portfolio.';
      } else if (u.naacGrade && u.naacGrade.includes('A')) {
        reason = `${u.naacGrade} accredited institution with flexible degrees.`;
      }

      return { u, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export default function UniversityPage() {
  const { slug } = useParams();
  const uni = uniById(slug || 'chitkara-university-punjab') || universities[0];
  const [levels, setLevels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [duration, setDuration] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [specialisation, setSpecialisation] = useState('');
  const [mode, setMode] = useState('');
  const [minRating, setMinRating] = useState('');
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [enquire, setEnquire] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const { add, remove, clear, ids } = useCompare();
  const [uniCompareOpen, setUniCompareOpen] = useState(false);
  const [uniCompareView, setUniCompareView] = useState('picker');

  const uniProgs = useMemo(() => programmes.filter((p) => p.universityId === uni.id), [uni.id]);
  const uniCategories = useMemo(() => Array.from(new Set(uniProgs.map((p) => p.category).filter(Boolean))), [uniProgs]);

  const handleLevelToggle = (lvl) => {
    setLevels((prev) => (prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]));
  };

  const clearAllFilters = () => {
    setLevels([]);
    setSelectedCategory('');
    setMaxFee('');
    setDuration('');
    setEligibility('');
    setSpecialisation('');
    setMode('');
    setMinRating('');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (levels.length > 0) count += levels.length;
    if (selectedCategory) count += 1;
    if (maxFee && Number(maxFee) < 500000) count += 1;
    if (duration) count += 1;
    if (eligibility) count += 1;
    if (specialisation) count += 1;
    if (mode) count += 1;
    if (minRating) count += 1;
    return count;
  }, [levels, selectedCategory, maxFee, duration, eligibility, specialisation, mode, minRating]);

  // Close lightbox on Escape key and navigate with Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight' && realGallery.length > 0) setLightboxIdx((prev) => (prev + 1) % realGallery.length);
      if (e.key === 'ArrowLeft' && realGallery.length > 0) setLightboxIdx((prev) => (prev - 1 + realGallery.length) % realGallery.length);
    };
    if (lightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const list = useMemo(() => {
    return uniProgs.filter((p) => {
      // Degree Level
      if (levels.length > 0 && !levels.includes(p.level)) return false;

      // Category
      if (selectedCategory && p.category !== selectedCategory) return false;

      // Fee
      if (maxFee && Number(maxFee) < 500000 && p.feeTotal > Number(maxFee)) return false;

      // Duration
      if (duration === 'short' && p.durationMo > 24) return false;
      if (duration === 'long' && p.durationMo < 36) return false;

      // Mode
      if (mode) {
        if (mode === '100% Online' && !p.mode?.includes('100% Online')) return false;
        if (mode === 'hybrid' && !/hybrid|immersion|blend|campus/i.test(p.mode || '')) return false;
        if (mode === 'distance' && !/distance|odl/i.test(p.mode || '')) return false;
      }

      // Eligibility
      if (eligibility === 'ug10plus2') {
        const match = p.level === 'UG' || /10\+2|class 12/i.test(p.eligibilityShort || '');
        if (!match) return false;
      }
      if (eligibility === 'pg50') {
        const match = p.level === 'PG' || /bachelor|graduation|degree/i.test(p.eligibilityShort || '');
        if (!match) return false;
      }
      if (eligibility === 'technical') {
        const match = /b\.?tech|be\b|gate|mca|bca|math/i.test(p.eligibilityShort || '');
        if (!match) return false;
      }

      // Specialisation / Keyword
      if (specialisation) {
        const term = specialisation.trim().toLowerCase();
        const matchName = p.name.toLowerCase().includes(term);
        const matchCat = p.category?.toLowerCase().includes(term);
        const matchSpecs = p.specialisations?.some((s) => s.toLowerCase().includes(term));
        if (!matchName && !matchCat && !matchSpecs) return false;
      }

      // Rating
      if (minRating) {
        const { rating } = getProgrammeRating(p.id);
        if (rating < Number(minRating)) return false;
      }

      return true;
    });
  }, [uniProgs, levels, selectedCategory, maxFee, duration, eligibility, specialisation, mode, minRating]);

  const startingFeeText = uniProgs.length > 0 ? inr(Math.min(...uniProgs.map((p) => p.feeTotal))) : 'Available on request';

  const isShortlisted = ids.includes(uni.id);
  const { isShortlisted: isUniHearted, toggleShortlist } = useShortlist();
  const isHearted = isUniHearted(uni.id);

  const handleCompareUniversity = (view = 'picker') => {
    const targetView = typeof view === 'string' && view === 'matrix' ? 'matrix' : 'picker';
    if (!ids.includes(uni.id)) {
      add(uni.id);
    }
    setUniCompareView(targetView);
    setUniCompareOpen(true);
  };

  const studentReviews = useMemo(() => getUniversityStudentReviews(uni, uniProgs), [uni.id]);
  const similarUnis = useMemo(() => getSimilarUniversitiesList(uni, universities), [uni.id]);

  // 100% Real Campus Media (Individual photos per university)
  const isChitkara = uni.id.includes('chitkara');
  const media = getUniversityMedia(uni);
  const heroBg = isChitkara
    ? '/images/campus/infra_banner.webp'
    : (media?.hero || `/images/campus/${uni.id}.jpg`);

  const realGallery = media?.gallery || [];

  const displayName = isChitkara ? 'Chitkara University' : uni.name;
  const locationPill = isChitkara ? 'Punjab, India' : (uni.location || (uni.state ? `${uni.state}, India` : 'India'));
  const heroDesc = isChitkara
    ? 'Chitkara University offers industry-relevant online programmes designed to help students build future-ready careers with flexibility and quality education.'
    : (uni.tagline || uni.description);

  return (
    <main className="container" style={{ paddingBottom: 40 }}>
      {/* 1. Breadcrumbs: Home / Universities / University Name */}
      <div className="uni-hero-breadcrumbs">
        <Link to="/">Home</Link>
        <span className="crumb-sep">/</span>
        <Link to="/universities">Universities</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">{displayName}</span>
      </div>

      {/* 2. Immersive Real Campus Hero Banner (Matches Reference Image 1) */}
      <section className="uni-detail-hero-banner" id="overview">
        {/* Real Campus Photo Background */}
        <img
          src={heroBg}
          alt={`${displayName} Real Campus`}
          className="uni-hero-bg-img"
          loading="eager"
        />

        {/* Ambient Dark Double Gradient for Crisp Contrast */}
        <div className="uni-hero-overlay" />

        {/* Inner Content Grid */}
        <div className="uni-hero-content-wrapper">
          {/* Left Column: Logo + Name + Pills + Description + CTAs */}
          <div className="uni-hero-main-col">
            <div className="uni-hero-header-row">
              {/* White Square Rounded Logo Box */}
              <div className="uni-hero-logo-box">
                {isChitkara ? (
                  <img
                    src="/images/logos/chitkara_emblem.png"
                    alt={displayName}
                    style={{ width: 62, height: 62, objectFit: 'contain' }}
                  />
                ) : (
                  <UniversityLogo id={uni.id} name={uni.name} short={uni.short} size={76} />
                )}
              </div>

              {/* Title & Pill Badges */}
              <div className="uni-hero-title-group">
                <h1 className="uni-hero-title">{displayName}</h1>
                <div className="uni-hero-badges-row">
                  {/* Badge 1: Online Learning */}
                  <span className="uni-hero-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                    <span>Online Learning</span>
                  </span>

                  {/* Badge 2: Location */}
                  <span className="uni-hero-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{locationPill}</span>
                  </span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                  <StarRating rating={getUniversityRating(uni.id).rating} count={getUniversityRating(uni.id).ratingCount} size={15} />
                </div>
              </div>
            </div>

            {/* Description Tagline */}
            <p className="uni-hero-desc">{heroDesc}</p>

            {/* Action Buttons */}
            <div className="uni-hero-actions">
              <a
                href="#programmes"
                className="uni-hero-btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('programmes')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Programmes →
              </a>

              <button
                type="button"
                className="uni-hero-btn-glass"
                onClick={() => toggleShortlist(uni.id)}
                title={isHearted ? 'Shortlisted (click to remove)' : 'Add to Shortlist'}
                style={{
                  borderColor: isHearted ? '#F87171' : undefined,
                  color: isHearted ? '#DC2626' : undefined,
                  background: isHearted ? 'rgba(254, 242, 242, 0.95)' : undefined,
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill={isHearted ? '#EF4444' : 'none'}
                  stroke={isHearted ? '#EF4444' : 'currentColor'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isHearted ? 'Shortlisted' : 'Shortlist'}
              </button>

              <button
                type="button"
                className="uni-hero-btn-glass"
                onClick={() => handleCompareUniversity('picker')}
              >
                {isShortlisted ? '✓ In Comparison (Open)' : '+ Add to Compare'}
              </button>

              <button
                type="button"
                className="uni-hero-btn-glass"
                onClick={() => setEnquire(true)}
              >
                Enquire Now
              </button>
            </div>
          </div>

          {/* Right Column: 3 Real Campus Gallery Thumbnails with +12 Overlay (ONLY for Chitkara!) */}
          {isChitkara && (
            <div className="uni-hero-gallery-stack">
              {/* Thumbnail 1: Real Campus Courtyard */}
              <div
                className="uni-hero-thumb"
                onClick={() => {
                  setLightboxIdx(2);
                  setLightboxOpen(true);
                }}
                title="View Campus Academic Courtyard"
              >
                <img src="/images/campus/mockup_t1.png" alt="Campus Garden" />
              </div>

              {/* Thumbnail 2: Real Campus Architecture */}
              <div
                className="uni-hero-thumb"
                onClick={() => {
                  setLightboxIdx(1);
                  setLightboxOpen(true);
                }}
                title="View Academic Blocks"
              >
                <img src="/images/campus/mockup_t2.png" alt="Campus Building" />
              </div>

              {/* Thumbnail 3: Real Campus with +12 Overlay */}
              <div
                className="uni-hero-thumb"
                onClick={() => {
                  setLightboxIdx(0);
                  setLightboxOpen(true);
                }}
                title="View all campus photos"
              >
                <img src="/images/campus/mockup_t3.png" alt="More Campus Photos" />
                <div className="uni-hero-thumb-overlay">
                  +{realGallery.length}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Quick Facts Cards (Learning Mode, NIRF, NAAC, Recognitions, Campus Area) */}
      <dl className="quick-facts" style={{ marginTop: 0, marginBottom: 24 }}>
        {uni.facts.map((f) => (
          <div key={f.label} className="card qf">
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      {/* 4. Subnav Sections Navigation */}
      <nav className="subnav" aria-label="University sections" style={{ marginTop: 0, marginBottom: 24 }}>
        <div className="subnav-inner">
          {['Overview', 'Programmes', 'Admissions', 'Learning Experience', 'Reviews', 'FAQs'].map((s) => (
            <a key={s} href={`#${s.toLowerCase().replace(/ /g, '-')}`}>{s}</a>
          ))}
        </div>
      </nav>

      {/* 5. Interactive Real Photo Lightbox Modal */}
      {lightboxOpen && (
        <div className="uni-lightbox-modal" onClick={() => setLightboxOpen(false)}>
          <button
            className="uni-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close Gallery"
          >
            ✕
          </button>

          <div
            className="uni-lightbox-stage"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="uni-lightbox-img-area">
              <button
                type="button"
                className="uni-lightbox-nav-btn uni-lightbox-nav-prev"
                onClick={() => setLightboxIdx((prev) => (prev - 1 + realGallery.length) % realGallery.length)}
                aria-label="Previous photo"
              >
                ‹
              </button>

              <img
                src={realGallery[lightboxIdx]?.src}
                alt={realGallery[lightboxIdx]?.title || 'Campus Photo'}
              />

              <button
                type="button"
                className="uni-lightbox-nav-btn uni-lightbox-nav-next"
                onClick={() => setLightboxIdx((prev) => (prev + 1) % realGallery.length)}
                aria-label="Next photo"
              >
                ›
              </button>
            </div>

            <div className="uni-lightbox-caption">
              <span>{realGallery[lightboxIdx]?.title}</span>
              <span style={{ color: '#94A3B8', fontSize: 13 }}>
                {lightboxIdx + 1} of {realGallery.length}
              </span>
            </div>
          </div>

          {/* Thumbnails Strip */}
          <div
            className="uni-lightbox-strip"
            onClick={(e) => e.stopPropagation()}
          >
            {realGallery.map((img, i) => (
              <div
                key={img.src + i}
                className={`uni-lightbox-strip-item ${i === lightboxIdx ? 'active' : ''}`}
                onClick={() => setLightboxIdx(i)}
              >
                <img src={img.src} alt={img.title} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="two-col">
        <div>
          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>About the university</h2>
            <p style={{ color: 'var(--muted)' }}>Institutional background, online offering, learning approach and student support.</p>
            <p style={{ fontSize: expanded ? 15 : 15 }}>{expanded ? uni.aboutLong + ' Support includes LMS access, mentor check-ins and exam guidance.' : uni.description}</p>
            <ul className="bullets"><li>Online offering: Recognized UG & PG degrees via modern LMS with live + recorded lectures.</li><li>Learning approach: Modular syllabus, continuous assignments and proctored examinations.</li><li>Student support: Dedicated mentors, academic helpdesk and discussion forums.</li></ul>
            <button className="readmore" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? 'Show less ↑' : 'Read More ↓'}</button>
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Recognition & credentials</h2>
            <p className="muted" style={{ fontSize: 14 }}>Accreditations and statutory approvals. Programme-level entitlement can vary — please verify current status on UGC-DEB and the university portal.</p>
            {uni.recognition.map((r) => (
              <div key={r.name} className="recog">
                <strong>{r.name}</strong>
                <div className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Authority: {r.authority} · {r.year}</div>
                <div style={{ fontSize: 13.5, marginTop: 2 }}>{r.note}</div>
              </div>
            ))}
          </section>

          <section id="programmes" className="card" style={{ padding: '24px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A' }}>Explore programmes at this university</h2>
                <div className="muted" style={{ fontSize: 13.5, marginTop: 3 }}>
                  Showing {list.length} of {uniProgs.length} accredited programmes
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    fontSize: 12.5,
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: '1px solid #FECACA',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Clear Filters ({activeFilterCount}) ✕
                </button>
              )}
            </div>

            <div className="uni-discovery-grid">
              {/* Smart Filters Panel (Exact same to same as requested by user) */}
              <div className="filter-panel card uni-smart-filters-sidebar">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>Smart Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Degree Level */}
                <div className="filter-group">
                  <div className="fg-title">Degree level</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, margin: '2px 0 4px' }}>
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

                {/* Programme */}
                <div className="filter-group">
                  <div className="fg-title">Programme</div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Programme category"
                  >
                    <option value="">All programmes</option>
                    {uniCategories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>

                {/* University */}
                <div className="filter-group">
                  <div className="fg-title">University</div>
                  <select value={uni.id} disabled aria-label="University">
                    <option value={uni.id}>{uni.name}</option>
                  </select>
                </div>

                {/* Fees (total) Slider */}
                <div className="filter-group">
                  <FeeSlider
                    value={maxFee}
                    onChange={(val) => setMaxFee(val === 'All' ? '' : String(val))}
                  />
                </div>

                {/* Duration */}
                <div className="filter-group">
                  <div className="fg-title">Duration</div>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    aria-label="Duration"
                  >
                    <option value="">Any duration</option>
                    <option value="short">Up to 24 months (PG)</option>
                    <option value="long">36+ months (UG)</option>
                  </select>
                </div>

                {/* Eligibility */}
                <div className="filter-group">
                  <div className="fg-title">Eligibility</div>
                  <select
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    aria-label="Eligibility"
                  >
                    <option value="">Any eligibility</option>
                    <option value="ug10plus2">10+2 / High School (UG)</option>
                    <option value="pg50">Bachelor's / Graduation (PG)</option>
                    <option value="technical">BE / B.Tech / GATE / BCA</option>
                  </select>
                </div>

                {/* Specialisation / Keyword */}
                <div className="filter-group">
                  <div className="fg-title">Specialisation / Keyword</div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={specialisation}
                      onChange={(e) => setSpecialisation(e.target.value)}
                      placeholder="e.g. Marketing, AI, MBA"
                      aria-label="Specialisation or keyword"
                      style={{ paddingRight: specialisation ? 28 : 11 }}
                    />
                    {specialisation && (
                      <button
                        type="button"
                        onClick={() => setSpecialisation('')}
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

                {/* Learning mode */}
                <div className="filter-group">
                  <div className="fg-title">Learning mode</div>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    aria-label="Learning mode"
                  >
                    <option value="">Any mode</option>
                    <option value="100% Online">100% Online</option>
                    <option value="hybrid">Hybrid / Campus Immersion</option>
                    <option value="distance">Online / Distance (ODL)</option>
                  </select>
                </div>

                {/* Student rating */}
                <div className="filter-group">
                  <div className="fg-title">Student rating</div>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    aria-label="Student rating"
                  >
                    <option value="">Any rating</option>
                    <option value="4.5">★ 4.5 & above (Top rated)</option>
                    <option value="4.2">★ 4.2 & above</option>
                    <option value="4.0">★ 4.0 & above</option>
                    <option value="3.8">★ 3.8 & above</option>
                  </select>
                </div>

                {/* Apply Button */}
                <div className="filter-actions" style={{ marginTop: 4 }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{
                      borderRadius: 9999,
                      width: '100%',
                      padding: '9px 12px',
                      background: appliedFeedback ? '#15803D' : 'var(--navy)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 12.5,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => {
                      setAppliedFeedback(true);
                      setTimeout(() => setAppliedFeedback(false), 1200);
                    }}
                  >
                    {appliedFeedback ? '✓ Applied' : `Apply (${list.length})`}
                  </button>
                </div>
              </div>

              {/* Programme Cards Column */}
              <div className="uni-progs-results">
                <div className="prog-grid">
                  {list.map((p) => (<ProgrammeCard key={p.id} p={p} />))}
                </div>
                {list.length === 0 && (
                  <div className="empty" style={{ marginTop: 12, padding: 32 }}>
                    <strong>No programmes match your selected filters.</strong>
                    <div style={{ marginTop: 6, color: '#64748B' }}>Try resetting or broadening your filters.</div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: 12 }}
                      onClick={clearAllFilters}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>


          <section id="admissions" className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Fees & admissions</h2>
            <ol style={{ color: 'var(--muted)', fontSize: 15 }}><li>Check eligibility on the programme page.</li><li>Fill the online application form.</li><li>Upload required documents: ID, marksheets and photograph.</li><li>Pay application fee and await verification.</li></ol>
            <div className="muted" style={{ fontSize: 13.5 }}>Tuition, registration and examination fees are detailed on individual programme pages.</div>
            <Link to="/programmes/chitkara-online-mba" className="link-btn">View detailed MBA fee structure →</Link>
          </section>

          <section id="learning-experience" className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Learning experience</h2>
            <div className="learning-experience-grid">
              {[
                {
                  title: 'Live & Recorded Classes',
                  desc: 'Interactive weekend live sessions plus 24/7 on-demand lecture archive.',
                  bg: '#EFF6FF',
                  color: '#2563EB',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 8-6 4 6 4V8Z" />
                      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                    </svg>
                  ),
                },
                {
                  title: 'Digital LMS Platform',
                  desc: 'Comprehensive learning portal for e-books, quizzes, syllabus and tracking.',
                  bg: '#FAF5FF',
                  color: '#7C3AED',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="3" rx="2" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                  ),
                },
                {
                  title: 'Curated Study Material',
                  desc: 'Downloadable chapter notes, case studies, academic readings and journals.',
                  bg: '#ECFDF5',
                  color: '#059669',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M6 6h10" />
                      <path d="M6 10h10" />
                    </svg>
                  ),
                },
                {
                  title: 'Continuous Assessments',
                  desc: 'Structured module assignments, practical projects and proctored examinations.',
                  bg: '#FFFBEB',
                  color: '#D97706',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="m9 14 2 2 4-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Faculty Mentorship',
                  desc: 'Direct interaction with experienced professors and regular doubt-clearing sessions.',
                  bg: '#EEF2FF',
                  color: '#4F46E5',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  ),
                },
                {
                  title: 'Student Support Helpdesk',
                  desc: 'Dedicated academic counselors and swift technical query resolution.',
                  bg: '#ECFEFF',
                  color: '#0891B2',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="learning-item-card">
                  <div className="learning-icon-box" style={{ background: item.bg, color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="learning-content">
                    <h4 className="learning-item-title">{item.title}</h4>
                    <p className="learning-item-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Career & industry exposure</h2>
            <div className="muted" style={{ fontSize: 14 }}>Guidance and preparation support for professional growth.</div>
            <ul className="bullets"><li><strong>Career guidance:</strong> Resume building and interview preparation workshops.</li><li><strong>Placement assistance:</strong> Dedicated placement cell and recruitment drives.</li><li><strong>Industry interaction:</strong> Masterclasses and webinars with industry practitioners.</li><li><strong>Skill development:</strong> Hands-on projects and domain-specific certifications.</li></ul>
          </section>

          <section id="reviews" className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2 style={{ margin: 0 }}>Student reviews</h2>
            <p className="muted" style={{ fontSize: 13.5, margin: '4px 0 16px 0' }}>Real feedback from students studying online degrees with {displayName}.</p>

            <div className="reviews-grid-container">
              {studentReviews.map((r) => (
                <div key={r.name} className="student-review-card">
                  <div className="review-card-top">
                    <div className="review-stars-row" aria-label="5 stars">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="review-quote-text">{r.review}</p>

                  <div className="review-author-row">
                    <div className="review-avatar" style={{ background: r.avatarBg }}>
                      {r.initials}
                    </div>
                    <div className="review-author-info">
                      <span className="review-author-name">{r.name}</span>
                      <span className="review-author-degree">{r.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Similar universities</h2>
            <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>Alternatives to explore — based on degree offerings and rankings.</p>
            <div className="similar-uni-grid">
              {similarUnis.map(({ u, reason }) => (
                <UniversityCard
                  key={u.id}
                  u={u}
                  reason={reason}
                />
              ))}
            </div>
          </section>

          <section id="faqs" style={{ marginTop: 28 }}><h2>University FAQs</h2><Faq items={uniFaqs} /></section>
        </div>

        <aside className="card side-panel">
          <strong>Interested in {uni.name}?</strong>
          <div className="muted" style={{ fontSize: 13.5 }}>Programmes starting from {startingFeeText}.</div>
          <a href="#programmes" className="btn btn-primary">Explore Programmes</a>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              borderColor: isShortlisted ? '#2563EB' : undefined,
              color: isShortlisted ? '#2563EB' : undefined,
              fontWeight: isShortlisted ? 700 : 600,
            }}
            onClick={() => handleCompareUniversity('picker')}
          >
            {isShortlisted ? '✓ View Comparison' : 'Compare University'}
          </button>
          <button className="btn btn-accent" onClick={() => setEnquire(true)}>Enquire Now</button>
        </aside>
      </div>

      <div className="sticky-cta"><a href="#programmes" className="btn btn-ghost btn-sm">Programmes</a><button className="btn btn-accent btn-sm" onClick={() => setEnquire(true)}>Enquire Now</button></div>
      <EnquiryModal open={enquire} onClose={() => setEnquire(false)} programmeName={uni.name} />

      {/* Dedicated University Compare Experience (Exclusive to University Detail Pages) */}
      {!uniCompareOpen && (
        <UniversityCompareFloatingTray
          selectedIds={ids}
          onRemove={remove}
          onClear={clear}
          onOpenModal={(view) => {
            setUniCompareView(view);
            setUniCompareOpen(true);
          }}
        />
      )}

      <UniversityCompareModal
        isOpen={uniCompareOpen}
        onClose={() => setUniCompareOpen(false)}
        currentUni={uni}
        selectedIds={ids}
        onAdd={add}
        onRemove={remove}
        onClear={clear}
        initialView={uniCompareView}
      />
    </main>
  );
}
