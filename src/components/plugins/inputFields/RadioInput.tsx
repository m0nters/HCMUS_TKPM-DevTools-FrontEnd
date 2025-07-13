import { RadioButton } from "../../common";
import { InputFieldProps } from "../InputField";

export function RadioInput({ field, value, onChange, error }: InputFieldProps) {
  const handleRadioChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <div className="flex my-6 mx-8">
      {field.options?.map((option) => (
        <RadioButton
          key={option.value}
          name={field.id}
          value={option.value}
          checked={value === option.value}
          onChange={handleRadioChange}
        >
          {option.label}
        </RadioButton>
      ))}
    </div>
  );
}
