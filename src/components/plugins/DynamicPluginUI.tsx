import { useEffect, useState } from "react";
import { PluginSchema } from "../../types/";
import InputField from "./InputField";
import OutputField from "./OutputField";
import { executePlugin } from "../../services/plugins/";
import { useDebounce } from "../../hooks/";
import { hasValue } from "../../utils/";

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

  // Initialize default values for inputs and validate schema
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

  // Handle input changes with debounce for auto-processing
  useEffect(() => {
    if (Object.keys(debouncedInputs).length === 0) return;
    handleAction();
  }, [debouncedInputs]);

  // Initialize default values for required fields
  const handleMissingImportantValues = () => {
    schema.uiSchemas.forEach((section) => {
      section.inputs.forEach((input) => {
        if (input.type === "text") {
          if (!input.placeholder) input.placeholder = "Enter something here...";
        } else if (input.type === "textarea") {
          if (!input.rows) input.rows = 5;
          if (!input.placeholder) input.placeholder = "Enter something here...";
        } else if (["number", "slider"].includes(input.type)) {
          if (!input.min) input.min = 0;
          if (!input.max) input.max = 100;
          if (!input.step) input.step = 1;
          if (!input.defaultValue) input.defaultValue = input.min;
        } else if (input.type === "color") {
          if (!input.defaultValue) input.defaultValue = "#000000";
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
        if (output.type === "textarea") {
          if (!output.rows) output.rows = 5;
        }
      });
    });
  };

  // Update input values and clear validation errors
  const handleInputChange = (fieldId: string, value: any) => {
    setInputs((prevInputs) => ({ ...prevInputs, [fieldId]: value }));
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const { [fieldId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Process the plugin data
  const handleAction = async () => {
    // Validate required fields
    const errors: Record<string, string> = {};
    schema.uiSchemas.forEach((section) => {
      section.inputs.forEach((input) => {
        if (input.required && hasValue(inputs[input.id])) {
          errors[input.id] = "This field is required";
        }
      });
    });

    // Show validation errors and stop processing if needed
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Process the plugin
    setIsProcessing(true);
    try {
      console.log("Input object", inputs);
      const outputs = await executePlugin(schema.id, inputs);
      console.log("Output object", outputs);
      setOutputs(outputs);
      if (onSuccess) onSuccess(outputs);
    } catch (error) {
      console.error("Error executing plugin:", error);
      if (onError) onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate grid layout classes based on section count
  const getGridLayoutClasses = () => {
    const sectionCount = schema.uiSchemas.length;
    if (sectionCount === 1) return "";

    // Define specific classes to avoid dynamic class generation issues in Tailwind
    if (sectionCount === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-6";
    } else {
      return "grid grid-cols-1 md:grid-cols-3 gap-6";
    }
  };

  // Get section container classes based on layout
  const getSectionContainerClasses = (hasMultipleSections: boolean) => {
    if (hasMultipleSections)
      return "section-container border border-gray-200 rounded-lg overflow-hidden bg-white";
  };

  // Get section content padding classes
  const getSectionContentClasses = (hasMultipleSections: boolean) => {
    if (hasMultipleSections) return "p-5";
  };

  // Grid layout classes for the container
  const gridLayoutClasses = getGridLayoutClasses();

  // Multiple sections flag for reuse
  const hasMultipleSections = schema.uiSchemas.length > 1;

  return (
    <div className="plugin-ui-container">
      {/* Horizontal layout for sections */}
      <div className={gridLayoutClasses}>
        {schema.uiSchemas.map((section, index) => {
          // Section-specific classes
          const sectionContainerClasses =
            getSectionContainerClasses(hasMultipleSections);
          const sectionContentClasses =
            getSectionContentClasses(hasMultipleSections);

          return (
            <div key={index} className={sectionContainerClasses}>
              {/* Section Header with Name (if available) */}
              {section.name && (
                <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                  <h2 className="font-medium text-lg">{section.name}</h2>
                </div>
              )}

              <div className={sectionContentClasses}>
                {/* Input Fields for this section */}
                {section.inputs.length > 0 && (
                  <div className="inputs-container mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-4">
                      {section.inputs.length > 1 ? "Inputs" : "Input"}
                    </h3>
                    <div className="space-y-4">
                      {section.inputs.map((input) => (
                        <InputField
                          key={input.id}
                          field={input}
                          value={inputs[input.id]}
                          onChange={(value) =>
                            handleInputChange(input.id, value)
                          }
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
                      {section.outputs.length > 1 ? "Outputs" : "Output"}
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
          );
        })}
      </div>
    </div>
  );
}

export default DynamicPluginUI;
