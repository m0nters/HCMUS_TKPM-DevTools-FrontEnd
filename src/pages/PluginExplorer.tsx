import { useState, useEffect } from "react";
import { Plugin, PluginCategory } from "../types/plugins";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import DropdownMenu from "../components/common/Components/DropdownMenu";
import { LoadingSpinner, PluginCard } from "../components/common";
import {
  getAllPlugins,
  getSearchedPlugins,
  getAllCategories,
} from "../services/plugins/";
import { useDebounce } from "../hooks/useDebounce";

function PluginExplorer() {
  // Hooks
  const [allCategories, setAllCategories] = useState<PluginCategory[]>([]);
  const [allPlugins, setAllPlugins] = useState<Plugin[]>([]);
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Debounce the search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedPlugins = await getAllPlugins();
      const fetchedCategories = await getAllCategories();
      setAllPlugins(fetchedPlugins);
      setAllCategories(fetchedCategories);
      setFilteredPlugins(fetchedPlugins); // the category is `All categories` at first, always
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = [
    { value: null, label: "All Categories" },
    ...allCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  // Fetch all plugins and categories at first for initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Search and filter
  useEffect(() => {
    const fetchFilteredPlugins = async () => {
      // Client side code
      let result = allPlugins;

      const search = () => {
        if (searchQuery.trim()) {
          result = result.filter(
            (plugin) =>
              plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              plugin.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        }
      };

      const filter = () => {
        if (categoryFilter !== null) {
          result = result.filter(
            (plugin) => plugin.categoryId === categoryFilter
          );
        }

        if (showPremiumOnly) {
          result = result.filter((plugin) => plugin.isPremium);
        }
      };

      filter();
      search();
      setFilteredPlugins(result);
      setIsSearching(false);

      // // server side code (suck! but it mitigates the client's load)
      // try {
      //   const result = await getSearchedPlugins(
      //     searchQuery,
      //     categoryFilter,
      //     showPremiumOnly
      //   );
      //   setFilteredPlugins(result);
      // } catch (error) {
      //   console.error("Error searching plugins:", error);
      // } finally {
      //   setIsSearching(false);
      // }
    };

    fetchFilteredPlugins();
  }, [debouncedSearchQuery, categoryFilter, showPremiumOnly]);

  return (
    <>
      <article>
        <title>Explore All Tools | IT Tools</title>
        <meta name="description" content="Explore all available plugins." />
      </article>
      <div className="w-full max-w-7xl mx-auto pt-24 px-6 pb-12">
        <h1 className="text-3xl font-bold mb-6">Explore All Tools</h1>
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

              {/* Dynamic icon: Show spinner when searching, otherwise show magnifying glass */}
              {isSearching ? (
                <ArrowPathIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" />
              )}

              {/* Optional: Add "Searching..." text below input when searching */}
              {isSearching && (
                <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
                  Searching...
                </div>
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
        </p>
        {/* Tools Grid */}
        {isLoading ? (
          LoadingSpinner({ size: "large" })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlugins.map((plugin) => (
              <PluginCard key={plugin.id} plugin={plugin} iconSize="md" />
            ))}
          </div>
        )}
        {filteredPlugins.length === 0 &&
          allPlugins.length !== 0 &&
          !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No tools found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter(null);
                  setShowPremiumOnly(false);
                }}
                className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Clear All Filters
              </button>
            </div>
          )}
        {!allPlugins.length && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tools found.</p>
            <p className="text-gray-500">
              The system hasn't have any tool yet. Please check back later.
            </p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default PluginExplorer;
