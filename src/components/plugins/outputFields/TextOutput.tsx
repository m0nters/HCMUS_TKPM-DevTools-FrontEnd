import { OutputFieldProps } from "../OutputField";

export function TextOutput({
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

  return (
    <div
      className={`max-h-[250px] min-h-11 w-full overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-3 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      {displayValue}
    </div>
  );
}
