import { Plugin } from "../../types/plugins";
import { withAuth } from "../api/auth-request";
import { slugify } from "../../utils/string";

/**
 * Get user's favorite plugins
 */
export const getFavorites = async (): Promise<Plugin[]> => {
  try {
    const favorites = await withAuth<any[]>("/me/favorite");

    // Transform the API response to match our Plugin type
    return favorites.map((plugin) => ({
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
    console.error("Error fetching favorites:", error);
    return [];
  }
};

/**
 * Add a plugin to favorites
 * @param pluginId The ID of the plugin to add to favorites
 */
export const addFavorite = async (pluginId: number): Promise<boolean> => {
  try {
    await withAuth("/me/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pluginId }),
    });
    return true;
  } catch (error) {
    console.error(`Error adding plugin ${pluginId} to favorites:`, error);
    return false;
  }
};

/**
 * Remove a plugin from favorites
 * @param pluginId The ID of the plugin to remove from favorites
 */
export const removeFavorite = async (pluginId: number): Promise<boolean> => {
  try {
    await withAuth("/me/favorite", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pluginId }),
    });
    return true;
  } catch (error) {
    console.error(`Error removing plugin ${pluginId} from favorites:`, error);
    return false;
  }
};
