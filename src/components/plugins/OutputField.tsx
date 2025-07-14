import { OutputField as OutputFieldType } from "../../types/";
import { useState, useEffect } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import { hasValue } from "../../utils/";
import {
  JSONOutput,
  TextAreaOutput,
  TextOutput,
  XMLOutput,
} from "./outputFields";

export interface OutputFieldProps {
  field: OutputFieldType;
  value: any;
  isLoading?: boolean;
}

/**
 * Component that renders output field with copy to clipboard functionality
 */
export function OutputField({
  field,
  value,
  isLoading = false,
}: OutputFieldProps) {
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

  const renderOutputElement = () => {
    switch (field.type) {
      case "textarea":
        return (
          <TextAreaOutput field={field} value={value} isLoading={isLoading} />
        );
      case "text":
        return <TextOutput field={field} value={value} isLoading={isLoading} />;
      case "json":
        return <JSONOutput field={field} value={value} isLoading={isLoading} />;
      case "xml":
        return <XMLOutput field={field} value={value} isLoading={isLoading} />;
      default:
        return (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              Unsupported output type: {field.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="output-field-container">
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        {hasValue(value) && (
          <button
            onClick={copyToClipboard}
            className="text-gray-500 transition-colors hover:text-black"
            title="Copy to clipboard"
            disabled={isLoading || copied}
          >
            {copied ? (
              <>
                <CheckIcon className="h-5 w-5 text-green-600" />
                <div className="animate-fade-in-up fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transform rounded-md border border-green-200 bg-green-50 p-4 text-green-800 shadow-md">
                  Copied to clipboard!
                </div>
              </>
            ) : (
              <ClipboardDocumentIcon className="h-5 w-5 cursor-pointer" />
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
