"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

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

// Capsule navbar items strictly per instructions:
// 1. Self-Assessment Scores
// 2. Catalog
// 3. AI Quiz Studio
// 4. Learner Hub
const capsuleNavLinks = [
  {
    href: "/assessment",
    label: "Self-Assessment Scores",
    matchPath: "/assessment",
  },
  {
    href: "/catalog",
    label: "Catalog",
    matchPath: "/catalog",
  },
  {
    href: "/quiz-studio",
    label: "AI Quiz Studio",
    matchPath: "/quiz-studio",
  },
  {
    href: "/dashboard/learner",
    label: "Learner Hub",
    matchPath: "/dashboard/learner",
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

  return (
    <div className="w-full bg-white">
      {/* ── Top Government Header Bar ── */}
      <div className="bg-[#142446] text-[#B7C7D9] text-[11px] border-b border-[#1e3460]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium tracking-wide text-white/90">
              Government of India
            </span>
            <span className="text-[#475A6F]">|</span>
            <span className="text-[#B7C7D9]">
              Ministry of Statistics & Programme Implementation
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="text-[#F3E7D1] font-medium">
              Mission Karmayogi
            </span>
            <span className="text-[#475A6F]">·</span>
            <span className="text-[#B7C7D9]">
              FRAC Competency Framework
            </span>
          </div>
        </div>
      </div>

      {/* ── National Tricolor Accent Ribbon ── */}
      <div className="tricolor-bar">
        <span />
        <span />
        <span />
      </div>

      {/* ── Main White Header ── */}
      <header className="w-full bg-white border-b border-[#C7C2BA]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[70px]">
          {/* Logo & App Name */}
          <Link
            href={`/?user=${currentOfficer.id}`}
            className="flex items-center gap-3.5"
            aria-label="Karmasarthi Home"
          >
            <div className="relative flex items-center shrink-0">
              <Image
                src="/karmasarthi.png"
                alt="Karmasarthi Logo"
                width={500}
                height={500}
                priority
                className="h-[44px] w-auto object-contain"
              />
            </div>
          </Link>

          {/* Right Action: Officer Profile Switcher (Personalization & Context) */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#C7C2BA]/70 bg-[#FAF9F6] text-left"
              aria-expanded={profileDropdownOpen}
              aria-label="Switch officer profile"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#142446] text-white text-[11px] font-semibold shrink-0">
                {currentOfficer.avatarText}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-bold text-[#142446] leading-none">
                    {currentOfficer.name}
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8921E]" />
                </div>
                <p className="text-[10px] text-[#475A6F] leading-tight mt-0.5">
                  {currentOfficer.cadre} · {currentOfficer.division.split("(")[1]?.replace(")", "") || "MoSPI"}
                </p>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#475A6F] transition-transform duration-150 ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-[#C7C2BA]/80 bg-white shadow-lg p-1.5">
                  <div className="px-3 py-2 border-b border-[#C7C2BA]/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#475A6F]">
                      Simulate Statistical Cadre
                    </p>
                    <p className="text-[11px] text-[#142446] font-medium mt-0.5">
                      Select officer to test role-calibrated competency gap analysis
                    </p>
                  </div>
                  <div className="py-1.5 space-y-1">
                    {OFFICER_PROFILES.map((profile) => {
                      const isSelected = profile.id === currentOfficer.id;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => handleSelectOfficer(profile.id)}
                          className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left ${
                            isSelected
                              ? "bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]/60"
                              : "hover:bg-[#FAF9F6] text-[#475A6F]"
                          }`}
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              isSelected
                                ? "bg-[#142446] text-white"
                                : "bg-[#B7C7D9]/50 text-[#142446]"
                            }`}
                          >
                            {profile.avatarText}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-[#142446] truncate">
                              {profile.name}
                            </p>
                            <p className="text-[11px] text-[#475A6F] truncate">
                              {profile.designation}
                            </p>
                            <p className="text-[10px] text-[#475A6F]/80 truncate">
                              {profile.division}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#142446] text-white self-center">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-3 py-2 border-t border-[#C7C2BA]/40 bg-[#FAF9F6] rounded-b-lg">
                    <Link
                      href={`/assessment?user=${currentOfficer.id}`}
                      className="block text-center text-[11px] font-semibold text-[#142446] hover:text-[#D8921E] py-0.5"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Open Assessment for {currentOfficer.name} →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Floating Capsule Navigation Bar (Seamless, No Background Strip) ── */}
      <div className="w-full bg-white pb-3 pt-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {/* Floating Capsule Container */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="inline-flex items-center gap-1.5 p-1 bg-[#FAF9F6] rounded-full border border-[#C7C2BA] shadow-xs"
          >
            {capsuleNavLinks.map((link) => {
              const isActive =
                pathname === link.matchPath ||
                (link.matchPath.length > 1 && pathname?.startsWith(link.matchPath));

              return (
                <Link
                  key={link.href}
                  href={`${link.href}?user=${currentOfficer.id}`}
                  className={`px-4 sm:px-5 py-1.5 rounded-full text-[13px] font-semibold transition-colors duration-150 text-center ${
                    isActive
                      ? "bg-[#142446] text-white shadow-xs"
                      : "text-[#475A6F] hover:text-[#142446] hover:bg-[#F3E7D1]/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
