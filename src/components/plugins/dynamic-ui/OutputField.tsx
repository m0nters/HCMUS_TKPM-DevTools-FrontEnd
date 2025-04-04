import { OutputField as OutputFieldType } from "../../../types/pluginSchema";
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
        typeof value === "object"
          ? JSON.stringify(value, null, 2)
          : String(value);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Create a formatted display value
  const displayValue = isLoading
    ? "Processing..."
    : value === undefined || value === null
    ? ""
    : typeof value === "object"
    ? JSON.stringify(value, null, 2)
    : String(value);

  return (
    <div className="output-field-container mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        {value !== undefined && value !== null && value !== "" && (
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-black transition-colors"
            title="Copy to clipboard"
            disabled={isLoading}
          >
            {copied ? (
              <CheckIcon className="w-5 h-5 text-green-600" />
            ) : (
              <ClipboardDocumentIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {field.rows && field.rows > 1 ? (
        <textarea
          value={displayValue}
          readOnly
          rows={field.rows || 5}
          className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 resize-y ${
            isLoading ? "animate-pulse" : ""
          }`}
        />
      ) : (
        <div
          className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[38px] ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {displayValue}
        </div>
      )}

      {field.description && (
        <p className="mt-1 text-sm text-gray-500">{field.description}</p>
      )}
    </div>
  );
}

export default OutputField;
