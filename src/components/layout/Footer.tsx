import React from "react";
import Link from "next/link";
import Image from "next/image";

const platformLinks = [
  { href: "/assessment", label: "Self-Assessment Scores" },
  { href: "/catalog", label: "Course Catalog" },
  { href: "/quiz-studio", label: "AI Quiz Studio" },
  { href: "/dashboard/learner", label: "Learner Hub" },
  { href: "/dashboard/admin", label: "Leadership Analytics" },
  { href: "/acbp", label: "Annual Capacity Building Plan" },
];

const institutionalLinks = [
  { label: "Mission Karmayogi", href: "https://karmayogi.gov.in" },
  { label: "iGOT Karmayogi Bharat", href: "https://igotkarmayogi.gov.in" },
  { label: "NSSTA, Greater Noida", href: "#" },
  { label: "MoSPI, Government of India", href: "https://mospi.gov.in" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-[#C7C2BA]/60 text-[#142446]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#C7C2BA]/40">
          {/* Brand column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/karmasarthi.png"
                alt="Karmasarthi"
                width={160}
                height={48}
                className="h-[42px] w-auto object-contain"
              />
            </div>

            <p className="text-[13px] text-[#475A6F] leading-relaxed max-w-sm">
              AI-enabled competency assessment and personalized learning pathways for India&apos;s Official Statistical System — integrated with Mission Karmayogi.
            </p>

            <div className="text-[12px] text-[#475A6F] leading-normal pt-1">
              <p className="font-semibold text-[#142446]">Data Informatics & Innovation Division (DIID)</p>
              <p>Ministry of Statistics & Programme Implementation</p>
              <p>Government of India</p>
            </div>
          </div>

          {/* Platform modules */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#142446]">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#475A6F] hover:text-[#142446] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#142446]">
              Institutional Framework
            </h4>
            <ul className="space-y-2">
              {institutionalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-[13px] text-[#475A6F] hover:text-[#142446] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Statistical Cadres */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#142446]">
              Statistical Cadres
            </h4>
            <ul className="space-y-1.5 text-[12.5px] text-[#475A6F]">
              <li>ISS Assistant Director</li>
              <li>Senior Statistical Officer</li>
              <li>Junior Statistical Officer</li>
              <li className="pt-2 text-[11px] font-mono text-[#142446] font-medium">
                FOD · ESD · NAD · DIID · SDRD
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#475A6F]">
          <p>
            &copy; 2026 Ministry of Statistics & Programme Implementation (MoSPI). All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>GIGW Compliant</span>
            <span className="text-[#C7C2BA]">·</span>
            <span>Mission Karmayogi Standard</span>
            <span className="text-[#C7C2BA]">·</span>
            <span className="font-mono text-[10px] text-[#142446]">FRAC Framework</span>
          </div>
        </div>
      </div>

      {/* Tricolor bottom accent */}
      <div className="tricolor-bar">
        <span />
        <span />
        <span />
      </div>
    </footer>
  );
}
