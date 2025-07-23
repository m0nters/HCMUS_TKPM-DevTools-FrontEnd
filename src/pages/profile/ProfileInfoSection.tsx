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
import { useAuth, useDeleteAccountMutation } from "../../hooks/";

export function ProfileInfoSection() {
  const { profile } = useOutletContext<any>();
  const { isPremium, logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const deleteAccountMutation = useDeleteAccountMutation();

  const handleInitialDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setShowPasswordConfirm(true);
  };

  const handleDeleteAccount = async (password: string) => {
    deleteAccountMutation.mutate(
      { password },
      {
        onSuccess: () => {
          // Show success message briefly before logout
          setStatusMessage({
            message: "Account deleted successfully. Redirecting...",
            isError: false,
          });

          // Logout after a short delay
          setTimeout(() => {
            logout();
          }, 2000);
        },
        onError: (error: any) => {
          setStatusMessage({
            message:
              error.message ||
              "Failed to delete account. Please check your password and try again.",
            isError: true,
          });
        },
      },
    );
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowPasswordConfirm(false);
  };

  return (
    <>
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
        <h2 className="border-b pb-4 text-xl font-semibold">
          Profile Information
        </h2>
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
        {/* Danger Zone */}
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="mt-0.5 h-6 w-6 text-red-600" />
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-red-900">
                Danger Zone
              </h3>
              <p className="mb-4 text-red-700">
                Once you delete your account, there is no going back. This
                action cannot be undone. All your data, including favorites and
                preferences, will be permanently removed.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteAccountMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
              >
                <TrashIcon className="h-4 w-4" />
                {deleteAccountMutation.isPending
                  ? "Deleting..."
                  : "Delete Account"}
              </button>
            </div>
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
          isLoading={deleteAccountMutation.isPending}
          onConfirm={handleDeleteAccount}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}
