import { useMemo } from "react";
import type { BadgeProps } from "../../model/BadgeProps";
export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) => {
  const classes = useMemo(() => {
    const baseClasses = "inline-flex items-center font-medium rounded-full";
    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-2 text-base",
    };
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  }, [variant, size, className]);
  return <span className={classes}>{children}</span>;
};
Badge.displayName = "Badge";
