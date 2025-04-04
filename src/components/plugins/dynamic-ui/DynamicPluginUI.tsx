import { useEffect, useState } from "react";
import { PluginSchema } from "../../../types/pluginSchema";
import InputField from "./InputField";
import OutputField from "./OutputField";
import ControlField from "./ControlField";
import OptionField from "./OptionField";
import { executePlugin } from "../../../services/plugins/execute";
import { LoadingSpinner } from "../../../components/common";

interface DynamicPluginUIProps {
  schema: PluginSchema;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Main component for dynamically rendering plugin UI based on schema
 */
function DynamicPluginUI({ schema, onSuccess, onError }: DynamicPluginUIProps) {
  // State for input values, output values, and processing state
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [outputs, setOutputs] = useState<Record<string, any>>({});
  const [options, setOptions] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Initialize default input and option values from schema
  useEffect(() => {
    if (!schema) return;

    const initialInputs: Record<string, any> = {};
    schema.uiSchema.inputs.forEach((input) => {
      initialInputs[input.id] =
        input.defaultValue !== undefined ? input.defaultValue : null;
    });
    setInputs(initialInputs);

    const initialOptions: Record<string, any> = {};
    if (schema.uiSchema.options) {
      schema.uiSchema.options.forEach((option) => {
        initialOptions[option.id] =
          option.defaultValue !== undefined ? option.defaultValue : null;
      });
      setOptions(initialOptions);
    }
  }, [schema]);

  /**
   * Handle input field changes
   */
  const handleInputChange = (fieldId: string, value: any) => {
    setInputs((prevInputs) => ({ ...prevInputs, [fieldId]: value }));

    // Clear validation error when user changes the field
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  /**
   * Handle option field changes
   */
  const handleOptionChange = (optionId: string, value: any) => {
    setOptions((prevOptions) => ({ ...prevOptions, [optionId]: value }));
  };

  /**
   * Handle action button clicks
   */
  const handleAction = async (action: string) => {
    // Handle client-side actions
    if (action === "clear") {
      // Reset inputs and outputs
      const clearedInputs: Record<string, any> = {};
      schema.uiSchema.inputs.forEach((input) => {
        clearedInputs[input.id] =
          input.defaultValue !== undefined ? input.defaultValue : null;
      });
      setInputs(clearedInputs);
      setOutputs({});
      setValidationErrors({});
      return;
    }

    // Handle processing actions that call the API

    // Validate required fields
    const errors: Record<string, string> = {};
    schema.uiSchema.inputs.forEach((input) => {
      if (
        input.required &&
        (inputs[input.id] === null ||
          inputs[input.id] === undefined ||
          inputs[input.id] === "")
      ) {
        errors[input.id] = "This field is required";
      }
    });

    // If there are validation errors, display them and stop processing
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Prepare input data with options
    const inputData = {
      ...inputs,
      options,
    };

    // Process the plugin
    setIsProcessing(true);
    try {
      const result = await executePlugin(schema.id, inputData);
      setOutputs(result);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Error executing plugin:", error);

      if (onError)
        onError(
          error instanceof Error ? error : new Error("Plugin execution failed")
        );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!schema) {
    return <LoadingSpinner size="medium" />;
  }

  return (
    <div className="plugin-ui-container">
      {/* Input Fields Section */}
      {schema.uiSchema.inputs.length > 0 && (
        <div className="inputs-container space-y-6 mb-8">
          <h3 className="text-lg font-medium">Input</h3>
          <div className="space-y-4">
            {schema.uiSchema.inputs.map((input) => (
              <InputField
                key={input.id}
                field={input}
                value={inputs[input.id]}
                onChange={(value) => handleInputChange(input.id, value)}
                error={validationErrors[input.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Options Section (if any) */}
      {schema.uiSchema.options && schema.uiSchema.options.length > 0 && (
        <div className="options-container space-y-4 mb-8">
          <h3 className="text-lg font-medium">Options</h3>
          <div className="space-y-3 p-4 bg-gray-50 rounded-md">
            {schema.uiSchema.options.map((option) => (
              <OptionField
                key={option.id}
                field={option}
                value={options[option.id]}
                onChange={(value) => handleOptionChange(option.id, value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Controls Section */}
      {schema.uiSchema.controls.length > 0 && (
        <div className="controls-container flex flex-wrap gap-4 mb-8">
          {schema.uiSchema.controls.map((control) => (
            <ControlField
              key={control.id}
              field={control}
              onAction={() => handleAction(control.action)}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}

      {/* Output Fields Section */}
      {schema.uiSchema.outputs.length > 0 && (
        <div className="outputs-container space-y-6">
          <h3 className="text-lg font-medium">Output</h3>
          <div className="space-y-4">
            {schema.uiSchema.outputs.map((output) => (
              <OutputField
                key={output.id}
                field={output}
                value={outputs[output.id]}
                isLoading={isProcessing}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicPluginUI;
