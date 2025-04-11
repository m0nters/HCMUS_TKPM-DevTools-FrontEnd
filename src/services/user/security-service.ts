import { withAuth } from "../api/auth-request";

/**
 * Changes the user's password
 * @param oldPassword Current password
 * @param newPassword New password
 * @param confirmNewPassword Confirmation of new password
 */
interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const changePassword = async (
  request: PasswordChangeRequest
): Promise<void> => {
  try {
    return await withAuth("/account/me/password-change", {
      method: "PUT",
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};
