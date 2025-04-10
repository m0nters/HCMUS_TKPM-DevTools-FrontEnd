import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BackLinkProps {
  to: string;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "pill";
  className?: string;
}

/**
 * Reusable back link component with consistent styling and animation
 */
function BackLink({ to, label, size = "md", className = "" }: BackLinkProps) {
  // Size classes
  const sizeClasses = {
    sm: "text-xs py-1 px-2",
    md: "text-sm py-2 px-3",
    lg: "text-base py-2 px-4",
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: "w-3 h-3 mr-1",
    md: "w-4 h-4 mr-2",
    lg: "w-5 h-5 mr-2",
  };

  return (
    <Link
      to={to}
      className={`inline-flex items-center font-medium text-gray-700 hover:bg-gray-200 rounded-full transition-colors group ${sizeClasses[size]} ${className}`}
    >
      <ArrowLeftIcon
        className={`transition-transform group-hover:-translate-x-1 ${iconSizeClasses[size]}`}
      />
      {label}
    </Link>
  );
}

export default BackLink;
