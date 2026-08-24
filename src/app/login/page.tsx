"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, Shield, Users } from "lucide-react";

const OFFICERS = [
  {
    id: "usr-jso-rajesh",
    name: "Rajesh Kumar",
    designation: "Junior Statistical Officer (JSO)",
    division: "Field Operations Division (FOD)",
    avatar: "RK",
    icon: Users,
  },
  {
    id: "usr-sso-priya",
    name: "Priya Sharma",
    designation: "Senior Statistical Officer (SSO)",
    division: "Economic Statistics Division (ESD)",
    avatar: "PS",
    icon: BookOpen,
  },
  {
    id: "usr-ad-amit",
    name: "Dr. Amit Verma",
    designation: "Assistant Director (ISS)",
    division: "National Accounts Division (NAD)",
    avatar: "AV",
    icon: BarChart3,
  },
  {
    id: "usr-dir-sunita",
    name: "Sunita Rao",
    designation: "Director (DIID & CBC)",
    division: "Data Informatics & Innovation Division",
    avatar: "SR",
    icon: Shield,
  },
] as const;

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-3">
            <Image
              src="/karmasarthi.png"
              alt="Karmasarthi"
              width={160}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#142446] tracking-tight">
              Karmasarthi
            </h1>
            <p className="text-xs text-[#475A6F] mt-0.5">
              Capacity Building & Competency Intelligence for India&apos;s Statistical System
            </p>
          </div>
          <p className="text-xs text-[#475A6F] max-w-md mx-auto">
            Select your officer profile to access the competency assessment and personalized learning roadmap.
          </p>
        </div>

        {/* Officer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OFFICERS.map((officer) => {
            const Icon = officer.icon;
            return (
              <button
                key={officer.id}
                onClick={() => router.push(`/dashboard/learner?user=${officer.id}`)}
                className="group flex items-start gap-4 rounded-2xl border border-[#C7C2BA] bg-white p-5 text-left transition-colors hover:border-[#142446] hover:bg-[#FAF9F6] shadow-xs"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#142446] text-white text-sm font-bold">
                  {officer.avatar}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-bold text-[#142446] group-hover:text-[#D8921E] transition-colors truncate">
                    {officer.name}
                  </p>
                  <p className="text-xs text-[#475A6F] truncate">
                    {officer.designation}
                  </p>
                  <p className="text-[11px] text-[#475A6F] font-mono truncate">
                    {officer.division}
                  </p>
                </div>
                <Icon className="h-4 w-4 text-[#475A6F] group-hover:text-[#142446] transition-colors shrink-0 mt-1" />
              </button>
            );
          })}
        </div>

        {/* Admin shortcut */}
        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard/admin?user=usr-dir-sunita")}
            className="text-xs font-semibold text-[#142446] hover:text-[#D8921E] transition-colors underline underline-offset-2"
          >
            Enter as DIID Leadership (Admin Dashboard) →
          </button>
        </div>

        {/* Prototype disclaimer */}
        <p className="text-center text-[11px] text-[#475A6F]">
          Platform demonstration — select any profile to explore personalized competency mapping.
        </p>
      </div>
    </main>
  );
}
