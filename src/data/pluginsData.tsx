import { Plugin, PluginCategory } from "../types/plugins";
import {
  fetchAllPlugins,
  fetchAllCategories,
} from "../services/pluginsService";

// Get categories and their plugins from API
export const getCategories = async (): Promise<PluginCategory[]> => {
  try {
    const apiCategories = await fetchAllCategories();

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

// Helper function to get a flat list of all plugins
export const getAllPlugins = async (): Promise<Plugin[]> => {
  try {
    // Try to get data from API
    const apiPlugins = await fetchAllPlugins();

    // If successful and we got data, return it
    if (apiPlugins && apiPlugins.length > 0) {
      return apiPlugins;
    }

    // Fallback to static data if API fails or returns empty
    console.log("Using fallback data because API returned no results");
    return [];
  } catch (error) {
    // Fallback to static data if API call fails
    console.error("Error in getAllPlugins:", error);
    return [];
  }
};
