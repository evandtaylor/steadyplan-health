"use client";

import { type FormEvent, useMemo, useState } from "react";

type AdminGroup = "free" | "custom" | "founding" | "weekly";
type ProductFilter = "All" | "ShiftPlan" | "KinPlan" | "SuppPlan";
type PaidIntakeType = "custom_plan" | "founding_pro" | "founding_pro_weekly";

type BetaSignup = {
  created_at: string;
  name: string;
  email: string;
  product_interest: ProductFilter;
  biggest_problem: string;
  current_tools: string | null;
  willingness_to_pay: "Yes" | "No" | "Maybe";
  optional_details: string | null;
};

type ShiftPlanIntake = {
  created_at: string;
  name: string;
  email: string;
  role: string;
  typical_shift_type: string;
  shift_length: string;
  workdays_this_week: string;
  commute_time: string;
  sleep_goal: string;
  workout_goal: string;
  nutrition_goal: string;
  biggest_shift_work_struggle: string;
  useful_plan_details: string;
  willingness_to_pay: "Yes" | "No" | "Maybe";
};

type ShiftPlanPaidIntake = {
  created_at: string;
  intake_type: PaidIntakeType;
  first_name: string;
  email: string;
  plan_start_date: string | null;
  plan_end_date: string | null;
  week_start_date: string | null;
  week_end_date: string | null;
  job_role: string | null;
  schedule_type: string | null;
  typical_shift_pattern: string | null;
  exact_work_shifts: string | null;
  commute_time: string | null;
  typical_commute_time: string | null;
  main_goal: string | null;
  monthly_goal: string | null;
  meal_prep_preferences: string | null;
  meal_prep_needs_this_week: string | null;
  workout_training_goals: string | null;
  workout_training_preferences: string | null;
  workout_training_goals_this_week: string | null;
  appointments: string | null;
  appointments_this_week: string | null;
  errands: string | null;
  errands_this_week: string | null;
  family_personal_responsibilities: string | null;
  family_personal_responsibilities_this_week: string | null;
  top_3_priorities: string | null;
  top_3_priorities_this_week: string | null;
  anything_to_avoid: string | null;
  preferred_plan_style: string | null;
  organize_focus: string | null;
  recurring_responsibilities: string | null;
  avoid_after_work: string | null;
  messy_week_reason: string | null;
  changed_from_last_week: string | null;
  worked_from_last_plan: string | null;
  unrealistic_from_last_plan: string | null;
  specific_request_this_week: string | null;
  safety_acknowledged: boolean;
};

type AdminResponse = {
  message?: string;
  signups?: BetaSignup[];
  shiftPlanIntakes?: ShiftPlanIntake[];
  shiftPlanPaidIntakes?: ShiftPlanPaidIntake[];
};

const groups: { id: AdminGroup; label: string }[] = [
  { id: "free", label: "Free Reset / Beta" },
  { id: "custom", label: "Custom Plan" },
  { id: "founding", label: "Founding Pro" },
  { id: "weekly", label: "Weekly Schedule" },
];

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [shiftPlanIntakes, setShiftPlanIntakes] = useState<ShiftPlanIntake[]>([]);
  const [shiftPlanPaidIntakes, setShiftPlanPaidIntakes] = useState<
    ShiftPlanPaidIntake[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<AdminGroup>("free");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const paidGroups = useMemo(() => {
    return {
      custom: shiftPlanPaidIntakes.filter(
        (intake) => intake.intake_type === "custom_plan",
      ),
      founding: shiftPlanPaidIntakes.filter(
        (intake) => intake.intake_type === "founding_pro",
      ),
      weekly: shiftPlanPaidIntakes.filter(
        (intake) => intake.intake_type === "founding_pro_weekly",
      ),
    };
  }, [shiftPlanPaidIntakes]);

  const groupCounts = {
    free: signups.length + shiftPlanIntakes.length,
    custom: paidGroups.custom.length,
    founding: paidGroups.founding.length,
    weekly: paidGroups.weekly.length,
  };

  async function loadSignups(nextPassword = password) {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/beta-signups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: nextPassword }),
      });
      const result = (await response.json()) as AdminResponse;

      if (
        !response.ok ||
        !result.signups ||
        !result.shiftPlanIntakes ||
        !result.shiftPlanPaidIntakes
      ) {
        setMessage(result.message || "Unable to load admin submissions.");
        setIsUnlocked(false);
        return;
      }

      setSignups(result.signups);
      setShiftPlanIntakes(result.shiftPlanIntakes);
      setShiftPlanPaidIntakes(result.shiftPlanPaidIntakes);
      setIsUnlocked(true);
    } catch {
      setMessage("Unable to reach the admin data route right now.");
      setIsUnlocked(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password.trim()) {
      setMessage("Enter the admin password.");
      return;
    }

    await loadSignups(password);
  }

  if (!isUnlocked) {
    return (
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase text-teal-700">Internal MVP</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950">
            Founder admin
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Enter the admin password to review free and paid ShiftPlan
            submissions. This simple gate is for internal MVP use only and is
            not full authentication.
          </p>

          {message ? (
            <div
              className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
              role="alert"
            >
              {message}
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label
                htmlFor="adminPassword"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Admin password
              </label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-control"
                autoComplete="off"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
            >
              {isLoading ? "Checking..." : "View submissions"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              Internal MVP
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              ShiftPlan submissions
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Review free reset, custom plan, Founding Pro onboarding, and
              weekly schedule submissions. Keep this data internal and avoid
              collecting sensitive health details in future form changes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadSignups()}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 sm:w-fit"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedGroup(group.id)}
              aria-pressed={selectedGroup === group.id}
              className={`rounded-lg border p-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                selectedGroup === group.id
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-teal-200"
              }`}
            >
              <span className="block text-sm font-medium text-slate-500">
                {group.label}
              </span>
              <span className="mt-2 block text-3xl font-semibold text-slate-950">
                {groupCounts[group.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          {selectedGroup === "free" ? (
            <FreeSubmissionGroup
              signups={signups}
              shiftPlanIntakes={shiftPlanIntakes}
            />
          ) : null}
          {selectedGroup === "custom" ? (
            <PaidSubmissionGroup
              title="Custom 7-Day ShiftPlan submissions"
              intakes={paidGroups.custom}
            />
          ) : null}
          {selectedGroup === "founding" ? (
            <PaidSubmissionGroup
              title="Founding Pro onboarding submissions"
              intakes={paidGroups.founding}
            />
          ) : null}
          {selectedGroup === "weekly" ? (
            <PaidSubmissionGroup
              title="Founding Pro weekly schedule submissions"
              intakes={paidGroups.weekly}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FreeSubmissionGroup({
  signups,
  shiftPlanIntakes,
}: {
  signups: BetaSignup[];
  shiftPlanIntakes: ShiftPlanIntake[];
}) {
  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <GroupHeader
          title="Free Reset Plan intakes"
          count={shiftPlanIntakes.length}
        />
        {shiftPlanIntakes.length === 0 ? (
          <EmptyState message="No Free Reset Plan intakes yet." />
        ) : (
          <div className="grid gap-4 p-4">
            {shiftPlanIntakes.map((intake) => (
              <article
                key={`shiftplan-${intake.email}-${intake.created_at}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{intake.name}</p>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {intake.email}
                    </p>
                  </div>
                  <span className="w-fit rounded-lg bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                    Free Reset Plan
                  </span>
                </div>
                <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <AdminField label="Created" value={formatDate(intake.created_at)} />
                  <AdminField label="Role" value={intake.role} />
                  <AdminField
                    label="Shift pattern"
                    value={`${intake.typical_shift_type}, ${intake.shift_length}`}
                  />
                  <AdminField
                    label="Workdays this week"
                    value={intake.workdays_this_week}
                  />
                  <AdminField label="Commute" value={intake.commute_time} />
                  <AdminField
                    label="Would pay"
                    value={intake.willingness_to_pay}
                  />
                  <AdminField label="Sleep goal" value={intake.sleep_goal} />
                  <AdminField label="Workout goal" value={intake.workout_goal} />
                  <AdminField
                    label="Nutrition goal"
                    value={intake.nutrition_goal}
                  />
                  <AdminField
                    label="Biggest struggle"
                    value={intake.biggest_shift_work_struggle}
                  />
                  <AdminField
                    label="Useful plan details"
                    value={intake.useful_plan_details}
                  />
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <GroupHeader title="General beta submissions" count={signups.length} />
        {signups.length === 0 ? (
          <EmptyState message="No general beta submissions yet." />
        ) : (
          <div className="grid gap-4 p-4">
            {signups.map((signup) => (
              <article
                key={`beta-${signup.email}-${signup.created_at}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{signup.name}</p>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {signup.email}
                    </p>
                  </div>
                  <span className="w-fit rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
                    {signup.product_interest}
                  </span>
                </div>
                <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <AdminField label="Created" value={formatDate(signup.created_at)} />
                  <AdminField
                    label="Biggest problem"
                    value={signup.biggest_problem}
                  />
                  <AdminField
                    label="Current tools"
                    value={signup.current_tools || "-"}
                  />
                  <AdminField label="Would pay" value={signup.willingness_to_pay} />
                  <AdminField
                    label="Optional details"
                    value={signup.optional_details || "-"}
                  />
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaidSubmissionGroup({
  title,
  intakes,
}: {
  title: string;
  intakes: ShiftPlanPaidIntake[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <GroupHeader title={title} count={intakes.length} />
      {intakes.length === 0 ? (
        <EmptyState message="No submissions in this group yet." />
      ) : (
        <div className="grid gap-4 p-4">
          {intakes.map((intake) => (
            <article
              key={`${intake.intake_type}-${intake.email}-${intake.created_at}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">
                      {intake.first_name}
                    </p>
                    <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                      {formatPaidLabel(intake.intake_type)}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-slate-600">
                    {intake.email}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {formatDate(intake.created_at)}
                </p>
              </div>

              <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <AdminField label="Intake type" value={formatPaidLabel(intake.intake_type)} />
                <AdminField label="Plan dates" value={formatPlanDates(intake)} />
                <AdminField label="Job / role" value={intake.job_role || "-"} />
                <AdminField
                  label="Schedule"
                  value={intake.schedule_type || intake.typical_shift_pattern || "-"}
                />
                <AdminField
                  label="Main goal"
                  value={intake.main_goal || intake.monthly_goal || "-"}
                />
                <AdminField
                  label="Preferred plan style"
                  value={intake.preferred_plan_style || "-"}
                />
                <AdminField
                  label="Safety acknowledged"
                  value={intake.safety_acknowledged ? "Yes" : "No"}
                />
              </dl>

              <details className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-teal-800">
                  View planning details
                </summary>
                <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <AdminField
                    label="Exact work shifts"
                    value={intake.exact_work_shifts || "-"}
                  />
                  <AdminField
                    label="Commute time"
                    value={intake.commute_time || intake.typical_commute_time || "-"}
                  />
                  <AdminField
                    label="Meal prep"
                    value={
                      intake.meal_prep_preferences ||
                      intake.meal_prep_needs_this_week ||
                      "-"
                    }
                  />
                  <AdminField
                    label="Workout / training"
                    value={
                      intake.workout_training_goals ||
                      intake.workout_training_preferences ||
                      intake.workout_training_goals_this_week ||
                      "-"
                    }
                  />
                  <AdminField
                    label="Appointments"
                    value={intake.appointments || intake.appointments_this_week || "-"}
                  />
                  <AdminField
                    label="Errands"
                    value={intake.errands || intake.errands_this_week || "-"}
                  />
                  <AdminField
                    label="Family / personal responsibilities"
                    value={
                      intake.family_personal_responsibilities ||
                      intake.family_personal_responsibilities_this_week ||
                      "-"
                    }
                  />
                  <AdminField
                    label="Top 3 priorities"
                    value={intake.top_3_priorities || intake.top_3_priorities_this_week || "-"}
                  />
                  <AdminField
                    label="Anything to avoid"
                    value={intake.anything_to_avoid || intake.avoid_after_work || "-"}
                  />
                  <AdminField
                    label="Recurring responsibilities"
                    value={intake.recurring_responsibilities || "-"}
                  />
                  <AdminField
                    label="What changed from last week"
                    value={intake.changed_from_last_week || "-"}
                  />
                  <AdminField
                    label="What worked from last plan"
                    value={intake.worked_from_last_plan || "-"}
                  />
                  <AdminField
                    label="What felt unrealistic"
                    value={intake.unrealistic_from_last_plan || "-"}
                  />
                  <AdminField
                    label="Specific request this week"
                    value={intake.specific_request_this_week || "-"}
                  />
                  <AdminField
                    label="What makes the week messy"
                    value={intake.messy_week_reason || "-"}
                  />
                  <AdminField
                    label="What to organize"
                    value={intake.organize_focus || "-"}
                  />
                </dl>
              </details>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <span className="w-fit rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {count} {count === 1 ? "submission" : "submissions"}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="px-4 py-10 text-center text-slate-600">{message}</div>;
}

function AdminField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words leading-6 text-slate-800">
        {value}
      </dd>
    </div>
  );
}

function formatPaidLabel(value: PaidIntakeType) {
  if (value === "custom_plan") return "Custom Plan";
  if (value === "founding_pro") return "Founding Pro";
  return "Weekly Schedule";
}

function formatPlanDates(intake: ShiftPlanPaidIntake) {
  const start = intake.plan_start_date || intake.week_start_date;
  const end = intake.plan_end_date || intake.week_end_date;

  if (!start && !end) return "-";
  if (start && end) return `${formatPlainDate(start)} to ${formatPlainDate(end)}`;
  return formatPlainDate(start || end || "");
}

function formatPlainDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
