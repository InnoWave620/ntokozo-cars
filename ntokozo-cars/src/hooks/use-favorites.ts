import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@ntokozo_cars_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then((value) => {
      if (value) {
        try {
          setFavorites(JSON.parse(value));
        } catch {
          setFavorites([]);
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback((ids: string[]) => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
