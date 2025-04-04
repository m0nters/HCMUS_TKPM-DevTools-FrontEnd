import { InputField as InputFieldType } from "../../../types/pluginSchema";

interface InputFieldProps {
  field: InputFieldType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

/**
 * Factory component that renders the appropriate input field based on type
 */
function InputField({ field, value, onChange, error }: InputFieldProps) {
  // Render appropriate component based on field type
  switch (field.type) {
    case "text":
      return (
        <div className="input-field-container mb-4">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
          />
          {field.description && (
            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );

    case "textarea":
      return (
        <div className="input-field-container mb-4">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={field.rows || 5}
            className={`w-full p-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y`}
          />
          {field.description && (
            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );

    case "number":
      return (
        <div className="input-field-container">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            id={field.id}
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.valueAsNumber || null)}
            min={field.min}
            max={field.max || Infinity}
            className={`w-full p-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
          />
          {field.description && (
            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );

    case "color":
      return (
        <div className="input-field-container mb-4">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex items-center">
            <input
              type="color"
              id={field.id}
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              className="h-10 w-16 rounded-md border border-gray-300 p-0"
            />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="ml-2 p-3 border border-gray-300 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          {field.description && (
            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );

    case "date":
      return (
        <div className="input-field-container mb-4">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            id={field.id}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={`w-full p-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
          />
          {field.description && (
            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );

    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Unsupported input type: {field.type}
          </p>
        </div>
      );
  }
}

export default InputField;
