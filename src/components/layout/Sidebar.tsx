"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart2,
  BookMarked,
  CalendarCheck2,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface SidebarProps {
  currentUserId?: string;
}

export function Sidebar({ currentUserId }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = currentUserId || searchParams?.get("user") || "usr-jso-rajesh";

  const buildUrl = (path: string) => `${path}?user=${userId}`;

  const learnerNav = [
    {
      href: buildUrl("/dashboard/learner"),
      pathnameMatch: "/dashboard/learner",
      label: "Learner Overview",
      icon: LayoutDashboard,
    },
    {
      href: buildUrl("/assessment"),
      pathnameMatch: "/assessment",
      label: "FRAC Self-Assessment",
      icon: CheckCircle,
      badge: "29 Skills",
    },
    {
      href: buildUrl("/catalog"),
      pathnameMatch: "/catalog",
      label: "Course Catalog",
      icon: BookMarked,
      badge: "iGOT + NSSTA",
    },
    {
      href: buildUrl("/quiz-studio"),
      pathnameMatch: "/quiz-studio",
      label: "AI Quiz Studio",
      icon: FileText,
      badge: "MCQ Engine",
    },
  ];

  const adminNav = [
    {
      href: buildUrl("/dashboard/admin"),
      pathnameMatch: "/dashboard/admin",
      label: "Leadership & Heatmap",
      icon: BarChart2,
      badge: "5 Divisions",
    },
    {
      href: buildUrl("/acbp"),
      pathnameMatch: "/acbp",
      label: "ACBP 2026-27 Plan",
      icon: FileSpreadsheet,
      badge: "Batches",
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#C7C2BA]/60 bg-white p-4 hidden md:flex flex-col justify-between min-h-[calc(100vh-6rem)]">
      <div className="space-y-6">
        {/* Learner Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#475A6F]">
              Officer Workspace
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]/60">
              Learner
            </span>
          </div>
          <nav className="space-y-1">
            {learnerNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.pathnameMatch;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-[#142446] text-white shadow-xs"
                      : "text-[#475A6F] hover:bg-[#FAF9F6] hover:text-[#142446]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]/40"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Leadership & Analytics Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#475A6F]">
              DIID / Executive Hub
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#B7C7D9]/40 text-[#142446] border border-[#C7C2BA]/60">
              Admin
            </span>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.pathnameMatch;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-[#142446] text-white shadow-xs"
                      : "text-[#475A6F] hover:bg-[#FAF9F6] hover:text-[#142446]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]/40"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Framework Reference Info (Clean, No Box Frame) */}
        <div className="pt-4 border-t border-[#C7C2BA]/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#142446]">
            <ShieldCheck className="h-4 w-4 text-[#142446]" />
            <span>Mission Karmayogi FRAC</span>
          </div>
          <p className="text-[11px] text-[#475A6F] leading-relaxed">
            4 official statistical domains mapped across Level 1–5 proficiency scales.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-[#C7C2BA]/60 text-[11px] text-[#475A6F] space-y-1">
        <p className="font-semibold text-[#142446]">MoSPI · DIID Platform</p>
        <p className="text-[10px]">Karmayogi Statistical Extension</p>
      </div>
    </aside>
  );
}
