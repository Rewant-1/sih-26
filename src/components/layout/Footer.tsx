import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Award, BookOpen, ExternalLink, Globe, Shield, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Ministry Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF9933] text-slate-900 font-serif font-black text-lg">
                M
              </div>
              <span className="font-bold text-white text-sm">
                MoSPI Skill Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data Informatics and Innovation Division (DIID), Ministry of
              Statistics and Programme Implementation, Government of India.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="saffron" size="sm">
                SIH 26101
              </Badge>
              <Badge variant="navy" size="sm" className="bg-slate-800 text-slate-200 border-slate-700">
                FRAC 2026
              </Badge>
            </div>
          </div>

          {/* Col 2: Official Pillars */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Institutional Framework
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#FF9933]" />
                <span>Mission Karmayogi (CBC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-400" />
                <span>iGOT Karmayogi Bharat</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#138808]" />
                <span>NSSTA Greater Noida (TPAC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                <span>FRAC 4-Domain Taxonomy</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link
                  href="/dashboard/learner"
                  className="hover:text-white transition"
                >
                  Learner Dashboard & Radar
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin"
                  className="hover:text-white transition"
                >
                  Admin Division Heatmap
                </Link>
              </li>
              <li>
                <Link href="/acbp" className="hover:text-white transition">
                  Annual Capacity Building Plan (ACBP)
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:text-white transition">
                  Competency Self-Assessment
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-white transition">
                  Unified Course Catalog
                </Link>
              </li>
              <li>
                <Link href="/quiz-studio" className="hover:text-white transition">
                  AI Document-to-Quiz Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Cadres & Divisions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Target Statistical Cadres
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>• Indian Statistical Service (ISS AD / DD / Dir)</p>
              <p>• Senior Statistical Officer (SSO, Subordinate)</p>
              <p>• Junior Statistical Officer (JSO, Subordinate)</p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Key Divisions Covered:
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  FOD • ESD • NAD • DIID • SDRD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Ministry of Statistics and Programme Implementation (MoSPI). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>GIGW & Karmayogi Standard Compliant</span>
            <span>•</span>
            <span className="font-mono text-[11px]">API: /api/admin/analytics</span>
          </div>
        </div>
      </div>

      {/* Tricolor Bottom Accent */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>
    </footer>
  );
}
