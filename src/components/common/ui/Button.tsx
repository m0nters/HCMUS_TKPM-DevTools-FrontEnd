import { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Button component with primary and secondary variants
 * @param children - Button text
 * @param variant - Button variant (primary or secondary)
 * @param size - Button size (sm, md, lg)
 * @param to - React Router link
 * @param href - External link
 * @param onClick - Action button
 * @param className - Additional custom classes
 * @param type - Button type (button, submit, reset)
 * @param disabled - Disable button
 * @returns Button component
 * @example
 * ```tsx
 * <Button to="/login" variant="primary" size="md">
 *  Login
 * </Button>
 * ```
 */
interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant; // primary (black) or secondary (white)
  size?: ButtonSize;
  to?: string; // For React Router links
  href?: string; // For external links
  onClick?: () => void; // For action buttons
  className?: string; // Additional custom classes
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  // Size classes mapping
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Base classes that apply to both variants
  const baseClasses = `font-medium rounded-md w-full relative overflow-hidden group transition-colors ${sizeClasses[size]}`;

  // Variant specific classes
  const variantClasses = {
    primary: `bg-black border-2 border-black text-white hover:bg-black`,
    secondary: `bg-white text-black border-2 border-black hover:text-white`,
  };

  // Hover effect spans
  const hoverEffect =
    variant === "primary" ? (
      <span className="absolute inset-0 w-0 bg-white rounded-sm transition-all duration-300 ease-in-out group-hover:w-full"></span>
    ) : (
      <span className="absolute inset-0 w-0 bg-black rounded-sm transition-all duration-300 ease-in-out group-hover:w-full"></span>
    );

  // Text that changes color on hover
  const buttonText = (
    <span
      className={`relative ${
        variant === "primary"
          ? "group-hover:text-black"
          : "group-hover:text-white"
      } transition-colors duration-300 ease-in-out`}
    >
      {children}
    </span>
  );

  // If disabled, override classes
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "hover:shadow-md cursor-pointer";

  // Render as Link for React Router navigation
  if (to) {
    return (
      <div className={`${className}`}>
        <Link
          to={to}
          className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
        >
          {hoverEffect}
          {buttonText}
        </Link>
      </div>
    );
  }

  // Render as anchor for external links
  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {hoverEffect}
        {buttonText}
      </a>
    );
  }

  // Render as button for actions
  return (
    <div className={`${className}`}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
      >
        {hoverEffect}
        {buttonText}
      </button>
    </div>
  );
}

export default Button;
