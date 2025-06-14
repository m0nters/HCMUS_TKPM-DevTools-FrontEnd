import { InputFieldProps } from "../InputField";

export function RadioInput({ field, value, onChange, error }: InputFieldProps) {
  return (
    <div className="flex justify-start gap-6 items-center mb-2">
      {field.options?.map((option) => (
        <div key={option.value} className="flex flex-col items-center gap-2">
          <label
            htmlFor={`${field.id}-${option.value}`}
            className="ml-2 text-sm text-gray-700"
          >
            {option.label}
          </label>
          <input
            type="radio"
            id={`${field.id}-${option.value}`}
            name={field.id}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-5 w-5 text-black focus:ring-black border-gray-300 accent-black"
          />
        </div>
      ))}
    </div>
  );
}
