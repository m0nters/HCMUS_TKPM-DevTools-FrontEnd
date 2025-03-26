// src/components/common/PluginCard.tsx
import { Link } from "react-router-dom";
import { Plugin } from "../../types/plugins";
import { slugify } from "../../utils/string";
import PremiumBadge from "./PremiumBadge";

interface PluginCardProps {
  plugin: Plugin;
  iconSize?: "sm" | "md" | "lg";
}

function PluginCard({ plugin, iconSize = "md" }: PluginCardProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <Link
      to={`/${slugify(plugin.name)}`}
      key={plugin.id}
      className="flex flex-col p-6 border bg-white border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all duration-200 relative group"
    >
      {plugin.isPremium && (
        <span className="absolute top-2 left-2">
          <PremiumBadge />
        </span>
      )}
      <div
        className={`${sizeClasses[iconSize]} mb-4 mx-auto text-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform`}
        dangerouslySetInnerHTML={{ __html: plugin.icon || "" }}
      />
      <h3 className="font-medium text-center text-lg">{plugin.name}</h3>
      <p className="text-sm text-gray-500 mt-2 text-center line-clamp-2 max-w-full">
        {plugin.description || ""}
      </p>
      <div className="mt-auto pt-4 text-xs text-gray-400 text-center">
        {plugin.categoryName}
      </div>
    </Link>
  );
}

export default PluginCard;
