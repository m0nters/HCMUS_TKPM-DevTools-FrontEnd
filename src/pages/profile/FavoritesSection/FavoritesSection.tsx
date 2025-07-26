import { useEffect } from "react";
import { LoadingSpinner } from "../../../components/";
import { useFavorites, useFavoritesQuery } from "../../../hooks/";
import { Plugin } from "../../../types/";
import { ErrorState } from "./ErrorState";
import { FavoriteList } from "./FavoriteList";

export function FavoritesSection() {
  // Get access to the favorites context
  const { isFavorite, favorites: favoriteIds } = useFavorites();

  // Use React Query to fetch favorites
  const {
    data: favorites = [],
    isLoading,
    error,
    refetch,
  } = useFavoritesQuery();

  // Listen to changes in the favorites list from context
  useEffect(() => {
    // If favorites context has changed, refetch to get updated list
    if (favorites.length > 0) {
      const updatedFavorites = favorites.filter((plugin: Plugin) =>
        isFavorite(plugin.id),
      );

      // Only refetch if something was actually removed
      if (updatedFavorites.length !== favorites.length) {
        refetch();
      }
    }
  }, [favoriteIds, isFavorite, favorites.length, refetch]); // React to changes in the favorites context

  if (isLoading) {
    return <LoadingSpinner size="lg" className="h-full" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return <FavoriteList favorites={favorites} />;
}
