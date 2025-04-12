import { UserProfile } from "../../types/user";
function ProfileInfoSection({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-4">
        Profile Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          {profile.isPremium ? (
            <p className="flex items-center gap-2 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-green-600">Active</span>
            </p>
          ) : (
            <p className="flex items-center gap-2 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
              <span className="text-gray-500">Inactive</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoSection;
