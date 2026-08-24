import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karmasarthi — AI-Enabled Skill Intelligence Platform",
  description:
    "Karmasarthi: AI-powered competency assessment, personalized learning pathways, and iGOT Karmayogi integration for India's Official Statistical System. A MoSPI / DIID initiative.",
  keywords: [
    "Karmasarthi",
    "iGOT Karmayogi",
    "MoSPI",
    "statistical training",
    "competency assessment",
    "India AI learning",
    "NSSTA",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#f9f8f5] text-[#142446] antialiased">
        {children}
      </body>
    </html>
  );
}
