import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "saffron"
    | "navy"
    | "success";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default:
        "bg-[#142446] text-white hover:bg-[#1e3460] shadow-sm border border-transparent",
      secondary:
        "bg-[#B7C7D9]/30 text-[#142446] hover:bg-[#B7C7D9]/50 border border-[#B7C7D9]",
      outline:
        "border border-[#C7C2BA] bg-white text-[#475A6F] hover:bg-[#F3E7D1]/40 hover:text-[#142446] shadow-sm",
      ghost: "text-[#475A6F] hover:bg-[#F3E7D1]/50 hover:text-[#142446]",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-sm border border-transparent",
      saffron:
        "bg-[#D8921E] text-white hover:bg-[#e8a835] shadow-sm font-medium border border-transparent focus-visible:ring-[#D8921E]",
      navy:
        "bg-[#142446] text-white hover:bg-[#1e3460] shadow-sm font-medium border border-transparent focus-visible:ring-[#142446]",
      success:
        "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm font-medium border border-transparent",
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-9 px-4 py-2 text-sm rounded-lg",
      lg: "h-11 px-6 py-2.5 text-base rounded-lg",
      icon: "h-9 w-9 p-0 rounded-lg justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
