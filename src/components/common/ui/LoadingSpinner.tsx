/**
 * Loading spinner component.
 * @param size - Spinner size (sm, md, lg), default is "md".
 * @returns Loading spinner component
 * @example
 * ```tsx
 * <LoadingSpinner />
 * ```
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}
function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full border-b-2 border-black ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
