import { PluginCategory } from "../types/plugins";
import { getAllCategories } from "../services/plugins/categories";

/**
 * Fetches the plugin categories from the API.
 * If the API is not available, it will fallback to empty data
 * @returns Promise that resolves to an array of `PluginCategory` objects
 */
export const getCategories = async (): Promise<PluginCategory[]> => {
  try {
    const apiCategories = await getAllCategories();

    if (apiCategories && apiCategories.length > 0) {
      return apiCategories;
    }

    // Fallback to static data
    console.log("Using fallback category data");
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
