import { InputFieldProps } from "../InputField";

export function DateTimeInput({
  field,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <input
      type="datetime-local"
      id={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      className={`w-full border p-3 ${
        error ? "border-red-500" : "border-white-300"
      } rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none`}
    />
  );
}
