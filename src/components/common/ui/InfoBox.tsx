import { ReactNode } from "react";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface InfoBoxProps {
  /**
   * The title of the info box
   */
  title: string;

  /**
   * Content to display - either an array of text lines or custom React nodes
   */
  content: string[] | ReactNode;

  /**
   * Visual style of the info box
   * @default "info"
   */
  type?: "info" | "warning" | "success" | "error";

  /**
   * Optional custom icon to override the default icon based on type
   */
  icon?: ReactNode;

  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
}

/**
 * InfoBox - A reusable component for displaying information with an icon
 */
export function InfoBox({
  title,
  content,
  type = "info",
  icon,
  className = "",
}: InfoBoxProps) {
  // Define styling based on type
  const styles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      titleColor: "text-blue-800",
      textColor: "text-blue-700",
      iconColor: "text-blue-500",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      titleColor: "text-yellow-800",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-500",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      titleColor: "text-green-800",
      textColor: "text-green-700",
      iconColor: "text-green-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      titleColor: "text-red-800",
      textColor: "text-red-700",
      iconColor: "text-red-500",
    },
  };

  const currentStyle = styles[type];

  // Select the appropriate default icon based on type
  const defaultIcon = (() => {
    switch (type) {
      case "info":
        return (
          <InformationCircleIcon
            className={`h-5 w-5 ${currentStyle.iconColor}`}
          />
        );
      case "warning":
        return (
          <ExclamationTriangleIcon
            className={`h-5 w-5 ${currentStyle.iconColor}`}
          />
        );
      case "success":
        return (
          <CheckCircleIcon className={`h-5 w-5 ${currentStyle.iconColor}`} />
        );
      case "error":
        return <XCircleIcon className={`h-5 w-5 ${currentStyle.iconColor}`} />;
    }
  })();

  return (
    <div
      className={`${currentStyle.bg} border-l-4 ${currentStyle.border} rounded p-4 ${className}`}
    >
      <div className="flex items-start">
        <div className="mr-3 shrink-0">{icon || defaultIcon}</div>
        <div>
          <h3 className={`text-sm font-medium ${currentStyle.titleColor}`}>
            {title}
          </h3>
          <div className={`mt-1 text-sm ${currentStyle.textColor}`}>
            {Array.isArray(content)
              ? content.map((line, index) => (
                  <p key={index} className={index > 0 ? "mt-1" : ""}>
                    {line}
                  </p>
                ))
              : content}
          </div>
        </div>
      </div>
    </div>
  );
}
