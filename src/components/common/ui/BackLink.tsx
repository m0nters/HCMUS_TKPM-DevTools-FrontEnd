import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BackLinkProps {
  to?: string; // if not provided, will navigate back in history
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "pill";
  className?: string;
}

/**
 * Reusable back link component with consistent styling and animation
 */
export function BackLink({
  to,
  label = "Back",
  size = "md",
  className = "",
}: BackLinkProps) {
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center font-medium text-gray-700 hover:bg-gray-200 rounded-full transition-colors cursor-pointer group ${sizeClasses[size]} ${className}`}
    >
      <ArrowLeftIcon
        className={`transition-transform group-hover:-translate-x-1 ${iconSizeClasses[size]}`}
      />
      {label}
    </button>
  );
}
