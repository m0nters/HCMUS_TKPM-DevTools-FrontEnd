import { withAuth } from "../api/";

/**
 * Submit a request to upgrade the current user's account to premium status
 * @returns Promise with the result of the upgrade request
 */
export const requestPremiumUpgrade = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await withAuth<{ success: boolean; message: string }>(
      "/account/me/premium/upgrade-submit",
      {
        method: "POST",
      },
    );
    return response;
  } catch (error) {
    console.error("Premium upgrade request failed:", error);
    throw error;
  }
};
