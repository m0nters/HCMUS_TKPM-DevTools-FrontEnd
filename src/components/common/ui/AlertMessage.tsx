import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AlertMessageProps {
  /**
   * The message to display
   */
  message: string;

  /**
   * Whether the message is an error (red) or success (green)
   * @default false
   */
  isError?: boolean;

  /**
   * Additional classes to apply to the component
   */
  className?: string;

  /**
   * Time in milliseconds before auto-dismiss
   * @default 0 (no auto-dismiss)
   */
  duration?: number;

  /**
   * Whether the message can be closed manually
   * @default true
   */
  canClose?: boolean;

  /**
   * Callback when message is dismissed
   */
  onDismiss?: () => void;

  /**
   * Position of the alert on the screen
   * @default "inline"
   */
  position?: "inline" | "top-center" | "bottom-center";

  /**
   * Custom animation class
   * @default undefined
   */
  animationClass?: string;
}

/**
 * AlertMessage - Versatile alert component for feedback messages
 *
 * Displays success or error messages with optional auto-dismiss functionality.
 * Can be positioned in various places on the screen or inline with content.
 *
 * @example
 * // Basic inline alert
 * <AlertMessage message="Settings saved successfully" />
 *
 * @example
 * // Floating alert at top of screen with auto-dismiss
 * <AlertMessage
 *   message="File uploaded successfully"
 *   position="top-center"
 *   duration={5000}
 * />
 *
 * @example
 * // Error message with callback
 * <AlertMessage
 *   message="Failed to save changes"
 *   isError={true}
 *   onDismiss={() => refetchData()}
 * />
 */
export function AlertMessage({
  message,
  isError = false,
  className = "",
  duration = 0, // 0 means no auto-dismiss
  canClose = true,
  onDismiss,
  position = "inline",
  animationClass,
}: AlertMessageProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    setProgress(100);

    // Set up auto-dismiss if duration is provided
    if (duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + duration;

      // Update progress bar
      const intervalId = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const progressValue = (remaining / duration) * 100;

        setProgress(progressValue);

        if (now >= endTime) {
          clearInterval(intervalId);
          setVisible(false);
          if (onDismiss) onDismiss();
        }
      }, 50);

      return () => clearInterval(intervalId);
    }
  }, [message, duration]);

  if (!message || !visible) return null;

  // Base classes for all alert types
  const baseClasses = "border rounded-md p-3 overflow-hidden";

  // Color classes based on type
  const colorClasses = isError
    ? "bg-red-50 border-red-200 text-red-800"
    : "bg-green-50 border-green-200 text-green-800";

  // Position classes
  const positionClasses = {
    inline: "mb-4 relative",
    "top-center":
      "fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down max-w-md w-full",
    "bottom-center":
      "fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up max-w-md w-full",
  };

  // Determine final position and animation classes
  const positionClass = positionClasses[position];
  const animationClassToApply = animationClass || "";

  // Combine all classes
  const alertClassesArray = [
    baseClasses,
    colorClasses,
    positionClass,
    animationClassToApply,
    className,
  ].filter(Boolean);

  const alertClassesFinal = alertClassesArray.join(" ");

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className={alertClassesFinal}>
      <div className="flex items-center justify-between">
        <div>{message}</div>
        {canClose && (
          <button
            onClick={handleDismiss}
            className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Close"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300">
          <div
            className={`h-full ${isError ? "bg-red-500" : "bg-green-500"}`}
            style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
          />
        </div>
      )}
    </div>
  );
}
