import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner, ProfileSidePanel } from "../../components/";
import { getProfile } from "../../services/";
import { UserProfile } from "../../types";

export function MyProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Fetch user profile data
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        const fetchedProfileData = await getProfile();
        setProfile(fetchedProfileData);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  if (location.pathname === "/profile") {
    return <Navigate to="/profile/info" replace />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 px-6 pb-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <ProfileSidePanel profile={profile} isLoading={isLoading} />

        {/* Main Content Area */}
        <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
              {error}
            </div>
          ) : (
            <Outlet context={{ profile }} />
          )}
        </div>
      </div>
    </div>
  );
}
