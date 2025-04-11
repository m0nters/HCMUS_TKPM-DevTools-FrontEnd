import { UserProfile } from "../../types/user";
import { withAuth } from "../api/auth-request";
import { Plugin } from "../../types/plugins";
import { slugify } from "../../utils/string";
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
