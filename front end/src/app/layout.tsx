import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "SolarSight AI — Next-Gen Solar Inspection Platform",
  description: "AI-powered drone solar inspection platform. Detect hotspots, cracks, and thermal anomalies in real time.",
  openGraph: {
    title: "SolarSight AI",
    description: "AI-powered drone solar inspection platform.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-primary selection:bg-accent-cyan/30 selection:text-white">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
