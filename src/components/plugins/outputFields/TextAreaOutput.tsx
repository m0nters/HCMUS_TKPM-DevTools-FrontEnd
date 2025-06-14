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
      className={`border border-gray-300 rounded-md ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <textarea
        readOnly
        value={displayValue}
        placeholder={field.placeholder}
        rows={field.rows || 5}
        className={`w-full p-3 bg-transparent focus:outline-none ${resizeClass}`}
      />
    </div>
  );
}
