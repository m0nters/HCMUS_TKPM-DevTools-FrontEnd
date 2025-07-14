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
    <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-12">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Sidebar */}
        <ProfileSidePanel profile={profile} isLoading={isLoading} />

        {/* Main Content Area */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {isLoading ? (
            <LoadingSpinner size="lg" className="h-full" />
          ) : error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
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
