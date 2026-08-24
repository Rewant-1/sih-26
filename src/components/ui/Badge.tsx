import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "saffron"
    | "navy"
    | "igot"
    | "nssta";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-[#142446] text-white border-transparent",
    secondary: "bg-[#B7C7D9]/30 text-[#142446] border-[#B7C7D9]",
    outline: "text-[#142446] border-[#C7C2BA] bg-transparent",
    destructive: "bg-rose-100 text-rose-800 border-rose-200 font-medium",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200 font-medium",
    warning: "bg-amber-100 text-amber-800 border-amber-200 font-medium",
    saffron: "bg-[#D8921E]/15 text-[#D8921E] border-[#D8921E]/40 font-medium",
    navy: "bg-[#142446] text-white border-[#1e3460] font-medium",
    igot: "bg-[#B7C7D9]/30 text-[#142446] border-[#B7C7D9] font-medium",
    nssta: "bg-[#475A6F]/20 text-[#142446] border-[#475A6F]/40 font-medium",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs font-semibold",
    lg: "px-3 py-1 text-sm font-semibold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
