import {
  ArchiveBoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEventBus } from "../../hooks";
import { EVENTS, getAllCategories } from "../../services";
import { PluginCategory } from "../../types";
import { slugify, truncate } from "../../utils";
import { LoadingSpinner, PremiumBadge } from "../common/";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidePanel({ isOpen, onClose }: SidePanelProps) {
  // State for categories data
  const [categories, setCategories] = useState<PluginCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]); // Array of category names

  const fetchAllCategories = async () => {
    setIsLoading(true);
    try {
      const result = await getAllCategories();
      setCategories(result);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEventBus(EVENTS.SIDEBAR_REFRESH, () => {
    fetchAllCategories();
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      // If category is already expanded, collapse it
      setExpandedCategories(
        expandedCategories.filter((name) => name !== categoryName),
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
          className="fixed inset-0 z-10 bg-black opacity-50 transition-opacity"
          onClick={onClose} // Close panel when clicking outside the side panel
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 left-0 z-20 h-full w-96 transform bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Tools Menu</h2>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingSpinner className="h-full" />
          ) : categories.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
              <ArchiveBoxIcon className="mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-1 text-lg font-medium text-gray-900">
                No Categories Found
              </h3>
              <p className="text-gray-500">
                Something went wrong, there are no plugin categories available
                at the moment. Try refreshing the page.
              </p>
              <button
                onClick={fetchAllCategories}
                className="mt-4 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="space-y-2 px-6 py-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="overflow-hidden rounded-md border border-gray-200"
                >
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="flex w-full cursor-pointer items-center justify-between bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
                  >
                    <span className="line-clamp-1 font-medium">
                      {category.name}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform ${
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
                          className="group flex items-center justify-between border-t border-gray-100 bg-white p-3 hover:bg-gray-50"
                          onClick={onClose}
                        >
                          <div className="flex items-center gap-2 transition-all duration-200 ease-in-out group-hover:gap-4">
                            {/* Tool Icon */}
                            <div
                              className="flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: plugin.icon || "",
                              }}
                            />

                            {/* Tool Name */}
                            <span className="truncate text-gray-800">
                              {truncate(plugin.name, 20)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Premium Tag */}
                            {plugin.isPremium && (
                              <PremiumBadge variant="outlined" />
                            )}
                            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
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
