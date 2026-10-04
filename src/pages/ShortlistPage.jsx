import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { inr, programmes, universities } from '../data.js';
import { UniversityLogo } from '../components/UniversityLogo.jsx';
import { ProgrammeCard } from '../components/Cards.jsx';
import { EnquiryModal } from '../components/Widgets.jsx';

export default function ShortlistPage() {
  const {
    items,
    count,
    removeShortlist,
    clearShortlist,
    shortlistedProgrammes,
    shortlistedUniversities,
    addShortlist,
  } = useShortlist();

  const { add: addToCompare, ids: compareIds } = useCompare();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'programmes' | 'universities'
  const [enquireItem, setEnquireItem] = useState(null);

  // Suggested popular programmes for 1-click shortlist in empty state
  const recommendedProgs = programmes.slice(0, 4);

  const displayedItems = activeTab === 'all'
    ? items
    : activeTab === 'programmes'
      ? shortlistedProgrammes
      : shortlistedUniversities;

  return (
    <main className="shortlist-page-container">
      {/* Top Header Section */}
      <section className="shortlist-hero-section">
        <div className="container">
          <div className="shortlist-hero-content">
            <h1 className="shortlist-main-title">
              My Shortlist
              {count > 0 && <span className="shortlist-title-count">({count})</span>}
            </h1>

            <p className="shortlist-sub-text">
              Review your shortlisted degree programmes and universities. Compare them side-by-side or connect with academic counselors.
            </p>

            {count > 0 && (
              <div className="shortlist-top-bar">
                {/* Filter Tabs */}
                <div className="shortlist-tabs-wrap">
                  <button
                    className={`shortlist-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({count})
                  </button>
                  <button
                    className={`shortlist-tab-btn ${activeTab === 'programmes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('programmes')}
                  >
                    Programmes ({shortlistedProgrammes.length})
                  </button>
                  <button
                    className={`shortlist-tab-btn ${activeTab === 'universities' ? 'active' : ''}`}
                    onClick={() => setActiveTab('universities')}
                  >
                    Universities ({shortlistedUniversities.length})
                  </button>
                </div>

                {/* Actions */}
                <div className="shortlist-actions-wrap">
                  <Link to="/compare" className="shortlist-btn-compare-all">
                    <span>Compare Shortlist</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>

                  <button
                    className="shortlist-btn-clear"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your entire shortlist?')) {
                        clearShortlist();
                      }
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container shortlist-content-section">
        {count === 0 ? (
          /* Empty State */
          <div className="shortlist-empty-card">
            <div className="shortlist-empty-heart-icon">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <h2 className="shortlist-empty-title">Your shortlist is currently empty</h2>
            <p className="shortlist-empty-desc">
              Browse top online degree programmes and click the heart icon under the PG/UG ribbon to save programmes here for quick review and comparison.
            </p>

            <div className="shortlist-empty-buttons">
              <Link to="/programmes" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Explore Programmes →
              </Link>
              <Link to="/universities" className="btn btn-ghost" style={{ padding: '12px 28px' }}>
                Explore Universities
              </Link>
            </div>

            {/* Popular Programmes to Try */}
            <div className="shortlist-rec-section">
              <h3 className="shortlist-rec-title">Popular Programmes You Might Like</h3>
              <div className="shortlist-rec-grid">
                {recommendedProgs.map((prog) => {
                  const uni = universities.find((u) => u.id === prog.universityId);
                  return (
                    <div key={prog.id} className="shortlist-rec-card">
                      <div className="shortlist-rec-top">
                        <UniversityLogo id={prog.universityId} name={uni?.name} short={uni?.short} size={40} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span className="shortlist-rec-uni">{uni?.name}</span>
                          <h4 className="shortlist-rec-prog-title">
                            <Link to={`/programmes/${prog.slug}`}>{prog.name}</Link>
                          </h4>
                        </div>
                      </div>
                      <div className="shortlist-rec-meta">
                        <span>{prog.durationMo} Months</span>
                        <span>•</span>
                        <strong>{inr(prog.feeTotal)}</strong>
                      </div>
                      <button
                        className="btn-shortlist-add-rec"
                        onClick={() => addShortlist(prog.id)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>+ Add to Shortlist</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Shortlisted Items List */
          <div className="shortlist-items-grid">
            {displayedItems.length === 0 ? (
              <div className="shortlist-tab-empty">
                <p>No {activeTab} shortlisted yet.</p>
                <button className="btn btn-ghost" onClick={() => setActiveTab('all')}>
                  View All Shortlisted Items
                </button>
              </div>
            ) : (
              displayedItems.map((item) => {
                if (item.type === 'programme') {
                  const p = item.prog;
                  return (
                    <div key={p.id} className="shortlist-card-wrapper">
                      <ProgrammeCard p={p} />
                    </div>
                  );
                }

                // University Card
                if (item.type === 'university') {
                  const u = item.uni;
                  const isCmp = compareIds.includes(u.id);
                  return (
                    <article key={u.id} className="shortlist-uni-card">
                      <div className="shortlist-uni-header">
                        <UniversityLogo id={u.id} name={u.name} short={u.short} size={54} />
                        <div className="shortlist-uni-info">
                          <h3 className="shortlist-uni-name">
                            <Link to={`/universities/${u.slug}`}>{u.name}</Link>
                          </h3>
                          <span className="shortlist-uni-loc">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {u.location} • NAAC {u.naacGrade || 'A+'}
                          </span>
                        </div>

                        {/* Remove Heart Button */}
                        <button
                          className="shortlist-remove-btn"
                          onClick={() => removeShortlist(u.id)}
                          title="Remove from shortlist"
                          aria-label="Remove from shortlist"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>

                      <p className="shortlist-uni-desc">{u.desc || `${u.name} is a premier accredited university offering UGC-DEB recognized online degrees.`}</p>

                      <div className="shortlist-uni-actions">
                        <Link to={`/universities/${u.slug}`} className="btn-shortlist-action btn-view">
                          View University Details →
                        </Link>
                        <button
                          className={`btn-shortlist-action btn-cmp ${isCmp ? 'active' : ''}`}
                          onClick={() => addToCompare(u.id)}
                        >
                          {isCmp ? '✓ In Compare' : '+ Compare'}
                        </button>
                        <button
                          className="btn-shortlist-action btn-enquire"
                          onClick={() => setEnquireItem(u)}
                        >
                          Enquire Now
                        </button>
                      </div>
                    </article>
                  );
                }

                return null;
              })
            )}
          </div>
        )}
      </section>

      {/* Enquiry Modal if triggered */}
      {enquireItem && (
        <EnquiryModal
          open={!!enquireItem}
          onClose={() => setEnquireItem(null)}
          programmeName={enquireItem?.name || ''}
        />
      )}
    </main>
  );
}
