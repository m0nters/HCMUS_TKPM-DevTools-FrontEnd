import { RadioButton } from "../../common";
import { InputFieldProps } from "../InputField";

export function RadioInput({ field, value, onChange, error }: InputFieldProps) {
  const handleRadioChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <div className="mx-8 my-6 flex">
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
