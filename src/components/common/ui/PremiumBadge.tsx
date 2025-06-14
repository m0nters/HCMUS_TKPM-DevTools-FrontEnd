import { SparklesIcon } from "@heroicons/react/24/solid";

export interface PremiumBadgeProps {
  /** Custom class names to apply to the badge */
  className?: string;
  /** Badge size variant */
  size?: "sm" | "md" | "lg";
  /** Style variant of the badge */
  variant?: "default" | "subtle" | "outlined";
  /** Show or hide the sparkles icon */
  showIcon?: boolean;
  /** Custom label text (defaults to "Premium") */
  label?: string;
  /** Click handler for the badge */
  onClick?: () => void;
}

/**
 * Premium badge component with customizable styles
 */
export function PremiumBadge({
  className = "",
  size = "md",
  variant = "default",
  showIcon = true,
  label = "Premium",
  onClick,
}: PremiumBadgeProps) {
  // Size classes mapping
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  // Variant classes mapping
  const variantClasses = {
    default:
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm",
    subtle: "bg-purple-100 text-purple-800 border border-purple-200",
    outlined: "bg-transparent border border-purple-500 text-purple-700",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium ${sizeClasses[size]} 
        ${variantClasses[variant]} transition-all duration-200 
        ${
          onClick
            ? "cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
            : ""
        }
        ${className}
      `}
      onClick={onClick}
    >
      {showIcon && (
        <SparklesIcon
          className={`
          ${
            size === "sm"
              ? "w-3 h-3 mr-1"
              : size === "md"
              ? "w-3.5 h-3.5 mr-1.5"
              : "w-4 h-4 mr-2"
          }
        `}
        />
      )}
      {label}
    </span>
  );
}
