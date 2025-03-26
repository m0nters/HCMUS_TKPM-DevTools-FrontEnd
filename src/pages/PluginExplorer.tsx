import { useState, useEffect, useRef } from "react";
import { getAllCategories as getAllCategories } from "../services/plugins/categories";
import { Plugin, PluginCategory } from "../types/plugins";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, PluginCard } from "../components/common";

function PluginExplorer() {
  const [categories, setCategories] = useState<PluginCategory[]>([]);
  const [allPlugins, setAllPlugins] = useState<Plugin[]>([]);
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories & extract plugins
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);

        // Extract all plugins from categories
        const plugins = categoriesData.flatMap((category) =>
          category.plugins.map((plugin) => ({
            ...plugin,
            categoryName: category.name, // Add category name for display
          }))
        );

        setAllPlugins(plugins);
        setFilteredPlugins(plugins);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter plugins based on search query and filters
  useEffect(() => {
    let result = allPlugins;

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== null) {
      result = result.filter((plugin) => plugin.category === categoryFilter);
    }

    // Apply premium filter
    if (showPremiumOnly) {
      result = result.filter((plugin) => plugin.isPremium);
    }

    setFilteredPlugins(result);
  }, [searchQuery, categoryFilter, showPremiumOnly, allPlugins]);

  // Add ESC key and click outside => close dropdown
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    // Add both outside click and ESC key listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    // Clean up both listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  // Get the name of the current category
  const selectedCategoryName =
    categoryFilter !== null
      ? categories.find((c) => c.id === categoryFilter)?.name || "Unknown" // the "Unknown" part should never happen
      : "All Categories";

  return (
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-1/3 relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md hover:border-gray-400 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-black"
            >
              <span className="truncate">{selectedCategoryName}</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Options */}
            <div
              className={`absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-200 origin-top ${
                dropdownOpen
                  ? "opacity-100 transform scale-y-100 max-h-60"
                  : "opacity-0 transform scale-y-0 max-h-0"
              } overflow-y-auto`}
            >
              <div
                className="p-1"
                style={{ display: dropdownOpen ? "block" : "none" }}
              >
                <button
                  onClick={() => {
                    setCategoryFilter(null);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    categoryFilter === null ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  All Categories
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setCategoryFilter(category.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                      categoryFilter === category.id
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
          {filteredPlugins.map((plugin) =>
            PluginCard({ plugin, iconSize: "sm" })
          )}
        </div>
      )}

      {filteredPlugins.length === 0 && !isLoading && (
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
    </div>
  );
}

export default PluginExplorer;
