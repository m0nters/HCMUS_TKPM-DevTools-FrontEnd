import { InputFieldProps } from "../InputField";

/**
 * TextArea input component for multiline text
 */
export function TextAreaInput({
  field,
  value,
  onChange,
  error,
}: InputFieldProps) {
  const resizeClass =
    field.resize === "x"
      ? "resize-x"
      : field.resize === "y"
      ? "resize-y"
      : field.resize === "both"
      ? "resize"
      : field.resize === "none"
      ? "resize-none"
      : "resize-y"; // Default to vertical resize
  return (
    <textarea
      id={field.id}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={field.rows}
      className={`w-full p-3 border ${
        error ? "border-red-500" : "border-white-300"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${resizeClass} `}
    />
  );
}
