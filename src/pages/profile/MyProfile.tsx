import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner, ProfileSidePanel } from "../../components/";
import { useProfile } from "../../hooks/";

export function MyProfile() {
  const location = useLocation();

  // Use React Query to fetch profile data
  const { data: profile, isLoading, error, refetch } = useProfile();

  if (location.pathname === "/profile") {
    return <Navigate to="/profile/info" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-12">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Sidebar */}
        <ProfileSidePanel profile={profile || null} isLoading={isLoading} />

        {/* Main Content Area */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {isLoading ? (
            <LoadingSpinner size="lg" className="h-full" />
          ) : error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
              <div className="mb-2">
                {error instanceof Error
                  ? error.message
                  : "Failed to load profile data"}
              </div>
              <button
                onClick={() => refetch()}
                className="text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <Outlet context={{ profile }} />
          )}
        </div>
      </div>
    </div>
  );
}
