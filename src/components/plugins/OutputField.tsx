import { OutputField as OutputFieldType } from "../../types/pluginSchema";
import { useState, useEffect } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface OutputFieldProps {
  field: OutputFieldType;
  value: any;
  isLoading?: boolean;
}

/**
 * Component that renders output field with copy to clipboard functionality
 */
function OutputField({ field, value, isLoading = false }: OutputFieldProps) {
  const [copied, setCopied] = useState(false);

  // Reset copied status after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Function to copy output to clipboard
  const copyToClipboard = async () => {
    if (!value) return;

    try {
      // Convert value to string if it's not already
      const textToCopy =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  // Create a formatted display value
  const displayValue = (() => {
    if (isLoading) {
      return "Processing...";
    }

    if (value === undefined || value === null) {
      return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  })();

  const renderOutputElement = () => {
    switch (field.type) {
      case "textarea":
        // Determine the resize class based on the resize attribute
        const resizeClass =
          field.resize === "x"
            ? "resize-x"
            : field.resize === "y"
            ? "resize-y"
            : field.resize === "both"
            ? "resize"
            : field.resize === "none"
            ? "resize-none"
            : "resize-y"; // Default to vertical resize

        return (
          <textarea
            value={displayValue}
            readOnly
            placeholder={field.placeholder || "Waiting for input..."}
            rows={field.rows || 5}
            className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 ${resizeClass} ${
              isLoading ? "animate-pulse" : ""
            }`}
          />
        );
      case "text":
        return (
          <div
            className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-11 max-h-[250px] overflow-y-auto${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            {displayValue || (
              <span className="text-gray-400">
                {field.placeholder || "Waiting for input..."}
              </span>
            )}{" "}
          </div>
        );
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Unsupported output type: {field.type}
            </p>
          </div>
        );
    }
  };

  const hasValue =
    value !== undefined &&
    value !== null &&
    (typeof value === "string" ? value.trim() !== "" : true);

  return (
    <div className="output-field-container">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        {hasValue && (
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-black transition-colors"
            title="Copy to clipboard"
            disabled={isLoading}
          >
            {copied ? (
              <>
                <CheckIcon className="w-5 h-5 text-green-600" />
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 shadow-md z-50 animate-fade-in-up">
                  Operation completed successfully!
                </div>
              </>
            ) : (
              <ClipboardDocumentIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {field.description && (
        <p className="mb-1 text-sm text-gray-500">{field.description}</p>
      )}
      {/* Render appropriate output element based on type */}
      {renderOutputElement()}
    </div>
  );
}

export default OutputField;
