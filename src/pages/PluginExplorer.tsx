import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { AdminModeToggle } from "../components/";
import {
  AlertMessage,
  DropdownMenu,
  LoadingSpinner,
  PluginCard,
} from "../components/common";
import { useAuth, useDebounce } from "../hooks";
import { getAllPluginsAdmin } from "../services/admin";
import { eventBus, EVENTS } from "../services/eventBus";
import { getAllCategories, getAllPlugins } from "../services/plugins";
import { AdminPlugin, Plugin, PluginCategory } from "../types";
import { estimateReadingTime } from "../utils/";

export function PluginExplorer() {
  // Hooks
  const [allCategories, setAllCategories] = useState<PluginCategory[]>([]);
  const [allPlugins, setAllPlugins] = useState<Plugin[] | AdminPlugin[]>([]);
  const [filteredPlugins, setFilteredPlugins] = useState<
    Plugin[] | AdminPlugin[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  // Auth hook to check if user is admin
  const { isAdmin } = useAuth();

  // Debounce the search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch plugins based on admin mode
      let fetchedPlugins;
      if (isAdmin && isAdminMode) {
        fetchedPlugins = await getAllPluginsAdmin();
      } else {
        fetchedPlugins = await getAllPlugins();
      }

      const fetchedCategories = await getAllCategories();
      setAllPlugins(fetchedPlugins);
      setAllCategories(fetchedCategories);

      // Apply current filters to newly fetched data
      applyFilters(fetchedPlugins);
    } catch (error) {
      console.error("Failed to load data:", error);
      setStatusMessage({
        message: "Failed to load plugins. Please try again.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to plugin list
  const applyFilters = (plugins: Plugin[] | AdminPlugin[]) => {
    let result = [...plugins];

    // Apply category filter
    if (categoryFilter !== null) {
      result = result.filter((plugin) => plugin.categoryId === categoryFilter);
    }

    // Apply premium filter
    if (showPremiumOnly) {
      result = result.filter((plugin) => plugin.isPremium);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlugins(result);
  };

  // Category options for dropdown
  const categoryOptions = [
    { value: null, label: "All Categories" },
    ...allCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  // Fetch data when component mounts or admin mode changes
  useEffect(() => {
    fetchData();
  }, [isAdminMode, isAdmin]);

  // Apply filters when search query, category filter, or premium filter changes
  useEffect(() => {
    applyFilters(allPlugins);
    setIsSearching(false);
  }, [debouncedSearchQuery, categoryFilter, showPremiumOnly, allPlugins]);

  // Handle plugin updates from admin controls
  const onPluginUpdated = (
    pluginId: number,
    isActive: boolean,
    isPremium: boolean
  ) => {
    // Update plugins in the state
    const updatedPlugins = allPlugins.map((plugin) =>
      plugin.id === pluginId ? { ...plugin, isActive, isPremium } : plugin
    );

    setAllPlugins(updatedPlugins);

    // Show a success message
    setStatusMessage({
      message: `Plugin "${
        updatedPlugins.find((p) => p.id === pluginId)?.name
      }" updated successfully`,
      isError: false,
    });

    // Emit event to refresh sidebar also
    eventBus.emit(EVENTS.SIDEBAR_REFRESH);
  };

  // Handler for plugin deletion
  const onPluginDeleted = (pluginId: number) => {
    // Find the deleted plugin name for the message
    const deletedPlugin = allPlugins.find((p) => p.id === pluginId);
    const pluginName = deletedPlugin?.name || "Plugin";

    // Remove the plugin from state
    const updatedPlugins = allPlugins.filter(
      (plugin) => plugin.id !== pluginId
    );
    setAllPlugins(updatedPlugins);

    // Update filtered plugins list as well
    setFilteredPlugins(
      filteredPlugins.filter((plugin) => plugin.id !== pluginId)
    );

    // Show success message
    setStatusMessage({
      message: `${pluginName} was deleted successfully`,
      isError: false,
    });

    // Emit event to refresh sidebar
    eventBus.emit(EVENTS.SIDEBAR_REFRESH);
  };

  return (
    <>
      <article>
        <title>Explore All Tools | IT Tools</title>
        <meta name="description" content="Explore all available plugins." />
      </article>
      <div className="w-full max-w-7xl mx-auto pt-24 px-6 pb-12">
        <h1 className="text-3xl font-bold mb-6">Explore All Tools</h1>

        {/* Status messages */}
        {statusMessage && (
          <AlertMessage
            message={statusMessage.message}
            isError={statusMessage.isError}
            duration={estimateReadingTime(statusMessage.message)}
            onDismiss={() => setStatusMessage(null)}
            position="top-center"
          />
        )}

        {/* Admin mode toggle - only visible for admins */}
        {isAdmin && (
          <AdminModeToggle
            isAdminMode={isAdminMode}
            onToggle={setIsAdminMode}
          />
        )}

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Search */}
            <div className="w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />

              {/* Dynamic icon */}
              {isSearching ? (
                <ArrowPathIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" />
              )}
            </div>

            {/* Category Filter */}
            <DropdownMenu
              options={categoryOptions}
              selectedValue={categoryFilter}
              onSelect={(value) => setCategoryFilter(value as number | null)}
              className="w-full md:w-1/3"
              disabled={isLoading}
            />

            {/* Premium Filter */}
            <div className="w-full md:w-1/6 flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={() => setShowPremiumOnly(!showPremiumOnly)}
                  className="sr-only"
                />
                <span
                  className={`w-10 h-6 rounded-full transition ${
                    showPremiumOnly ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 mt-1 ml-1 rounded-full transition transform ${
                      showPremiumOnly ? "bg-white translate-x-4" : "bg-white"
                    }`}
                  />
                </span>
                <span className="ml-2 text-sm">Premium Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-gray-600">
          Showing {filteredPlugins.length} of {allPlugins.length} tools
          {isAdminMode && (
            <span className="ml-2 animated-gradient text-white px-2 py-0.5 rounded-md text-xs font-medium">
              Hovering over a plugin...
            </span>
          )}
        </p>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPlugins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                iconSize="md"
                isAdminMode={isAdminMode}
                onPluginUpdated={onPluginUpdated}
                onPluginDeleted={onPluginDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500">
              No tools found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter(null);
                setShowPremiumOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
