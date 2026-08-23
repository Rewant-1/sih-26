import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }
  return `${hours} hr${hours > 1 ? "s" : ""} ${remainingMins} min`;
}

export function getDomainBadgeColor(domain: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (domain) {
    case "Statistical Competencies":
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-800 border-blue-300",
      };
    case "Technical Competencies":
      return {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        badge: "bg-purple-100 text-purple-800 border-purple-300",
      };
    case "Digital Governance & Data Stewardship":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      };
    case "Behavioural & Managerial Competencies":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        badge: "bg-slate-100 text-slate-800 border-slate-300",
      };
  }
}
