import { HeartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  AlertMessage,
  Button,
  LoadingSpinner,
  PluginCard,
} from "../../components/";
import { useFavorites } from "../../hooks/";
import { getFavorites } from "../../services/";
import { Plugin } from "../../types/";

export function FavoritesSection() {
  const [favorites, setFavorites] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // Get access to the favorites context
  const { isFavorite, favorites: favoriteIds } = useFavorites();

  // Fetch favorite plugins
  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const favoritePlugins = await getFavorites();
      setFavorites(favoritePlugins);
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setError("Failed to load your favorite tools. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load favorites on component mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Listen to changes in the favorites list from context
  useEffect(() => {
    // If favorites context has changed, update our local list by filtering out removed items
    if (!isLoading && favorites.length > 0) {
      const updatedFavorites = favorites.filter((plugin) =>
        isFavorite(plugin.id),
      );

      // Only update state if something was actually removed
      if (updatedFavorites.length !== favorites.length) {
        setFavorites(updatedFavorites);
      }
    }
  }, [favoriteIds, isFavorite]); // React to changes in the favorites context

  if (isLoading) {
    return <LoadingSpinner size="lg" className="h-full" />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <AlertMessage
          message={error}
          isError={true}
          duration={3000}
          onDismiss={() => setError("")}
        />
        <Button onClick={fetchFavorites} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="py-12 text-center">
        <HeartIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900">
          No Favorite Tools Yet
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          You haven't saved any tools as favorites. Browse tools and click the
          heart icon to save them here.
        </p>
        <Button to="/explore" variant="secondary" className="mt-6">
          Browse Tools
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold">Favorite Tools</h2>
        <p className="text-sm text-gray-500">
          {favorites.length} {favorites.length === 1 ? "tool" : "tools"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((plugin) => (
          <PluginCard key={plugin.id} plugin={plugin} iconSize="md" />
        ))}
      </div>
    </div>
  );
}
