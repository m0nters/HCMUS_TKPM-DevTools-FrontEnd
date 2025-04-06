import { InputFieldProps } from "../InputField";

function ToggleInput({ field, value, onChange, error }: InputFieldProps) {
  return (
    <div className="space-y-4">
      {field.options?.map((option) => {
        // Check if this option is toggled on
        const isToggled = Array.isArray(value)
          ? value.includes(option.value)
          : typeof value === "object" && value !== null
          ? value[option.value] === true
          : false;

        return (
          <div key={option.value} className="flex items-center justify-between">
            <label className="text-sm text-gray-700">{option.label}</label>
            <button
              type="button"
              role="switch"
              aria-checked={isToggled}
              onClick={() => {
                if (Array.isArray(value)) {
                  // Handle array value type
                  if (isToggled) {
                    onChange(value.filter((v) => v !== option.value));
                  } else {
                    onChange([...value, option.value]);
                  }
                } else {
                  // Handle object value type (preferred)
                  onChange({
                    ...value,
                    [option.value]: !isToggled,
                  });
                }
              }}
              className={`${
                isToggled ? "bg-black" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2`}
            >
              <span className="sr-only">{option.label}</span>
              <span
                className={`${
                  isToggled ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToggleInput;
