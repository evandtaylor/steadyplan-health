import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "ShiftPlan",
  title: {
    default: "ShiftPlan",
    template: "%s | ShiftPlan",
  },
  description:
    "Turn your shift schedule into a simple weekly life plan. ShiftPlan helps nurses and shift workers organize routines around irregular schedules.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ShiftPlan",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
