import { OutputFieldProps } from "../OutputField";

function TextOutput({ field, value, isLoading = false }: OutputFieldProps) {
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
      className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-11 max-h-[250px] overflow-y-auto ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      {displayValue}
    </div>
  );
}

export default TextOutput;
