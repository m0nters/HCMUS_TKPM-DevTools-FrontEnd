import { Plugin } from "../../types/";
import { slugify } from "../../utils/";
import { apiRequest } from "../api/request";

/**
 * Fetches all available plugins from the API
 * @returns Promise resolving to an array of Plugin objects
 */
export const getAllPlugins = async (): Promise<Plugin[]> => {
  try {
    const plugins = await apiRequest<any[]>("/plugin");

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

/**
 * Searches for plugins based on name, category, and premium status
 * @param name - Optional name filter
 * @param categoryId - Optional category ID filter
 * @param premium - Optional premium status filter
 * @returns Promise resolving to filtered Plugin array
 */
export const getSearchedPlugins = async (
  name: string | null,
  categoryId: number | null,
  premium: boolean | null
): Promise<Plugin[]> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (name) params.append("Name", name);
    if (categoryId) params.append("CategoryId", categoryId.toString());
    if (premium) params.append("Premium", premium.toString());

    // Create the endpoint with query string
    const queryString = params.toString();
    const endpoint = `/plugin/search${queryString ? `?${queryString}` : ""}`;

    // Make the API request
    const plugins = await apiRequest<any[]>(endpoint);

    // Transform the API response to match our Plugin type
    return plugins.map((plugin) => ({
      id: plugin.id,
      name: plugin.name,
      categoryId: plugin.categoryId,
      categoryName: plugin.categoryName || "",
      description: plugin.description || "",
      isPremium: plugin.isPremium || false,
      icon: plugin.icon || "",
      path: `/${slugify(plugin.name)}`,
    }));
  } catch (error) {
    console.error("Failed to search plugins:", error);
    return [];
  }
};
