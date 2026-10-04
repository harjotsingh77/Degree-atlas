import { SectionHead } from './Cards.jsx';

export function ScholarshipsSection() {
  const scholarshipCards = [
    {
      id: 'no-cost-emi',
      badge: '0% Interest Plans',
      title: 'Flexible No-Cost EMI Options',
      sub: 'Pay your tuition in stress-free monthly installments. Zero upfront loan charges and zero hidden interest.',
      highlights: [
        'Starting as low as ₹4,499 per month',
        '0% Interest with top banks (HDFC, ICICI, Axis, Kotak)',
        'Flexible 6, 12, 18 & 24-month tenures',
        'Instant paperless approval in under 10 minutes',
      ],
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="14" x="2" y="5" rx="3" fill="rgba(220, 38, 38, 0.06)" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <path d="M6 15h3M14 15h4" />
        </svg>
      ),
    },
    {
      id: 'merit-scholarships',
      badge: 'Up to 30% Fee Waiver',
      title: 'Merit & Need-Based Scholarships',
      sub: 'Direct university scholarships for high achievers, sports veterans, and economically weaker section (EWS) candidates.',
      highlights: [
        '80%+ in Graduation / 10+2: Up to 30% tuition reduction',
        'Female Student Grants: 15–20% fee waiver',
        'Economically Weaker Section (EWS) assistance',
        'Early Bird Bursaries for new session admissions',
      ],
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill="rgba(220, 38, 38, 0.08)" />
        </svg>
      ),
    },
    {
      id: 'corporate-defence',
      badge: 'Special Category Aid',
      title: 'Corporate, Defence & Alumni Discounts',
      sub: 'Special fee concessions for active defence personnel, corporate employees of partner MNCs, and continuing university alumni.',
      highlights: [
        'Armed Forces & Paramilitary: Up to 25% discount',
        'Corporate tie-ups with 150+ Top IT & Consulting MNCs',
        'Alumni Continuity Grant: 15% discount for graduates',
        'Family & sibling tuition fee support vouchers',
      ],
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l7 4v6c0 5.25-3.5 10-7 11-3.5-1-7-5.75-7-11V6l7-4z" fill="rgba(220, 38, 38, 0.08)" />
          <polygon points="12 8 13.5 11.5 17 12 14.5 14.5 15 18 12 16.2 9 18 9.5 14.5 7 12 10.5 11.5 12 8" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section" id="scholarships" style={{ background: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <SectionHead
          eyebrow="Financial Aid & Easy Payments"
          title="Scholarships & Zero-Burden EMI Plans"
          sub="Quality higher education should be accessible. Explore verified university fee concessions, scholarships, and flexible 0% interest monthly payment options."
        />

        {/* 3 Highlight Cards */}
        <div className="aid-cards-grid">
          {scholarshipCards.map((card) => (
            <div key={card.id} className="aid-card">
              <div className="aid-card-accent-bar" aria-hidden="true" />
              <div className="aid-card-header">
                <div className="aid-icon-bubble" aria-hidden="true">
                  {card.icon}
                </div>
                <div className="aid-card-title-group">
                  <h3 className="aid-card-title">{card.title}</h3>
                  <span className="aid-simple-tag">{card.badge}</span>
                </div>
              </div>

              <p className="aid-card-sub">{card.sub}</p>

              <div className="aid-divider" />

              <ul className="aid-features-list">
                {card.highlights.map((h, i) => (
                  <li key={i}>
                    <span className="aid-check-circle" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
