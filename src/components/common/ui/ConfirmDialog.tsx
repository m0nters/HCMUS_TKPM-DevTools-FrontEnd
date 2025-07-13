import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useScrollLock } from "../../../hooks/";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: "red" | "blue" | "green";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmDialog - A reusable modal dialog for confirming user actions
 *
 * This component displays a modal dialog with customizable content, requiring
 * explicit user confirmation before proceeding with potentially destructive
 * or important actions.
 *
 * @example
 * // Basic usage
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item?"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDialog(false)}
 * />
 *
 * @example
 * // Advanced usage with custom styling and content
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   title="Publish Changes"
 *   message={
 *     <>
 *       Are you sure you want to publish changes to <strong>Production</strong>?
 *       <ul className="list-disc ml-4 mt-2">
 *         <li>This will be visible to all users</li>
 *         <li>This action cannot be undone</li>
 *       </ul>
 *     </>
 *   }
 *   confirmText="Yes, Publish"
 *   cancelText="Not Now"
 *   confirmButtonColor="green"
 *   onConfirm={handlePublish}
 *   onCancel={handleCancel}
 * />
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "red",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const confirmButtonStyles = {
    red: "bg-red-600 hover:bg-red-700 disabled:bg-red-400",
    blue: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400",
    green: "bg-green-600 hover:bg-green-700 disabled:bg-green-400",
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-40"
      onClick={isLoading ? undefined : onCancel}
    >
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md animate-fade-in">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          <p className="mb-6 text-sm text-gray-500">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md cursor-pointer disabled:cursor-not-allowed ${confirmButtonStyles[confirmButtonColor]}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ArrowPathIcon className="animate-spin h-4 w-4" />
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
