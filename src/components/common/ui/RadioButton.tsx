import { ReactNode } from "react";

type RadioButtonProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
};

export function RadioButton({
  name,
  value,
  checked,
  onChange,
  children,
  className = "",
}: RadioButtonProps) {
  return (
    <label
      className={`flex cursor-pointer items-center transition-all duration-50 ease-in-out ${className} ${
        checked ? "relative -left-9 mr-6" : "mr-12"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <div className="relative flex items-center">
        {/* Animated circle that transforms into chip */}
        <div
          className={`absolute rounded-full border-2 border-black transition-all duration-300 ease-in-out ${
            checked
              ? "right-0 left-0 h-10 bg-black"
              : "-left-7 h-8 w-8 bg-transparent"
          }`}
        />

        {/* Text content */}
        <span
          className={`px-4 font-medium transition-all duration-300 ${
            checked ? "relative z-10 text-white" : "text-gray-700"
          }`}
        >
          {children}
        </span>
      </div>
    </label>
  );
}
