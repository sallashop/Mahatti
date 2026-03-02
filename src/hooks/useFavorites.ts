import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "mahatati_favorites";
const FAVORITES_EXPIRY_KEY = "mahatati_favorites_expiry";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const expiry = localStorage.getItem(FAVORITES_EXPIRY_KEY);
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem(FAVORITES_KEY);
      localStorage.removeItem(FAVORITES_EXPIRY_KEY);
      setFavorites([]);
      return;
    }
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try { setFavorites(JSON.parse(stored)); } catch { setFavorites([]); }
    }
  }, []);

  const toggle = useCallback((stationId: string) => {
    setFavorites(prev => {
      const next = prev.includes(stationId)
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      localStorage.setItem(FAVORITES_EXPIRY_KEY, String(Date.now() + ONE_WEEK_MS));
      return next;
    });
  }, []);

  const isFavorite = useCallback((stationId: string) => favorites.includes(stationId), [favorites]);

  return { favorites, toggle, isFavorite };
}
