"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Shield,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface OfficerProfile {
  id: string;
  name: string;
  designation: string;
  cadre: string;
  division: string;
  avatarText: string;
}

const OFFICER_PROFILES: OfficerProfile[] = [
  {
    id: "usr-jso-rajesh",
    name: "Rajesh Kumar",
    designation: "Junior Statistical Officer (JSO)",
    cadre: "JSO",
    division: "Field Operations Division (FOD)",
    avatarText: "RK",
  },
  {
    id: "usr-sso-priya",
    name: "Priya Sharma",
    designation: "Senior Statistical Officer (SSO)",
    cadre: "SSO",
    division: "Economic Statistics Division (ESD)",
    avatarText: "PS",
  },
  {
    id: "usr-ad-amit",
    name: "Dr. Amit Verma",
    designation: "Assistant Director (ISS)",
    cadre: "ISS AD",
    division: "National Accounts Division (NAD)",
    avatarText: "AV",
  },
  {
    id: "usr-dir-sunita",
    name: "Sunita Rao",
    designation: "Director (DIID & CBC)",
    cadre: "Director (ISS)",
    division: "Data Informatics & Innovation Division",
    avatarText: "SR",
  },
];

export function Header({
  activeUserId,
  onUserChange,
}: {
  activeUserId?: string;
  onUserChange?: (userId: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Determine current user
  const currentUserId =
    activeUserId || searchParams?.get("user") || "usr-jso-rajesh";
  const currentOfficer =
    OFFICER_PROFILES.find((p) => p.id === currentUserId) || OFFICER_PROFILES[0];

  const handleSelectOfficer = (officerId: string) => {
    setProfileDropdownOpen(false);
    if (onUserChange) {
      onUserChange(officerId);
    } else {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("user", officerId);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const navLinks = [
    {
      href: "/dashboard/learner",
      label: "Learner Hub",
      icon: LayoutDashboard,
      badge: "FRAC",
    },
    {
      href: "/dashboard/admin",
      label: "Leadership & DIID",
      icon: BarChart3,
      badge: "Heatmap",
    },
    {
      href: "/acbp",
      label: "ACBP 2026-27",
      icon: FileCheck2,
      badge: "Planner",
    },
    {
      href: "/assessment",
      label: "Self-Assessment",
      icon: CheckCircle2,
    },
    {
      href: "/catalog",
      label: "Course Catalog",
      icon: BookOpen,
      badge: "iGOT+NSSTA",
    },
    {
      href: "/quiz-studio",
      label: "AI Quiz Studio",
      icon: Sparkles,
      badge: "Gemini",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Government of India Tricolor Ribbon Bar */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Left: MoSPI Emblem & Brand */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#000080] to-[#0B132B] text-white shadow-md ring-1 ring-[#000080]/30">
              <span className="font-serif font-black text-xl tracking-tighter text-[#FF9933]">
                M
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight sm:text-base">
                  MoSPI Skill Intelligence
                </span>
                <Badge variant="saffron" size="sm" className="hidden sm:inline-flex py-0">
                  SIH 26101
                </Badge>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Data Informatics & Innovation Division (DIID) • Mission Karmayogi
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href.startsWith("/dashboard") &&
                pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={`${link.href}?user=${currentOfficer.id}`}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#000080] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/70 text-slate-700"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Officer Profile Switcher */}
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-[#000080]"
              aria-expanded={profileDropdownOpen}
              aria-label="Switch Officer Profile"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#000080] font-bold text-white text-[11px] shadow-sm">
                {currentOfficer.avatarText}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-semibold text-slate-900 leading-tight">
                  {currentOfficer.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentOfficer.cadre} • {currentOfficer.division.split(" ")[0]}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-950/5 animate-in fade-in-50 zoom-in-95">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Simulate Statistical Officer
                    </p>
                    <p className="text-xs text-slate-500">
                      Switch cadre profile to test adaptive FRAC gap analysis
                    </p>
                  </div>
                  <div className="space-y-1">
                    {OFFICER_PROFILES.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleSelectOfficer(profile.id)}
                        className={`flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition ${
                          profile.id === currentOfficer.id
                            ? "bg-slate-100 border border-slate-200 text-[#000080]"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            profile.id === currentOfficer.id
                              ? "bg-[#000080] text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {profile.avatarText}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {profile.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {profile.designation}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            {profile.division}
                          </p>
                        </div>
                        {profile.id === currentOfficer.id && (
                          <div className="h-2 w-2 rounded-full bg-[#138808] self-center" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-slate-100 pt-2 px-2">
                    <Link
                      href={`/assessment?user=${currentOfficer.id}`}
                      className="block text-center text-xs font-semibold text-[#000080] hover:underline"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Take Self-Assessment as {currentOfficer.name.split(" ")[0]} →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
