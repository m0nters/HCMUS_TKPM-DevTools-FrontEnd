import { useAuth } from "../../hooks/";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

interface AdminModeToggleProps {
  isAdminMode: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Toggle component for enabling/disabling admin mode in the explorer
 */
function AdminModeToggle({ isAdminMode, onToggle }: AdminModeToggleProps) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div
      className={`flex items-center gap-6 w-fit p-3 rounded-md mb-4 shadow-md transition-all duration-300 ${
        isAdminMode
          ? "bg-gradient-to-r from-blue-600 to-purple-600"
          : "bg-gray-100 border border-gray-200"
      }`}
    >
      <div className="flex items-center">
        <ShieldCheckIcon
          className={`w-5 h-5 mr-2 ${
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

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isAdminMode}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <div
          className={`w-12 h-6 rounded-full peer transition-all ${
            isAdminMode
              ? "bg-white shadow-inner"
              : "bg-gray-200 border border-gray-300"
          } peer-focus:ring-2 peer-focus:ring-blue-200`}
        >
          <div
            className={`absolute w-4 h-4 rounded-full transform transition-all top-1 ${
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
export default AdminModeToggle;
