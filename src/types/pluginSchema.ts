export interface PluginSchema {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  isPremium: boolean;
  uiSchema: UISchema;
  api: {
    process: string;
  };
}

export interface UISchema {
  inputs: InputField[];
  outputs: OutputField[];
  controls: Control[];
  options?: Option[];
}

// Base field properties
interface BaseField {
  id: string;
  label: string;
  description?: string;
  type: string;
  required?: boolean;
}

// Input field types
export interface InputField extends BaseField {
  type: "text" | "textarea" | "number" | "color" | "date";
  placeholder?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  options?: { value: string; label: string }[];
}

// Output field types
export interface OutputField extends BaseField {
  type: "text" | "textarea";
  readonly: boolean;
  rows?: number;
}

// Control types (buttons, links)
export interface Control {
  id: string;
  label: string;
  action: string;
  primary?: boolean;
}

// Option types for plugin configuration
export interface Option {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "select" | "toggle";
  defaultValue?: any;
  options?: { value: string; label: string }[]; // list of selectable choices for multi-choice option types like dropdown menus or radio button groups.
}
