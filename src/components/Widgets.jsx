import { useState } from 'react';
import { inr } from '../data.js';

export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq-item ${isOpen ? 'open' : ''}`} key={f.q}>
            <button
              className="faq-q"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              id={`faq-btn-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{f.q}</span>
              <span className={`faq-toggle-icon ${isOpen ? 'open' : ''}`} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" className="faq-icon-v" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="faq-a" id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}>
                {f.a.split('\n\n').map((block, bIdx) => {
                  if (block.includes('• ')) {
                    const lines = block.split('\n').filter((l) => l.trim().length > 0);
                    return (
                      <ul className="faq-bullet-list" key={bIdx}>
                        {lines.map((line, lIdx) => {
                          const clean = line.replace(/^[•\s*-]+/, '').trim();
                          if (clean.includes(':')) {
                            const [k, ...v] = clean.split(':');
                            return (
                              <li className="faq-bullet-item" key={lIdx}>
                                <strong>{k}:</strong> {v.join(':').trim()}
                              </li>
                            );
                          }
                          return (
                            <li className="faq-bullet-item" key={lIdx}>
                              {clean}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }
                  return (
                    <p className="faq-p" key={bIdx}>
                      {block}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Curriculum({ data }) {
  const [open, setOpen] = useState([0]);
  const [expandAll, setExpandAll] = useState(false);
  const toggle = (i) => setOpen(open.includes(i) ? open.filter((x) => x !== i) : [...open, i]);
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => { setOpen(data.map((_, i) => i)); setExpandAll(true); }}>Expand All</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setOpen([]); setExpandAll(false); }}>Collapse All</button>
        <span className="muted" style={{ fontSize: 12.5, alignSelf: 'center' }}>Illustrative curriculum — not the official syllabus.</span>
      </div>
      {data.map((s, i) => (
        <div className="curr-item" key={s.sem}>
          <button className="curr-q" aria-expanded={open.includes(i)} onClick={() => toggle(i)}>
            {s.sem}<span aria-hidden="true">{open.includes(i) ? '−' : '+'}</span>
          </button>
          {open.includes(i) && (
            <div className="curr-a">
              {s.subjects.map((sub) => (
                <div key={sub.n} style={{ padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                  <strong style={{ color: 'var(--navy)' }}>{sub.n}</strong>
                  <div style={{ fontSize: 13.5 }}>{sub.d}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function EnquiryModal({ open, onClose, programmeName }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', consent: false });
  const [errs, setErrs] = useState({});
  const [done, setDone] = useState(false);
  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Enter your full name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!form.consent) errs.consent = 'Consent is required for the demo.';
    setErrs(errs);
    if (Object.keys(errs).length === 0) setDone(true);
  };
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Enquire">
      <div className="modal" style={{ maxWidth: 520, width: 'min(520px, calc(100vw - 24px))' }}>
        <div className="modal-head" style={{ gap: 12 }}>
          <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 44px)', fontSize: 16 }}>
            Enquire{programmeName ? ` — ${programmeName}` : ''}
          </strong>
          <button className="search-clear" onClick={onClose} aria-label="Close" style={{ flexShrink: 0 }}>✕</button>
        </div>
        <div className="modal-body">
          {!done ? (
            <form className="form-grid" onSubmit={submit} noValidate>
              <div className="muted" style={{ fontSize: 13.5 }}>Prototype only — details are validated locally, nothing is sent or stored.</div>
              <label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" style={{ minHeight: 46 }} />{errs.name && <span className="form-err">{errs.name}</span>}</label>
              <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" style={{ minHeight: 46 }} />{errs.email && <span className="form-err">{errs.email}</span>}</label>
              <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="numeric" placeholder="98XXXXXXXX" style={{ minHeight: 46 }} />{errs.phone && <span className="form-err">{errs.phone}</span>}</label>
              <label style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} style={{ width: 22, height: 22, minWidth: 22, marginTop: 2, cursor: 'pointer' }} /> <span>I agree to be contacted about this programme (demo consent).</span>{errs.consent && <span className="form-err">{errs.consent}</span>}</label>
              <button className="btn btn-accent" type="submit" style={{ minHeight: 46, width: '100%', borderRadius: 9999, fontWeight: 700 }}>Submit Enquiry</button>
            </form>
          ) : (
            <div className="success-box"><div style={{ fontSize: 36 }}>✓</div><h3>Enquiry noted (demo)</h3><p className="muted">Thanks {form.name.split(' ')[0] || 'there'} — this is a prototype success state. No data left your browser.</p><button className="btn btn-primary btn-sm" onClick={onClose} style={{ marginTop: 12 }}>Done</button></div>
          )}
        </div>
      </div>
    </div>
  );
}
