import Link from "next/link";
import { navLinks, siteDisclaimer } from "@/lib/content";
import { ShiftPlanLogo } from "@/components/ShiftPlanLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div>
          <ShiftPlanLogo variant="dark" />
          <p className="mt-2 text-sm leading-6 text-slate-300">
            A ShiftPlan-first MVP from SteadyPlan Health, built for lifestyle
            organization around irregular work schedules.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {siteDisclaimer}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-white">Explore</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/10 hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/10 hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300"
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
