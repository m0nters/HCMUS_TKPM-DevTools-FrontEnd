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

/**
 * Fetches all available favorite plugins from the API
 * @returns Promise resolving to an array of Plugin objects
 */
export const getFavoritePlugins = async (): Promise<Plugin[]> => {
  try {
    const plugins = await withAuth<any[]>("/me/favorite", {
      method: "GET",
    });

    // Transform the API response to match our Plugin type
    return plugins.map((plugin) => ({
      id: plugin.id,
      name: plugin.name,
      categoryId: plugin.categoryId,
      categoryName: plugin.categoryName || "",
      description: plugin.description || "",
      isPremium: plugin.isPremium || false,
      icon: plugin.icon || "",
      path: `/tools/${slugify(plugin.name)}`,
    }));
  } catch (error) {
    console.error("Failed to fetch plugins:", error);
    return [];
  }
};
