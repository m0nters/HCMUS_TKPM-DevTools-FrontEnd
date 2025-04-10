import { InputFieldProps } from "../InputField";

function TextInput({ field, value, onChange, error }: InputFieldProps) {
  return (
    <input
      type="text"
      id={field.id}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-3 border ${
        error ? "border-red-500" : "border-white-300"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
    />
  );
}

export default TextInput;
