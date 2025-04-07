import { InputFieldProps } from "../InputField";

function DateInput({ field, value, onChange, error }: InputFieldProps) {
  return (
    <input
      type="date"
      id={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      className={`w-full p-3 border ${
        error ? "border-red-500" : "border-white-300"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
    />
  );
}

export default DateInput;
