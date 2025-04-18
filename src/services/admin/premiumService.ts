import { UserProfile } from "../../types/user";
import { withAuth } from "../api";

/**
 * Gets all pending premium upgrade requests
 */
export const getPremiumRequests = async (): Promise<UserProfile[]> => {
  try {
    const requests = await withAuth<UserProfile[]>(
      "/admin/premium/upgrade-request"
    );
    return requests;
  } catch (error) {
    console.error("Failed to fetch premium upgrade requests:", error);
    return [];
  }
};

/**
 * Process (approve or reject) a premium upgrade request
 * @param userId The ID of the user whose request is being processed
 * @param isAccepted Whether to approve (true) or reject (false) the request
 */
export const processPremiumRequest = async (
  userId: string,
  isAccepted: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await withAuth<{ success: boolean; message: string }>(
      "/admin/premium/upgrade-request",
      {
        method: "POST",
        body: JSON.stringify({ userId, isAccepted }),
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to process premium request:", error);
    throw error;
  }
};
