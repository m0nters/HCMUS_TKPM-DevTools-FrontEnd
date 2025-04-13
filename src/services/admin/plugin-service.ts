import { AdminPlugin } from "../../types/plugins";
import { withAuth } from "../api/auth-request";
import { slugify } from "../../utils/string";

/**
 * Fetches all plugins for admin (including inactive ones)
 */
export const getAllPluginsAdmin = async (): Promise<AdminPlugin[]> => {
  try {
    const plugins = await withAuth<any[]>("/admin/plugin");

    // Transform the API response to match our AdminPlugin type
    return plugins.map((plugin) => ({
      id: plugin.id,
      name: plugin.name,
      categoryId: plugin.categoryId,
      categoryName: plugin.categoryName || "",
      description: plugin.description || "",
      isPremium: plugin.isPremium || false,
      isActive: plugin.isActive || false,
      icon: plugin.icon || "",
      path: `/tools/${slugify(plugin.name)}`,
    }));
  } catch (error) {
    console.error("Failed to fetch admin plugins:", error);
    return [];
  }
};

/**
 * Toggle the active status of a plugin
 * @param pluginId The ID of the plugin to update
 * @param isActive Whether the plugin should be active
 */
export const togglePluginActive = async (
  pluginId: number,
  isActive: boolean
): Promise<boolean> => {
  try {
    await withAuth(`/admin/${pluginId}/activation?isActive=${isActive}`, {
      method: "POST",
    });
    return true;
  } catch (error) {
    console.error(`Failed to update plugin ${pluginId} active status:`, error);
    return false;
  }
};

/**
 * Toggle the premium status of a plugin
 * @param pluginId The ID of the plugin to update
 * @param isPremium Whether the plugin should be premium
 */
export const togglePluginPremium = async (
  pluginId: number,
  isPremium: boolean
): Promise<boolean> => {
  try {
    await withAuth(`/admin/${pluginId}/premium?isPremium=${isPremium}`, {
      method: "POST",
    });
    return true;
  } catch (error) {
    console.error(`Failed to update plugin ${pluginId} premium status:`, error);
    return false;
  }
};
