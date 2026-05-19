"use client";

import { useState } from "react";

const quickChips = [
  { id: "saved-commute", label: "Use saved commute" },
  { id: "meal-defaults", label: "Use meal defaults" },
  { id: "batch-errands", label: "Batch errands" },
  { id: "light-first-day", label: "Keep first off day light" },
  { id: "short-workouts", label: "Short workouts only" },
];

const detailFields = [
  { id: "workouts", label: "Workouts", placeholder: "e.g., 2 strength sessions, 1 cardio" },
  { id: "errands", label: "Errands", placeholder: "e.g., groceries, pharmacy, dry cleaning" },
  { id: "appointments", label: "Appointments", placeholder: "e.g., dentist Friday 9am" },
  { id: "family", label: "Family responsibilities", placeholder: "e.g., school pickup Wed, family dinner Sat" },
  { id: "priorities", label: "Priorities", placeholder: "e.g., meal prep, get ahead on laundry" },
  { id: "avoid", label: "Things to avoid", placeholder: "e.g., no errands after work, no morning workouts on workdays" },
];

export function WeeklyRequestForm() {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState(false);

  const toggleChip = (id: string) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Create this week&apos;s ShiftPlan
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Your saved defaults are already remembered. Add what changed this week.
        </p>
      </div>

      <form className="space-y-6">
        {/* Week start date */}
        <div className="space-y-2">
          <label
            htmlFor="week-start"
            className="block text-sm font-medium text-slate-300"
          >
            Week start date
          </label>
          <input
            type="date"
            id="week-start"
            className="field-control w-full rounded-lg border border-white/15 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
          />
        </div>

        {/* Tell ShiftPlan your week */}
        <div className="space-y-2">
          <label
            htmlFor="week-summary"
            className="block text-sm font-medium text-slate-300"
          >
            Tell ShiftPlan your week
          </label>
          <textarea
            id="week-summary"
            rows={4}
            placeholder="Example: I work Wed-Fri 7a-7p, want two workouts, meal prep Tuesday, and need to run errands Saturday."
            className="field-control w-full resize-none rounded-lg border border-white/15 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
          />
        </div>

        {/* Quick chips */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-300">Quick options</p>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip) => {
              const isSelected = selectedChips.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => toggleChip(chip.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "bg-teal-400/20 text-teal-200 ring-1 ring-teal-400/40"
                      : "bg-white/10 text-slate-300 hover:bg-white/15"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exact work schedule */}
        <div className="space-y-2">
          <label
            htmlFor="work-schedule"
            className="block text-sm font-medium text-slate-300"
          >
            Exact work schedule <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="work-schedule"
            required
            placeholder="Example: Wed 7a-7p, Thu 7a-7p, Fri 7a-7p"
            className="field-control w-full rounded-lg border border-white/15 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
          />
          <p className="text-xs text-slate-500">
            Example: Wed 7a-7p, Thu 7a-7p, Fri 7a-7p
          </p>
        </div>

        {/* Optional details accordion */}
        <div className="rounded-xl border border-white/10 bg-white/[0.04]">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between px-4 py-4 text-left"
          >
            <span className="text-sm font-medium text-slate-300">
              Add more details (optional)
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-5 w-5 text-slate-400 transition ${showDetails ? "rotate-180" : ""}`}
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showDetails && (
            <div className="space-y-4 border-t border-white/10 px-4 py-4">
              {detailFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-slate-400"
                  >
                    {field.label}
                  </label>
                  <input
                    type="text"
                    id={field.id}
                    placeholder={field.placeholder}
                    className="field-control w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety checkbox */}
        <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <input
            type="checkbox"
            id="safety"
            checked={safetyChecked}
            onChange={(e) => setSafetyChecked(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-teal-400 focus:ring-teal-400/30"
          />
          <label htmlFor="safety" className="text-sm text-slate-400">
            I understand ShiftPlan is for lifestyle and routine organization only,
            not medical advice, treatment, or healthcare guidance.
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!safetyChecked}
          className="w-full rounded-lg bg-teal-400 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.24)] transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Save This Week&apos;s Request
        </button>
      </form>
    </div>
  );
}
