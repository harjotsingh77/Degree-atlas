import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { programmes, universities } from '../data.js';

const ShortlistCtx = createContext(null);
const STORAGE_KEY = 'degreeatlas-shortlist-v1';

export function ShortlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const isShortlisted = (id) => ids.includes(id);

  const toggleShortlist = (id) => {
    setIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const addShortlist = (id) => {
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeShortlist = (id) => {
    setIds((prev) => prev.filter((item) => item !== id));
  };

  const clearShortlist = () => {
    setIds([]);
  };

  // Resolved shortlisted items
  const items = useMemo(() => {
    return ids.map((id) => {
      const prog = programmes.find((p) => p.id === id);
      if (prog) {
        const uni = universities.find((u) => u.id === prog.universityId);
        return {
          id: prog.id,
          type: 'programme',
          prog,
          uni,
        };
      }
      const uni = universities.find((u) => u.id === id);
      if (uni) {
        return {
          id: uni.id,
          type: 'university',
          uni,
        };
      }
      return null;
    }).filter(Boolean);
  }, [ids]);

  const shortlistedProgrammes = useMemo(() => {
    return items.filter((it) => it.type === 'programme');
  }, [items]);

  const shortlistedUniversities = useMemo(() => {
    return items.filter((it) => it.type === 'university');
  }, [items]);

  return (
    <ShortlistCtx.Provider
      value={{
        ids,
        count: ids.length,
        isShortlisted,
        toggleShortlist,
        addShortlist,
        removeShortlist,
        clearShortlist,
        items,
        shortlistedProgrammes,
        shortlistedUniversities,
      }}
    >
      {children}
    </ShortlistCtx.Provider>
  );
}

export const useShortlist = () => {
  const context = useContext(ShortlistCtx);
  if (!context) {
    throw new Error('useShortlist must be used within a ShortlistProvider');
  }
  return context;
};
