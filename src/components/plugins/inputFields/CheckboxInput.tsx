import { InputFieldProps } from "../InputField";

function CheckboxInput({ field, value, onChange, error }: InputFieldProps) {
  // Initialize the value as an object if it's not already
  const valueObject = typeof value === "object" && value !== null ? value : {};

  return (
    <div className="space-y-4">
      {field.options?.map((option) => {
        // Check if this option is checked
        const isChecked = valueObject[option.value] === true;

        return (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`${field.id}-${option.value}`}
              name={field.id}
              checked={isChecked}
              onChange={() => {
                // Toggle this specific option in the object
                onChange({
                  ...valueObject,
                  [option.value]: !isChecked,
                });
              }}
              className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded accent-black"
            />
            <label
              htmlFor={`${field.id}-${option.value}`}
              className="text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default CheckboxInput;
