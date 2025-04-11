import { UserCircleIcon, KeyIcon, StarIcon } from "@heroicons/react/24/outline";
import { UserProfile } from "../../types/user";
import { ProfileSection } from "./Profile";
import { PremiumBadge } from "../../components/common";

interface LeftSidebarProps {
  profile: UserProfile | null;
  activeSection: ProfileSection;
  setActiveSection: (section: ProfileSection) => void;
  isLoading?: boolean;
}

function LeftSidebar({
  profile,
  activeSection,
  setActiveSection,
  isLoading = false,
}: LeftSidebarProps) {
  // Get color based on role
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="w-full md:w-72 shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
        {/* Profile Avatar and Details */}
        {!isLoading && profile && (
          <div className="flex flex-col items-center mb-6">
            <img
              src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
                profile.fullName
              )}&size=96`}
              alt={`${profile.fullName}'s avatar`}
              className="w-24 h-24 rounded-full mb-4 shadow-sm"
            />
            <h2 className="text-xl font-semibold text-center">
              {profile.fullName}
            </h2>
            <div
              className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                profile.role
              )}`}
            >
              {profile.role}
            </div>
            {profile.isPremium && (
              <PremiumBadge variant="subtle" className="mt-2" />
            )}
          </div>
        )}

        {/* Skeleton loader for profile when loading */}
        {isLoading && (
          <div className="flex flex-col items-center mb-6 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded mt-2"></div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <button
            onClick={() => setActiveSection("info")}
            className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
              activeSection === "info"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UserCircleIcon className="w-5 h-5 mr-3" />
            Profile Information
          </button>

          <button
            onClick={() => setActiveSection("security")}
            className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
              activeSection === "security"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <KeyIcon className="w-5 h-5 mr-3" />
            Security & Password
          </button>

          <button
            onClick={() => setActiveSection("favorites")}
            className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
              activeSection === "favorites"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <StarIcon className="w-5 h-5 mr-3" />
            Favorite Tools
          </button>
        </nav>
      </div>
    </div>
  );
}

export default LeftSidebar;
