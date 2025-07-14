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
export function ProfileSidePanel({
  profile,
  isLoading = false,
}: SidePanelProps) {
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
      icon: <UserCircleIcon className="h-5 w-5" />,
      label: "Profile Information",
      to: "info",
    },
    {
      icon: <KeyIcon className="h-5 w-5" />,
      label: "Security & Password",
      to: "security",
    },
    {
      icon: <HeartIcon className="h-5 w-5" />,
      label: "Favorite Tools",
      to: "favorites",
    },
  ];

  return (
    <div className="w-full shrink-0 md:w-72">
      <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Profile Avatar and Details */}
        {!isLoading && profile && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
                profile.fullName,
              )}&size=96`}
              alt={`${profile.fullName}'s avatar`}
              className="mb-4 h-24 w-24 rounded-full shadow-sm"
            />
            <h2 className="text-center text-xl font-semibold">
              {profile.fullName}
            </h2>
            <div
              className={`mt-2 rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                profile.role,
              )}`}
            >
              {profile.role}
            </div>
          </div>
        )}

        {/* Skeleton loader for profile when loading */}
        {isLoading && (
          <div className="mb-6 flex animate-pulse flex-col items-center">
            <div className="mb-4 h-24 w-24 rounded-full bg-gray-200"></div>
            <div className="mb-2 h-5 w-32 rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-20 rounded bg-gray-200"></div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map(({ icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-4 py-3 transition-all duration-200 ease-in-out hover:gap-4 ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                } `
              }
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
