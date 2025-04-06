export interface PluginSchema {
  id: number; // this is Plugin ID!
  uiSchemas: UISchema[];
}

export interface UISchema {
  name?: string;
  inputs: InputField[];
  outputs: OutputField[];
}

// Base field properties
interface BaseField {
  id: string;
  label?: string;
  description?: string;
  type: string;
  required: boolean;
}

// Input field types
export interface InputField extends BaseField {
  type:
    | "text"
    | "textarea"
    | "number"
    | "color"
    | "date"
    | "slider"
    | "dropdown"
    | "checkbox"
    | "radio"
    | "toggle";
  placeholder?: string;
  defaultValue?: any;
  min?: number; // minimum value for number related, like number inputs, sliders (ranges)
  max?: number; // similar to min
  step?: number;
  rows?: number; // number of rows for textarea
  options?: { value: string; label: string }[]; // list of selectable choices with their labels like `select`, `checkbox`, `radio`, `toggle`
}

// Output field types
export interface OutputField extends BaseField {
  type: "text" | "textarea";
  placeholder?: string;
  rows?: number; // number of rows for textarea
  resize?: "none" | "both" | "x" | "y"; // resize options for textarea
}
