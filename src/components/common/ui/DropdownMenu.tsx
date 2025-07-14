import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../../hooks/";
import { DropdownOption } from "../../../types/";

interface DropdownMenuProps {
  options: DropdownOption[];
  selectedValue: string | number | null;
  onSelect: (value: string | number | null) => void;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
  allowClear?: boolean;
}

/**
 * Reusable dropdown menu component with animation and keyboard support
 */
export function DropdownMenu({
  options,
  selectedValue,
  onSelect,
  className = "",
  buttonClassName = "",
  optionsClassName = "",
  disabled = false,
  searchable = true,
  allowClear = true,
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

  // Check if there's a selected value (not null and not the default option)
  const hasSelectedValue =
    selectedValue !== null && selectedValue !== undefined;

  // Handle clear button click
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onSelect(null);
  };

  // Filter options based on search query
  useEffect(() => {
    if (isOpen && searchQuery) {
      setFilteredOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(debouncedSearchQuery),
        ),
      );
    } else {
      setFilteredOptions(options);
    }
  }, [isOpen, debouncedSearchQuery, options]);

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
        className={`flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-3 text-left transition-colors hover:border-gray-400 focus:ring-2 focus:ring-black focus:outline-none ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        } ${buttonClassName} z-30`}
      >
        <span className="truncate">{selectedLabel}</span>

        {hasSelectedValue && !disabled && allowClear ? (
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
            title="Clear selection"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        ) : (
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Dropdown Options */}
      <div
        className={`absolute mt-1 w-full origin-top rounded-md border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
          isOpen
            ? "max-h-60 scale-y-100 transform opacity-100"
            : "max-h-0 scale-y-0 transform opacity-0"
        } overflow-y-auto ${optionsClassName} z-30`}
      >
        {searchable && isOpen && (
          <div className="sticky top-0 border-b border-gray-100 bg-white p-2">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        <div className="z-50 flex flex-col p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`w-full cursor-pointer rounded px-3 py-2 text-left hover:bg-gray-100 ${
                  option.value === selectedValue
                    ? "bg-gray-100 font-medium"
                    : ""
                }`}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
