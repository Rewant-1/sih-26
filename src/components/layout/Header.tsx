"use client";

import React, { useState, useEffect } from "react";
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

const navLinks = [
  { href: "/dashboard/learner", label: "Learner Hub" },
  { href: "/dashboard/admin", label: "Admin Dashboard" },
  { href: "/acbp", label: "ACBP 2026–27" },
  { href: "/assessment", label: "Self-Assessment" },
  { href: "/catalog", label: "Course Catalog" },
  { href: "/quiz-studio", label: "AI Quiz Studio" },
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
  const [scrolled, setScrolled] = useState(false);

  const currentUserId =
    activeUserId || searchParams?.get("user") || "usr-jso-rajesh";
  const currentOfficer =
    OFFICER_PROFILES.find((p) => p.id === currentUserId) || OFFICER_PROFILES[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      {/* Government top bar */}
      <div className="bg-[#142446] text-white text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
          <span className="text-[#B7C7D9] font-medium tracking-wide">
            Government of India &nbsp;·&nbsp; Ministry of Statistics and Programme Implementation
          </span>
          <span className="text-[#B7C7D9] hidden sm:block">
            Mission Karmayogi &nbsp;·&nbsp; FRAC Framework &nbsp;·&nbsp; SIH 26101
          </span>
        </div>
      </div>

      {/* Tricolor ribbon */}
      <div className="tricolor-bar">
        <span />
        <span />
        <span />
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 w-full bg-white border-b transition-shadow duration-300 ${
          scrolled ? "border-[#B7C7D9] shadow-sm" : "border-[#e8e4dc]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[60px]">

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Karmasarthi Home"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/karmasarthi.png"
                alt="Karmasarthi"
                width={36}
                height={36}
                className="object-contain"
              />
              <div className="flex flex-col leading-tight">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-devanagari font-semibold text-[#142446] text-[13px] leading-none"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  >
                    कर्मसारथी
                  </span>
                  <span className="text-[#C7C2BA] text-[11px] font-light select-none">|</span>
                  <span className="font-sans font-semibold text-[#142446] text-[13px] leading-none tracking-wide uppercase">
                    Karmasarthi
                  </span>
                </div>
                <span className="text-[10px] text-[#475A6F] font-normal tracking-wide mt-0.5 hidden sm:block">
                  AI Skill Intelligence Platform &nbsp;·&nbsp; MoSPI
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href.length > 1 && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={`${link.href}?user=${currentOfficer.id}`}
                  className={`relative px-3.5 py-1.5 text-[12.5px] font-medium rounded-md transition-colors hover-underline ${
                    isActive
                      ? "text-[#142446]"
                      : "text-[#475A6F] hover:text-[#142446]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#D8921E] rounded-t-sm" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Officer profile switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e8e4dc] bg-[#F3E7D1]/40 hover:bg-[#F3E7D1]/80 transition text-left text-xs"
              aria-expanded={profileDropdownOpen}
              aria-label="Switch officer profile"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#142446] text-white text-[10px] font-semibold shrink-0">
                {currentOfficer.avatarText}
              </div>
              <div className="hidden md:block">
                <p className="text-[12px] font-semibold text-[#142446] leading-tight">
                  {currentOfficer.name}
                </p>
                <p className="text-[10px] text-[#475A6F] leading-tight">
                  {currentOfficer.cadre}
                </p>
              </div>
              <ChevronDown
                className={`h-3 w-3 text-[#475A6F] transition-transform duration-200 ${
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
                <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-[#e8e4dc] bg-white shadow-xl ring-1 ring-[#142446]/5">
                  <div className="px-4 py-3 border-b border-[#f0ece4]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#475A6F]">
                      Simulate Officer Profile
                    </p>
                    <p className="text-[11px] text-[#475A6F] mt-0.5">
                      Switch cadre to test adaptive gap analysis
                    </p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {OFFICER_PROFILES.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleSelectOfficer(profile.id)}
                        className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition ${
                          profile.id === currentOfficer.id
                            ? "bg-[#F3E7D1]/60 text-[#142446]"
                            : "hover:bg-[#f7f5f1] text-[#475A6F]"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                            profile.id === currentOfficer.id
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
                          <p className="text-[10px] text-[#C7C2BA] truncate mt-0.5">
                            {profile.division}
                          </p>
                        </div>
                        {profile.id === currentOfficer.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D8921E] self-center shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-[#f0ece4]">
                    <Link
                      href={`/assessment?user=${currentOfficer.id}`}
                      className="block text-center text-[11px] font-medium text-[#142446] hover-underline py-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Begin Assessment as {currentOfficer.name.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
