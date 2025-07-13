import { DropdownOption } from "../../../types/";
import { DropdownMenu } from "../../common/";
import { InputFieldProps } from "../InputField";

export function DropDownMenuInput({
  field,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <div>
      <DropdownMenu
        searchable={false}
        options={field.options as DropdownOption[]}
        selectedValue={value}
        onSelect={(selectedValue) => onChange(selectedValue)}
        buttonClassName={error ? "border-red-500" : ""}
      />
    </div>
  );
}
