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
    <div className="relative rounded-md border-2 border-gray-300 p-1">
      <input
        type="color"
        id={field.id}
        value={colorValue}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        className="absolute inset-0 z-10 h-10 w-full cursor-pointer opacity-0"
      />
      <div
        className={`flex h-10 w-full items-center justify-center rounded-md`}
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
