import { Plugin, PluginCategory } from "../types/plugins";

// Get all plugins from the API
export const fetchAllPlugins = async (): Promise<Plugin[]> => {
  try {
    const response = await fetch(`/api/plugins/plugins`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching plugins:", error);
    // Return empty array if API fails
    return [];
  }
};

// Get all categories with their plugins from API
export const fetchAllCategories = async (): Promise<PluginCategory[]> => {
  try {
    const response = await fetch(`/api/PluginCategory/Categories`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Get the raw data
    const data = await response.json();

    // Map the API response to match our expected format
    // Transform the data to match our PluginCategory type
    const categories: PluginCategory[] = data.map((category: any) => ({
      id: category.id,
      name: category.name,
      plugins: category.plugins.map((plugin: any) => ({
        id: plugin.id,
        name: plugin.name,
        category: category.id,
        description: plugin.description || `A tool for ${plugin.name}`,
        icon: plugin.icon || "",
        isPremium: plugin.isPremium,
        path: `/${plugin.name.toLowerCase().replace(/\s+/g, "-")}`,
      })),
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return empty array if API fails
    return [];
  }
};
