import Link from "next/link";
import { navLinks } from "@/lib/content";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex w-fit items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-base font-bold text-white">
            SP
          </span>
          <span>
            <span className="block text-base font-semibold text-slate-950">
              ShiftPlan
            </span>
            <span className="block text-sm text-slate-500">
              Weekly planning for shift workers
            </span>
          </span>
        </Link>
        <div className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2 sm:px-0 sm:pb-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
