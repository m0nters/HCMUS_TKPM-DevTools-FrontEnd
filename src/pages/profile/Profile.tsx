import { useState, useEffect } from "react";
import { LoadingSpinner } from "../../components/common";
import { getProfile } from "../../services/user/user-service";
import { UserProfile } from "../../types/user";
import SecuritySection from "./SecuritySection";
import ProfileInfoSection from "./ProfileInfoSection";
import FavoritesSection from "./FavoriteSection";
import LeftSidebar from "./LeftSidebar";

// Profile sections
export type ProfileSection = "info" | "security" | "favorites";

function Profile() {
  const [activeSection, setActiveSection] = useState<ProfileSection>("info");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile data
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        const fetchedProfileData = await getProfile();
        const updatedProfileData = {
          ...fetchedProfileData,
          isPremium:
            fetchedProfileData.role === "Premium" ||
            fetchedProfileData.role === "Admin",
        };
        setProfile(updatedProfileData);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  // Render different content based on active section
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          {error}
        </div>
      );
    }

    if (!profile) return null;

    switch (activeSection) {
      case "info":
        return <ProfileInfoSection profile={profile} />;
      case "security":
        return <SecuritySection />;
      case "favorites":
        return <FavoritesSection userId={profile.id} />;
      default:
        return <ProfileInfoSection profile={profile} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 px-6 pb-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <LeftSidebar
          profile={profile}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isLoading={isLoading}
        />

        {/* Main Content Area */}
        <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Section Components

export default Profile;
