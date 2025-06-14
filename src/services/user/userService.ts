import { UserProfile } from "../../types/";
import { withAuth } from "../api/";
/**
 * Fetches the current user's profile information
 * Requires authentication - will automatically use the token from storage
 */
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const userProfile = await withAuth<UserProfile>("/account/me");
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
