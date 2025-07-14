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
  if (!isOpen) return null;
  useScrollLock(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() && !isLoading) {
      onConfirm(password);
    }
  };

  const handleCancel = (e) => {
    setPassword("");
    setShowPassword(false);
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-30 bg-black/70"
      onClick={isLoading ? undefined : handleCancel}
    >
      <div
        className="animate-fade-in fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">{title}</h3>
          <p className="mb-6 text-sm text-gray-500">{message}</p>
          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Enter your password"
                disabled={isLoading}
                autoFocus
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
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
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
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
