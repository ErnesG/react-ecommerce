import { forwardRef, useMemo } from "react";
import type { InputProps } from "../../model/InputProps";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "outlined",
      inputSize = "md",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = useMemo(
      () => id || `input-${Math.random().toString(36).substr(2, 9)}`,
      [id]
    );

    const inputClasses = useMemo(() => {
      const baseClasses = "w-full transition-colors focus:outline-none";
      const variantClasses = {
        default:
          "border-0 border-b-2 border-gray-300 focus:border-primary-500 bg-transparent",
        outlined:
          "border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
      };
      const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-5 py-4 text-lg",
      };
      const errorClasses = error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "";
      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${errorClasses} ${className}`;
    }, [variant, inputSize, error, className]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={inputClasses} {...props} />
        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              error ? "text-red-600" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
