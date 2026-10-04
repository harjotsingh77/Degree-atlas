import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programmes, universities, inr } from '../data.js';
import { UniversityLogo } from './UniversityLogo.jsx';
import { useFloatingTrayActive } from '../context/CompareContext.jsx';
import '../uni-compare.css';

export default function ProgrammeCompareModal({
  isOpen,
  onClose,
  currentProg,
  selectedIds = [],
  onAdd,
  onRemove,
  onClear,
  initialView = 'picker',
  onEnquire,
}) {
  const safeInitialView = typeof initialView === 'string' && initialView === 'matrix' ? 'matrix' : 'picker';
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [viewMode, setViewMode] = useState(safeInitialView);

  // Sync initial view when modal opens
  useEffect(() => {
    if (isOpen) {
      setViewMode(typeof initialView === 'string' && initialView === 'matrix' ? 'matrix' : 'picker');
      if (currentProg?.category) {
        setCategoryFilter(currentProg.category);
      } else {
        setCategoryFilter('All');
      }
    }
  }, [isOpen, initialView, currentProg]);

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

  // Resolve selected programmes
  const selectedProgs = useMemo(() => {
    return selectedIds
      .map((id) => programmes.find((p) => p.id === id))
      .filter(Boolean)
      .filter((p, idx, self) => self.findIndex((o) => o.id === p.id) === idx);
  }, [selectedIds]);

  // Available categories for pill filters
  const categoriesList = useMemo(() => {
    const set = new Set();
    programmes.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, []);

  // Filter programmes for picker
  const filteredProgrammes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return programmes.filter((p) => {
      // Category filter
      if (categoryFilter !== 'All' && p.category !== categoryFilter) {
        return false;
      }

      // Level filter
      if (levelFilter !== 'All' && p.level !== levelFilter) {
        return false;
      }

      // Search query
      if (q) {
        const u = universities.find((x) => x.id === p.universityId);
        const matchProgName = p.name?.toLowerCase().includes(q);
        const matchShort = p.shortName?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        const matchUni = u?.name?.toLowerCase().includes(q) || u?.short?.toLowerCase().includes(q);
        const matchSpec = p.specialisations?.some((s) => s.toLowerCase().includes(q));
        return matchProgName || matchShort || matchCat || matchUni || matchSpec;
      }

      return true;
    }).sort((a, b) => {
      // Prioritize current programme and programmes from same category/level
      if (currentProg) {
        if (a.id === currentProg.id) return -1;
        if (b.id === currentProg.id) return 1;
        if (a.category === currentProg.category && b.category !== currentProg.category) return -1;
        if (b.category === currentProg.category && a.category !== currentProg.category) return 1;
      }
      return 0;
    });
  }, [searchQuery, categoryFilter, levelFilter, currentProg]);

  const handleToggleProg = (progId) => {
    const isSelected = selectedProgs.some((p) => p.id === progId);
    if (isSelected) {
      onRemove(progId);
    } else {
      if (selectedProgs.length >= 4) {
        alert('You can compare up to 4 programmes simultaneously. Please remove one to add another.');
        return;
      }
      onAdd(progId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="uni-cmp-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Compare Programmes">
      <div className="uni-cmp-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="uni-cmp-header">
          <div className="uni-cmp-header-info">
            <h2>
              {viewMode === 'matrix' ? 'Side-by-Side Programme Comparison' : 'Compare Online Programmes'}
            </h2>
            <p>
              {viewMode === 'matrix'
                ? `Comparing ${selectedProgs.length} programmes side-by-side on fees, duration, eligibility & accreditations.`
                : 'Select programmes below to compare curriculum, fees, duration & university credentials side-by-side.'}
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
                placeholder="Search by programme name (MBA, MCA, BCA), university, or specialisation..."
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
              <button
                type="button"
                className={`uni-cmp-pill ${categoryFilter === 'All' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('All')}
              >
                All Programmes ({programmes.length})
              </button>
              {currentProg?.category && (
                <button
                  type="button"
                  className={`uni-cmp-pill ${categoryFilter === currentProg.category ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(currentProg.category)}
                >
                  Same Category ({currentProg.category})
                </button>
              )}
              {categoriesList
                .filter((c) => c !== currentProg?.category)
                .slice(0, 5)
                .map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`uni-cmp-pill ${categoryFilter === c ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(c)}
                  >
                    {c}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Mode: Picker Cards View */}
        {viewMode === 'picker' && (
          <div className="uni-cmp-body-scroll">
            <div className="uni-cmp-cards-grid">
              {filteredProgrammes.map((p) => {
                const u = universities.find((x) => x.id === p.universityId);
                const isSelected = selectedProgs.some((x) => x.id === p.id);
                const isCurrent = currentProg && currentProg.id === p.id;

                return (
                  <div
                    key={p.id}
                    className={`uni-cmp-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleProg(p.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="uni-cmp-card-left">
                      <div className="uni-cmp-card-logo">
                        <UniversityLogo
                          id={u?.id}
                          name={u?.name || p.name}
                          short={u?.short}
                          size={40}
                        />
                      </div>
                      <div className="uni-cmp-card-meta">
                        <h4 className="uni-cmp-card-title" title={p.name}>
                          {p.name}
                        </h4>
                        <div className="uni-cmp-card-loc">
                          <span>{u?.name || 'Verified University'}</span>
                          {u?.state && <span> · {u.state}</span>}
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
                              Current Programme
                            </span>
                          )}
                          <span className="uni-cmp-mini-badge" style={{ fontWeight: 600 }}>
                            {p.level}
                          </span>
                          <span className="uni-cmp-mini-badge">
                            {p.durationMo} Mo
                          </span>
                          <span className="uni-cmp-mini-badge" style={{ color: '#047857', background: '#ECFDF5', borderColor: '#A7F3D0', fontWeight: 700 }}>
                            {inr(p.feeTotal)}
                          </span>
                          {u?.naacGrade && (
                            <span className="uni-cmp-mini-badge">
                              {u.naacGrade}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Plus / Added Toggle Button */}
                    <button
                      type="button"
                      className={`uni-cmp-plus-btn ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProg(p.id);
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

            {filteredProgrammes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B' }}>
                <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0', color: '#0F172A' }}>
                  No programmes found
                </p>
                <p style={{ fontSize: 13, margin: 0 }}>
                  Try a different search term or select another category filter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mode: Side-by-Side Matrix View */}
        {viewMode === 'matrix' && (
          <div className="uni-cmp-matrix-wrap">
            {selectedProgs.length < 2 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B' }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px 0', color: '#0F172A' }}>
                  Select at least 2 programmes to compare
                </p>
                <p style={{ fontSize: 13.5, margin: '0 0 20px 0' }}>
                  Please choose another programme from the list to see side-by-side metrics.
                </p>
                <button
                  type="button"
                  className="uni-cmp-btn-compare-now"
                  onClick={() => setViewMode('picker')}
                >
                  + Add More Programmes
                </button>
              </div>
            ) : (
              <>
                <div className="uni-cmp-swipe-hint">← Swipe to compare programmes side-by-side →</div>
                <table className="uni-cmp-table">
                <thead>
                  <tr>
                    <th className="uni-cmp-table-header-col">Parameter</th>
                    {selectedProgs.map((p) => {
                      const u = universities.find((x) => x.id === p.universityId);
                      return (
                        <th key={p.id} className="uni-cmp-table-uni-col">
                          <div className="uni-cmp-matrix-uni-head">
                            <div className="uni-cmp-matrix-logo">
                              <UniversityLogo
                                id={u?.id}
                                name={u?.name || p.name}
                                short={u?.short}
                                size={44}
                              />
                            </div>
                            <div>
                              <h4 className="uni-cmp-matrix-title">{p.name}</h4>
                              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                                {u?.name}
                              </div>
                              <Link
                                to={`/programmes/${p.slug}`}
                                className="uni-cmp-matrix-link"
                                onClick={onClose}
                              >
                                <span>View Programme</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="uni-cmp-btn-remove-all"
                              style={{ padding: '4px 8px', fontSize: 12, marginTop: 4 }}
                              onClick={() => onRemove(p.id)}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Total Programme Fee */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Total Programme Fee</th>
                    {selectedProgs.map((p) => (
                      <td key={p.id}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>
                          {inr(p.feeTotal)}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          No hidden charges · All sem exams included
                        </div>
                      </td>
                    ))}
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
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                            Payable across {sems} semesters
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Degree Level & Category */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Degree Level</th>
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
                        <div style={{ fontSize: 12.5, color: '#475569', marginTop: 4 }}>
                          {p.category}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Duration */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Duration</th>
                    {selectedProgs.map((p) => (
                      <td key={p.id}>
                        <strong style={{ color: '#0F172A' }}>{p.durationMo} Months</strong>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          {p.durationMo / 12} Years (Flexible online pacing)
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Learning Mode */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Learning Mode</th>
                    {selectedProgs.map((p) => (
                      <td key={p.id}>
                        <span
                          className="uni-cmp-mini-badge"
                          style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE', fontWeight: 600 }}
                        >
                          {p.mode || '100% Online'}
                        </span>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
                          Live + Recorded Lectures on LMS
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Eligibility Criteria */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Eligibility Criteria</th>
                    {selectedProgs.map((p) => (
                      <td key={p.id}>
                        <div style={{ fontSize: 13.5, color: '#1E293B', fontWeight: 600 }}>
                          {p.eligibilityShort || 'Graduation / 10+2 from recognized board'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          Direct admission · Online document verification
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* University & Accreditations */}
                  <tr>
                    <th className="uni-cmp-table-header-col">University & NAAC</th>
                    {selectedProgs.map((p) => {
                      const u = universities.find((x) => x.id === p.universityId);
                      return (
                        <td key={p.id}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F172A', fontWeight: 600, fontSize: 13.5 }}>
                            <span>{u?.name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                            {u?.naacGrade && (
                              <span className="uni-cmp-mini-badge">
                                {u.naacGrade}
                              </span>
                            )}
                            <span className="uni-cmp-mini-badge" style={{ color: '#047857', background: '#ECFDF5', borderColor: '#A7F3D0' }}>
                              UGC-DEB Entitled
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Specialisations Offered */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Specialisations</th>
                    {selectedProgs.map((p) => (
                      <td key={p.id}>
                        {p.specialisations?.length > 0 ? (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {p.specialisations.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                style={{
                                  fontSize: 11.5,
                                  background: '#F1F5F9',
                                  padding: '2px 8px',
                                  borderRadius: 9999,
                                  color: '#334155',
                                  fontWeight: 500,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                            {p.specialisations.length > 4 && (
                              <span style={{ fontSize: 11.5, color: '#64748B', alignSelf: 'center' }}>
                                +{p.specialisations.length - 4} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: 13 }}>General Programme</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Direct Action */}
                  <tr>
                    <th className="uni-cmp-table-header-col">Action</th>
                    {selectedProgs.map((p) => (
                      <td key={p.id}>
                        <button
                          type="button"
                          className="uni-cmp-btn-compare-now"
                          style={{ width: '100%', justifyContent: 'center', padding: '9px 16px', fontSize: 13 }}
                          onClick={() => {
                            onClose();
                            if (onEnquire) onEnquire(p.name);
                          }}
                        >
                          Enquire Now
                        </button>
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
              Compare ({selectedProgs.length}/4):
            </span>

            {selectedProgs.map((p) => {
              const u = universities.find((x) => x.id === p.universityId);
              return (
                <div key={p.id} className="uni-cmp-chip">
                  <div className="uni-cmp-chip-thumb">
                    <UniversityLogo id={u?.id} name={u?.name || p.name} short={u?.short} size={20} />
                  </div>
                  <span className="uni-cmp-chip-name" title={p.name}>{p.shortName || p.name}</span>
                  <button
                    type="button"
                    className="uni-cmp-chip-remove"
                    onClick={() => onRemove(p.id)}
                    aria-label={`Remove ${p.name}`}
                    title="Remove from comparison"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            {/* Empty slots placeholders */}
            {selectedProgs.length === 0 ? (
              <span className="uni-cmp-tray-empty-hint">Select 2 to 4 programmes</span>
            ) : (
              Array.from({ length: Math.max(0, 4 - selectedProgs.length) }).map((_, idx) => (
                <div
                  key={idx}
                  className="uni-cmp-empty-slot"
                  style={{ cursor: viewMode === 'matrix' ? 'pointer' : 'default' }}
                  onClick={() => {
                    if (viewMode === 'matrix') setViewMode('picker');
                  }}
                >
                  <span>+</span>
                  <span>Add Programme</span>
                </div>
              ))
            )}
          </div>

          <div className="uni-cmp-bar-actions">
            {selectedProgs.length > 0 && (
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
                disabled={selectedProgs.length < 2}
                onClick={() => setViewMode('matrix')}
              >
                <span>Compare Now ({selectedProgs.length})</span>
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

// Floating tray component on Programme page (when modal is closed)
export function ProgrammeCompareFloatingTray({
  selectedIds = [],
  onRemove,
  onClear,
  onOpenModal,
}) {
  const selectedProgs = useMemo(() => {
    return selectedIds
      .map((id) => programmes.find((p) => p.id === id))
      .filter(Boolean)
      .filter((p, idx, self) => self.findIndex((o) => o.id === p.id) === idx);
  }, [selectedIds]);

  const isVisible = selectedProgs.length > 0;
  useFloatingTrayActive(isVisible);

  if (!isVisible) return null;

  return (
    <div className="uni-cmp-floating-tray" role="region" aria-label="Programme Comparison Tray">
      <div className="uni-cmp-tray-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="16 3 21 3 21 8" />
          <line x1="4" y1="20" x2="21" y2="3" />
          <polyline points="21 16 21 21 16 21" />
          <line x1="15" y1="15" x2="21" y2="21" />
          <line x1="4" y1="4" x2="9" y2="9" />
        </svg>
        <span>Compare ({selectedProgs.length}/4):</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {selectedProgs.map((p) => {
          const u = universities.find((x) => x.id === p.universityId);
          return (
            <div key={p.id} className="uni-cmp-chip">
              <div className="uni-cmp-chip-thumb">
                <UniversityLogo id={u?.id} name={u?.name || p.name} short={u?.short} size={18} />
              </div>
              <span className="uni-cmp-chip-name">{p.shortName || p.name}</span>
              <button
                type="button"
                className="uni-cmp-chip-remove"
                onClick={() => onRemove(p.id)}
                aria-label={`Remove ${p.name}`}
              >
                ✕
              </button>
            </div>
          );
        })}
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
        disabled={selectedProgs.length < 2}
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
