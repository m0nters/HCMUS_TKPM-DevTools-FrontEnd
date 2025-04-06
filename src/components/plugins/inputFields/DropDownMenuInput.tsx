import { InputFieldProps } from "../InputField";
import DropdownMenu from "../../common/Components/DropdownMenu";
import { DropdownOption } from "../../../types/dropdownMenu";

function DropDownMenuInput({ field, value, onChange, error }: InputFieldProps) {
  return (
    <div>
      <DropdownMenu
        options={field.options as DropdownOption[]}
        selectedValue={value || ""}
        onSelect={(selectedValue) => onChange(selectedValue)}
        buttonClassName={error ? "border-red-500" : ""}
      />
    </div>
  );
}

export default DropDownMenuInput;
