import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useState } from "react";
import { useScrollLock } from "../../../hooks/";

interface PasswordConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
}

export function PasswordConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: PasswordConfirmDialogProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() && !isLoading) {
      onConfirm(password);
    }
  };

  const handleCancel = () => {
    setPassword("");
    setShowPassword(false);
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-40"
      onClick={isLoading ? undefined : handleCancel}
    >
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md animate-fade-in">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>

          {typeof message === "string" ? (
            <p className="mb-6 text-sm text-gray-500">{message}</p>
          ) : (
            <div className="mb-6">{message}</div>
          )}

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                placeholder="Enter your password"
                disabled={isLoading}
                autoFocus
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 border border-transparent rounded-md cursor-pointer disabled:cursor-not-allowed"
              disabled={isLoading || !password.trim()}
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
        </form>
      </div>
    </div>
  );
}
