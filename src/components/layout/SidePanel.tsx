import React, { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../data/toolsData";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidePanel({ isOpen, onClose }: SidePanelProps) {
  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(
        expandedCategories.filter((name) => name !== categoryName)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Tools Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-6 pt-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="font-medium">{category.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-4 h-4 transition-transform ${
                      expandedCategories.includes(category.name)
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {/* Tool list under each category */}
                {expandedCategories.includes(category.name) && (
                  <div className="bg-white">
                    {category.tools.map((tool) => (
                      <Link
                        to={tool.path}
                        key={tool.path}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 border-t border-gray-100"
                        onClick={onClose}
                      >
                        <div className="flex items-center">
                          {/* Tool Icon */}
                          <div className="flex-shrink-0 w-5 h-5 mr-2 text-gray-700 flex items-center justify-center overflow-hidden">
                            {React.cloneElement(
                              tool.icon as React.ReactElement
                            )}
                          </div>
                          {/* Tool Name */}
                          <span className="text-gray-800">{tool.name}</span>
                          {/* Premium Tag */}
                          {tool.premium && (
                            <span className="ml-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-gray-400"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SidePanel;
