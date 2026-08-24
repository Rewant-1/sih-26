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
    <div className="w-full bg-white z-40 relative">
      {/* ── Top Government Identity Strip ── */}
      <div className="bg-[#142446] text-[#B7C7D9] text-[11px] border-b border-[#1e3460]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium tracking-wide text-white/90">
              Government of India
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[#B7C7D9]">
              Ministry of Statistics & Programme Implementation
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="text-[#F3E7D1] font-medium">
              Mission Karmayogi
            </span>
            <span className="text-white/30">·</span>
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

      {/* ── Unified Single Header Bar with Embedded Deep Navy Capsule Navbar ── */}
      <header className="w-full bg-white border-b border-[#C7C2BA]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[74px] gap-4">
          
          {/* 1. Large Brand Logo */}
          <Link
            href={`/?user=${currentOfficer.id}`}
            className="flex items-center shrink-0"
            aria-label="Karmasarthi Home"
          >
            <Image
              src="/karmasarthi.png"
              alt="Karmasarthi Logo"
              width={260}
              height={70}
              priority
              className="h-[54px] w-auto object-contain"
            />
          </Link>

          {/* 2. Embedded Deep Navy Capsule Navbar */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden md:inline-flex items-center gap-1 p-1 bg-[#142446] rounded-full shadow-sm"
          >
            {capsuleNavLinks.map((link) => {
              const isActive =
                pathname === link.matchPath ||
                (link.matchPath.length > 1 && pathname?.startsWith(link.matchPath));

              return (
                <Link
                  key={link.href}
                  href={`${link.href}?user=${currentOfficer.id}`}
                  className={`px-4 lg:px-5 py-2 rounded-full text-[12.5px] font-semibold transition-colors text-center ${
                    isActive
                      ? "bg-white text-[#142446] shadow-xs"
                      : "text-[#B7C7D9] hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Compact Officer Profile Switcher (Clean, Non-Boxy) */}
          <div className="relative shrink-0">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 py-1 px-2.5 rounded-full hover:bg-[#FAF9F6] border border-transparent hover:border-[#C7C2BA]/60 transition-colors text-left"
              aria-expanded={profileDropdownOpen}
              aria-label="Switch officer profile"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#142446] text-[#F3E7D1] text-[11px] font-bold shrink-0">
                {currentOfficer.avatarText}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-bold text-[#142446] leading-none">
                  {currentOfficer.name}
                </p>
                <p className="text-[10px] text-[#475A6F] mt-0.5 leading-none">
                  {currentOfficer.cadre}
                </p>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#475A6F] transition-transform duration-150 ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Popover */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-[#C7C2BA] bg-white shadow-xl p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-[#C7C2BA]/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#475A6F]">
                      Switch Official Cadre
                    </p>
                    <p className="text-[11px] text-[#142446] font-medium mt-0.5">
                      Preview tailored competency benchmarks & courses
                    </p>
                  </div>
                  <div className="py-1 space-y-1">
                    {OFFICER_PROFILES.map((profile) => {
                      const isSelected = profile.id === currentOfficer.id;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => handleSelectOfficer(profile.id)}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                            isSelected
                              ? "bg-[#FAF9F6] border border-[#C7C2BA]"
                              : "hover:bg-[#FAF9F6]"
                          }`}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#142446] text-white text-[10px] font-bold shrink-0">
                            {profile.avatarText}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-[#142446] truncate">
                              {profile.name}
                            </p>
                            <p className="text-[10px] text-[#475A6F] truncate">
                              {profile.designation}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-[#142446] text-white">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Mobile Navigation Drop (Visible on Small Screens) */}
        <div className="md:hidden flex items-center justify-center p-2 bg-[#142446] overflow-x-auto gap-1">
          {capsuleNavLinks.map((link) => {
            const isActive =
              pathname === link.matchPath ||
              (link.matchPath.length > 1 && pathname?.startsWith(link.matchPath));

            return (
              <Link
                key={link.href}
                href={`${link.href}?user=${currentOfficer.id}`}
                className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold shrink-0 ${
                  isActive
                    ? "bg-white text-[#142446]"
                    : "text-[#B7C7D9] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </header>
    </div>
  );
}
