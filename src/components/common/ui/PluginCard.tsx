import { Link } from "react-router-dom";
import { AdminPlugin, Plugin } from "../../../types/plugins";
import { slugify } from "../../../utils/string";
import PremiumBadge from "./PremiumBadge";
import { useRef, useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useAuth, useFavorites } from "../../../hooks/";
import { AdminPluginControls } from "../../admin";

interface PluginCardProps {
  plugin: Plugin | AdminPlugin;
  iconSize?: "sm" | "md" | "lg";
  isAdminMode?: boolean;
  onPluginUpdated?: (
    pluginId: number,
    isActive: boolean,
    isPremium: boolean
  ) => void;
  onPluginDeleted?: (pluginId: number) => void;
}

/**
 * Plugin card component
 */
function PluginCard({
  plugin,
  iconSize = "md",
  isAdminMode = false,
  onPluginUpdated,
  onPluginDeleted,
}: PluginCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { isAuth } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Check if this plugin is an admin plugin with isActive property
  const isAdminPlugin = "isActive" in plugin;
  const isDisabled = isAdminPlugin && !plugin.isActive;

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  // Check if text is truncated when component mounts and on window resize
  useEffect(() => {
    const checkIfTruncated = () => {
      if (descriptionRef.current) {
        // Compare the scroll height to client height to detect truncation
        const isTruncated =
          descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight;
        setIsTextTruncated(isTruncated);
      }
    };

    // Initial check
    checkIfTruncated();

    // Check again if window resizes
    window.addEventListener("resize", checkIfTruncated);

    return () => {
      window.removeEventListener("resize", checkIfTruncated);
    };
  }, [plugin.description]);

  // Handle favorite button click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to the tool page
    e.stopPropagation(); // Prevent event bubbling

    if (isAuth) {
      toggleFavorite(plugin.id);
    }
  };

  const isFav = isAuth && isFavorite(plugin.id);

  return (
    <div
      className={`relative h-full ${isDisabled ? "opacity-50" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Admin controls overlay when in admin mode */}
      {isAdminPlugin && isAdminMode && isHovering && (
        <AdminPluginControls
          plugin={plugin as AdminPlugin}
          onPluginUpdated={onPluginUpdated!}
          onPluginDeleted={onPluginDeleted!}
        />
      )}

      {/* Disabled watermark for inactive plugins */}
      {isDisabled && (
        <div className="absolute top-4 -left-6 flex items-center justify-center z-5 pointer-events-none">
          <div className="bg-red-800 text-white px-4 py-1 transform -rotate-45 text-sm font-bold opacity-90 uppercase">
            DISABLED
          </div>
        </div>
      )}

      <Link
        to={`/tools/${slugify(plugin.name)}`}
        key={plugin.id}
        className="flex flex-col p-6 border bg-white border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all duration-200 relative group h-full"
      >
        {plugin.isPremium && (
          <span className="absolute top-2 left-2">
            <PremiumBadge />
          </span>
        )}
        {/* Favorite button */}
        {isAuth && !isAdminMode && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 cursor-pointer"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            {isFav ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutline className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}

        {plugin.icon && (
          <div
            className={`${sizeClasses[iconSize]} mb-4 mx-auto text-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform`}
            dangerouslySetInnerHTML={{ __html: plugin.icon || "" }}
          />
        )}

        <h3 className="font-medium text-center text-lg">{plugin.name}</h3>
        {plugin.description && (
          <div className="relative">
            <p
              ref={descriptionRef}
              className="text-sm text-gray-500 mt-2 text-center line-clamp-2 max-w-full"
            >
              {plugin.description}
            </p>
            {/* Full description tooltip on hover */}
            {isHovering && isTextTruncated && !isAdminMode && (
              <div className="absolute left-0 right-0 -bottom-2 transform translate-y-full bg-black text-white p-3 rounded-md shadow-lg z-10 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {plugin.description}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rotate-45"></div>
              </div>
            )}
          </div>
        )}

        {plugin.categoryName && (
          <div className="mt-auto pt-4 text-xs text-gray-400 text-center">
            {plugin.categoryName}
          </div>
        )}
      </Link>
    </div>
  );
}

export default PluginCard;
