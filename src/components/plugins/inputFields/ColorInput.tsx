import { InputFieldProps } from "../InputField";
import { useState, useEffect } from "react";

export function ColorInput({ field, value, onChange, error }: InputFieldProps) {
  const [textColor, setTextColor] = useState<string>("white");
  const colorValue = value;

  // Calculate contrasting text color (black or white) based on background color brightness
  useEffect(() => {
    // Convert hex to RGB
    const hex = colorValue.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate perceived brightness using the formula:
    // (R * 0.299 + G * 0.587 + B * 0.114)
    // If brightness > 128, use black text; otherwise, use white
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    setTextColor(brightness > 128 ? "black" : "white");
  }, [colorValue]);

  return (
    <div className="relative border-2 border-gray-300 rounded-md p-1">
      <input
        type="color"
        id={field.id}
        value={colorValue}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        className="h-10 w-full opacity-0 absolute inset-0 cursor-pointer z-10"
      />
      <div
        className={`h-10 w-full rounded-md flex items-center justify-center`}
        style={{
          backgroundColor: colorValue,
          color: textColor,
          fontFamily: "monospace",
        }}
      >
        <span className="text-sm font-medium tracking-wide">
          {colorValue.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
