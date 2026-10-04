import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { universities, programmes, inr } from '../data.js';
import UniversityLogo from './UniversityLogo.jsx';
import { useFloatingTrayActive } from '../context/CompareContext.jsx';
import '../uni-compare.css';

const STATE_FILTERS = [
  'All',
  'Punjab',
  'Delhi NCR',
  'Karnataka',
  'Tamil Nadu',
  'Maharashtra',
  'Uttar Pradesh',
];

export default function UniversityCompareModal({
  isOpen,
  onClose,
  currentUni,
  selectedIds = [],
  onAdd,
  onRemove,
  onClear,
  initialView = 'picker',
}) {
  const safeInitialView = typeof initialView === 'string' && initialView === 'matrix' ? 'matrix' : 'picker';
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [viewMode, setViewMode] = useState(safeInitialView);

  // Sync initial view when modal opens
  useEffect(() => {
    if (isOpen) {
      setViewMode(typeof initialView === 'string' && initialView === 'matrix' ? 'matrix' : 'picker');
    }
  }, [isOpen, initialView]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Resolve selected universities (supporting both university IDs and programme IDs)
  const selectedUnis = useMemo(() => {
    return selectedIds
      .map((id) => {
        const u = universities.find((x) => x.id === id);
        if (u) return u;
        const p = programmes.find((x) => x.id === id);
        if (p) return universities.find((x) => x.id === p.universityId);
        return null;
      })
      .filter(Boolean)
      .filter((u, idx, self) => self.findIndex((o) => o.id === u.id) === idx);
  }, [selectedIds]);

  // Filter universities for picker
  const filteredUniversities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return universities.filter((u) => {
      // State filter
      if (stateFilter !== 'All') {
        if (stateFilter === 'Delhi NCR') {
          const matchDelhi =
            u.state?.toLowerCase().includes('delhi') ||
            u.location?.toLowerCase().includes('delhi') ||
            u.location?.toLowerCase().includes('noida') ||
            u.location?.toLowerCase().includes('gurugram');
          if (!matchDelhi) return false;
        } else {
          const matchState =
            u.state?.toLowerCase().includes(stateFilter.toLowerCase()) ||
            u.location?.toLowerCase().includes(stateFilter.toLowerCase());
          if (!matchState) return false;
        }
      }

      // Search query
      if (q) {
        const matchName = u.name?.toLowerCase().includes(q);
        const matchShort = u.short?.toLowerCase().includes(q);
        const matchLoc = u.location?.toLowerCase().includes(q);
        const matchState = u.state?.toLowerCase().includes(q);
        const matchType = u.type?.toLowerCase().includes(q);
        return matchName || matchShort || matchLoc || matchState || matchType;
      }

      return true;
    });
  }, [searchQuery, stateFilter]);

  const handleRemoveUni = (uniId) => {
    const matchingIds = selectedIds.filter((id) => {
      if (id === uniId) return true;
      const p = programmes.find((x) => x.id === id);
      return p && p.universityId === uniId;
    });
    if (matchingIds.length > 0) {
      matchingIds.forEach((id) => onRemove(id));
    } else {
      onRemove(uniId);
    }
  };

  const handleToggleUni = (uniId) => {
    const isSelected = selectedUnis.some((u) => u.id === uniId);
    if (isSelected) {
      handleRemoveUni(uniId);
    } else {
      if (selectedUnis.length >= 4) {
        alert('You can compare up to 4 universities simultaneously. Please remove one to add another.');
        return;
      }
      onAdd(uniId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="uni-cmp-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Compare Universities">
      <div className="uni-cmp-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="uni-cmp-header">
          <div className="uni-cmp-header-info">
            <h2>
              {viewMode === 'matrix' ? 'Side-by-Side University Comparison' : 'Compare Universities'}
            </h2>
            <p>
              {viewMode === 'matrix'
                ? `Comparing ${selectedUnis.length} universities side-by-side on accreditations, rankings & fees.`
                : 'Select universities below to compare rankings, approvals, degrees & credentials side-by-side.'}
            </p>
          </div>
          <button
            type="button"
            className="uni-cmp-close-btn"
            onClick={onClose}
            aria-label="Close comparison window"
          >
            ✕
          </button>
        </div>

        {/* Toolbar (Only in picker mode) */}
        {viewMode === 'picker' && (
          <div className="uni-cmp-toolbar">
            <div className="uni-cmp-search-row">
              <svg
                className="uni-cmp-search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="uni-cmp-search-input"
                placeholder="Search by university name, state, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="uni-cmp-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="uni-cmp-pills-row">
              {STATE_FILTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`uni-cmp-pill ${stateFilter === s ? 'active' : ''}`}
                  onClick={() => setStateFilter(s)}
                >
                  {s === 'All' ? `All Universities (${universities.length})` : s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode: Picker Cards View */}
        {viewMode === 'picker' && (
          <div className="uni-cmp-body-scroll">
            <div className="uni-cmp-cards-grid">
              {filteredUniversities.map((uni) => {
                const isSelected = selectedUnis.some((u) => u.id === uni.id);
                const isCurrent = currentUni && currentUni.id === uni.id;

                return (
                  <div
                    key={uni.id}
                    className={`uni-cmp-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleUni(uni.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="uni-cmp-card-left">
                      <div className="uni-cmp-card-logo">
                        <UniversityLogo
                          id={uni.id}
                          name={uni.name}
                          short={uni.short}
                          size={40}
                        />
                      </div>
                      <div className="uni-cmp-card-meta">
                        <h4 className="uni-cmp-card-title" title={uni.name}>
                          {uni.name}
                        </h4>
                        <div className="uni-cmp-card-loc">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{uni.location || (uni.state ? `${uni.state}, India` : 'India')}</span>
                        </div>
                        <div className="uni-cmp-card-badges">
                          {isCurrent && (
                            <span
                              className="uni-cmp-mini-badge"
                              style={{
                                background: '#EFF6FF',
                                color: '#1D4ED8',
                                borderColor: '#BFDBFE',
                                fontWeight: 700,
                              }}
                            >
                              Current Uni
                            </span>
                          )}
                          {uni.naacGrade && (
                            <span className="uni-cmp-mini-badge">
                              {uni.naacGrade}
                            </span>
                          )}
                          {uni.nirfRank && (
                            <span className="uni-cmp-mini-badge">
                              {uni.nirfRank.split(' ')[0]} {uni.nirfRank.split(' ')[1] || ''}
                            </span>
                          )}
                          {uni.ugcDeb && (
                            <span
                              className="uni-cmp-mini-badge"
                              style={{ color: '#047857', background: '#ECFDF5', borderColor: '#A7F3D0' }}
                            >
                              UGC-DEB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Prominent Plus Icon Button */}
                    <button
                      type="button"
                      className={`uni-cmp-plus-btn ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleUni(uni.id);
                      }}
                      title={isSelected ? 'Remove from compare' : 'Add to compare'}
                    >
                      {isSelected ? (
                        <>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredUniversities.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B' }}>
                <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0', color: '#0F172A' }}>
                  No universities found
                </p>
                <p style={{ fontSize: 13, margin: 0 }}>
                  Try a different search term or select another state filter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mode: Side-by-Side Matrix View */}
        {viewMode === 'matrix' && (
          <div className="uni-cmp-matrix-wrap">
            {selectedUnis.length < 2 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B' }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px 0', color: '#0F172A' }}>
                  Select at least 2 universities to compare
                </p>
                <p style={{ fontSize: 13.5, margin: '0 0 20px 0' }}>
                  Please choose another university from the list to see side-by-side metrics.
                </p>
                <button
                  type="button"
                  className="uni-cmp-btn-compare-now"
                  onClick={() => setViewMode('picker')}
                >
                  + Add More Universities
                </button>
              </div>
            ) : (
              <>
                <div className="uni-cmp-swipe-hint">← Swipe to compare side-by-side →</div>
                <table className="uni-cmp-table">
                <thead>
                  <tr>
                    <th className="uni-cmp-table-header-col">Parameter</th>
                    {selectedUnis.map((uni) => (
                      <th key={uni.id} className="uni-cmp-table-uni-col">
                        <div className="uni-cmp-matrix-uni-head">
                          <div className="uni-cmp-matrix-logo">
                            <UniversityLogo
                              id={uni.id}
                              name={uni.name}
                              short={uni.short}
                              size={48}
                            />
                          </div>
                          <div>
                            <h4 className="uni-cmp-matrix-title">{uni.name}</h4>
                            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                              {uni.location || uni.state}
                            </div>
                            <Link
                              to={`/universities/${uni.slug}`}
                              className="uni-cmp-matrix-link"
                              onClick={onClose}
                            >
                              <span>View Profile</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                          <button
                            type="button"
                            className="uni-cmp-btn-remove-all"
                            style={{ padding: '4px 8px', fontSize: 12, marginTop: 4 }}
                            onClick={() => onRemove(uni.id)}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* UGC-DEB Approval */}
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
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          Valid for Online Degrees nationwide
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* NAAC Accreditation */}
                  <tr>
                    <th className="uni-cmp-table-header-col">NAAC Accreditation</th>
                    {selectedUnis.map((uni) => (
                      <td key={uni.id}>
                        <strong style={{ color: '#0F172A', fontSize: 14 }}>
                          {uni.naacGrade || 'NAAC Accredited'}
                        </strong>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          Apex quality standard
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* NIRF Ranking */}
                  <tr>
                    <th className="uni-cmp-table-header-col">NIRF Ranking 2025</th>
                    {selectedUnis.map((uni) => (
                      <td key={uni.id}>
                        <strong style={{ color: '#0F172A', fontSize: 14 }}>
                          {uni.nirfRank || 'Ranked in India'}
                        </strong>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          Ministry of Education, Govt of India
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* University Type */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Institution Type</th>
                    {selectedUnis.map((uni) => (
                      <td key={uni.id}>
                        <span style={{ fontWeight: 600, color: '#1E293B' }}>{uni.type || 'University'}</span>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          Est. {uni.established || '—'}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Online Programmes */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Available Online Degrees</th>
                    {selectedUnis.map((uni) => {
                      const progs = programmes.filter((p) => p.universityId === uni.id);
                      return (
                        <td key={uni.id}>
                          <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                            {progs.length > 0 ? `${progs.length} Programmes` : 'UG & PG Programmes'}
                          </div>
                          {progs.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {progs.slice(0, 5).map((p) => (
                                <span
                                  key={p.id}
                                  className="uni-cmp-mini-badge"
                                  style={{ background: '#F8FAFC', color: '#1E293B' }}
                                >
                                  {p.name.split(' (')[0].replace('Online ', '')}
                                </span>
                              ))}
                              {progs.length > 5 && (
                                <span className="uni-cmp-mini-badge" style={{ color: '#2563EB' }}>
                                  +{progs.length - 5} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <div style={{ fontSize: 12.5, color: '#64748B' }}>
                              MBA, MCA, BCA, BBA, M.Com
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Estimated Fee Range */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Fee Range</th>
                    {selectedUnis.map((uni) => {
                      const progs = programmes.filter((p) => p.universityId === uni.id);
                      let feeStr = '₹90,000 – ₹2,50,000';
                      if (progs.length > 0) {
                        const fees = progs.map((p) => p.feeTotal).filter(Boolean);
                        if (fees.length > 0) {
                          const minF = Math.min(...fees);
                          const maxF = Math.max(...fees);
                          feeStr = minF === maxF ? inr(minF) : `${inr(minF)} – ${inr(maxF)}`;
                        }
                      }
                      return (
                        <td key={uni.id}>
                          <strong style={{ color: '#0F172A', fontSize: 14 }}>{feeStr}</strong>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                            Flexible semester EMI available
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Mode & LMS */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Learning Mode & LMS</th>
                    {selectedUnis.map((uni) => (
                      <td key={uni.id}>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>100% Online</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          Live interactive lectures + recorded LMS access + online proctored exams
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Action Link */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Action</th>
                    {selectedUnis.map((uni) => (
                      <td key={uni.id}>
                        <Link
                          to={`/universities/${uni.slug}`}
                          className="uni-cmp-btn-compare-now"
                          style={{
                            padding: '8px 16px',
                            fontSize: 13,
                            textDecoration: 'none',
                            display: 'inline-flex',
                          }}
                          onClick={onClose}
                        >
                          Explore University
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="uni-cmp-bottom-bar">
        <div className="uni-cmp-tray-slots">
          <span className="uni-cmp-tray-counter" style={{ marginRight: 4 }}>
            Compare ({selectedUnis.length}/4):
          </span>

          {selectedUnis.map((uni) => (
            <div key={uni.id} className="uni-cmp-chip">
              <div className="uni-cmp-chip-thumb">
                <UniversityLogo id={uni.id} name={uni.name} short={uni.short} size={20} />
              </div>
              <span className="uni-cmp-chip-name">{uni.short || uni.name}</span>
              <button
                type="button"
                className="uni-cmp-chip-remove"
                onClick={() => handleRemoveUni(uni.id)}
                aria-label={`Remove ${uni.name}`}
                title="Remove from comparison"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Empty placeholder slots up to 4 */}
          {selectedUnis.length === 0 ? (
            <span className="uni-cmp-tray-empty-hint">Select 2 to 4 universities</span>
          ) : (
            Array.from({ length: Math.max(0, 4 - selectedUnis.length) }).map((_, idx) => (
              <div
                key={idx}
                className="uni-cmp-empty-slot"
                style={{ cursor: viewMode === 'matrix' ? 'pointer' : 'default' }}
                onClick={() => {
                  if (viewMode === 'matrix') setViewMode('picker');
                }}
              >
                <span>+</span>
                <span>Add University</span>
              </div>
            ))
          )}
        </div>

          <div className="uni-cmp-bar-actions">
            {selectedUnis.length > 0 && (
              <button
                type="button"
                className="uni-cmp-btn-remove-all"
                onClick={onClear}
              >
                Remove All
              </button>
            )}

            {viewMode === 'matrix' ? (
              <button
                type="button"
                className="uni-cmp-btn-add-more"
                onClick={() => setViewMode('picker')}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '9px 16px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add More</span>
              </button>
            ) : (
              <button
                type="button"
                className="uni-cmp-btn-compare-now"
                disabled={selectedUnis.length < 2}
                onClick={() => setViewMode('matrix')}
              >
                <span>Compare Now ({selectedUnis.length})</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating tray component on University page (when modal is closed)
export function UniversityCompareFloatingTray({
  selectedIds = [],
  onRemove,
  onClear,
  onOpenModal,
}) {
  const selectedUnis = useMemo(() => {
    return selectedIds
      .map((id) => {
        const u = universities.find((x) => x.id === id);
        if (u) return u;
        const p = programmes.find((x) => x.id === id);
        if (p) return universities.find((x) => x.id === p.universityId);
        return null;
      })
      .filter(Boolean)
      .filter((u, idx, self) => self.findIndex((o) => o.id === u.id) === idx);
  }, [selectedIds]);

  const isVisible = selectedUnis.length > 0;
  useFloatingTrayActive(isVisible);

  if (!isVisible) return null;

  return (
    <div className="uni-cmp-floating-tray" role="region" aria-label="University Comparison Tray">
      <div className="uni-cmp-tray-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="16 3 21 3 21 8" />
          <line x1="4" y1="20" x2="21" y2="3" />
          <polyline points="21 16 21 21 16 21" />
          <line x1="15" y1="15" x2="21" y2="21" />
          <line x1="4" y1="4" x2="9" y2="9" />
        </svg>
        <span>Compare ({selectedUnis.length}/4):</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {selectedUnis.map((uni) => (
          <div key={uni.id} className="uni-cmp-chip">
            <div className="uni-cmp-chip-thumb">
              <UniversityLogo id={uni.id} name={uni.name} short={uni.short} size={18} />
            </div>
            <span className="uni-cmp-chip-name">{uni.short || uni.name}</span>
            <button
              type="button"
              className="uni-cmp-chip-remove"
              onClick={() => onRemove(uni.id)}
              aria-label={`Remove ${uni.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="uni-cmp-btn-add-more"
        onClick={() => onOpenModal('picker')}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add More</span>
      </button>

      <button
        type="button"
        className="uni-cmp-btn-remove-all"
        onClick={onClear}
        style={{ color: '#E2E8F0', fontSize: 13, cursor: 'pointer' }}
      >
        Remove All
      </button>

      <button
        type="button"
        className="uni-cmp-btn-compare-now"
        disabled={selectedUnis.length < 2}
        onClick={() => onOpenModal('matrix')}
        style={{ padding: '8px 18px', fontSize: 13 }}
      >
        <span>Compare Now</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
