import { InputFieldProps } from "../InputField";

/**
 * TextArea input component for multiline text
 */
function TextAreaInput({ field, value, onChange, error }: InputFieldProps) {
  return (
    <textarea
      id={field.id}
      placeholder={field.placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      rows={field.rows}
      className={`w-full p-3 border ${
        error ? "border-red-500" : "border-white-300"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y`}
    />
  );
}

export default TextAreaInput;
