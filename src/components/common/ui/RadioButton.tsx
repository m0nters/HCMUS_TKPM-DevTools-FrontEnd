import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
    <motion.label
      className={`flex cursor-pointer items-center ${className}`}
      animate={{
        x: checked ? -36 : 0,
        marginRight: checked ? 24 : 48,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 18,
        mass: 1,
      }}
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
        {/* Circle that transforms into chip */}
        <motion.div
          className="absolute rounded-full border-2 border-black"
          animate={{
            left: checked ? 0 : -28,
            right: checked ? 0 : "auto",
            width: checked ? "100%" : 32,
            height: checked ? 40 : 32,
            backgroundColor: checked ? "#000000" : "transparent",
          }}
        />

        {/* Text */}
        <motion.span
          className="px-4 font-medium"
          animate={{
            color: checked ? "#ffffff" : "#000000",
            zIndex: checked ? 2 : 1,
          }}
        >
          {children}
        </motion.span>
      </div>
    </motion.label>
  );
}
