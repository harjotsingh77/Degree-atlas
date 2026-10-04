import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { inr, mbaCurriculum, progBySlug, progFaqs, programmes, uniById, getProgrammeRating } from '../data.js';
import { Breadcrumbs, ProgrammeCard } from '../components/Cards.jsx';
import { Curriculum, EnquiryModal, Faq } from '../components/Widgets.jsx';
import { StarRating } from '../components/StarRating.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { UniversityLogo } from '../components/UniversityLogo.jsx';
import ProgrammeCompareModal, { ProgrammeCompareFloatingTray } from '../components/ProgrammeCompareModal.jsx';
import '../uni-hero.css';

function getProgrammeReviews(prog, uni) {
  const uniName = uni?.short || uni?.name || 'the university';
  const progName = prog?.shortName || prog?.name || 'this programme';

  let hash = 0;
  for (let i = 0; i < (prog.id || '').length; i++) {
    hash = (hash * 31 + prog.id.charCodeAt(i)) >>> 0;
  }

  const reviewPools = [
    [
      {
        name: 'Karan Joshi',
        role: `${progName} · Class of 2024`,
        initials: 'KJ',
        avatarBg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        review: `“The capstone projects and live case studies felt practical and directly aligned with modern business needs at ${uniName}.”`,
      },
      {
        name: 'Meera Sengupta',
        role: `${progName} · Working Professional`,
        initials: 'MS',
        avatarBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        review: `“Weekend live sessions suited my corporate schedule perfectly. Faculty doubt sessions made learning interactive and flexible.”`,
      },
    ],
    [
      {
        name: 'Aakash Verma',
        role: `${progName} · Batch of 2024`,
        initials: 'AV',
        avatarBg: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
        review: `“The curriculum is comprehensive and well-paced. Balancing work and exams was seamless thanks to 24/7 digital LMS access.”`,
      },
      {
        name: 'Pooja Nair',
        role: `${progName} · Verified Graduate`,
        initials: 'PN',
        avatarBg: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
        review: `“Quality academic delivery from experienced faculty. Resume building and interview preparation workshops helped during placement drives.”`,
      },
    ],
    [
      {
        name: 'Rohan Sharma',
        role: `${progName} · Class of 2024`,
        initials: 'RS',
        avatarBg: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
        review: `“Modern syllabus with great real-world industry case studies. Peer discussion groups gave valuable networking opportunities.”`,
      },
      {
        name: 'Sneha Patel',
        role: `${progName} · Working Executive`,
        initials: 'SP',
        avatarBg: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
        review: `“Loved the self-paced flexibility and clear grading criteria. ${uniName}'s academic support team resolved all queries quickly.”`,
      },
    ],
  ];

  return reviewPools[hash % reviewPools.length];
}

export default function ProgrammePage() {
  const { slug } = useParams();
  const prog = progBySlug(slug || 'chitkara-online-mba') || programmes[0];
  const uni = uniById(prog.universityId);
  const reviews = getProgrammeReviews(prog, uni);
  const [spec, setSpec] = useState(prog.specialisations[0] || '');
  const [enquire, setEnquire] = useState(false);
  const [eligOpen, setEligOpen] = useState(false);
  const [progCompareOpen, setProgCompareOpen] = useState(false);
  const [progCompareView, setProgCompareView] = useState('picker');
  const { ids, add, remove, clear } = useCompare();
  const { isShortlisted, toggleShortlist } = useShortlist();
  const on = ids.includes(prog.id);
  const isHearted = isShortlisted(prog.id);

  const handleCompareProgramme = (view = 'picker') => {
    const targetView = typeof view === 'string' && view === 'matrix' ? 'matrix' : 'picker';
    if (!ids.includes(prog.id)) {
      add(prog.id);
    }
    setProgCompareView(targetView);
    setProgCompareOpen(true);
  };

  const semFee = Math.round(prog.feeTotal / 4);
  const related = programmes.filter((p) => p.id !== prog.id && (p.category === prog.category || p.level === prog.level)).slice(0, 4);

  return (
    <main className="container" style={{ paddingBottom: 48 }}>
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Universities', to: '/#discover' }, { label: uni?.name, to: `/universities/${uni?.slug}` }, { label: prog.name }]} />

      <section className="detail-hero">
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', margin: '0 0 8px 0', color: 'var(--navy)', lineHeight: 1.2 }}>{prog.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <StarRating rating={getProgrammeRating(prog.id).rating} count={getProgrammeRating(prog.id).ratingCount} size={15} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14, fontSize: 14, color: '#64748B' }}>
            <span style={{ color: '#DC2626', fontWeight: 800, fontSize: 13.5, letterSpacing: '0.04em' }}>
              {prog.level}
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ fontWeight: 500, color: '#334155' }}>{prog.mode}</span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ fontWeight: 500, color: '#334155' }}>{prog.durationMo} months</span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ fontWeight: 500, color: '#334155' }}>{uni?.naacGrade || 'Verified Degree'}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '14px 0' }}>
            <UniversityLogo id={uni?.id} name={uni?.name} short={uni?.short} size={44} />
            <Link to={`/universities/${uni?.slug}`} style={{ fontWeight: 700, fontSize: 17, color: 'var(--navy)' }}>{uni?.name}</Link>
          </div>
          <p className="muted" style={{ maxWidth: 640 }}>{prog.desc}</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
            <div><div className="muted" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 800 }}>Total Programme Fee</div><strong style={{ fontSize: 24, color: 'var(--navy)' }}>{inr(prog.feeTotal)}</strong></div>
            <div><div className="muted" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 800 }}>Eligibility</div><strong style={{ fontSize: 15, color: '#374151' }}>{prog.eligibilityShort}</strong></div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, alignItems: 'center' }}>
            <button className="btn btn-accent" onClick={() => setEnquire(true)}>Enquire Now</button>
            <a href="#curriculum" className="btn btn-ghost">View Curriculum</a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => toggleShortlist(prog.id)}
              aria-pressed={isHearted}
              title={isHearted ? 'Shortlisted (click to remove)' : 'Shortlist programme'}
              style={{
                borderRadius: 9999,
                fontWeight: 600,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                borderColor: isHearted ? '#F87171' : undefined,
                background: isHearted ? '#FEF2F2' : undefined,
                color: isHearted ? '#DC2626' : undefined,
                transition: 'all 0.2s ease',
              }}
            >
              <svg
                width="16"
                height="16"
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
              className={`btn ${on ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handleCompareProgramme('picker')}
              aria-pressed={on}
              style={{
                borderRadius: 9999,
                fontWeight: 600,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {on ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  ✓ In Comparison (Open)
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  + Add to Compare
                </>
              )}
            </button>
          </div>
          {on && (
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '6px 14px', borderRadius: 9999 }}>
              <span style={{ fontSize: 13, color: '#15803D', fontWeight: 600 }}>✓ Added to comparison ({ids.length}/4)</span>
              <button
                type="button"
                className="link-btn"
                onClick={() => handleCompareProgramme('matrix')}
                style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Compare Now →
              </button>
            </div>
          )}
        </div>
        <div className="card" style={{ padding: 20, alignSelf: 'start', minWidth: 'min(100%, 260px)' }}>
          <strong>Quick information</strong>
          <dl style={{ display: 'grid', gap: 10, marginTop: 12, fontSize: 14 }}>
            <div><dt className="muted">Level</dt><dd style={{ margin: 0, fontWeight: 700 }}>{prog.level} · {prog.category}</dd></div>
            <div><dt className="muted">Duration</dt><dd style={{ margin: 0, fontWeight: 700 }}>{prog.durationMo} months</dd></div>
            <div><dt className="muted">Mode</dt><dd style={{ margin: 0, fontWeight: 700 }}>{prog.mode}</dd></div>
            <div><dt className="muted">Specialisations</dt><dd style={{ margin: 0, fontWeight: 700 }}>{prog.specialisations.length ? `${prog.specialisations.length} options` : '—'}</dd></div>
          </dl>
        </div>
      </section>

      <div className="two-col">
        <div>
          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Programme overview</h2>
            <p className="muted">Curriculum coverage · target audience · career roadmap.</p>
            <div className="prog-overview-grid">
              {[
                {
                  label: 'Covers',
                  desc: 'Core Management, functional electives & hands-on analytics tools.',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                },
                {
                  label: 'Designed for',
                  desc: 'Graduates, early career professionals & mid-level executives.',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                },
                {
                  label: 'What to expect',
                  desc: 'Real-world business case studies, group capstones & mentor reviews.',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                    </svg>
                  ),
                },
              ].map((h) => (
                <div key={h.label} style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <div style={{ marginBottom: 8 }}>{h.icon}</div>
                  <strong style={{ display: 'block', fontSize: 14.5, color: '#0F172A', marginBottom: 2 }}>{h.label}</strong>
                  <div className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>{h.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Fees & payment options</h2>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', margin: '12px 0 6px 0' }}>
              <table className="fee-table" style={{ marginTop: 0, minWidth: 260 }}><thead><tr><th>Component</th><th>Amount</th></tr></thead><tbody>
                <tr><td>Total tuition fee</td><td><strong>{inr(prog.feeTotal)}</strong></td></tr>
                <tr><td>Per semester (×4)</td><td>{inr(semFee)}</td></tr>
                <tr><td>Registration fee</td><td>{inr(5000)}</td></tr>
                <tr><td>Examination fee</td><td>{inr(8000)} total</td></tr>
                <tr><td>EMI / instalments</td><td>Easy semester-wise instalments available with 0% EMI partners</td></tr>
              </tbody></table>
            </div>
            <p className="muted" style={{ fontSize: 13 }}>Tuition, registration and exam charges. For current academic year fee schedule and scholarship criteria, please enquire with our counselors.</p>
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20, borderLeft: '4px solid var(--purple)' }}>
            <h2>Eligibility</h2>
            <ul className="bullets"><li>Required qualification: Recognized Bachelor’s degree in any discipline.</li><li>Minimum marks: 50% aggregate (45% for reserved categories).</li><li>Work experience: Not mandatory; open to fresh graduates and working professionals.</li><li>Verification: Government ID proof & graduation marksheets required.</li></ul>
            <button className="btn btn-primary btn-sm" onClick={() => setEligOpen(!eligOpen)} aria-expanded={eligOpen}>Check Eligibility</button>
            {eligOpen && <div className="card" style={{ padding: 16, marginTop: 12, background: 'var(--bg)' }}><strong>Eligibility checklist:</strong><ul style={{ fontSize: 14, color: 'var(--muted)' }}><li>✓ Bachelor’s degree completed</li><li>✓ 50% marks or equivalent CGPA</li><li>✓ Academic documents ready</li></ul><span className="muted" style={{ fontSize: 12.5 }}>You meet basic criteria — enquire below for counseling and direct enrollment assistance.</span></div>}
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Specialisations {prog.specialisations.length ? `(${prog.specialisations.length})` : ''}</h2>
            {prog.specialisations.length === 0 ? <p className="muted">Standard comprehensive curriculum across all semesters.</p> : (
              <><div className="spec-grid">{prog.specialisations.map((s) => (<div key={s} role="button" tabIndex={0} onClick={() => setSpec(s)} onKeyDown={(e) => e.key === 'Enter' && setSpec(s)} className={`card spec-card ${spec === s ? 'selected' : ''}`} aria-pressed={spec === s}><strong>{s}</strong><div className="muted" style={{ fontSize: 13 }}>Focus areas in {s.toLowerCase()} with live projects & industry case studies.</div></div>))}</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>Selected: <strong>{spec}</strong></div></>
            )}
          </section>

          <section id="curriculum" className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Curriculum — semester-wise</h2><p className="muted" style={{ fontSize: 13.5 }}>Detailed semester-by-semester breakdown designed with industry leaders.</p>
            <div style={{ marginTop: 12 }}><Curriculum data={mbaCurriculum} /></div>
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Learning methodology</h2>
            <div className="learning-experience-grid">
              {[
                {
                  title: 'Digital Modules',
                  desc: 'Weekly self-paced learning modules on 24/7 accessible LMS platform.',
                  bg: '#EFF6FF',
                  color: '#2563EB',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                  ),
                },
                {
                  title: 'Live Lectures',
                  desc: 'Interactive live sessions with faculty plus unlimited recording replays.',
                  bg: '#FAF5FF',
                  color: '#7C3AED',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                    </svg>
                  ),
                },
                {
                  title: 'Graded Assignments',
                  desc: 'Real-world business case analyses and continuous performance evaluations.',
                  bg: '#ECFDF5',
                  color: '#059669',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Proctored Examinations',
                  desc: 'Secure AI-proctored online semester exams from home convenience.',
                  bg: '#FFFBEB',
                  color: '#D97706',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
                {
                  title: 'Expert Mentorship',
                  desc: 'Dedicated faculty office hours, live doubt solving and industry masterclasses.',
                  bg: '#EEF2FF',
                  color: '#4F46E5',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  ),
                },
                {
                  title: 'Student Helpdesk',
                  desc: 'One-on-one student relationship manager and technical helpdesk support.',
                  bg: '#ECFEFF',
                  color: '#0891B2',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  ),
                },
              ].map((t) => (
                <div key={t.title} className="learning-item-card">
                  <div className="learning-icon-box" style={{ background: t.bg, color: t.color }}>
                    {t.icon}
                  </div>
                  <div className="learning-content">
                    <h4 className="learning-item-title">{t.title}</h4>
                    <p className="learning-item-desc">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Career opportunities</h2>
            <p className="muted" style={{ fontSize: 13.5 }}>Top career pathways for graduates.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>{['Business Analyst', 'Marketing Manager', 'Operations Manager', 'Business Development Professional', 'Entrepreneur'].map((r) => (<span key={r} className="badge">{r}</span>))}</div>
            <div className="muted" style={{ fontSize: 13.5, marginTop: 10 }}>Career assistance: Resume building, interview preparation and direct placement drives.</div>
          </section>

          <section className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2>Certificates & additional learning</h2>
            <p className="muted" style={{ fontSize: 14 }}>Includes degree certification, domain specialization certificate, and industry project verification.</p>
          </section>

          <section id="reviews" className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div>
                <h2 style={{ margin: 0 }}>Student reviews</h2>
                <p className="muted" style={{ fontSize: 13.5, margin: '4px 0 0 0' }}>Real feedback from students who enrolled in {prog.name}.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF3C7', padding: '5px 12px', borderRadius: 9999, border: '1px solid #FDE68A' }}>
                <span style={{ color: '#D97706', fontSize: 14, fontWeight: 700 }}>★ 4.9</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>Verified Rating</span>
              </div>
            </div>

            <div className="reviews-grid-container">
              {reviews.map((r) => (
                <div key={r.name} className="student-review-card">
                  <div className="review-card-top">
                    <div className="review-stars-row" aria-label="5 stars">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="review-verified-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified Learner
                    </span>
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

          <section><h2>Related programmes</h2><div className="prog-grid">{related.map((p) => (<ProgrammeCard key={p.id} p={p} />))}</div></section>
          <section style={{ marginTop: 24 }}><h2>FAQs</h2><Faq items={progFaqs} /></section>
        </div>

        <aside className="card side-panel">
          <strong>{inr(prog.feeTotal)}</strong>
          <div className="muted" style={{ fontSize: 13 }}>{prog.durationMo} mo · {prog.mode} · {prog.eligibilityShort}</div>
          <button className="btn btn-accent" onClick={() => setEnquire(true)}>Enquire Now</button>
          <button className="btn btn-ghost" onClick={() => setEnquire(true)}>Request Information</button>
          <button
            type="button"
            className={`btn ${on ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleCompareProgramme('picker')}
            style={{
              width: '100%',
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {on ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                ✓ In Comparison (Open)
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                + Compare Programme
              </>
            )}
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => handleCompareProgramme(ids.length >= 2 ? 'matrix' : 'picker')}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            {ids.length >= 2 ? 'Open side-by-side comparison →' : 'Choose programmes to compare →'}
          </button>
        </aside>
      </div>

      <section><div className="final-cta"><h2 className="section-title">Have questions about this programme?</h2><div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}><button className="btn btn-accent" onClick={() => setEnquire(true)}>Enquire Now</button><button className="btn btn-ghost" onClick={() => setEnquire(true)}>Request Information</button><button className="btn btn-ghost" onClick={() => handleCompareProgramme(ids.length >= 2 ? 'matrix' : 'picker')}>Compare Programme</button></div></div></section>

      <div className="sticky-cta"><button className="btn btn-ghost btn-sm" onClick={() => handleCompareProgramme(ids.length >= 2 ? 'matrix' : 'picker')}>Compare ({ids.length})</button><button className="btn btn-accent btn-sm" onClick={() => setEnquire(true)}>Enquire Now</button></div>
      <EnquiryModal open={enquire} onClose={() => setEnquire(false)} programmeName={prog.name} />

      {/* Programme Compare Modal Window (like University Compare) */}
      <ProgrammeCompareModal
        isOpen={progCompareOpen}
        onClose={() => setProgCompareOpen(false)}
        currentProg={prog}
        selectedIds={ids}
        onAdd={add}
        onRemove={remove}
        onClear={clear}
        initialView={progCompareView}
        onEnquire={(pName) => {
          setEnquire(true);
        }}
      />

      {/* Floating comparison dock (when modal is closed) */}
      {!progCompareOpen && (
        <ProgrammeCompareFloatingTray
          selectedIds={ids}
          onRemove={remove}
          onClear={clear}
          onOpenModal={(view) => handleCompareProgramme(view)}
        />
      )}
    </main>
  );
}
