import { InputFieldProps } from "../InputField";

export function ToggleInput({
  field,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <div className="space-y-4">
      {field.options?.map((option) => {
        const isToggled = value ? value[option.value] === true : false;

        return (
          <div key={option.value} className="flex items-center justify-between">
            <label
              className="text-sm text-gray-700"
              htmlFor={`${field.id}-${option.value}`}
            >
              {option.label}
            </label>
            <button
              type="button"
              id={`${field.id}-${option.value}`}
              role="switch"
              aria-checked={isToggled}
              onClick={() => {
                onChange({
                  ...value,
                  [option.value]: !isToggled,
                });
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
