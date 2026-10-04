import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programmes, universities } from '../data.js';

export function SearchBar({ level, setLevel }) {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const nav = useNavigate();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const out = [];
    programmes.filter((p) => !level || p.level === level).forEach((p) => {
      const uni = universities.find((u) => u.id === p.universityId);
      const hay = `${p.name} ${p.category} ${uni?.name} ${p.specialisations.join(' ')}`.toLowerCase();
      if (hay.includes(needle)) out.push({ type: 'Programme', title: `${p.name} · ${uni?.name}`, sub: `${p.level} · ${p.durationMo} mo`, slug: `/programmes/${p.slug}` });
    });
    universities.forEach((u) => {
      if (u.name.toLowerCase().includes(needle)) out.push({ type: 'University', title: u.name, sub: u.location, slug: `/universities/${u.slug}` });
    });
    return out.slice(0, 6);
  }, [q, level]);

  const isUG = (level || '') === 'UG' || (level || '') === '';

  return (
    <div className="hero-search-block">
      <div className="ugpg-toggle" role="tablist" aria-label="Degree level">
        <button role="tab" aria-selected={isUG} className={isUG ? 'active' : ''} onClick={() => setLevel('UG')}>
          Undergraduate (UG)
        </button>
        <button role="tab" aria-selected={level === 'PG'} className={level === 'PG' ? 'active' : ''} onClick={() => setLevel('PG')}>
          Postgraduate (PG)
        </button>
      </div>
      <div className="hero-search-wrap">
        <div className="hero-search-row">
          <span className="hero-search-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#14142B" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="#14142B" strokeWidth="2" strokeLinecap="round" /></svg>
          </span>
          <input
            id="hero-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            placeholder="Search universities, degrees or specialisations..."
            aria-label="Search universities, degrees or specialisations"
          />
          {q && <button className="search-clear" onClick={() => setQ('')} aria-label="Clear search">✕</button>}
          <button className="hero-search-go" aria-label="Search" onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
        {focus && q.trim() && (
          <div className="suggestions" role="listbox" aria-label="Search suggestions">
            {results.length === 0 ? (
              <div style={{ padding: 18 }}><strong>No matches for “{q}”.</strong><div className="muted" style={{ fontSize: 13 }}>Try “MBA”, “BCA”, “M.Com” or a university name.</div></div>
            ) : results.map((r) => (
              <button key={r.slug + r.title} onClick={() => nav(r.slug)}>
                <span className="badge">{r.type}</span><span><strong>{r.title}</strong><br /><span className="muted">{r.sub}</span></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
