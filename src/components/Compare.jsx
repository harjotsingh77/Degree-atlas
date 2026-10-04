import { Link, useLocation } from 'react-router-dom';
import { inr, universities } from '../data.js';
import { useCompare } from '../context/CompareContext.jsx';

export function CompareTray() {
  const location = useLocation();
  const isUniPage = location.pathname.startsWith('/universities/') && location.pathname !== '/universities';
  const isProgPage = location.pathname.startsWith('/programmes/') && location.pathname !== '/programmes';
  const isComparePage = location.pathname === '/compare';
  const { items, remove, clear, setModalOpen, trayOpen, setTrayOpen, notice } = useCompare();
  if (isUniPage || isProgPage || isComparePage || !trayOpen || items.length === 0) return null;
  return (
    <div className="tray" role="region" aria-label="Comparison tray">
      <div className="tray-left">
        <span className="tray-label">Compare</span>
        <span className="tray-badge">{items.length}/3</span>
      </div>
      <div className="tray-items">
        {items.map((p) => (
          <span key={p.id} className="tray-chip" title={p.name}>
            <span className="tray-chip-name">{p.shortName || p.name}</span>
            <button
              type="button"
              onClick={() => remove(p.id)}
              aria-label={`Remove ${p.name}`}
              className="tray-chip-remove"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="tray-actions">
        <Link to="/compare" className="tray-cta-btn">
          Compare Now
        </Link>
        <button
          type="button"
          onClick={clear}
          className="tray-clear-btn"
          title="Remove all items from comparison"
          aria-label="Remove all items"
        >
          <span className="tray-clear-text">Clear</span>
          <span className="tray-clear-icon">✕</span>
        </button>
        <button
          type="button"
          onClick={() => setTrayOpen(false)}
          className="tray-minimize-btn"
          title="Minimize tray"
          aria-label="Hide comparison tray"
        >
          –
        </button>
      </div>
      {notice && <span className="sr-only" role="status">{notice}</span>}
    </div>
  );
}

export function CompareModal() {
  const { items, remove, clear, modalOpen, setModalOpen, notice } = useCompare();
  if (!modalOpen) return null;
  const rows = [
    { label: 'University', get: (p) => universities.find((u) => u.id === p.universityId)?.name },
    { label: 'Programme', get: (p) => p.name },
    { label: 'Level', get: (p) => p.level },
    { label: 'Total fee', get: (p) => inr(p.feeTotal) },
    { label: 'Duration', get: (p) => `${p.durationMo} months` },
    { label: 'Eligibility', get: (p) => p.eligibilityShort },
    { label: 'Specialisations', get: (p) => (p.specialisations.length ? p.specialisations.join(', ') : '—') },
    { label: 'Mode', get: (p) => p.mode },
    { label: 'Recognition', get: () => 'UGC-DEB Recognized' },
  ];
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Compare programmes">
      <div className="modal">
        <div className="modal-head">
          <div><strong>Side-by-side comparison</strong><div className="muted" style={{ fontSize: 13 }}>Up to 3 programmes · Key parameters side-by-side</div></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={clear}>Remove All</button>
            <button className="search-clear" onClick={() => setModalOpen(false)} aria-label="Close comparison">✕</button>
          </div>
        </div>
        <div className="modal-body">
          {notice && <div className="empty" style={{ marginBottom: 12 }}>{notice}</div>}
          {items.length === 0 ? (
            <div className="empty"><strong>No programmes selected yet.</strong><div>Add programmes from any card to compare fees, duration and eligibility.</div><div style={{ marginTop: 12 }}><Link to="/#discover" className="btn btn-accent btn-sm" onClick={() => setModalOpen(false)}>Explore Programmes</Link></div></div>
          ) : (
            <table className="cmp-table">
              <thead><tr><th scope="col">Detail</th>{items.map((p) => (<th key={p.id} scope="col">{p.name}<br /><span className="muted" style={{ fontWeight: 500, fontSize: 12 }}>{universities.find((u) => u.id === p.universityId)?.name}</span><br /><button className="link-btn" onClick={() => remove(p.id)}>Remove</button></th>))}</tr></thead>
              <tbody>{rows.map((r) => (<tr key={r.label}><th scope="row">{r.label}</th>{items.map((p) => (<td key={p.id}>{r.get(p)}</td>))}</tr>))}</tbody>
            </table>
          )}
          <div className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>Matching vs missing values are shown plainly for scanning. Fees/approvals are illustrative — confirm on official sites before deciding.</div>
        </div>
      </div>
    </div>
  );
}
