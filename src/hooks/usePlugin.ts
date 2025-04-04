import { useContext } from "react";
import { PluginsContext } from "../contexts/PluginsContext";

/**
 * Hook for accessing plugin-related functionality
 */
export function usePlugins() {
  return useContext(PluginsContext);
}
