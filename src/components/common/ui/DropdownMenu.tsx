import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { DropdownOption } from "../../../types/";
import { useDebounce } from "../../../hooks";

interface DropdownMenuProps {
  options: DropdownOption[];
  selectedValue: string | number | null;
  onSelect: (value: string | number | null) => void;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
}

/**
 * Reusable dropdown menu component with animation and keyboard support
 */
function DropdownMenu({
  options,
  selectedValue,
  onSelect,
  className = "",
  buttonClassName = "",
  optionsClassName = "",
  disabled = false,
  searchable = true,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<DropdownOption[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery.toLowerCase().trim());

  // Find the label for the currently selected value
  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label ||
    "Select an option";

  // Filter options based on search query

  useEffect(() => {
    if (isOpen && searchQuery) {
      setFilteredOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(debouncedSearchQuery)
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [isOpen, debouncedSearchQuery]);

  // Focus the search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  // Reset search query when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle outside clicks and ESC key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md hover:border-gray-400 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-black ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } ${buttonClassName} z-30`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options */}
      <div
        className={`absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-200 origin-top ${
          isOpen
            ? "opacity-100 transform scale-y-100 max-h-60"
            : "opacity-0 transform scale-y-0 max-h-0"
        } overflow-y-auto ${optionsClassName} z-30`}
      >
        {searchable && isOpen && (
          <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        <div className="p-1 flex flex-col z-50">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 cursor-pointer ${
                  option.value === selectedValue
                    ? "bg-gray-100 font-medium"
                    : ""
                }`}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;
