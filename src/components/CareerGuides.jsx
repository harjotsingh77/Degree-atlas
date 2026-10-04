import { useState } from 'react';
import { SectionHead } from './Cards.jsx';

export function CareerGuides() {
  const [selectedGuide, setSelectedGuide] = useState(null);

  const guideArticles = [
    {
      id: 'how-to-choose-mba',
      cat: 'Admissions & ROI',
      tag: 'Most Read',
      title: 'How to Choose the Right Online MBA in 2026',
      readTime: '5 min read',
      icon: '🎓',
      summary: 'Fees, electives, ROI outcomes, and 7 mandatory checks before you shortlist your executive or online management degree.',
      takeaways: [
        'Verify UGC-DEB entitlement specifically for the current academic session.',
        'Compare total tuition fees vs semester fees — watch out for hidden exam, LMS & convocation fees.',
        'Choose specialisations with dual-track options (e.g., Marketing + Business Analytics).',
        'Look for live weekend masterclasses from industry practitioners rather than 100% pre-recorded videos.',
        'Evaluate placement support: Check for dedicated job portals, resume reviews, and verified alumni networks.',
      ],
      author: 'Academic Advisory Board',
    },
    {
      id: 'ug-vs-pg-difference',
      cat: 'Career Strategy',
      tag: 'Decision Guide',
      title: 'Online UG vs PG: Understanding the Key Differences',
      readTime: '4 min read',
      icon: '⚖️',
      summary: 'Eligibility criteria, coursework depth, salary potential, and how to decide whether to pursue a master’s or upskill directly.',
      takeaways: [
        'UG degrees (BBA, BCA, B.Com) build core foundational skills over 36 to 48 months following Class 12.',
        'PG degrees (MBA, MCA, M.Com) provide strategic leadership and deep technical specialisations in 24 months.',
        'Working professionals with 2+ years of experience often achieve a 40–60% salary jump after completing an accredited Online MBA/MCA.',
        'UGC regulations confirm that online UG and PG degrees hold full legal equivalence to on-campus degrees for govt jobs and exams (UPSC, SSC, Banking).',
      ],
      author: 'Career Pathways Cell',
    },
    {
      id: 'online-degree-checklist',
      cat: 'Verification Checklist',
      tag: 'Essential Audit',
      title: 'Checklist Before Enrolling in an Online Degree',
      readTime: '6 min read',
      icon: '✅',
      summary: 'Accreditation verification, LMS quality, proctored exams, hidden fee checks, and alumni reviews.',
      takeaways: [
        'Step 1: Check the university name on the official UGC-DEB approved university portal.',
        'Step 2: Verify NAAC accreditation grade (prefer NAAC A, A+ or A++ institutions).',
        'Step 3: Confirm examination methodology (ensure proctored online exams without mandatory physical campus visits).',
        'Step 4: Request a demo of the Learning Management System (LMS) to test mobile app accessibility and lecture quality.',
        'Step 5: Verify flexible no-cost EMI and payment milestone options before submitting registration fees.',
      ],
      author: 'Compliance & Student Advocacy',
    },
  ];

  return (
    <section className="section" id="resources" style={{ background: '#FAF9F6', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <SectionHead
          eyebrow="Career Guidance & Resources"
          title="Expert Articles & Decision Frameworks"
          sub="Empower your education choices with unbiased guides, verified accreditation checklists, and career insights."
        />

        <div className="guides-grid-enhanced">
          {guideArticles.map((g) => (
            <article key={g.id} className="guide-card-modern" onClick={() => setSelectedGuide(g)}>
              <div className="guide-card-top">
                <div className="guide-icon-pill">{g.icon}</div>
                <div className="guide-meta-strip">
                  <span className="guide-cat-badge">{g.cat}</span>
                  <span className="guide-read-time">{g.readTime}</span>
                </div>
              </div>

              <div className="guide-card-body">
                <span className="guide-highlight-tag">{g.tag}</span>
                <h3 className="guide-title">{g.title}</h3>
                <p className="guide-summary">{g.summary}</p>
              </div>

              <div className="guide-card-footer">
                <button
                  type="button"
                  className="guide-read-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGuide(g);
                  }}
                >
                  Read Full Guide <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal for Reading Guide */}
        {selectedGuide && (
          <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedGuide(null)}>
            <div className="modal guide-reader-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <span className="guide-cat-badge" style={{ marginBottom: 4 }}>{selectedGuide.cat}</span>
                  <h3 style={{ fontSize: 20, margin: '6px 0 0', fontWeight: 700 }}>{selectedGuide.title}</h3>
                </div>
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSelectedGuide(null)}
                  aria-label="Close guide reader"
                  style={{ fontSize: 20, padding: 8 }}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body" style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, color: '#6B7280', fontSize: 13.5 }}>
                  <span>Published by: <strong>{selectedGuide.author}</strong></span>
                  <span>•</span>
                  <span>{selectedGuide.readTime}</span>
                </div>

                <p style={{ fontSize: 16, lineHeight: 1.7, color: '#374151', marginBottom: 20 }}>
                  {selectedGuide.summary}
                </p>

                <h4 style={{ fontSize: 16, fontWeight: 700, margin: '20px 0 12px', color: '#111827' }}>
                  Key Recommendations & Actionable Checks:
                </h4>

                <ul style={{ paddingLeft: 20, display: 'grid', gap: 12, color: '#374151', fontSize: 14.5, lineHeight: 1.6 }}>
                  {selectedGuide.takeaways.map((point, i) => (
                    <li key={i}><strong>{point}</strong></li>
                  ))}
                </ul>

                <div style={{ marginTop: 28, padding: 16, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <strong style={{ color: '#991B1B', display: 'block', fontSize: 14 }}>Have questions about accredited programmes?</strong>
                    <span style={{ color: '#7F1D1D', fontSize: 13 }}>Explore verified degrees matching your profile.</span>
                  </div>
                  <a href="#discover" className="btn btn-accent btn-sm" onClick={() => setSelectedGuide(null)} style={{ borderRadius: 9999 }}>
                    Explore Catalog →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
