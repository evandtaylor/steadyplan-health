"use client";

import { useState } from "react";

interface DayPlan {
  day: string;
  date: string;
  type: "workday" | "off" | "recovery" | "errand";
  blocks: {
    time: string;
    label: string;
    type?: "work" | "reset" | "meal" | "workout" | "errand" | "family";
  }[];
  checklistCount: number;
  checklistDone: number;
}

const weekSnapshot = {
  dateRange: "May 18 - May 24, 2025",
  workdays: "Wed, Thu, Fri",
  mainGoal: "Keep workdays simple, batch errands on Saturday",
  keyStrategy: "Meal prep Tuesday, workouts on off days only",
  mealPrepDay: "Tuesday",
  trainingDays: "Monday, Saturday",
};

const weekPlan: DayPlan[] = [
  {
    day: "Monday",
    date: "May 18",
    type: "off",
    blocks: [
      { time: "7:00 AM", label: "Sleep in / slow morning", type: "reset" },
      { time: "9:00 AM", label: "30 min strength workout", type: "workout" },
      { time: "10:30 AM", label: "Grocery list + light admin" },
      { time: "12:00 PM", label: "Lunch" },
      { time: "2:00 PM", label: "Laundry + house reset", type: "errand" },
      { time: "6:00 PM", label: "Dinner + wind down", type: "meal" },
    ],
    checklistCount: 6,
    checklistDone: 4,
  },
  {
    day: "Tuesday",
    date: "May 19",
    type: "off",
    blocks: [
      { time: "8:00 AM", label: "Morning routine" },
      { time: "9:30 AM", label: "Grocery shopping", type: "errand" },
      { time: "11:00 AM", label: "Meal prep for work stretch", type: "meal" },
      { time: "2:00 PM", label: "Pack lunches + snacks", type: "meal" },
      { time: "4:00 PM", label: "Light walk or stretch", type: "workout" },
      { time: "6:00 PM", label: "Early dinner", type: "meal" },
      { time: "9:00 PM", label: "Prep bag + clothes for tomorrow" },
    ],
    checklistCount: 5,
    checklistDone: 2,
  },
  {
    day: "Wednesday",
    date: "May 20",
    type: "workday",
    blocks: [
      { time: "5:30 AM", label: "Wake + quick breakfast", type: "meal" },
      { time: "6:00 AM", label: "Commute" },
      { time: "7:00 AM - 7:00 PM", label: "Work shift", type: "work" },
      { time: "7:30 PM", label: "Commute home" },
      { time: "8:00 PM", label: "Shower + easy dinner", type: "reset" },
      { time: "9:30 PM", label: "Wind down + bed prep" },
    ],
    checklistCount: 4,
    checklistDone: 0,
  },
  {
    day: "Thursday",
    date: "May 21",
    type: "workday",
    blocks: [
      { time: "5:30 AM", label: "Wake + quick breakfast", type: "meal" },
      { time: "6:00 AM", label: "Commute" },
      { time: "7:00 AM - 7:00 PM", label: "Work shift", type: "work" },
      { time: "7:30 PM", label: "Commute home" },
      { time: "8:00 PM", label: "Shower + easy dinner", type: "reset" },
      { time: "9:30 PM", label: "Wind down + bed prep" },
    ],
    checklistCount: 4,
    checklistDone: 0,
  },
  {
    day: "Friday",
    date: "May 22",
    type: "workday",
    blocks: [
      { time: "5:30 AM", label: "Wake + quick breakfast", type: "meal" },
      { time: "6:00 AM", label: "Commute" },
      { time: "7:00 AM - 7:00 PM", label: "Work shift", type: "work" },
      { time: "7:30 PM", label: "Commute home" },
      { time: "8:00 PM", label: "Celebrate end of stretch", type: "reset" },
      { time: "9:30 PM", label: "Extra sleep tonight" },
    ],
    checklistCount: 4,
    checklistDone: 0,
  },
  {
    day: "Saturday",
    date: "May 23",
    type: "errand",
    blocks: [
      { time: "8:00 AM", label: "Sleep in" },
      { time: "9:30 AM", label: "Dentist appointment", type: "errand" },
      { time: "11:00 AM", label: "Errands: pharmacy, returns", type: "errand" },
      { time: "1:00 PM", label: "Lunch out" },
      { time: "3:00 PM", label: "45 min strength workout", type: "workout" },
      { time: "5:00 PM", label: "Rest + downtime", type: "reset" },
      { time: "6:30 PM", label: "Family dinner", type: "family" },
    ],
    checklistCount: 6,
    checklistDone: 0,
  },
  {
    day: "Sunday",
    date: "May 24",
    type: "recovery",
    blocks: [
      { time: "9:00 AM", label: "Sleep in + slow morning", type: "reset" },
      { time: "11:00 AM", label: "Brunch" },
      { time: "1:00 PM", label: "Light meal prep for Mon-Tue", type: "meal" },
      { time: "3:00 PM", label: "Review next week schedule" },
      { time: "5:00 PM", label: "Relaxation + hobby time", type: "reset" },
      { time: "7:00 PM", label: "Early dinner", type: "meal" },
      { time: "9:00 PM", label: "Wind down for week" },
    ],
    checklistCount: 5,
    checklistDone: 0,
  },
];

const typeColors: Record<string, string> = {
  workday: "bg-blue-400/20 text-blue-200",
  off: "bg-teal-400/20 text-teal-200",
  recovery: "bg-purple-400/20 text-purple-200",
  errand: "bg-amber-400/20 text-amber-200",
};

const blockColors: Record<string, string> = {
  work: "border-l-blue-400 bg-blue-400/10",
  reset: "border-l-purple-400 bg-purple-400/10",
  meal: "border-l-teal-400 bg-teal-400/10",
  workout: "border-l-cyan-400 bg-cyan-400/10",
  errand: "border-l-amber-400 bg-amber-400/10",
  family: "border-l-pink-400 bg-pink-400/10",
};

export function SavedPlanView() {
  const [expandedDays, setExpandedDays] = useState<string[]>(["Monday", "Tuesday"]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleDay = (day: string) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">
      {/* Plan header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Your week</h1>
          <p className="mt-1 text-sm text-slate-400">{weekSnapshot.dateRange}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {weekSnapshot.workdays} (7a-7p)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
          >
            Copy Summary
          </button>
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
          >
            Copy Plan
          </button>
          <button
            type="button"
            className="rounded-lg border border-teal-400/30 bg-teal-400/15 px-3 py-2 text-xs font-medium text-teal-200 transition hover:bg-teal-400/25"
          >
            Download Calendar
          </button>
        </div>
      </div>

      {/* Week Snapshot card */}
      <div className="rounded-xl border border-teal-400/25 bg-gradient-to-br from-teal-400/10 via-transparent to-transparent p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-200">
          Week Snapshot
        </h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex gap-3">
            <span className="text-slate-400">Workdays:</span>
            <span className="text-white">{weekSnapshot.workdays}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-400">Meal prep:</span>
            <span className="text-white">{weekSnapshot.mealPrepDay}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-400">Training:</span>
            <span className="text-white">{weekSnapshot.trainingDays}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-400">Main goal:</span>
            <span className="text-white">{weekSnapshot.mainGoal}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          <span className="font-medium text-slate-300">Key strategy:</span>{" "}
          {weekSnapshot.keyStrategy}
        </p>
      </div>

      {/* Day-by-day timeline */}
      <div className="space-y-3">
        {weekPlan.map((dayPlan) => {
          const isExpanded = expandedDays.includes(dayPlan.day);
          return (
            <div
              key={dayPlan.day}
              className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleDay(dayPlan.day)}
                className="flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-white">{dayPlan.day}</p>
                    <p className="text-xs text-slate-500">{dayPlan.date}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${typeColors[dayPlan.type]}`}
                  >
                    {dayPlan.type === "workday"
                      ? "Workday"
                      : dayPlan.type === "off"
                        ? "Off day"
                        : dayPlan.type === "recovery"
                          ? "Recovery"
                          : "Errand day"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    {dayPlan.checklistDone}/{dayPlan.checklistCount}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-5 w-5 text-slate-400 transition ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              {isExpanded && (
                <div className="border-t border-white/10 px-4 py-4">
                  <div className="space-y-2">
                    {dayPlan.blocks.map((block, idx) => {
                      const checkId = `${dayPlan.day}-${idx}`;
                      const isChecked = checkedItems.has(checkId);
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 rounded-lg border-l-2 px-3 py-2.5 ${
                            block.type
                              ? blockColors[block.type]
                              : "border-l-slate-600 bg-slate-900/40"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleCheck(checkId)}
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs transition ${
                              isChecked
                                ? "border-teal-400 bg-teal-400 text-slate-950"
                                : "border-slate-600 text-transparent hover:border-slate-500"
                            }`}
                          >
                            {isChecked && "✓"}
                          </button>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${isChecked ? "text-slate-500 line-through" : "text-white"}`}
                            >
                              {block.label}
                            </p>
                            <p className="text-xs text-slate-500">{block.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Important Note */}
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
        <div className="flex gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 shrink-0 text-amber-300"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-amber-100/90">
            AI-generated draft. Review dates, times, and assumptions before
            relying on it. This is for lifestyle planning only — not medical
            advice.
          </p>
        </div>
      </div>
    </div>
  );
}
