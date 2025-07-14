import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useFavorites } from "../../../hooks/";
import { AdminPlugin, Plugin } from "../../../types/";
import { slugify } from "../../../utils/";
import { AdminPluginControls } from "../../admin/";
import { ClickSpark } from "../animations/";
import { PremiumBadge } from "./PremiumBadge";

interface PluginCardProps {
  plugin: Plugin | AdminPlugin;
  iconSize?: "sm" | "md" | "lg";
  isAdminMode?: boolean;
  onPluginUpdated?: (
    pluginId: number,
    isActive: boolean,
    isPremium: boolean,
  ) => void;
  onPluginDeleted?: (pluginId: number) => void;
}

/**
 * Plugin card component
 */
export function PluginCard({
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
        <div className="pointer-events-none absolute top-4 -left-6 z-5 flex items-center justify-center">
          <div className="-rotate-45 transform bg-red-800 px-4 py-1 text-sm font-bold text-white uppercase opacity-90">
            DISABLED
          </div>
        </div>
      )}

      <Link
        to={`/tools/${slugify(plugin.name)}`}
        key={plugin.id}
        className="group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-black hover:shadow-md"
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
            className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <ClickSpark
              sparkColor="#fb2c36"
              sparkSize={10}
              sparkRadius={35}
              sparkCount={8}
              duration={400}
              extraScale={0.5}
            >
              {isFav ? (
                <HeartSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutline className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </ClickSpark>
          </button>
        )}

        {plugin.icon && (
          <div
            className={`${sizeClasses[iconSize]} mx-auto mb-4 flex items-center justify-center text-gray-800 transition-transform group-hover:scale-110`}
            dangerouslySetInnerHTML={{ __html: plugin.icon || "" }}
          />
        )}

        <h3 className="text-center text-lg font-medium">{plugin.name}</h3>
        {plugin.description && (
          <div className="relative">
            <p
              ref={descriptionRef}
              className="mt-2 line-clamp-2 max-w-full text-center text-sm text-gray-500"
            >
              {plugin.description}
            </p>
            {/* Full description tooltip on hover */}
            {isHovering && isTextTruncated && !isAdminMode && (
              <div className="absolute right-0 -bottom-2 left-0 z-10 translate-y-full transform rounded-md bg-black p-3 text-sm text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {plugin.description}
                <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform bg-black"></div>
              </div>
            )}
          </div>
        )}

        {plugin.categoryName && (
          <div className="mt-auto pt-4 text-center text-xs text-gray-400">
            {plugin.categoryName}
          </div>
        )}
      </Link>
    </div>
  );
}
