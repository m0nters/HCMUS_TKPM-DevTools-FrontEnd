import { InputFieldProps } from "../InputField";

function SliderInput({ field, value, onChange, error }: InputFieldProps) {
  return (
    <>
      <div className="flex justify-between">
        <span className="text-xs text-gray-500">{field.min || 0}</span>
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs text-gray-500"> {field.max || 100}</span>
      </div>
      <input
        type="range"
        id={field.id}
        min={field.min || 0}
        max={field.max || 100}
        step={field.step || 1}
        value={value ?? (field.min! + field.max!) / 2}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
      />
    </>
  );
}

export default SliderInput;
