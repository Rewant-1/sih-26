import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  variant?: "default" | "saffron" | "navy" | "green" | "rose" | "amber";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function Progress({
  className,
  value = 0,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const variantColors = {
    default: "bg-slate-900",
    saffron: "bg-[#FF9933]",
    navy: "bg-[#000080]",
    green: "bg-[#138808]",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full space-y-1", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60 shadow-inner",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
