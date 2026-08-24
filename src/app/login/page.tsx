"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, Shield, Users } from "lucide-react";

const OFFICERS = [
  {
    id: "usr-jso-rajesh",
    name: "Rajesh Kumar",
    designation: "Junior Statistical Officer (JSO)",
    division: "Field Operations Division (FOD)",
    avatar: "RK",
    color: "from-emerald-600 to-emerald-800",
    icon: Users,
  },
  {
    id: "usr-sso-priya",
    name: "Priya Sharma",
    designation: "Senior Statistical Officer (SSO)",
    division: "Economic Statistics Division (ESD)",
    avatar: "PS",
    color: "from-blue-600 to-blue-800",
    icon: BookOpen,
  },
  {
    id: "usr-ad-amit",
    name: "Dr. Amit Verma",
    designation: "Assistant Director (ISS)",
    division: "National Accounts Division (NAD)",
    avatar: "AV",
    color: "from-violet-600 to-violet-800",
    icon: BarChart3,
  },
  {
    id: "usr-dir-sunita",
    name: "Sunita Rao",
    designation: "Director (DIID & CBC)",
    division: "Data Informatics & Innovation Division",
    avatar: "SR",
    color: "from-amber-600 to-amber-800",
    icon: Shield,
  },
] as const;

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9933] to-[#FF6600] text-white font-serif font-black text-2xl shadow-lg">
              M
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white tracking-tight">
                MoSPI Skill Intelligence Platform
              </h1>
              <p className="text-xs text-slate-400">
                DIID • Mission Karmayogi FRAC • SIH 26101
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Select your officer profile to access the competency assessment and learning dashboard.
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
                className="group flex items-start gap-4 rounded-xl border border-slate-700/60 bg-slate-800/60 p-5 text-left backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-700/60 hover:shadow-lg hover:shadow-blue-950/30 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${officer.color} text-white text-sm font-bold shadow-md`}>
                  {officer.avatar}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-white group-hover:text-[#FF9933] transition-colors truncate">
                    {officer.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {officer.designation}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {officer.division}
                  </p>
                </div>
                <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0 mt-1" />
              </button>
            );
          })}
        </div>

        {/* Admin shortcut */}
        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard/admin?user=usr-dir-sunita")}
            className="text-xs text-slate-500 hover:text-[#FF9933] transition-colors underline underline-offset-2"
          >
            Enter as DIID Leadership (Admin Dashboard) →
          </button>
        </div>

        {/* Prototype disclaimer */}
        <p className="text-center text-[11px] text-slate-600">
          Prototype demonstration — no authentication required. Select any profile to explore.
        </p>
      </div>
    </main>
  );
}
