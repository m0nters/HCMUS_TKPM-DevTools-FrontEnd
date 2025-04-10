import { apiRequest } from "../api/base";

/**
 * Executes a plugin with the given input data
 */
export const executePlugin = async (
  pluginId: number,
  inputData: Record<string, any>
): Promise<Record<string, any>> => {
  try {
    const response = await apiRequest<Record<string, any>>(
      `/plugin/${pluginId}/execution`,
      {
        method: "POST",
        body: JSON.stringify(inputData),
      }
    );
    return response;
  } catch (error) {
    console.error(`Error executing plugin ${pluginId}:`, error);
    throw error;
  }
};
