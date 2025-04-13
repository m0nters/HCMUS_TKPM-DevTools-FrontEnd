import { useState } from "react";
import { AdminPlugin } from "../../types/plugins";
import {
  togglePluginActive,
  togglePluginPremium,
} from "../../services/admin/plugin-service";
import {
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../common";

interface AdminPluginControlsProps {
  plugin: AdminPlugin;
  onPluginUpdated: (
    pluginId: number,
    isActive: boolean,
    isPremium: boolean
  ) => void;
}

/**
 * Admin controls that overlay on plugin cards when in admin mode
 */
function AdminPluginControls({
  plugin,
  onPluginUpdated,
}: AdminPluginControlsProps) {
  const [isUpdatingActive, setIsUpdatingActive] = useState(false);
  const [isUpdatingPremium, setIsUpdatingPremium] = useState(false);

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdatingActive) return;

    setIsUpdatingActive(true);
    try {
      const success = await togglePluginActive(plugin.id, !plugin.isActive);
      if (success) {
        onPluginUpdated(plugin.id, !plugin.isActive, plugin.isPremium);
      }
    } catch (error) {
      console.error("Failed to toggle plugin active status:", error);
    } finally {
      setIsUpdatingActive(false);
    }
  };

  const handleTogglePremium = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdatingPremium) return;

    setIsUpdatingPremium(true);
    try {
      const success = await togglePluginPremium(plugin.id, !plugin.isPremium);
      if (success) {
        onPluginUpdated(plugin.id, plugin.isActive, !plugin.isPremium);
      }
    } catch (error) {
      console.error("Failed to toggle plugin premium status:", error);
    } finally {
      setIsUpdatingPremium(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 rounded-lg flex flex-col items-center justify-center gap-4 z-1">
      <div className="text-center text-white mb-2">
        <h3 className="font-semibold">{plugin.name}</h3>
        <p className="text-xs opacity-80">Admin Controls</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleToggleActive}
          disabled={isUpdatingActive}
          className={`p-2 rounded-md transition-colors ${
            plugin.isActive
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={plugin.isActive ? "Disable plugin" : "Enable plugin"}
        >
          {isUpdatingActive ? (
            <LoadingSpinner size="small" />
          ) : plugin.isActive ? (
            <EyeIcon className="w-5 h-5 text-white" />
          ) : (
            <EyeSlashIcon className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={handleTogglePremium}
          disabled={isUpdatingPremium}
          className={`p-2 rounded-md transition-colors ${
            plugin.isPremium
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
          title={plugin.isPremium ? "Make free" : "Make premium"}
        >
          {isUpdatingPremium ? (
            <LoadingSpinner size="small" />
          ) : (
            <SparklesIcon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      <div className="mt-2 text-center">
        <div className="text-xs text-white">
          <span
            className={`${plugin.isActive ? "text-green-400" : "text-red-400"}`}
          >
            {plugin.isActive ? "Active" : "Inactive"}
          </span>
          <span className="mx-1">•</span>
          <span
            className={`${
              plugin.isPremium ? "text-purple-400" : "text-gray-400"
            }`}
          >
            {plugin.isPremium ? "Premium" : "Free"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminPluginControls;
