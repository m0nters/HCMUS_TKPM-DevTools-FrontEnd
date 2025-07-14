import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { getFavorites, addFavorite, removeFavorite } from "../services/";
import { useAuth } from "../hooks/";

interface FavoritesContextType {
  favorites: Set<number>;
  isLoading: boolean;
  toggleFavorite: (pluginId: number) => Promise<void>;
  isFavorite: (pluginId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  isLoading: false,
  toggleFavorite: async () => {},
  isFavorite: () => false,
  refreshFavorites: async () => {},
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth } = useAuth();

  // Function to refresh favorites from the API
  const refreshFavorites = useCallback(async () => {
    if (!isAuth) {
      setFavorites(new Set());
      return;
    }

    try {
      setIsLoading(true);
      const favPlugins = await getFavorites();
      setFavorites(new Set(favPlugins.map((plugin) => plugin.id)));
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuth]);

  // Load favorites when the component mounts or auth state changes
  useEffect(() => {
    refreshFavorites();
  }, [isAuth, refreshFavorites]);

  // Function to check if a plugin is a favorite
  const isFavorite = useCallback(
    (pluginId: number): boolean => {
      return favorites.has(pluginId);
    },
    [favorites],
  );

  // Function to toggle favorite status
  const toggleFavorite = async (pluginId: number) => {
    if (!isAuth) return;

    try {
      if (isFavorite(pluginId)) {
        // Remove from favorites
        const success = await removeFavorite(pluginId);
        if (success) {
          setFavorites((prev) => {
            const updated = new Set(prev);
            updated.delete(pluginId);
            return updated;
          });
        }
      } else {
        // Add to favorites
        const success = await addFavorite(pluginId);
        if (success) {
          setFavorites((prev) => {
            const updated = new Set(prev);
            updated.add(pluginId);
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        toggleFavorite,
        isFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
