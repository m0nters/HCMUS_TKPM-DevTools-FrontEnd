import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AlertMessageProps {
  message: string;
  isError?: boolean;
  className?: string;
  duration?: number; // Time in milliseconds before auto-dismiss
  canClose?: boolean; // Whether the message can be closed manually
  onDismiss?: () => void;
}

/**
 * Alert message component for displaying success or error messages with auto-dismiss
 * @param message - The message to display
 * @param isError - Whether the message is an error (red) or success (green)
 * @param className - Additional classes to apply to the component
 * @param duration - Time in milliseconds before auto-dismiss (0 for no auto-dismiss)
 * @param canClose - Whether the message can be closed manually
 * @param onDismiss - Callback when message is dismissed
 */
function AlertMessage({
  message,
  isError = false,
  className = "",
  duration = 0, // 0 means no auto-dismiss
  canClose = true,
  onDismiss,
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
  }, []);

  if (!message || !visible) return null;

  const baseClasses = "border rounded-md p-3 mb-4 relative overflow-hidden";

  const alertClasses = isError
    ? "bg-red-50 border-red-200 text-red-800"
    : "bg-green-50 border-green-200 text-green-800";

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className={`${baseClasses} ${alertClasses} ${className}`}>
      <div className="flex items-center justify-between">
        <div>{message}</div>
        {canClose && (
          <button
            onClick={handleDismiss}
            className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
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

export default AlertMessage;
