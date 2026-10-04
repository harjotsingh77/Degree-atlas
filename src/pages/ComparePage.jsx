import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { programmes, universities, inr } from '../data.js';
import { useCompare } from '../context/CompareContext.jsx';
import { Breadcrumbs } from '../components/Cards.jsx';
import { UniversityLogo } from '../components/UniversityLogo.jsx';
import { EnquiryModal } from '../components/Widgets.jsx';
import ProgrammeCompareModal from '../components/ProgrammeCompareModal.jsx';
import UniversityCompareModal from '../components/UniversityCompareModal.jsx';
import '../uni-compare.css';

const POPULAR_PROGRAMME_PRESETS = [
  {
    title: 'Flagship Management',
    desc: 'Chitkara Online MBA vs Amity Online MBA',
    tag: 'Most Popular',
    ids: ['chitkara-online-mba', 'amity-online-mba'],
  },
  {
    title: 'Tech & Computing',
    desc: 'Manipal Online MCA vs Chitkara Online MCA',
    tag: 'Software Leadership',
    ids: ['manipal-online-mca', 'chitkara-online-mca'],
  },
  {
    title: 'Undergraduate Careers',
    desc: 'Chitkara Online BBA vs Lovely Online BCA',
    tag: 'After Class 12',
    ids: ['chitkara-online-bba', 'lovely-online-bca'],
  },
  {
    title: 'Advanced Engineering & IT',
    desc: 'BITS Pilani M.Tech vs Manipal Online MCA',
    tag: 'Tech Executives',
    ids: ['bits-online-mtech', 'manipal-online-mca'],
  },
];

const POPULAR_UNIVERSITY_PRESETS = [
  {
    title: 'Premier NAAC A+ Peers',
    desc: 'Chitkara University vs Chandigarh University',
    tag: 'North India Flagship',
    ids: ['chitkara', 'chandigarh'],
  },
  {
    title: 'Top Private Universities',
    desc: 'Manipal University vs Amity University',
    tag: 'Highest NIRF Ranks',
    ids: ['manipal', 'amity'],
  },
  {
    title: 'Corporate Career Focus',
    desc: 'Jain University vs D.Y. Patil University',
    tag: 'Top Industry Tie-ups',
    ids: ['jain', 'dypatil'],
  },
];

export default function ComparePage() {
  const { ids, add, remove, clear } = useCompare();
  const [activeTab, setActiveTab] = useState('programmes'); // 'programmes' | 'universities'
  const [enquireProg, setEnquireProg] = useState(null);
  const [progModalOpen, setProgModalOpen] = useState(false);
  const [uniModalOpen, setUniModalOpen] = useState(false);

  // Resolve selected programmes
  const selectedProgs = useMemo(() => {
    return ids
      .map((id) => programmes.find((p) => p.id === id))
      .filter(Boolean)
      .filter((p, idx, self) => self.findIndex((o) => o.id === p.id) === idx);
  }, [ids]);

  // Resolve selected universities (either directly matching uni.id or via programme.universityId)
  const selectedUnis = useMemo(() => {
    return ids
      .map((id) => {
        const u = universities.find((x) => x.id === id);
        if (u) return u;
        const p = programmes.find((x) => x.id === id);
        if (p) return universities.find((x) => x.id === p.universityId);
        return null;
      })
      .filter(Boolean)
      .filter((u, idx, self) => self.findIndex((o) => o.id === u.id) === idx);
  }, [ids]);

  const loadPreset = (presetIds, mode = 'programmes') => {
    clear();
    presetIds.forEach((id) => add(id));
    setActiveTab(mode);
  };

  return (
    <main className="container" style={{ paddingBottom: 64, paddingTop: 16 }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />

      {/* 2. Hero Header */}
      <div style={{ marginTop: 12, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>UNBIASED COMPARISON ENGINE</div>
            <h1 style={{ fontSize: 'clamp(28px, 3.6vw, 42px)', fontWeight: 800, color: 'var(--navy)', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
              Compare Before You Decide
            </h1>
            <p className="muted" style={{ fontSize: 16, maxWidth: 680, margin: 0, lineHeight: 1.6 }}>
              Evaluate verified semester fees, UGC-DEB entitlements, NAAC ratings, duration, and curriculum side-by-side to make the smartest educational choice.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {((activeTab === 'programmes' && selectedProgs.length > 0) || (activeTab === 'universities' && selectedUnis.length > 0)) && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={clear}
                style={{ borderRadius: 9999, color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2' }}
              >
                Clear All
              </button>
            )}

            <button
              type="button"
              className="btn btn-accent btn-sm"
              onClick={() => {
                if (activeTab === 'programmes') setProgModalOpen(true);
                else setUniModalOpen(true);
              }}
              style={{ borderRadius: 9999, padding: '9px 18px' }}
            >
              + Add {activeTab === 'programmes' ? 'Programme' : 'University'}
            </button>
          </div>
        </div>

        {/* 3. Mode Switcher Tabs */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, borderBottom: '1px solid #E2E8F0', paddingBottom: 2, overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%', scrollbarWidth: 'none' }}>
          <button
            type="button"
            onClick={() => setActiveTab('programmes')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'programmes' ? '3px solid var(--red)' : '3px solid transparent',
              padding: '12px 18px',
              fontSize: 15,
              fontWeight: 700,
              color: activeTab === 'programmes' ? 'var(--navy)' : '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            <span>Compare Programmes</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
                background: activeTab === 'programmes' ? 'var(--red-soft)' : '#F1F5F9',
                color: activeTab === 'programmes' ? 'var(--red)' : '#64748B',
              }}
            >
              {selectedProgs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('universities')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'universities' ? '3px solid var(--red)' : '3px solid transparent',
              padding: '12px 18px',
              fontSize: 15,
              fontWeight: 700,
              color: activeTab === 'universities' ? 'var(--navy)' : '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            <span>Compare Universities</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
                background: activeTab === 'universities' ? 'var(--red-soft)' : '#F1F5F9',
                color: activeTab === 'universities' ? 'var(--red)' : '#64748B',
              }}
            >
              {selectedUnis.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4. MAIN COMPARISON VIEW */}
      {activeTab === 'programmes' && (
        <>
          {selectedProgs.length >= 2 ? (
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 20, boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)' }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="uni-cmp-table" style={{ margin: 0, minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th className="uni-cmp-table-header-col" style={{ width: 220, minWidth: 220 }}>
                        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 700 }}>
                          Comparing {selectedProgs.length} Programmes
                        </div>
                      </th>
                      {selectedProgs.map((p) => {
                        const u = universities.find((x) => x.id === p.universityId);
                        return (
                          <th key={p.id} className="uni-cmp-table-uni-col" style={{ width: 260, minWidth: 260 }}>
                            <div className="uni-cmp-matrix-uni-head">
                              <div className="uni-cmp-matrix-logo">
                                <UniversityLogo id={u?.id} name={u?.name || p.name} short={u?.short} size={48} />
                              </div>
                              <div>
                                <h4 className="uni-cmp-matrix-title">{p.name}</h4>
                                <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>{u?.name}</div>
                                <Link to={`/programmes/${p.slug}`} className="uni-cmp-matrix-link">
                                  <span>View Details</span>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </div>
                              <button
                                type="button"
                                className="uni-cmp-btn-remove-all"
                                style={{ padding: '4px 8px', fontSize: 12, marginTop: 4, cursor: 'pointer' }}
                                onClick={() => remove(p.id)}
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </th>
                        );
                      })}
                      {selectedProgs.length < 4 && (
                        <th style={{ width: 200, minWidth: 200, verticalAlign: 'middle', textAlign: 'center', background: '#FAFAFA' }}>
                          <button
                            type="button"
                            onClick={() => setProgModalOpen(true)}
                            style={{
                              background: '#FFFFFF',
                              border: '2px dashed #CBD5E1',
                              borderRadius: 14,
                              padding: '24px 16px',
                              width: '100%',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 8,
                              color: 'var(--navy)',
                              fontWeight: 700,
                              fontSize: 13.5,
                            }}
                          >
                            <span style={{ fontSize: 24, lineHeight: 1, color: 'var(--red)' }}>+</span>
                            <span>Add Another Programme</span>
                          </button>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Total Programme Fee */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Total Programme Fee</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--navy)' }}>{inr(p.feeTotal)}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Full degree fee · Exam fees included</div>
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Approx Semester Fee */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Approx. Semester Fee</th>
                      {selectedProgs.map((p) => {
                        const sems = p.durationMo <= 24 ? 4 : 6;
                        const semFee = Math.round(p.feeTotal / sems);
                        return (
                          <td key={p.id}>
                            <strong style={{ fontSize: 15, color: '#0F172A' }}>{inr(semFee)} / sem</strong>
                            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Easy zero-interest EMI available</div>
                          </td>
                        );
                      })}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Degree Level & Stream */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Degree Level & Category</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          <span
                            className="uni-cmp-mini-badge"
                            style={{
                              background: p.level === 'PG' ? '#0F172A' : '#FEF2F2',
                              color: p.level === 'PG' ? '#FFFFFF' : '#B91C1C',
                              borderColor: p.level === 'PG' ? '#0F172A' : '#FECACA',
                              fontWeight: 700,
                            }}
                          >
                            {p.level === 'PG' ? 'Postgraduate (PG)' : 'Undergraduate (UG)'}
                          </span>
                          <div style={{ fontSize: 13, color: '#475569', marginTop: 5, fontWeight: 500 }}>{p.category}</div>
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Duration */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Duration</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          <strong style={{ color: '#0F172A', fontSize: 14 }}>{p.durationMo} Months</strong>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                            {p.durationMo / 12} Years (Flexible online pacing)
                          </div>
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Learning Delivery Mode */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Delivery Mode</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          <span className="uni-cmp-mini-badge" style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE', fontWeight: 600 }}>
                            {p.mode || '100% Online'}
                          </span>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Live webinars + Recorded LMS lectures</div>
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Eligibility Criteria */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Eligibility Criteria</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          <div style={{ fontSize: 13.5, color: '#1E293B', fontWeight: 600 }}>{p.eligibilityShort}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Direct online admission</div>
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* University Accreditation & Approvals */}
                    <tr>
                      <th className="uni-cmp-table-header-col">University Credentials</th>
                      {selectedProgs.map((p) => {
                        const u = universities.find((x) => x.id === p.universityId);
                        return (
                          <td key={p.id}>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{u?.name}</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                              {u?.naacGrade && (
                                <span className="uni-cmp-mini-badge">{u.naacGrade}</span>
                              )}
                              <span className="uni-cmp-mini-badge" style={{ color: '#047857', background: '#ECFDF5', borderColor: '#A7F3D0' }}>
                                UGC-DEB Entitled
                              </span>
                            </div>
                          </td>
                        );
                      })}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Specialisations */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Domain Specialisations</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          {p.specialisations?.length > 0 ? (
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {p.specialisations.slice(0, 5).map((s) => (
                                <span
                                  key={s}
                                  style={{
                                    fontSize: 11.5,
                                    background: '#F1F5F9',
                                    padding: '3px 8px',
                                    borderRadius: 9999,
                                    color: '#334155',
                                    fontWeight: 500,
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                              {p.specialisations.length > 5 && (
                                <span style={{ fontSize: 11.5, color: '#64748B', alignSelf: 'center' }}>
                                  +{p.specialisations.length - 5} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: 13 }}>General Curriculum</span>
                          )}
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Examination Mode */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Examinations</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#047857', fontWeight: 600, fontSize: 13 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>100% Online Proctored</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Appear from anywhere across India</div>
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Actions */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Application Action</th>
                      {selectedProgs.map((p) => (
                        <td key={p.id}>
                          <button
                            type="button"
                            className="btn btn-accent btn-sm"
                            style={{ width: '100%', borderRadius: 9999, padding: '10px 16px', fontWeight: 700 }}
                            onClick={() => setEnquireProg(p.name)}
                          >
                            Enquire Now
                          </button>
                          <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <Link to={`/programmes/${p.slug}`} style={{ fontSize: 12.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'underline' }}>
                              View Full Programme →
                            </Link>
                          </div>
                        </td>
                      ))}
                      {selectedProgs.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Empty or Single Programme Selection State */
            <div className="card" style={{ padding: '40px 24px', textAlign: 'center', borderRadius: 20 }}>
              <div style={{ maxWidth: 540, margin: '0 auto' }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: '0 0 8px 0' }}>
                  {selectedProgs.length === 1 ? 'Select at least 1 more programme to compare' : 'Choose programmes to compare side-by-side'}
                </h3>
                <p className="muted" style={{ fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
                  {selectedProgs.length === 1
                    ? `You currently have "${selectedProgs[0].name}" selected. Add another programme below to view side-by-side fee and accreditation metrics.`
                    : 'Pick any 2 to 4 undergraduate or postgraduate degrees from top recognized universities to evaluate side-by-side.'}
                </p>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={() => setProgModalOpen(true)}
                    style={{ borderRadius: 9999, padding: '12px 24px', fontWeight: 700 }}
                  >
                    + Browse & Choose Programmes
                  </button>
                  <Link to="/programmes" className="btn btn-ghost" style={{ borderRadius: 9999 }}>
                    Explore All Programmes
                  </Link>
                </div>

                {/* Popular Presets */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 28, textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: 14 }}>
                    Or try these 1-Click Popular Comparisons:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 14 }}>
                    {POPULAR_PROGRAMME_PRESETS.map((preset) => (
                      <div
                        key={preset.title}
                        onClick={() => loadPreset(preset.ids, 'programmes')}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: 14,
                          padding: '16px',
                          background: '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--red)';
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--red-soft)', color: 'var(--red)', padding: '2px 8px', borderRadius: 999 }}>
                            {preset.tag}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700 }}>Compare →</span>
                        </div>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px 0' }}>{preset.title}</h4>
                        <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>{preset.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 5. UNIVERSITIES COMPARISON VIEW */}
      {activeTab === 'universities' && (
        <>
          {selectedUnis.length >= 2 ? (
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 20, boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)' }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="uni-cmp-table" style={{ margin: 0, minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th className="uni-cmp-table-header-col" style={{ width: 220, minWidth: 220 }}>
                        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 700 }}>
                          Comparing {selectedUnis.length} Universities
                        </div>
                      </th>
                      {selectedUnis.map((uni) => (
                        <th key={uni.id} className="uni-cmp-table-uni-col" style={{ width: 260, minWidth: 260 }}>
                          <div className="uni-cmp-matrix-uni-head">
                            <div className="uni-cmp-matrix-logo">
                              <UniversityLogo id={uni.id} name={uni.name} short={uni.short} size={48} />
                            </div>
                            <div>
                              <h4 className="uni-cmp-matrix-title">{uni.name}</h4>
                              <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>{uni.location || uni.state}</div>
                              <Link to={`/universities/${uni.slug}`} className="uni-cmp-matrix-link">
                                <span>View University</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="uni-cmp-btn-remove-all"
                              style={{ padding: '4px 8px', fontSize: 12, marginTop: 4, cursor: 'pointer' }}
                              onClick={() => remove(uni.id)}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </th>
                      ))}
                      {selectedUnis.length < 4 && (
                        <th style={{ width: 200, minWidth: 200, verticalAlign: 'middle', textAlign: 'center', background: '#FAFAFA' }}>
                          <button
                            type="button"
                            onClick={() => setUniModalOpen(true)}
                            style={{
                              background: '#FFFFFF',
                              border: '2px dashed #CBD5E1',
                              borderRadius: 14,
                              padding: '24px 16px',
                              width: '100%',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 8,
                              color: 'var(--navy)',
                              fontWeight: 700,
                              fontSize: 13.5,
                            }}
                          >
                            <span style={{ fontSize: 24, lineHeight: 1, color: 'var(--red)' }}>+</span>
                            <span>Add Another University</span>
                          </button>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* UGC-DEB Status */}
                    <tr>
                      <th className="uni-cmp-table-header-col">UGC-DEB Status</th>
                      {selectedUnis.map((uni) => (
                        <td key={uni.id}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#047857', fontWeight: 600 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{uni.ugcDeb || 'UGC-DEB Entitled'}</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Valid for Central/State Govt & Private Jobs</div>
                        </td>
                      ))}
                      {selectedUnis.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* NAAC Grade */}
                    <tr>
                      <th className="uni-cmp-table-header-col">NAAC Accreditation</th>
                      {selectedUnis.map((uni) => (
                        <td key={uni.id}>
                          <span
                            className="uni-cmp-mini-badge"
                            style={{
                              background: uni.naacGrade?.includes('A') ? '#ECFDF5' : '#F8FAFC',
                              color: uni.naacGrade?.includes('A') ? '#047857' : '#334155',
                              borderColor: uni.naacGrade?.includes('A') ? '#A7F3D0' : '#CBD5E1',
                              fontWeight: 700,
                              fontSize: 13,
                              padding: '4px 10px',
                            }}
                          >
                            {uni.naacGrade || 'Accredited'}
                          </span>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>National Assessment Council grade</div>
                        </td>
                      ))}
                      {selectedUnis.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* NIRF Ranking */}
                    <tr>
                      <th className="uni-cmp-table-header-col">NIRF Ranking</th>
                      {selectedUnis.map((uni) => (
                        <td key={uni.id}>
                          <strong style={{ color: '#0F172A', fontSize: 14 }}>{uni.nirfRank || 'Ranked in Top 100'}</strong>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Ministry of Education, Govt of India</div>
                        </td>
                      ))}
                      {selectedUnis.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Total Online Degrees */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Online Programmes Count</th>
                      {selectedUnis.map((uni) => {
                        const count = programmes.filter((p) => p.universityId === uni.id).length;
                        return (
                          <td key={uni.id}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>
                              {count > 0 ? `${count} Online Degrees` : 'Available on request'}
                            </span>
                            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Across UG, PG & Certificate tiers</div>
                          </td>
                        );
                      })}
                      {selectedUnis.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Location & Campus */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Campus Location</th>
                      {selectedUnis.map((uni) => (
                        <td key={uni.id}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{uni.location || uni.state}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{uni.type || 'State Private University'}</div>
                        </td>
                      ))}
                      {selectedUnis.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Approvals */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Statutory Approvals</th>
                      {selectedUnis.map((uni) => (
                        <td key={uni.id}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span className="uni-cmp-mini-badge">AICTE</span>
                            <span className="uni-cmp-mini-badge">UGC</span>
                            <span className="uni-cmp-mini-badge">AIU</span>
                            <span className="uni-cmp-mini-badge">WES Recognized</span>
                          </div>
                        </td>
                      ))}
                      {selectedUnis.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>

                    {/* Actions */}
                    <tr>
                      <th className="uni-cmp-table-header-col">Action</th>
                      {selectedUnis.map((uni) => (
                        <td key={uni.id}>
                          <button
                            type="button"
                            className="btn btn-accent btn-sm"
                            style={{ width: '100%', borderRadius: 9999, padding: '10px 16px', fontWeight: 700 }}
                            onClick={() => setEnquireProg(uni.name)}
                          >
                            Enquire Now
                          </button>
                          <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <Link to={`/universities/${uni.slug}`} style={{ fontSize: 12.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'underline' }}>
                              View University Profile →
                            </Link>
                          </div>
                        </td>
                      ))}
                      {selectedUnis.length < 4 && <td style={{ background: '#FAFAFA' }} />}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Empty or Single University Selection State */
            <div className="card" style={{ padding: '40px 24px', textAlign: 'center', borderRadius: 20 }}>
              <div style={{ maxWidth: 540, margin: '0 auto' }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: '0 0 8px 0' }}>
                  {selectedUnis.length === 1 ? 'Select at least 1 more university to compare' : 'Choose universities to compare side-by-side'}
                </h3>
                <p className="muted" style={{ fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
                  {selectedUnis.length === 1
                    ? `You currently have "${selectedUnis[0].name}" selected. Add another university to compare NAAC grades, NIRF ranks, and online degree options.`
                    : 'Compare accreditations, UGC approvals, rankings, and degrees across 78+ accredited universities in India.'}
                </p>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={() => setUniModalOpen(true)}
                    style={{ borderRadius: 9999, padding: '12px 24px', fontWeight: 700 }}
                  >
                    + Browse & Choose Universities
                  </button>
                  <Link to="/universities" className="btn btn-ghost" style={{ borderRadius: 9999 }}>
                    Explore All Universities
                  </Link>
                </div>

                {/* Popular Presets */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 28, textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: 14 }}>
                    Or try these 1-Click Popular Comparisons:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 14 }}>
                    {POPULAR_UNIVERSITY_PRESETS.map((preset) => (
                      <div
                        key={preset.title}
                        onClick={() => loadPreset(preset.ids, 'universities')}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: 14,
                          padding: '16px',
                          background: '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--red)';
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--red-soft)', color: 'var(--red)', padding: '2px 8px', borderRadius: 999 }}>
                            {preset.tag}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700 }}>Compare →</span>
                        </div>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px 0' }}>{preset.title}</h4>
                        <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>{preset.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 6. Modals */}
      <ProgrammeCompareModal
        isOpen={progModalOpen}
        onClose={() => setProgModalOpen(false)}
        selectedIds={ids}
        onAdd={add}
        onRemove={remove}
        onClear={clear}
        initialView="picker"
        onEnquire={(pName) => setEnquireProg(pName)}
      />

      <UniversityCompareModal
        isOpen={uniModalOpen}
        onClose={() => setUniModalOpen(false)}
        selectedIds={ids}
        onAdd={add}
        onRemove={remove}
        onClear={clear}
        initialView="picker"
      />

      <EnquiryModal
        open={Boolean(enquireProg)}
        onClose={() => setEnquireProg(null)}
        programmeName={enquireProg || 'Selected Degree'}
      />
    </main>
  );
}
