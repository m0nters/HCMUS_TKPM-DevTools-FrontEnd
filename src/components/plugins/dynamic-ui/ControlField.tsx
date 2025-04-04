import { Control as ControlFieldType } from "../../../types/pluginSchema";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface ControlFieldProps {
  field: ControlFieldType;
  onAction: () => void;
  isProcessing: boolean;
}

/**
 * Component that renders action buttons for the plugin UI
 */
function ControlField({
  field: control,
  onAction,
  isProcessing,
}: ControlFieldProps) {
  // Determine if this control should be disabled
  const isDisabled = isProcessing && control.action !== "clear";

  // Apply different styles based on whether it's a primary action
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";

  // Primary buttons (encode, process, etc) are black
  // Secondary buttons (clear, reset) are gray
  const buttonClasses = control.primary
    ? `${baseClasses} ${
        isDisabled
          ? "bg-gray-700 text-gray-300"
          : "bg-black text-white hover:bg-gray-800"
      }`
    : `${baseClasses} ${
        isDisabled
          ? "bg-gray-100 text-gray-400"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`;

  return (
    <button
      type="button"
      onClick={onAction}
      disabled={isDisabled}
      className={buttonClasses}
    >
      <div className="flex items-center gap-2">
        {/* Show spinner when processing primary actions */}
        {isProcessing && control.primary ? (
          <>
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>{control.label}</span>
        )}
      </div>
    </button>
  );
}

export default ControlField;
