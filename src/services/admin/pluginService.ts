import { AdminPlugin } from "../../types/plugins";
import { withAuth } from "../api/authRequest";
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

/**
 * Delete a plugin
 * @param pluginId The ID of the plugin to delete
 */
export const deletePlugin = async (pluginId: number): Promise<boolean> => {
  try {
    await withAuth(`/admin/plugin/${pluginId}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete plugin ${pluginId}:`, error);
    return false;
  }
};

/**
 * Get plugin statistics summary
 */
export const getPluginStats = async () => {
  try {
    const plugins = await getAllPluginsAdmin();

    return {
      totalTools: plugins.length,
      activeTools: plugins.filter((plugin) => plugin.isActive).length,
      premiumTools: plugins.filter((plugin) => plugin.isPremium).length,
    };
  } catch (error) {
    console.error("Failed to get plugin stats:", error);
    return {
      totalTools: 0,
      activeTools: 0,
      premiumTools: 0,
    };
  }
};

/**
 * Upload a new plugin with optional library files
 * @param pluginFile The main plugin DLL file
 * @param libraryFiles Optional array of library DLL files
 */
export const uploadPlugin = async (
  pluginFile: File,
  libraryFiles: File[] = []
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();

    // Add the main plugin file
    formData.append("DllFile", pluginFile, pluginFile.name);

    // Add any library files
    libraryFiles.forEach((file) => {
      formData.append("Libaries", file, file.name);
    });

    const response = await withAuth<{ success: boolean; message: string }>(
      "/admin/plugin",
      {
        method: "POST",
        body: formData,
        // Don't set Content-Type here - the browser will set it with the correct boundary
      }
    );

    return response;
  } catch (error) {
    console.error("Failed to upload plugin:", error);
    throw error;
  }
};
