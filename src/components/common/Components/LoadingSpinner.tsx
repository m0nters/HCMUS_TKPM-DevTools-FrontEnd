/**
 * Loading spinner component.
 * @param size - Spinner size (sm, medium, lg)
 * @returns Loading spinner component
 * @example
 * ```tsx
 * <LoadingSpinner size="medium" />
 * ```
 */
function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
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
