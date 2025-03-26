import { PluginCategory } from "../../types/plugins";
import { slugify } from "../../utils/string";
import { apiRequest } from "../api/base";

// Get all categories with their plugins from API
export async function getAllCategories(): Promise<PluginCategory[]> {
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
        description: plugin.description || `A tool for ${plugin.name}`,
        icon: plugin.icon || "",
        isPremium: plugin.isPremium,
        path: `/${slugify(plugin.name)}`,
      })),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
