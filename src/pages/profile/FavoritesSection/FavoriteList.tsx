import { HeartIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import { Button, PluginCard } from "../../../components/";
import { Plugin } from "../../../types/";

interface FavoriteListProps {
  favorites: Plugin[];
}

export const FavoriteList = memo(function FavoriteList({
  favorites,
}: FavoriteListProps) {
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
});
