import Link from "next/link";
import { navLinks } from "@/lib/content";
import { ShiftPlanLogo } from "@/components/ShiftPlanLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="group flex w-fit items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="ShiftPlan home"
        >
          <ShiftPlanLogo className="h-11" variant="dark" />
        </Link>
        <div className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2 sm:px-0 sm:pb-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/app"
            className="shrink-0 rounded-lg border border-teal-300/30 bg-teal-300/10 px-3 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-300/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            Have beta access? Log in
          </Link>
        </div>
      </nav>
    </header>
  );
}
