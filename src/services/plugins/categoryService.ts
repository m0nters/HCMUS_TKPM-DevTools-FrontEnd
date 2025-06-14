import { PluginCategory } from "../../types/";
import { slugify } from "../../utils/";
import { apiRequest } from "../api/";

/**
 * Fetches all available plugin categories and children plugins from the API.
 * Only use for SidePanel component.
 * @returns Promise resolving to an array of `PluginCategory` objects
 */
export const getAllCategories = async (): Promise<PluginCategory[]> => {
  try {
    const data = await apiRequest<any[]>("/plugin-category");

    return data.map((category) => ({
      id: category.id,
      name: category.name,
      plugins: category.plugins.map((plugin: any) => ({
        id: plugin.id,
        name: plugin.name,
        categoryId: category.id,
        categoryName: category.name || "",
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
