import { Option as OptionFieldType } from "../../../types/pluginSchema";

interface OptionFieldProps {
  field: OptionFieldType;
  value: any;
  onChange: (value: any) => void;
}

/**
 * Component that renders plugin option controls like toggles, checkboxes, etc.
 */
function OptionField({ field, value, onChange }: OptionFieldProps) {
  switch (field.type) {
    case "checkbox":
      return (
        <div className="option-field mb-4">
          <div className="flex items-center">
            <input
              id={field.id}
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label
              htmlFor={field.id}
              className="ml-2 block text-sm text-gray-700"
            >
              {field.label}
            </label>
          </div>
        </div>
      );

    case "toggle":
      return (
        <div className="option-field mb-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            <button
              id={field.id}
              role="switch"
              aria-checked={!!value}
              onClick={() => onChange(!value)}
              className={`${
                value ? "bg-black" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2`}
            >
              <span
                className={`${
                  value ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="option-field mb-4">
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </legend>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    type="radio"
                    checked={value === option.value}
                    onChange={() => onChange(option.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      );

    case "select":
      return (
        <div className="option-field mb-4">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
          </label>
          <select
            id={field.id}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    default:
      return (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
          <p className="text-sm text-yellow-800">
            Unsupported option type: {field.type}
          </p>
        </div>
      );
  }
}

export default OptionField;
