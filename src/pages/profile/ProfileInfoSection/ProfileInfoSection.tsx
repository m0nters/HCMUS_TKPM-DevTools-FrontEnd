import { useCallback, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertMessage,
  ConfirmDialog,
  PasswordConfirmDialog,
} from "../../../components/";
import { useAuth, useDeleteAccountMutation } from "../../../hooks/";
import { estimateReadingTime } from "../../../utils";
import { DangerZone } from "./DangerZone";
import { ProfileInfoDisplay } from "./ProfileInfoDisplay";

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

  const handleInitialDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
    setShowPasswordConfirm(true);
  }, []);

  const handleDeleteAccount = useCallback(
    async (password: string) => {
      deleteAccountMutation.mutate(
        { password },
        {
          onSuccess: () => {
            setStatusMessage({
              message: "Account deleted successfully. Redirecting...",
              isError: false,
            });
            setTimeout(() => logout(), 2000);
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
    },
    [deleteAccountMutation, logout],
  );

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setShowPasswordConfirm(false);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  return (
    <>
      <div className="space-y-6">
        {statusMessage && (
          <AlertMessage
            message={statusMessage.message}
            isError={statusMessage.isError}
            duration={estimateReadingTime(statusMessage.message)}
            onDismiss={() => setStatusMessage(null)}
            position="top-center"
          />
        )}

        <h2 className="border-b pb-4 text-xl font-semibold">
          Profile Information
        </h2>

        <ProfileInfoDisplay profile={profile} isPremium={isPremium} />

        <DangerZone
          onDeleteClick={handleDeleteClick}
          isDeleting={deleteAccountMutation.isPending}
        />
      </div>

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
