import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SteadyPlan Health",
    template: "%s | SteadyPlan Health",
  },
  description:
    "Simple plans for complicated health-life seasons. SteadyPlan Health helps users organize routines, responsibilities, and questions for qualified professionals.",
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
      </body>
    </html>
  );
}
