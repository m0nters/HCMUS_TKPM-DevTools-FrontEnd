import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/";

interface AdminModeToggleProps {
  isAdminMode: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Toggle component for enabling/disabling admin mode in the explorer
 */
export function AdminModeToggle({
  isAdminMode,
  onToggle,
}: AdminModeToggleProps) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div
      className={`mb-4 flex w-fit items-center gap-6 rounded-md p-3 shadow-md transition-all duration-300 ${
        isAdminMode
          ? "bg-gradient-to-r from-blue-600 to-purple-600"
          : "border border-gray-200 bg-gray-100"
      }`}
    >
      <div className="flex items-center">
        <ShieldCheckIcon
          className={`mr-2 h-5 w-5 ${
            isAdminMode ? "text-white" : "text-gray-500"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            isAdminMode ? "text-white" : "text-gray-700"
          }`}
        >
          Admin Mode
        </span>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={isAdminMode}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <div
          className={`peer h-6 w-12 rounded-full transition-all ${
            isAdminMode
              ? "bg-white shadow-inner"
              : "border border-gray-300 bg-gray-200"
          } peer-focus:ring-2 peer-focus:ring-blue-200`}
        >
          <div
            className={`absolute top-1 h-4 w-4 transform rounded-full transition-all ${
              isAdminMode
                ? "translate-x-7 bg-purple-600"
                : "translate-x-1 bg-gray-500"
            }`}
          />
        </div>

        <span
          className={`ml-3 text-xs font-medium ${
            isAdminMode ? "text-white" : "text-gray-600"
          }`}
        >
          {isAdminMode ? "ON" : "OFF"}
        </span>
      </label>
    </div>
  );
}
