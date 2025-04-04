import { createContext, useState, useEffect, ReactNode } from "react";
import { Plugin, PluginCategory } from "../types/plugins";
import { PluginSchema } from "../types/pluginSchema";
import { getAllPlugins } from "../services/plugins/plugins";
import { getAllCategories } from "../services/plugins/categories";
import { getPluginSchema } from "../services/plugins/schema";
import { executePlugin } from "../services/plugins/execute";

interface PluginsContextType {
  // Basic plugin data
  plugins: Plugin[];
  categories: PluginCategory[];
  isLoading: boolean;
  loadingError: string | null;

  // Active plugin related
  activePluginId: number | null;
  activePlugin: PluginSchema | null;
  isSchemaLoading: boolean;
  schemaError: string | null;

  // Execution related
  isExecuting: boolean;
  executionError: string | null;
  executionResult: Record<string, any> | null;

  // Methods
  fetchPlugins: () => Promise<void>;
  setActivePlugin: (pluginId: number | null) => Promise<void>;
  executeActivePlugin: (
    inputs: Record<string, any>
  ) => Promise<Record<string, any>>;
  clearExecutionResult: () => void;
}

export const PluginsContext = createContext<PluginsContextType>({
  // Default values
  plugins: [],
  categories: [],
  isLoading: false,
  loadingError: null,

  activePluginId: null,
  activePlugin: null,
  isSchemaLoading: false,
  schemaError: null,

  isExecuting: false,
  executionError: null,
  executionResult: null,

  fetchPlugins: async () => {},
  setActivePlugin: async () => {},
  executeActivePlugin: async () => ({}),
  clearExecutionResult: () => {},
});

interface PluginsProviderProps {
  children: ReactNode;
}

export function PluginsProvider({ children }: PluginsProviderProps) {
  // Plugin collections
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [categories, setCategories] = useState<PluginCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Active plugin
  const [activePluginId, setActivePluginId] = useState<number | null>(null);
  const [activePlugin, setActivePlugin] = useState<PluginSchema | null>(null);
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<Record<
    string,
    any
  > | null>(null);

  // Fetch all plugins and categories
  const fetchPlugins = async () => {
    setIsLoading(true);
    setLoadingError(null);

    try {
      const [fetchedPlugins, fetchedCategories] = await Promise.all([
        getAllPlugins(),
        getAllCategories(),
      ]);

      setPlugins(fetchedPlugins);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to fetch plugins:", error);
      setLoadingError("Failed to load plugins. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Set active plugin and fetch its schema
  const changeActivePlugin = async (pluginId: number | null) => {
    // Clear previous active plugin
    setActivePluginId(pluginId);
    setActivePlugin(null);
    setSchemaError(null);
    clearExecutionResult();

    // If null, we're just clearing the selection
    if (pluginId === null) return;

    // Fetch schema for the new active plugin
    setIsSchemaLoading(true);
    try {
      const schema = await getPluginSchema(pluginId);
      setActivePlugin(schema);
    } catch (error) {
      console.error(`Failed to fetch schema for plugin ${pluginId}:`, error);
      setSchemaError("Failed to load plugin details. Please try again later.");
    } finally {
      setIsSchemaLoading(false);
    }
  };

  // Execute the active plugin
  const executeActivePluginWithData = async (
    inputs: Record<string, any>
  ): Promise<Record<string, any>> => {
    if (!activePluginId) {
      const error = "No active plugin to execute";
      setExecutionError(error);
      return Promise.reject(new Error(error));
    }

    setIsExecuting(true);
    setExecutionError(null);
    setExecutionResult(null);

    try {
      const result = await executePlugin(activePluginId, inputs);
      setExecutionResult(result);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to execute plugin";
      console.error(`Error executing plugin ${activePluginId}:`, error);
      setExecutionError(errorMessage);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  };

  // Clear execution results
  const clearExecutionResult = () => {
    setExecutionResult(null);
    setExecutionError(null);
  };

  // Load plugins on mount
  useEffect(() => {
    fetchPlugins();
  }, []);

  return (
    <PluginsContext.Provider
      value={{
        plugins,
        categories,
        isLoading,
        loadingError,

        activePluginId,
        activePlugin,
        isSchemaLoading,
        schemaError,

        isExecuting,
        executionError,
        executionResult,

        fetchPlugins,
        setActivePlugin: changeActivePlugin,
        executeActivePlugin: executeActivePluginWithData,
        clearExecutionResult,
      }}
    >
      {children}
    </PluginsContext.Provider>
  );
}
