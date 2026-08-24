import React from "react";
import Link from "next/link";
import Image from "next/image";

const platformLinks = [
  { href: "/dashboard/learner", label: "Learner Dashboard" },
  { href: "/dashboard/admin", label: "Admin Analytics" },
  { href: "/acbp", label: "Annual Capacity Building Plan" },
  { href: "/assessment", label: "Competency Self-Assessment" },
  { href: "/catalog", label: "Course Catalog" },
  { href: "/quiz-studio", label: "AI Quiz Studio" },
];

const institutionalLinks = [
  { label: "Mission Karmayogi", href: "https://karmayogi.gov.in" },
  { label: "iGOT Karmayogi Bharat", href: "https://igotkarmayogi.gov.in" },
  { label: "NSSTA, Greater Noida", href: "#" },
  { label: "MoSPI, Government of India", href: "https://mospi.gov.in" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#142446] text-[#B7C7D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#1e3460]">

          {/* Brand column */}
          <div className="md:col-span-4 space-y-5">
            <Image
              src="/karmasarthi.png"
              alt="Karmasarthi"
              width={52}
              height={52}
              className="object-contain"
            />

            <p className="text-[13px] text-[#B7C7D9] leading-relaxed max-w-xs">
              AI-enabled competency assessment and personalized learning for India&apos;s Official Statistical System.
            </p>

            <p className="text-[12px] text-[#475A6F]">
              Data Informatics and Innovation Division (DIID)<br />
              Ministry of Statistics and Programme Implementation<br />
              Government of India
            </p>
          </div>

          {/* Platform links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#F3E7D1]">
              Platform Modules
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12.5px] text-[#B7C7D9]/80 hover:text-white transition-colors hover-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#F3E7D1]">
              Institutional Framework
            </h4>
            <ul className="space-y-2.5">
              {institutionalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-[12.5px] text-[#B7C7D9]/80 hover:text-white transition-colors hover-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cadres */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#F3E7D1]">
              Statistical Cadres
            </h4>
            <ul className="space-y-2 text-[12px] text-[#B7C7D9]/70">
              <li>ISS Assistant Director</li>
              <li>Senior Statistical Officer</li>
              <li>Junior Statistical Officer</li>
              <li className="pt-2 text-[10px] font-mono text-[#475A6F]">
                FOD · ESD · NAD · DIID · SDRD
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-5 border-b border-[#1e3460]">
          <p className="text-[11px] text-[#475A6F] text-center leading-relaxed">
            <span className="text-[#D8921E] font-medium">Prototype:</span>
            &nbsp;Course catalog uses representative data schema-matched to iGOT Karmayogi and NSSTA TPAC.
            Assessment profiles are simulated for demonstration purposes.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#475A6F]">
            &copy; 2026 Ministry of Statistics and Programme Implementation (MoSPI). All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#475A6F]">
            <span>GIGW Compliant</span>
            <span className="text-[#1e3460]">·</span>
            <span>Karmayogi Standard</span>
            <span className="text-[#1e3460]">·</span>
            <span className="font-mono text-[10px]">v1.0.0-beta</span>
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
