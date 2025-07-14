import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { deletePlugin } from "../../services/";
import { AdminPlugin } from "../../types/";

interface DeletePluginDialogProps {
  plugin: AdminPlugin;
  onCancel: () => void;
  onDeleted: (pluginId: number) => void;
}

export function DeletePluginDialog({
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onCancel} // Close on background click
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={handleDialogClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-800">
            Delete tool {plugin.name}
          </h3>
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Dialog content - Step 1 */}
        {confirmationStep === 1 && (
          <div className="flex flex-col items-center p-6">
            {/* Plugin Icon */}
            {plugin.icon && (
              <div
                className="mb-4 flex h-24 w-24 items-center justify-center text-gray-800"
                dangerouslySetInnerHTML={{ __html: plugin.icon }}
              />
            )}

            <div className="mb-8 text-center">
              <p className="mb-2 font-medium text-gray-800">{plugin.name}</p>
              <p className="text-sm text-gray-600">
                This will permanently delete this tool and all associated data.
              </p>
            </div>

            <button
              onClick={toNextStep}
              className="w-full cursor-pointer rounded-md bg-red-600 p-3 text-white transition-colors hover:bg-red-700"
            >
              I want to delete this tool
            </button>
          </div>
        )}

        {/* Dialog content - Step 2 */}
        {confirmationStep === 2 && (
          <div className="p-6">
            <div className="mb-6 flex items-center">
              {plugin.icon && (
                <div
                  className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center text-gray-800"
                  dangerouslySetInnerHTML={{ __html: plugin.icon }}
                />
              )}
              <span className="font-medium text-gray-800">{plugin.name}</span>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600">
                To confirm, type{" "}
                <span className="font-bold text-gray-800">"{plugin.name}"</span>{" "}
                in the box below
              </p>
              <input
                ref={inputRef}
                type="text"
                value={confirmationText}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-red-500 focus:outline-none`}
                placeholder={`Type ${plugin.name} to confirm`}
                disabled={isDeleting}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <button
              onClick={handleConfirmDelete}
              disabled={confirmationText !== plugin.name || isDeleting}
              className={`w-full rounded-md p-3 text-white transition-colors ${
                confirmationText === plugin.name && !isDeleting
                  ? "cursor-pointer bg-red-600 hover:bg-red-700"
                  : "cursor-not-allowed bg-gray-300"
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
