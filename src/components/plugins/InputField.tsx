import { InputField as InputFieldType } from "../../types/";
import {
  TextInput,
  TextAreaInput,
  ColorInput,
  CheckboxInput,
  DateTimeInput,
  DropDownMenuInput,
  NumberInput,
  RadioInput,
  SliderInput,
  ToggleInput,
} from "./inputFields";

export interface InputFieldProps {
  field: InputFieldType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

/**
 * Input field component for plugin UI
 */
export function InputField({ field, value, onChange, error }: InputFieldProps) {
  // Render the input element based on field type
  const renderInputElement = () => {
    switch (field.type) {
      case "text":
        return (
          <TextInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "textarea":
        return (
          <TextAreaInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "number":
        return (
          <NumberInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "slider":
        return (
          <SliderInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "color":
        return (
          <ColorInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "date":
        return (
          <DateTimeInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "dropdown":
        return (
          <DropDownMenuInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "radio":
        return (
          <RadioInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "checkbox":
        return (
          <CheckboxInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      case "toggle":
        return (
          <ToggleInput
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Unsupported input type: {field.type}, the schema data for input
              objects fetched from backend is wrong.
            </p>
          </div>
        );
    }
  };

  // Common wrapper for all supported input types
  return (
    <div className="input-field-container">
      {field.label && (
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {field.description && (
        <p className="mt-1 text-sm text-gray-500 mb-2">
          Description: {field.description}
        </p>
      )}

      {/* Render the appropriate input element */}
      {renderInputElement()}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
