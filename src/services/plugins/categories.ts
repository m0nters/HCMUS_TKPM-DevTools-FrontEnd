import { PluginCategory } from "../../types/plugins";
import { slugify } from "../../utils/string";
import { apiRequest } from "../api/base";

/**
 * Fetches all available plugin categories from the API.
 * @returns Promise resolving to an array of `PluginCategory` objects
 */
export const getAllCategories = async (): Promise<PluginCategory[]> => {
  try {
    const data = await apiRequest<any[]>("/PluginCategory/Categories");

    return data.map((category) => ({
      id: category.id,
      name: category.name,
      plugins: category.plugins.map((plugin: any) => ({
        id: plugin.id,
        name: plugin.name,
        category: category.id,
        categoryName: category.name,
        description: plugin.description || "",
        icon: plugin.icon || "",
        isPremium: plugin.isPremium,
        path: `/${slugify(plugin.name)}`,
      })),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
