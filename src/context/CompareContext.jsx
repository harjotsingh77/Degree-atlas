import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { programmes, universities } from '../data.js';

const Ctx = createContext(null);
const KEY = 'degreeatlas-compare-v1';

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  const [trayOpen, setTrayOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {} }, [ids]);

  const items = useMemo(() => ids.map((id) => {
    const p = programmes.find((prog) => prog.id === id);
    if (p) return p;
    const u = universities.find((uni) => uni.id === id);
    if (u) {
      const uniProg = programmes.find((prog) => prog.universityId === u.id);
      if (uniProg) return uniProg;
      return {
        id: u.id,
        universityId: u.id,
        name: `Online Programmes (${u.name})`,
        slug: u.slug,
        level: 'UG & PG Degrees',
        feeTotal: 120000,
        durationMo: 24,
        eligibilityShort: '10+2 / Graduation',
        mode: '100% Online',
        specialisations: ['Degree Programmes', 'Executive Studies'],
      };
    }
    return null;
  }).filter(Boolean), [ids]);

  const add = (id) => {
    if (ids.includes(id)) { setNotice('Already in comparison.'); return false; }
    if (ids.length >= 4) { setNotice('You can compare up to 4 universities. Remove one to add another.'); return false; }
    setIds([...ids, id]); setTrayOpen(true); setNotice('');
    return true;
  };
  const remove = (id) => setIds(ids.filter((x) => x !== id));
  const clear = () => setIds([]);

  return (
    <Ctx.Provider value={{ ids, items, add, remove, clear, count: ids.length, trayOpen, setTrayOpen, modalOpen, setModalOpen, notice, setNotice }}>
      {children}
    </Ctx.Provider>
  );
}
export const useCompare = () => useContext(Ctx);

let activeTrayCount = 0;

export function useFloatingTrayActive(isActive) {
  useEffect(() => {
    if (!isActive) return;
    activeTrayCount++;
    if (typeof document !== 'undefined') {
      document.body.classList.add('has-compare-tray');
    }
    return () => {
      activeTrayCount = Math.max(0, activeTrayCount - 1);
      if (activeTrayCount === 0 && typeof document !== 'undefined') {
        document.body.classList.remove('has-compare-tray');
      }
    };
  }, [isActive]);
}
