import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../services/plugins/";
import { PluginCategory } from "../../types/plugins";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { slugify, truncate } from "../../utils/string";
import { LoadingSpinner, PremiumBadge } from "../common";
import { useEventBus } from "../../hooks/useEventBus";
import { EVENTS } from "../../services/event-bus";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidePanel({ isOpen, onClose }: SidePanelProps) {
  // State for categories data
  const [categories, setCategories] = useState<PluginCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]); // Array of category names

  const fetchAllCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllCategories();
      setCategories(result);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEventBus(EVENTS.SIDEBAR_REFRESH, () => {
    fetchAllCategories();
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      // If category is already expanded, collapse it
      setExpandedCategories(
        expandedCategories.filter((name) => name !== categoryName)
      );
    } else {
      // If category is collapsed, expand it
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 transition-opacity"
          onClick={onClose} // Close panel when clicking outside the side panel
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white z-20 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Tools Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            LoadingSpinner({ size: "medium" })
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <ArchiveBoxIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Categories Found
              </h3>
              <p className="text-gray-500">
                Something went wrong, there are no plugin categories available
                at the moment. Try refreshing the page.
              </p>
              <button
                onClick={fetchAllCategories}
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="space-y-2 px-6 py-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="font-medium line-clamp-1">
                      {category.name}
                    </span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform ${
                        expandedCategories.includes(category.name)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Tool list under each currently opened category */}
                  {expandedCategories.includes(category.name) && (
                    <>
                      {category.plugins.map((plugin) => (
                        <Link
                          reloadDocument
                          to={`/tools/${slugify(plugin.name)}`}
                          key={plugin.id}
                          className="bg-white flex items-center justify-between p-3 hover:bg-gray-50 border-t border-gray-100 group"
                          onClick={onClose}
                        >
                          <div className="flex items-center gap-2 group-hover:gap-4 transition-all ease-in-out duration-200">
                            {/* Tool Icon */}
                            <div
                              className="flex-shrink-0 w-5 h-5 text-gray-700 flex items-center justify-center overflow-hidden"
                              dangerouslySetInnerHTML={{
                                __html: plugin.icon || "",
                              }}
                            />

                            {/* Tool Name */}
                            <span className="text-gray-800 truncate">
                              {truncate(plugin.name, 20)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Premium Tag */}
                            {plugin.isPremium && (
                              <PremiumBadge variant="outlined" />
                            )}
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SidePanel;
