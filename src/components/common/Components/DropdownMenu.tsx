import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { DropdownOption } from "../../../types/dropdownMenu";

interface DropdownMenuProps {
  options: DropdownOption[];
  selectedValue: string | number | null;
  onSelect: (value: string | number | null) => void;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  disabled?: boolean;
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
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the label for the currently selected value
  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label ||
    "Select an option";

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
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${buttonClassName}`}
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
        } overflow-y-auto z-20 ${optionsClassName}`}
      >
        <div className="p-1" style={{ display: isOpen ? "block" : "none" }}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                option.value === selectedValue ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;
