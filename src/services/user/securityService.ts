import { withAuth } from "../api/authRequest";

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
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await withAuth<{ success: boolean; message: string }>(
      "/account/me/password-change",
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    );
    return response;
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};
