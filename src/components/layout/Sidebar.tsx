"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart2,
  BookMarked,
  BrainCircuit,
  CalendarCheck2,
  CheckCircle,
  FileSpreadsheet,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
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
      badge: "iGOT+NSSTA",
    },
    {
      href: buildUrl("/quiz-studio"),
      pathnameMatch: "/quiz-studio",
      label: "AI Quiz Studio",
      icon: Sparkles,
      badge: "Gemini",
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
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-sm p-4 hidden md:flex flex-col justify-between min-h-[calc(100vh-4.5rem)]">
      <div className="space-y-6">
        {/* Learner Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Officer Workspace
            </h2>
            <Badge variant="saffron" size="sm">
              Learner
            </Badge>
          </div>
          <nav className="space-y-1">
            {learnerNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.pathnameMatch;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#000080] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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
                          : "bg-slate-100 text-slate-600"
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
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              DIID / Executive Hub
            </h2>
            <Badge variant="navy" size="sm">
              Admin
            </Badge>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.pathnameMatch;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#000080] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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
                          : "bg-slate-100 text-slate-600"
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

        {/* Framework Reference Box */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#000080]">
            <ShieldCheck className="h-4 w-4" />
            <span>Mission Karmayogi FRAC</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            4 official statistical domains mapped across Level 1-5 proficiency
            scales.
          </p>
          <div className="grid grid-cols-2 gap-1 pt-1 font-mono text-[10px] text-slate-500">
            <span className="bg-white rounded px-1.5 py-0.5">📊 8 Statistical</span>
            <span className="bg-white rounded px-1.5 py-0.5">💻 7 Technical</span>
            <span className="bg-white rounded px-1.5 py-0.5">🛡️ 7 Governance</span>
            <span className="bg-white rounded px-1.5 py-0.5">🤝 7 Behavioural</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">MoSPI • DIID Platform</p>
        <p className="text-[10px]">Zero-Config JSON Data Architecture</p>
      </div>
    </aside>
  );
}
