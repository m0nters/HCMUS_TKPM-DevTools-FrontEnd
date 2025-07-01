import {
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertMessage,
  ConfirmDialog,
  PasswordConfirmDialog,
} from "../../components/";
import { useAuth } from "../../hooks/";
import { deleteAccount } from "../../services/";

export function ProfileInfoSection() {
  const { profile } = useOutletContext<any>();
  const { isPremium, logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const handleInitialDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setShowPasswordConfirm(true);
  };

  const handleDeleteAccount = async (password: string) => {
    setIsDeleting(true);
    try {
      await deleteAccount({
        password,
      });

      // Show success message briefly before logout
      setStatusMessage({
        message: "Account deleted successfully. Redirecting...",
        isError: false,
      });

      // Logout after a short delay
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      setStatusMessage({
        message:
          "Failed to delete account. Please check your password and try again.",
        isError: true,
      });
    } finally {
      setIsDeleting(false);
      setShowPasswordConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowPasswordConfirm(false);
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Status messages */}
      {statusMessage && (
        <AlertMessage
          message={statusMessage.message}
          isError={statusMessage.isError}
          duration={5000}
          onDismiss={() => setStatusMessage(null)}
          position="top-center"
        />
      )}

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
          {isPremium ? (
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

      {/* Danger Zone */}
      <div className="mt-12 border border-red-200 rounded-lg p-6 bg-red-50">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Danger Zone
            </h3>
            <p className="text-red-700 mb-4">
              Once you delete your account, there is no going back. This action
              cannot be undone. All your data, including favorites and
              preferences, will be permanently removed.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-md transition-colors cursor-pointer"
            >
              <TrashIcon className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>

      {/* Initial Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Account"
          message="Are you absolutely sure you want to delete your account? This action cannot be undone."
          confirmText="Yes, Delete my account"
          cancelText="Cancel"
          isLoading={false}
          onConfirm={handleInitialDeleteConfirm}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Password Confirmation Dialog */}
      {showPasswordConfirm && (
        <PasswordConfirmDialog
          isOpen={showPasswordConfirm}
          title="For security reasons, please enter your password."
          message="Please enter your password to confirm account deletion."
          confirmText="Delete My Account"
          cancelText="Cancel"
          isLoading={isDeleting}
          onConfirm={handleDeleteAccount}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
