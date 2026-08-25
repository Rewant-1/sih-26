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
    <footer className="w-full bg-[#142446] border-t border-[#1e3460] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/karmasarthi.png"
                alt="Karmasarthi"
                width={200}
                height={200}
                className="h-[46px] w-auto object-contain bg-white/95 p-1 rounded-lg"
              />
            </div>

            <p className="text-[13px] text-[#B7C7D9] leading-relaxed max-w-sm">
              Competency assessment and personalized learning pathways for India&apos;s Official Statistical System — integrated with Mission Karmayogi.
            </p>

            <div className="text-[12px] text-[#B7C7D9]/80 leading-normal pt-1">
              <p className="font-semibold text-[#F3E7D1]">Data Informatics & Innovation Division (DIID)</p>
              <p>Ministry of Statistics & Programme Implementation</p>
              <p>Government of India</p>
            </div>
          </div>

          {/* Platform modules */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#F3E7D1]">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#B7C7D9] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#F3E7D1]">
              Institutional Framework
            </h4>
            <ul className="space-y-2">
              {institutionalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-[13px] text-[#B7C7D9] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Statistical Cadres */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#F3E7D1]">
              Statistical Cadres
            </h4>
            <ul className="space-y-1.5 text-[12.5px] text-[#B7C7D9]">
              <li>ISS Assistant Director</li>
              <li>Senior Statistical Officer</li>
              <li>Junior Statistical Officer</li>
              <li className="pt-2 text-[11px] text-[#F3E7D1] font-medium">
                FOD · ESD · NAD · DIID · SDRD
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11.5px] text-[#B7C7D9]/70">
          <p>
            © {new Date().getFullYear()} Ministry of Statistics & Programme Implementation (MoSPI). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#F3E7D1]">Capacity Building Commission Aligned</span>
            <span>·</span>
            <span>Mission Karmayogi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
