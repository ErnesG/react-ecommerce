import { useMemo } from "react";
import type { ButtonProps } from "../../model/ButtonProps";
export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const classes = useMemo(() => {
    const baseClasses =
      "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
      primary:
        "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
      danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    };
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  }, [variant, size, className]);
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
Button.displayName = "Button";
