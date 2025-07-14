import { OutputFieldProps } from "../OutputField";

export function TextAreaOutput({
  field,
  value,
  isLoading = false,
}: OutputFieldProps) {
  const displayValue = (() => {
    if (isLoading) {
      return "Processing...";
    }

    if (value === undefined || value === null) {
      return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  })();

  const resizeClass =
    field.resize === "x"
      ? "resize-x"
      : field.resize === "y"
        ? "resize-y"
        : field.resize === "both"
          ? "resize"
          : field.resize === "none"
            ? "resize-none"
            : "resize-y"; // Default to vertical resize

  return (
    <div
      className={`rounded-md border border-gray-300 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <textarea
        readOnly
        value={displayValue}
        placeholder={field.placeholder}
        rows={field.rows || 5}
        className={`w-full bg-transparent p-3 focus:outline-none ${resizeClass}`}
      />
    </div>
  );
}
