import Link from "next/link";
import { navLinks, siteDisclaimer } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div>
          <p className="text-lg font-semibold text-slate-950">
            ShiftPlan
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A ShiftPlan-first MVP from SteadyPlan Health, built for lifestyle
            organization around irregular work schedules.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {siteDisclaimer}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-slate-950">Explore</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
