import { OutputFieldProps } from "../OutputField";

function TextAreaOutput({ field, value, isLoading = false }: OutputFieldProps) {
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
    <textarea
      value={displayValue}
      readOnly
      placeholder={field.placeholder}
      rows={field.rows}
      className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 ${resizeClass} ${
        isLoading ? "animate-pulse" : ""
      }`}
    />
  );
}

export default TextAreaOutput;
