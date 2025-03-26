import { Plugin } from "../../types/plugins";
import { slugify } from "../../utils/string";
import { apiRequest } from "../api/base";

/**
 * Fetches all available plugins from the API
 * @returns Promise resolving to an array of Plugin objects
 */
export const getAllPlugins = async (): Promise<Plugin[]> => {
  try {
    const plugins = await apiRequest<any[]>("/plugins/plugins");

    // Transform the API response to match our Plugin type
    return plugins.map((plugin) => ({
      id: plugin.id,
      name: plugin.name,
      category: plugin.category,
      categoryName: "", // This will be filled in later if needed
      description: plugin.description || "",
      isPremium: plugin.isPremium || false,
      icon: plugin.icon || "",
      path: `/${[slugify(plugin.name)]}`,
    }));
  } catch (error) {
    console.error("Failed to fetch plugins:", error);
    return [];
  }
};
