"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Check,
  Star,
  Calendar,
  Dumbbell,
  UtensilsCrossed,
  Briefcase,
  Moon,
  Sun,
  Coffee,
  Sunset,
  AlertCircle,
  Clock,
  Target,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type DayType = "workday" | "off" | "reset";

type TimeBlock = {
  label: string;
  items: string[];
};

type DayPlan = {
  date: string;
  dayName: string;
  dayType: DayType;
  morning?: TimeBlock;
  midday?: TimeBlock;
  afternoon?: TimeBlock;
  evening?: TimeBlock;
  workBlock?: {
    start: string;
    end: string;
    notes?: string;
  };
  resetBlock?: string[];
};

type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

type ChecklistDay = {
  dayName: string;
  date: string;
  items: ChecklistItem[];
};

type WeekSnapshot = {
  workdays: string[];
  mainGoal: string;
  mainStrategy: string;
  mealPrepDay: string;
  trainingDays: string[];
};

type SavedPlanData = {
  title: string;
  dateRange: string;
  workScheduleSummary: string;
  usagePill: string;
  weekSnapshot: WeekSnapshot;
  days: DayPlan[];
  checklist: ChecklistDay[];
};

// ─────────────────────────────────────────────────────────────
// Placeholder Data
// ─────────────────────────────────────────────────────────────

const placeholderPlan: SavedPlanData = {
  title: "Your ShiftPlan",
  dateRange: "May 19 – May 25, 2025",
  workScheduleSummary: "3×12 Day Shifts (Mon, Tue, Wed)",
  usagePill: "Plan 2 of 4 this month",
  weekSnapshot: {
    workdays: ["Monday", "Tuesday", "Wednesday"],
    mainGoal: "Maintain energy through work stretch, reset by Friday",
    mainStrategy: "Front-load meal prep Sunday, keep workday evenings minimal",
    mealPrepDay: "Sunday",
    trainingDays: ["Thursday", "Saturday"],
  },
  days: [
    {
      date: "May 19",
      dayName: "Monday",
      dayType: "workday",
      morning: {
        label: "Morning",
        items: ["Wake 5:00am", "Quick stretch", "Grab prepped breakfast"],
      },
      workBlock: {
        start: "6:30am",
        end: "7:00pm",
        notes: "12hr day shift – pack lunch + snacks",
      },
      evening: {
        label: "Evening",
        items: [
          "Decompress 15min",
          "Light dinner (prepped)",
          "Prep scrubs for tomorrow",
          "Bed by 9:30pm",
        ],
      },
    },
    {
      date: "May 20",
      dayName: "Tuesday",
      dayType: "workday",
      morning: {
        label: "Morning",
        items: ["Wake 5:00am", "Quick stretch", "Grab prepped breakfast"],
      },
      workBlock: {
        start: "6:30am",
        end: "7:00pm",
        notes: "12hr day shift",
      },
      evening: {
        label: "Evening",
        items: [
          "Decompress 15min",
          "Light dinner (prepped)",
          "Prep scrubs for tomorrow",
          "Bed by 9:30pm",
        ],
      },
    },
    {
      date: "May 21",
      dayName: "Wednesday",
      dayType: "workday",
      morning: {
        label: "Morning",
        items: ["Wake 5:00am", "Quick stretch", "Grab prepped breakfast"],
      },
      workBlock: {
        start: "6:30am",
        end: "7:00pm",
        notes: "12hr day shift – last shift of stretch",
      },
      evening: {
        label: "Evening",
        items: [
          "Celebrate finishing stretch",
          "Light dinner",
          "Early wind-down",
          "Bed whenever comfortable",
        ],
      },
    },
    {
      date: "May 22",
      dayName: "Thursday",
      dayType: "reset",
      morning: {
        label: "Morning",
        items: ["Sleep in until natural wake", "Slow coffee", "Light breakfast"],
      },
      midday: {
        label: "Midday",
        items: ["30min walk or light yoga", "Grocery run for weekend"],
      },
      afternoon: {
        label: "Afternoon",
        items: ["Gym session (strength)", "Shower + self-care"],
      },
      evening: {
        label: "Evening",
        items: ["Cook fresh dinner", "Relaxation time", "Normal bedtime"],
      },
      resetBlock: [
        "Recovery day – no obligations",
        "Focus on sleep debt recovery",
        "Gentle movement only",
      ],
    },
    {
      date: "May 23",
      dayName: "Friday",
      dayType: "off",
      morning: {
        label: "Morning",
        items: ["Wake naturally", "Full breakfast", "Morning coffee ritual"],
      },
      midday: {
        label: "Midday",
        items: ["Errands: pharmacy, dry cleaning", "Quick lunch out"],
      },
      afternoon: {
        label: "Afternoon",
        items: ["Dentist appointment 2:30pm", "Free time"],
      },
      evening: {
        label: "Evening",
        items: ["Dinner with partner", "Movie night", "Relaxed bedtime"],
      },
    },
    {
      date: "May 24",
      dayName: "Saturday",
      dayType: "off",
      morning: {
        label: "Morning",
        items: ["Wake naturally", "Big breakfast", "Morning walk"],
      },
      midday: {
        label: "Midday",
        items: ["Gym session (cardio + core)", "Shower"],
      },
      afternoon: {
        label: "Afternoon",
        items: ["Meal prep for next week", "Organize scrubs and work bag"],
      },
      evening: {
        label: "Evening",
        items: ["Social time or hobbies", "Prep for Sunday", "Bed by 10pm"],
      },
    },
    {
      date: "May 25",
      dayName: "Sunday",
      dayType: "off",
      morning: {
        label: "Morning",
        items: ["Wake 7am", "Light breakfast", "Review upcoming week"],
      },
      midday: {
        label: "Midday",
        items: ["Final meal prep batch", "Pack Monday work bag"],
      },
      afternoon: {
        label: "Afternoon",
        items: ["Light activity or rest", "Lay out Monday outfit"],
      },
      evening: {
        label: "Evening",
        items: ["Early dinner", "Wind-down routine", "Bed by 8:30pm"],
      },
    },
  ],
  checklist: [
    {
      dayName: "Monday",
      date: "May 19",
      items: [
        { id: "mon-1", text: "Pack lunch + snacks", completed: false },
        { id: "mon-2", text: "Prep scrubs for Tuesday", completed: false },
        { id: "mon-3", text: "Bed by 9:30pm", completed: false },
      ],
    },
    {
      dayName: "Tuesday",
      date: "May 20",
      items: [
        { id: "tue-1", text: "Pack lunch + snacks", completed: false },
        { id: "tue-2", text: "Prep scrubs for Wednesday", completed: false },
        { id: "tue-3", text: "Bed by 9:30pm", completed: false },
      ],
    },
    {
      dayName: "Wednesday",
      date: "May 21",
      items: [
        { id: "wed-1", text: "Pack lunch + snacks", completed: false },
        { id: "wed-2", text: "Celebrate finishing work stretch", completed: false },
      ],
    },
    {
      dayName: "Thursday",
      date: "May 22",
      items: [
        { id: "thu-1", text: "30min walk or light yoga", completed: false },
        { id: "thu-2", text: "Grocery run", completed: false },
        { id: "thu-3", text: "Gym session", completed: false },
      ],
    },
    {
      dayName: "Friday",
      date: "May 23",
      items: [
        { id: "fri-1", text: "Errands: pharmacy, dry cleaning", completed: false },
        { id: "fri-2", text: "Dentist appointment 2:30pm", completed: false },
      ],
    },
    {
      dayName: "Saturday",
      date: "May 24",
      items: [
        { id: "sat-1", text: "Gym session", completed: false },
        { id: "sat-2", text: "Meal prep for next week", completed: false },
        { id: "sat-3", text: "Organize scrubs and work bag", completed: false },
      ],
    },
    {
      dayName: "Sunday",
      date: "May 25",
      items: [
        { id: "sun-1", text: "Final meal prep batch", completed: false },
        { id: "sun-2", text: "Pack Monday work bag", completed: false },
        { id: "sun-3", text: "Bed by 8:30pm", completed: false },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Utility Components
// ─────────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function DayTypeBadge({ type }: { type: DayType }) {
  const config = {
    workday: {
      bg: "bg-blue-500/20",
      text: "text-blue-300",
      border: "border-blue-400/30",
      label: "Workday",
    },
    off: {
      bg: "bg-teal-500/20",
      text: "text-teal-300",
      border: "border-teal-400/30",
      label: "Off Day",
    },
    reset: {
      bg: "bg-amber-500/20",
      text: "text-amber-300",
      border: "border-amber-400/30",
      label: "Reset Day",
    },
  };

  const { bg, text, border, label } = config[type];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
}

function TimeBlockIcon({ label }: { label: string }) {
  const iconClass = "h-4 w-4";
  switch (label.toLowerCase()) {
    case "morning":
      return <Sun className={`${iconClass} text-amber-400`} />;
    case "midday":
      return <Coffee className={`${iconClass} text-orange-400`} />;
    case "afternoon":
      return <Sunset className={`${iconClass} text-rose-400`} />;
    case "evening":
      return <Moon className={`${iconClass} text-indigo-400`} />;
    default:
      return <Clock className={`${iconClass} text-slate-400`} />;
  }
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
  successIcon: SuccessIcon,
  isSuccess,
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  successIcon?: React.ElementType;
  isSuccess?: boolean;
}) {
  const DisplayIcon = isSuccess && SuccessIcon ? SuccessIcon : Icon;
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-xs font-medium text-slate-300 transition-all hover:border-teal-400/30 hover:bg-teal-500/10 hover:text-teal-300 active:scale-[0.98]"
    >
      <DisplayIcon className={`h-5 w-5 ${isSuccess ? "text-teal-400" : ""}`} />
      <span>{isSuccess ? "Copied!" : label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────

function HeaderCard({
  title,
  dateRange,
  workScheduleSummary,
  usagePill,
}: {
  title: string;
  dateRange: string;
  workScheduleSummary: string;
  usagePill: string;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm font-medium text-teal-400">{dateRange}</p>
          <p className="mt-2 text-sm text-slate-400">{workScheduleSummary}</p>
        </div>
        <span className="shrink-0 rounded-full border border-teal-400/30 bg-teal-500/15 px-2.5 py-1 text-xs font-medium text-teal-300">
          {usagePill}
        </span>
      </div>
    </GlassCard>
  );
}

function ActionRow({
  onCopySummary,
  onCopyPlan,
  onDownloadCalendar,
  copiedSummary,
  copiedPlan,
}: {
  onCopySummary: () => void;
  onCopyPlan: () => void;
  onDownloadCalendar: () => void;
  copiedSummary: boolean;
  copiedPlan: boolean;
}) {
  return (
    <div className="flex gap-2">
      <ActionButton
        onClick={onCopySummary}
        icon={Copy}
        label="Copy Summary"
        successIcon={Check}
        isSuccess={copiedSummary}
      />
      <ActionButton
        onClick={onCopyPlan}
        icon={Copy}
        label="Copy Plan"
        successIcon={Check}
        isSuccess={copiedPlan}
      />
      <ActionButton
        onClick={onDownloadCalendar}
        icon={Download}
        label="Download .ics"
      />
    </div>
  );
}

function WeekSnapshotCard({ snapshot }: { snapshot: WeekSnapshot }) {
  return (
    <GlassCard className="p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        <Calendar className="h-4 w-4 text-teal-400" />
        Week Snapshot
      </h2>
      <div className="mt-4 grid gap-4">
        <div className="flex items-start gap-3">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Workdays
            </p>
            <p className="text-sm text-slate-200">
              {snapshot.workdays.join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Main Goal
            </p>
            <p className="text-sm text-slate-200">{snapshot.mainGoal}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Main Strategy
            </p>
            <p className="text-sm text-slate-200">{snapshot.mainStrategy}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-start gap-3">
            <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Meal Prep
              </p>
              <p className="text-sm text-slate-200">{snapshot.mealPrepDay}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Dumbbell className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Training
              </p>
              <p className="text-sm text-slate-200">
                {snapshot.trainingDays.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function DayCard({ day }: { day: DayPlan }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-sm font-bold text-white">
            {day.dayName.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-white">
              {day.dayName}{" "}
              <span className="font-normal text-slate-400">{day.date}</span>
            </p>
            <DayTypeBadge type={day.dayType} />
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-white/5 px-4 pb-4 pt-3">
          {day.workBlock && (
            <div className="mb-4 rounded-xl border border-blue-400/20 bg-blue-500/10 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
                <Briefcase className="h-4 w-4" />
                Work: {day.workBlock.start} – {day.workBlock.end}
              </div>
              {day.workBlock.notes && (
                <p className="mt-1 text-xs text-blue-200/70">
                  {day.workBlock.notes}
                </p>
              )}
            </div>
          )}

          {day.resetBlock && day.resetBlock.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-500/10 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-300">
                <Moon className="h-4 w-4" />
                Reset Focus
              </p>
              <ul className="space-y-1 text-xs text-amber-200/70">
                {day.resetBlock.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            {day.morning && (
              <TimeBlockSection block={day.morning} />
            )}
            {day.midday && (
              <TimeBlockSection block={day.midday} />
            )}
            {day.afternoon && (
              <TimeBlockSection block={day.afternoon} />
            )}
            {day.evening && (
              <TimeBlockSection block={day.evening} />
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function TimeBlockSection({ block }: { block: TimeBlock }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
        <TimeBlockIcon label={block.label} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {block.label}
        </p>
        <ul className="mt-1 space-y-0.5">
          {block.items.map((item, idx) => (
            <li key={idx} className="text-sm text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ChecklistSection({
  checklist,
  checklistState,
  onToggle,
  onCopyChecklist,
  copiedChecklist,
}: {
  checklist: ChecklistDay[];
  checklistState: Record<string, boolean>;
  onToggle: (id: string) => void;
  onCopyChecklist: () => void;
  copiedChecklist: boolean;
}) {
  const { totalItems, completedItems, progressPercent } = useMemo(() => {
    let total = 0;
    let completed = 0;
    checklist.forEach((day) => {
      day.items.forEach((item) => {
        total++;
        if (checklistState[item.id]) completed++;
      });
    });
    return {
      totalItems: total,
      completedItems: completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [checklist, checklistState]);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Check className="h-4 w-4 text-teal-400" />
          Weekly Checklist
        </h2>
        <button
          onClick={onCopyChecklist}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-teal-400/30 hover:text-teal-300"
        >
          {copiedChecklist ? (
            <Check className="h-3.5 w-3.5 text-teal-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copiedChecklist ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {completedItems} of {totalItems} complete
          </span>
          <span className="font-medium text-teal-400">{progressPercent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Day Groups */}
      <div className="mt-5 space-y-4">
        {checklist.map((day) => {
          const dayCompleted = day.items.filter(
            (item) => checklistState[item.id]
          ).length;
          const dayTotal = day.items.length;

          return (
            <div key={day.dayName}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">
                  {day.dayName}{" "}
                  <span className="text-slate-500">{day.date}</span>
                </p>
                <span className="text-xs text-slate-500">
                  {dayCompleted}/{dayTotal}
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {day.items.map((item) => {
                  const isChecked = checklistState[item.id] || false;
                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggle(item.id)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          isChecked
                            ? "border-teal-400 bg-teal-500/20 text-teal-400"
                            : "border-white/20 bg-white/[0.03]"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3" />}
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          isChecked
                            ? "text-slate-500 line-through"
                            : "text-slate-300"
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function FeedbackCard({
  feedback,
  onFeedbackChange,
  onSubmitFeedback,
  isSubmitting,
  submitted,
}: {
  feedback: {
    rating: number;
    whatWorked: string;
    whatFeltUnrealistic: string;
    whatShouldRemember: string;
  };
  onFeedbackChange: (field: string, value: string | number) => void;
  onSubmitFeedback: () => void;
  isSubmitting: boolean;
  submitted: boolean;
}) {
  return (
    <GlassCard className="p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        <Star className="h-4 w-4 text-teal-400" />
        Plan Feedback
      </h2>

      {submitted ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-teal-400/20 bg-teal-500/10 p-4 text-sm text-teal-300">
          <Check className="h-5 w-5" />
          Thanks for your feedback!
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Rating */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">
              How useful was this plan?
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onFeedbackChange("rating", star)}
                  className="rounded-lg p-1 transition-colors hover:bg-white/[0.06]"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= feedback.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Text Fields */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              What worked well?
            </label>
            <textarea
              value={feedback.whatWorked}
              onChange={(e) => onFeedbackChange("whatWorked", e.target.value)}
              placeholder="e.g., Meal prep timing was realistic"
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              What felt unrealistic?
            </label>
            <textarea
              value={feedback.whatFeltUnrealistic}
              onChange={(e) =>
                onFeedbackChange("whatFeltUnrealistic", e.target.value)
              }
              placeholder="e.g., Too many tasks on reset day"
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              What should ShiftPlan remember?
            </label>
            <textarea
              value={feedback.whatShouldRemember}
              onChange={(e) =>
                onFeedbackChange("whatShouldRemember", e.target.value)
              }
              placeholder="e.g., I never have energy for gym after night shifts"
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20"
            />
          </div>

          <button
            onClick={onSubmitFeedback}
            disabled={isSubmitting || feedback.rating === 0}
            className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}
    </GlassCard>
  );
}

function SafetyNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
      <p className="text-xs leading-relaxed text-slate-500">
        AI-generated draft. Review dates, shift times, appointments, and
        assumptions before relying on it. Lifestyle/routine planning only — not
        medical advice.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function SavedPlanTimeline() {
  const [plan] = useState<SavedPlanData>(placeholderPlan);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    {}
  );
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    whatWorked: "",
    whatFeltUnrealistic: "",
    whatShouldRemember: "",
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  function handleCopySummary() {
    const summary = `${plan.title}\n${plan.dateRange}\n${plan.workScheduleSummary}\n\nMain Goal: ${plan.weekSnapshot.mainGoal}\nStrategy: ${plan.weekSnapshot.mainStrategy}`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  }

  function handleCopyPlan() {
    let fullPlan = `${plan.title}\n${plan.dateRange}\n\n`;
    plan.days.forEach((day) => {
      fullPlan += `${day.dayName} ${day.date} (${day.dayType})\n`;
      if (day.workBlock) {
        fullPlan += `  Work: ${day.workBlock.start} – ${day.workBlock.end}\n`;
      }
      [day.morning, day.midday, day.afternoon, day.evening].forEach((block) => {
        if (block) {
          fullPlan += `  ${block.label}:\n`;
          block.items.forEach((item) => {
            fullPlan += `    - ${item}\n`;
          });
        }
      });
      fullPlan += "\n";
    });
    navigator.clipboard.writeText(fullPlan);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  }

  function handleDownloadCalendar() {
    // Placeholder: In a real app, generate and download .ics file
    alert("Calendar download would generate an .ics file");
  }

  function handleToggleChecklistItem(id: string) {
    setChecklistState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function handleCopyChecklist() {
    let checklistText = "Weekly Checklist\n\n";
    plan.checklist.forEach((day) => {
      checklistText += `${day.dayName} ${day.date}\n`;
      day.items.forEach((item) => {
        const checked = checklistState[item.id] ? "[x]" : "[ ]";
        checklistText += `  ${checked} ${item.text}\n`;
      });
      checklistText += "\n";
    });
    navigator.clipboard.writeText(checklistText);
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2000);
  }

  function handleFeedbackChange(field: string, value: string | number) {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmitFeedback() {
    setIsSubmittingFeedback(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackSubmitted(true);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Gradient Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(21,87,255,0.15),transparent_50%),radial-gradient(ellipse_at_top_left,rgba(18,191,174,0.12),transparent_40%)]" />

      {/* Content */}
      <div className="relative mx-auto max-w-lg px-4 py-6 pb-20">
        <div className="space-y-4">
          {/* Header */}
          <HeaderCard
            title={plan.title}
            dateRange={plan.dateRange}
            workScheduleSummary={plan.workScheduleSummary}
            usagePill={plan.usagePill}
          />

          {/* Action Row */}
          <ActionRow
            onCopySummary={handleCopySummary}
            onCopyPlan={handleCopyPlan}
            onDownloadCalendar={handleDownloadCalendar}
            copiedSummary={copiedSummary}
            copiedPlan={copiedPlan}
          />

          {/* Week Snapshot */}
          <WeekSnapshotCard snapshot={plan.weekSnapshot} />

          {/* Timeline Header */}
          <div className="flex items-center gap-2 px-1 pt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Day by Day
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Day Cards */}
          {plan.days.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}

          {/* Checklist */}
          <ChecklistSection
            checklist={plan.checklist}
            checklistState={checklistState}
            onToggle={handleToggleChecklistItem}
            onCopyChecklist={handleCopyChecklist}
            copiedChecklist={copiedChecklist}
          />

          {/* Feedback */}
          <FeedbackCard
            feedback={feedback}
            onFeedbackChange={handleFeedbackChange}
            onSubmitFeedback={handleSubmitFeedback}
            isSubmitting={isSubmittingFeedback}
            submitted={feedbackSubmitted}
          />

          {/* Safety Note */}
          <SafetyNote />
        </div>
      </div>
    </div>
  );
}
