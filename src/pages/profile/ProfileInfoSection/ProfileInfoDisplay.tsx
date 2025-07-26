import { memo } from "react";
import { UserProfile } from "../../../types/";

interface ProfileInfoDisplayProps {
  profile: UserProfile;
  isPremium: boolean;
}

export const ProfileInfoDisplay = memo(function ProfileInfoDisplay({
  profile,
  isPremium,
}: ProfileInfoDisplayProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <p className="text-sm text-gray-500">Full Name</p>
        <p className="font-medium">{profile.fullName}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Email Address</p>
        <p className="font-medium">{profile.email}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Account Type</p>
        <p className="font-medium">{profile.role}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Premium Status</p>
        {isPremium ? (
          <p className="flex items-center gap-2 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-green-600">Active</span>
          </p>
        ) : (
          <p className="flex items-center gap-2 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-400"></span>
            <span className="text-gray-500">Inactive</span>
          </p>
        )}
      </div>
    </div>
  );
});
