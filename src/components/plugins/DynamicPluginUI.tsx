import { useEffect, useState } from "react";
import { PluginSchema } from "../../types/pluginSchema";
import InputField from "./InputField";
import OutputField from "./OutputField";
import { executePlugin } from "../../services/plugins/execute";
import { useDebounce } from "../../hooks/useDebounce";

interface DynamicPluginUIProps {
  schema: PluginSchema;
  // since `onSuccess` function is only to display success message without
  // referencing any part of related result, this can just be () => void,
  // however we still pass result data into it, just it case.
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const debouncedInputs = useDebounce(inputs);

  // initialize some default values for required fields if not set
  const handleMissingImportantValues = () => {
    schema.uiSchemas.forEach((section) => {
      section.inputs.forEach((input) => {
        if (["number", "slider"].includes(input.type)) {
          if (!input.min) input.min = 0;
          if (!input.max) input.max = 100;
          if (!input.step) input.step = 1;
          if (!input.defaultValue && !input.placeholder)
            input.defaultValue = input.min;
        } else if (input.type === "color") {
          if (!input.defaultValue && !input.placeholder)
            input.defaultValue = "#000000";
        } else if (input.type === "date") {
          if (!input.defaultValue)
            input.defaultValue = new Date().toISOString().split("T")[0];
        }
        if (["checkbox", "toggle", "radio", "dropdown"].includes(input.type)) {
          if (!input.defaultValue) input.defaultValue = {};
        }
      });
      section.outputs.forEach((output) => {
        if (!output.placeholder) output.placeholder = "No output available";
      });
    });
  };

  // Fill in default values for inputs across all sections
  useEffect(() => {
    handleMissingImportantValues();
    const initialInputs: Record<string, any> = {};
    schema.uiSchemas.forEach((section) => {
      section.inputs.forEach((input) => {
        initialInputs[input.id] =
          input.defaultValue !== undefined ? input.defaultValue : null;
      });
    });
    setInputs(initialInputs);
  }, [schema]);

  // Process data when inputs change (with debounce)
  useEffect(() => {
    // Skip the first render when debouncedInputs is empty
    if (Object.keys(debouncedInputs).length === 0) return;

    handleAction();
  }, [debouncedInputs]);

  /**
   * Handle input field changes
   *
   * Note flow: when `inputs` changes, `debouncedInputs` will be changed too,
   * then it will trigger `handleAction()` function below (see related `useEffect`)
   */
  const handleInputChange = (fieldId: string, value: any) => {
    setInputs((prevInputs) => ({ ...prevInputs, [fieldId]: value }));
    // Clear validation error when user changes the field
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const { [fieldId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  /**
   * Handle API processing action
   */
  const handleAction = async () => {
    // Validate required fields
    const errors: Record<string, string> = {};

    schema.uiSchemas.forEach((section) => {
      section.inputs.forEach((input) => {
        if (
          input.required &&
          (inputs[input.id] === null ||
            inputs[input.id] === undefined ||
            (typeof inputs[input.id] === "string" &&
              inputs[input.id].trim() === ""))
        ) {
          errors[input.id] = "This field is required";
        }
      });
    });

    // If there are validation errors, display them and stop processing
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Process the plugin
    setIsProcessing(true);
    try {
      const result = await executePlugin(schema.id, inputs);
      setOutputs(result);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Error executing plugin:", error);

      if (onError) onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate number of sections to determine grid layout
  const sectionCount = schema.uiSchemas.length;
  const gridCols = sectionCount > 2 ? 3 : sectionCount;

  return (
    <div className="plugin-ui-container">
      {/* Horizontal layout for sections */}
      <div
        className={`${
          sectionCount > 1
            ? `grid grid-cols-1 md:grid-cols-${gridCols} gap-6`
            : ""
        }`}
      >
        {schema.uiSchemas.map((section, index) => (
          <div
            key={index}
            className={`section-container${
              sectionCount > 1 ? ` border border-gray-200` : ``
            } rounded-lg overflow-hidden bg-white`}
          >
            {/* Section Header with Name (if available) */}
            {section.name && (
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                <h2 className="font-medium text-lg">{section.name}</h2>
              </div>
            )}

            <div className={`${sectionCount > 1 ? `p-5` : ``}`}>
              {/* Input Fields for this section */}
              {section.inputs.length > 0 && (
                <div className="inputs-container mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4">
                    {section.name ? "Inputs" : "Input"}
                  </h3>
                  <div className="space-y-4">
                    {section.inputs.map((input) => (
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

              {/* Output Fields for this section */}
              {section.outputs.length > 0 && (
                <div className="outputs-container">
                  <h3 className="text-md font-medium text-gray-700 mb-4">
                    {section.name ? "Outputs" : "Output"}
                  </h3>
                  <div className="space-y-4">
                    {section.outputs.map((output) => (
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default DynamicPluginUI;
