import { PluginCategory } from "../types/plugins";
import { getAllCategories } from "../services/plugins/categories";

// Get categories and their plugins from API
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
