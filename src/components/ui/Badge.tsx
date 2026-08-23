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
    default: "bg-slate-900 text-white border-transparent",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    outline: "text-slate-800 border-slate-300 bg-transparent",
    destructive: "bg-rose-100 text-rose-800 border-rose-200 font-medium",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200 font-medium",
    warning: "bg-amber-100 text-amber-800 border-amber-200 font-medium",
    saffron: "bg-amber-500/15 text-amber-700 border-amber-300 font-medium",
    navy: "bg-indigo-950 text-white border-indigo-900 font-medium",
    igot: "bg-orange-100 text-orange-800 border-orange-300 font-medium",
    nssta: "bg-blue-100 text-blue-900 border-blue-300 font-medium",
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
