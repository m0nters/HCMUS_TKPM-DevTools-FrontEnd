import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AdminModeToggle,
  AlertMessage,
  DropdownMenu,
  LoadingSpinner,
  PluginCard,
} from "../components/";
import { useAuth, useDebounce } from "../hooks";
import {
  eventBus,
  EVENTS,
  getAllCategories,
  getAllPlugins,
  getAllPluginsAdmin,
} from "../services/";
import { AdminPlugin, Plugin, PluginCategory } from "../types";
import { estimateReadingTime } from "../utils/";

export function PluginExplorer() {
  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();

  // Hooks
  const [allCategories, setAllCategories] = useState<PluginCategory[]>([]);
  const [allPlugins, setAllPlugins] = useState<Plugin[] | AdminPlugin[]>([]);
  const [filteredPlugins, setFilteredPlugins] = useState<
    Plugin[] | AdminPlugin[]
  >([]);

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(
    searchParams.get("category") ? Number(searchParams.get("category")) : null,
  );
  const [showPremiumOnly, setShowPremiumOnly] = useState(
    searchParams.get("isPremiumOnly") === "true",
  );
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  // Auth hook to check if user is admin
  const { isAdmin } = useAuth();

  // Debounce the search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery);

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    if (categoryFilter !== null) {
      params.set("category", categoryFilter.toString());
    }

    if (showPremiumOnly) {
      params.set("isPremiumOnly", "true");
    }

    // Update URL without triggering navigation
    setSearchParams(params, { replace: true });
  };

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
          plugin.description?.toLowerCase().includes(searchQuery.toLowerCase()),
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
    updateURL(); // Update URL when filters change
  }, [debouncedSearchQuery, categoryFilter, showPremiumOnly, allPlugins]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter(null);
    setShowPremiumOnly(false);
    // Clear URL params
    setSearchParams({}, { replace: true });
  };

  // Handle plugin updates from admin controls
  const onPluginUpdated = (
    pluginId: number,
    isActive: boolean,
    isPremium: boolean,
  ) => {
    // Update plugins in the state
    const updatedPlugins = allPlugins.map((plugin) =>
      plugin.id === pluginId ? { ...plugin, isActive, isPremium } : plugin,
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
      (plugin) => plugin.id !== pluginId,
    );
    setAllPlugins(updatedPlugins);

    // Update filtered plugins list as well
    setFilteredPlugins(
      filteredPlugins.filter((plugin) => plugin.id !== pluginId),
    );

    // Show success message
    setStatusMessage({
      message: `${pluginName} was deleted successfully`,
      isError: false,
    });

    // Emit event to refresh sidebar
    eventBus.emit(EVENTS.SIDEBAR_REFRESH);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || categoryFilter !== null || showPremiumOnly;

  return (
    <>
      <article>
        <title>Explore All Tools | IT Tools</title>
        <meta name="description" content="Explore all available plugins." />
      </article>
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-12">
        <h1 className="mb-6 text-3xl font-bold">Explore All Tools</h1>

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

        {/* Control Bar - Admin Mode Toggle & Reset Filters */}
        <div className="mb-6 flex items-center justify-between">
          {/* Admin mode toggle - only visible for admins */}
          {isAdmin ? (
            <AdminModeToggle
              isAdminMode={isAdminMode}
              onToggle={setIsAdminMode}
            />
          ) : (
            <div /> // Empty div to maintain flex layout
          )}

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />

              {/* Dynamic icon */}
              {isSearching ? (
                <ArrowPathIcon className="absolute top-2.5 right-3 h-5 w-5 animate-spin text-gray-500" />
              ) : (
                <MagnifyingGlassIcon className="absolute top-2.5 right-3 h-5 w-5 text-gray-500" />
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
            <div className="flex w-full items-center md:w-1/6">
              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={() => setShowPremiumOnly(!showPremiumOnly)}
                  className="sr-only"
                />
                <span
                  className={`h-6 w-10 rounded-full transition ${
                    showPremiumOnly ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`mt-1 ml-1 block h-4 w-4 transform rounded-full transition ${
                      showPremiumOnly ? "translate-x-4 bg-white" : "bg-white"
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
            <span className="animated-gradient ml-2 rounded-md px-2 py-0.5 text-xs font-medium text-white">
              Hover over a plugin...
            </span>
          )}
        </p>

        {/* Tools Grid */}
        {isLoading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : filteredPlugins.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              onClick={clearAllFilters}
              className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
