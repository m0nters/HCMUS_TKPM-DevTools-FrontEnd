import { useAuth } from "../../hooks/useAuth";
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

  // Only show for admins
  if (!isAdmin) return null;

  return (
    <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
      <ShieldCheckIcon className="w-5 h-5 text-yellow-700 mr-2" />
      <span className="text-sm text-yellow-800 font-medium mr-4">
        Admin Mode
      </span>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isAdminMode}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <div
          className={`w-11 h-6 rounded-full peer transition-colors ${
            isAdminMode ? "bg-yellow-600" : "bg-gray-300"
          } peer-focus:ring-2 peer-focus:ring-yellow-400`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
              isAdminMode ? "translate-x-6" : "translate-x-1"
            } mt-1`}
          />
        </div>
      </label>
    </div>
  );
}

export default AdminModeToggle;
