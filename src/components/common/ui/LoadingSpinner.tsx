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
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}
export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-black ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
