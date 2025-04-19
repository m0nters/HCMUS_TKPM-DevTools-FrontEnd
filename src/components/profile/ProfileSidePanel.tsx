import {
  UserCircleIcon,
  KeyIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { UserProfile } from "../../types/";
import { NavLink } from "react-router-dom";

interface SidePanelProps {
  profile: UserProfile | null;
  isLoading?: boolean;
}

/**
 * Profile sidebar component displaying user information and navigation
 */
function ProfileSidePanel({ profile, isLoading = false }: SidePanelProps) {
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

  const navItems = [
    {
      icon: <UserCircleIcon className="w-5 h-5" />,
      label: "Profile Information",
      to: "info",
    },
    {
      icon: <KeyIcon className="w-5 h-5" />,
      label: "Security & Password",
      to: "security",
    },
    {
      icon: <HeartIcon className="w-5 h-5" />,
      label: "Favorite Tools",
      to: "favorites",
    },
  ];

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
          {navItems.map(({ icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center px-4 py-3 gap-2 hover:gap-4 rounded-md transition-all ease-in-out duration-200
                ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default ProfileSidePanel;
