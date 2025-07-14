import { InputFieldProps } from "../InputField";

export function NumberInput({
  field,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <input
      type="number"
      id={field.id}
      placeholder={field.placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.valueAsNumber)}
      min={field.min}
      max={field.max}
      className={`w-full border p-3 ${
        error ? "border-red-500" : "border-white-300"
      } rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none`}
    />
  );
}
