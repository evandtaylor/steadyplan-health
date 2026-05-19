"use client";

import Link from "next/link";
import { TrackedLink } from "@/components/TrackedLink";

const savedDefaultsItems = [
  "3x12 day shifts",
  "30-minute commute",
  "Meal prep before work stretch",
];

const thisWeeksPlanItems = [
  "Work: Wed-Fri, 7a-7p",
  "Meal prep: Tuesday",
  "Errands: Saturday morning",
];

const checklistItems = [
  { label: "Monday: 4 of 6 complete", progress: 67 },
  { label: "Tuesday: 2 of 5 complete", progress: 40 },
  { label: "Workdays: reset only", progress: 0 },
];

export function AppPreviewSection() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(18,191,174,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(21,87,255,0.18),transparent_40%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            See what your week could look like.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300 text-pretty">
            ShiftPlan turns your schedule, priorities, and real-life
            responsibilities into a weekly plan you can actually use.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Saved defaults card */}
          <div className="group relative rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-lg backdrop-blur transition hover:border-teal-300/30 hover:bg-white/[0.08]">
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-teal-400/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">
                  Saved defaults
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2.5">
              {savedDefaultsItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg bg-slate-950/60 px-3 py-2.5 text-sm text-slate-300"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* This week's plan card */}
          <div className="group relative rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-lg backdrop-blur transition hover:border-blue-300/30 hover:bg-white/[0.08]">
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/15 text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                  <path
                    fillRule="evenodd"
                    d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">
                  This week&apos;s plan
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2.5">
              {thisWeeksPlanItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg bg-slate-950/60 px-3 py-2.5 text-sm text-slate-300"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive checklist card */}
          <div className="group relative rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-lg backdrop-blur transition hover:border-cyan-300/30 hover:bg-white/[0.08] sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-cyan-400/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                  Interactive checklist
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {checklistItems.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    {item.progress > 0 && (
                      <span className="text-xs text-cyan-300">
                        {item.progress}%
                      </span>
                    )}
                  </div>
                  {item.progress > 0 && (
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TrackedLink
            href="/beta/shiftplan"
            eventName="app_preview_waitlist_click"
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.24)] transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
          >
            Join the waitlist
          </TrackedLink>
          <Link
            href="/app"
            className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
          >
            Have beta access? Log in
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Private beta is currently testing with nurses and shift workers.
          Lifestyle/routine planning only — not medical advice.
        </p>
      </div>
    </section>
  );
}
