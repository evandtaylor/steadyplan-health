"use client";

import { useState } from "react";
import Link from "next/link";

const quickNavItems = [
  { id: "this-week", label: "This week", active: true },
  { id: "defaults", label: "Saved defaults" },
  { id: "plans", label: "Plans" },
  { id: "checklist", label: "Checklist" },
  { id: "feedback", label: "Feedback" },
];

const savedDefaultsChips = [
  "3x12 days",
  "30 min commute",
  "Meal prep before shifts",
];

const quickChips = [
  { id: "saved-commute", label: "Use saved commute" },
  { id: "meal-defaults", label: "Use meal defaults" },
  { id: "batch-errands", label: "Batch errands" },
  { id: "light-first-day", label: "Keep first off day light" },
  { id: "short-workouts", label: "Short workouts" },
];

const latestPlanPreview = {
  dateRange: "May 18 - May 24",
  workdays: "Wed, Thu, Fri",
  shifts: "7a-7p",
  mealPrep: "Tuesday",
  workouts: "Mon, Sat",
};

export function ShiftPlanDashboard() {
  const [activeNav, setActiveNav] = useState("this-week");
  const [showDefaults, setShowDefaults] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const toggleChip = (id: string) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">
      {/* Welcome header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Your ShiftPlan</h1>
          <p className="mt-1 text-sm text-slate-400">
            Plan your week around your shifts
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-medium text-teal-200">
            1 of 4 plans used
          </span>
          <span className="text-xs text-slate-500">Private beta</span>
        </div>
      </div>

      {/* Primary action card */}
      <div className="rounded-xl border border-teal-400/25 bg-gradient-to-br from-teal-400/10 via-transparent to-transparent p-5 shadow-[0_0_40px_rgba(45,212,191,0.1)]">
        <h2 className="text-lg font-semibold text-white">
          Create this week&apos;s ShiftPlan
        </h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Use your saved defaults, then tell us what changed this week.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app/request"
            className="inline-flex items-center justify-center rounded-lg bg-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Start this week
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Use last week as starting point
          </button>
        </div>
      </div>

      {/* Quick nav chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickNavItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveNav(item.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              activeNav === item.id
                ? "bg-white/15 text-white"
                : "bg-white/[0.06] text-slate-400 hover:bg-white/10 hover:text-slate-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Saved defaults compact card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04]">
        <button
          type="button"
          onClick={() => setShowDefaults(!showDefaults)}
          className="flex w-full items-center justify-between px-4 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-slate-300">
              Saved defaults
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-5 w-5 text-slate-400 transition ${showDefaults ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {!showDefaults && (
          <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
            {savedDefaultsChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-400"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
        {showDefaults && (
          <div className="border-t border-white/10 px-4 py-4">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Shift pattern</span>
                <span>3x12 day shifts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commute</span>
                <span>30 minutes each way</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Meal prep</span>
                <span>Before work stretch</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Workout goal</span>
                <span>2-3 sessions/week</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Edit defaults
            </button>
          </div>
        )}
      </div>

      {/* Weekly request card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-medium text-slate-300">
          Tell ShiftPlan your week
        </h3>
        <textarea
          rows={3}
          placeholder="Example: I work Wed-Fri 7a-7p, want two workouts, meal prep Tuesday..."
          className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {quickChips.map((chip) => {
            const isSelected = selectedChips.includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleChip(chip.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-teal-400/20 text-teal-200 ring-1 ring-teal-400/40"
                    : "bg-white/10 text-slate-400 hover:bg-white/15 hover:text-slate-300"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="mt-3 text-sm font-medium text-teal-300 hover:text-teal-200"
        >
          + Add details
        </button>
      </div>

      {/* Saved plans preview */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">Latest plan</h3>
          <span className="text-xs text-slate-500">
            {latestPlanPreview.dateRange}
          </span>
        </div>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="flex items-center gap-3 rounded-lg bg-slate-900/60 px-3 py-2.5">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span className="text-slate-400">Workdays:</span>
            <span className="text-white">
              {latestPlanPreview.workdays} ({latestPlanPreview.shifts})
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-900/60 px-3 py-2.5">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-slate-400">Meal prep:</span>
            <span className="text-white">{latestPlanPreview.mealPrep}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-900/60 px-3 py-2.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Workouts:</span>
            <span className="text-white">{latestPlanPreview.workouts}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
          >
            View plan
          </button>
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
          >
            Copy summary
          </button>
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
          >
            Download calendar
          </button>
        </div>
      </div>

      {/* Feedback card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-medium text-slate-300">
          Help improve ShiftPlan
        </h3>
        <div className="mt-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`rounded p-1 transition ${
                star <= rating ? "text-teal-400" : "text-slate-600 hover:text-slate-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          rows={2}
          placeholder="Share your thoughts..."
          className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
        />
        <button
          type="button"
          className="mt-3 rounded-lg bg-teal-400/20 px-4 py-2 text-sm font-medium text-teal-200 transition hover:bg-teal-400/30"
        >
          Send feedback
        </button>
      </div>
    </div>
  );
}
