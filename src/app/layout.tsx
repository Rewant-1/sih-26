import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoSPI Skill Intelligence & Learning Platform",
  description:
    "AI-Enabled Skill Intelligence & Learning Platform for Official Statistics (MoSPI / DIID, SIH 26101)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
