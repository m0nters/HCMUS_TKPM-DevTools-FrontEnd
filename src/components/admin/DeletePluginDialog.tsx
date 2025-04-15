import { useState, useEffect, useRef } from "react";
import { AdminPlugin } from "../../types/plugins";
import { deletePlugin } from "../../services/admin/pluginService";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DeletePluginDialogProps {
  plugin: AdminPlugin;
  onCancel: () => void;
  onDeleted: (pluginId: number) => void;
}

function DeletePluginDialog({
  plugin,
  onCancel,
  onDeleted,
}: DeletePluginDialogProps) {
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when showing the second step
  useEffect(() => {
    if (confirmationStep === 2 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [confirmationStep]);

  const toNextStep = () => {
    setConfirmationStep(confirmationStep + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationText(e.target.value);
    setError("");
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deletePlugin(plugin.id);
      if (success) {
        onDeleted(plugin.id);
      } else {
        setError("Failed to delete the plugin. Please try again.");
        setIsDeleting(false);
      }
    } catch (err) {
      setError("An error occurred while deleting the plugin.");
      setIsDeleting(false);
    }
  };

  // Stop propagation to prevent closing when clicking inside
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onCancel} // Close on background click
    >
      <div
        className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={handleDialogClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Delete tool {plugin.name}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog content - Step 1 */}
        {confirmationStep === 1 && (
          <div className="p-6 flex flex-col items-center">
            {/* Plugin Icon */}
            {plugin.icon && (
              <div
                className="w-24 h-24 mb-4 flex items-center justify-center text-gray-800"
                dangerouslySetInnerHTML={{ __html: plugin.icon }}
              />
            )}

            <div className="text-center mb-8">
              <p className="mb-2 font-medium text-gray-800">{plugin.name}</p>
              <p className="text-sm text-gray-600">
                This will permanently delete this tool and all associated data.
              </p>
            </div>

            <button
              onClick={toNextStep}
              className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
            >
              I want to delete this tool
            </button>
          </div>
        )}

        {/* Dialog content - Step 2 */}
        {confirmationStep === 2 && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              {plugin.icon && (
                <div
                  className="w-10 h-10 mr-3 flex-shrink-0 flex items-center justify-center text-gray-800"
                  dangerouslySetInnerHTML={{ __html: plugin.icon }}
                />
              )}
              <span className="font-medium text-gray-800">{plugin.name}</span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                To confirm, type{" "}
                <span className="font-bold text-gray-800">"{plugin.name}"</span>{" "}
                in the box below
              </p>
              <input
                ref={inputRef}
                type="text"
                value={confirmationText}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder={`Type ${plugin.name} to confirm`}
                disabled={isDeleting}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <button
              onClick={handleConfirmDelete}
              disabled={confirmationText !== plugin.name || isDeleting}
              className={`w-full p-3 text-white rounded-md transition-colors ${
                confirmationText === plugin.name && !isDeleting
                  ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete this plugin"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeletePluginDialog;
