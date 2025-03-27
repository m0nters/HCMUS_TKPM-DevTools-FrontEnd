/**
 * Loading spinner component.
 * @param size - Spinner size (small, medium, large)
 * @returns Loading spinner component
 * @example
 * ```tsx
 * <LoadingSpinner size="medium" />
 * ```
 */
function LoadingSpinner({
  size = "medium",
}: {
  size?: "small" | "medium" | "large";
}) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-10 w-10",
    large: "h-12 w-12",
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
