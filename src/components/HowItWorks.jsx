import { SectionHead } from './Cards.jsx';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Discover & Filter Degrees',
      desc: 'Filter 185+ accredited online UG & PG degrees by semester budget, duration, university, and in-demand specialisations.',
      keyPoints: ['185+ UG & PG degrees', 'Budget & duration filters'],
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Verify Approvals & NAAC',
      desc: 'Zero fake claims. Check official UGC-DEB entitlement, NIRF rankings, and NAAC A+/A++ accreditations verified from central directories.',
      keyPoints: ['100% UGC-DEB entitled', 'NAAC A+/A++ verified'],
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(220, 38, 38, 0.08)" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Evaluate True Fees & LMS',
      desc: 'Transparent semester tuition fees, examination costs, live weekend mentorship hours, and LMS features with zero agent bias.',
      keyPoints: ['Complete fee breakdown', 'Zero telecaller spam'],
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="3" fill="rgba(220, 38, 38, 0.06)" />
          <line x1="7" y1="16" x2="7" y2="12" />
          <line x1="12" y1="16" x2="12" y2="9" />
          <line x1="17" y1="16" x2="17" y2="13" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Apply with Scholarships',
      desc: 'Connect directly to official university application portals. Unlock merit scholarships, corporate discounts, and 0% interest EMI.',
      keyPoints: ['Direct university portals', '0% interest EMI & aid'],
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="rgba(220, 38, 38, 0.08)" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section" id="how-it-works" style={{ background: '#FAF9F6', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <SectionHead
          eyebrow="Guided Evaluation Process"
          title="How DegreeAtlas Works For You"
          sub="Find and verify your online university degree in four transparent, unbiased steps without telecaller spam."
        />

        <div className="steps-container">
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-card-accent-bar" aria-hidden="true" />
                <span className="step-watermark-num" aria-hidden="true">{step.num}</span>

                <div className="step-top-row">
                  <div className="step-icon-wrap" aria-hidden="true">
                    {step.icon}
                  </div>
                  <h3 className="step-card-title">{step.title}</h3>
                </div>

                <p className="step-card-desc">{step.desc}</p>

                <div className="step-card-divider" />

                <ul className="step-points-list">
                  {step.keyPoints.map((pt, i) => (
                    <li key={i}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="steps-cta-strip">
          <span className="steps-cta-text">Ready to explore 185+ accredited programmes?</span>
          <a href="#discover" className="btn btn-accent btn-sm" style={{ borderRadius: 9999, padding: '10px 22px' }}>
            Start Free Discovery →
          </a>
        </div>
      </div>
    </section>
  );
}
