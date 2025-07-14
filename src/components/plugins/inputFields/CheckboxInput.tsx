import { InputFieldProps } from "../InputField";

export function CheckboxInput({
  field,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <div className="space-y-4">
      {field.options?.map((option) => {
        const isChecked = value ? value[option.value] === true : false;

        return (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`${field.id}-${option.value}`}
              name={field.id}
              checked={isChecked}
              onChange={() => {
                onChange({
                  ...value,
                  [option.value]: !isChecked,
                });
              }}
              className="h-5 w-5 rounded border-gray-300 text-black accent-black focus:ring-black"
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
