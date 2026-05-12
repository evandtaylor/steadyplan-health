"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type ShiftPlanAppAccessProps = {
  initialAccess?: {
    email: string;
  } | null;
};

type AccessResponse = {
  message?: string;
  user?: {
    email: string;
    first_name: string | null;
    status: string;
    max_generations_per_month: number | null;
    max_generations_per_day: number | null;
  };
};

type WeeklyRequest = {
  id: string;
  created_at: string;
  email: string;
  week_start_date: string;
  week_end_date: string;
  schedule_type: string;
  main_goal: string;
  preferred_plan_style: string;
  status: "submitted" | "generated" | "failed" | "blocked_safety";
  saved_plan?: AppSavedPlan | null;
};

type AppSavedPlan = {
  id: string;
  created_at: string;
  app_user_id: string;
  plan_request_id: string;
  week_start_date: string;
  week_end_date: string;
  plan_title: string | null;
  plan_body: string;
  plan_json: Record<string, unknown> | null;
  generation_source: string;
  usage_month: number;
  usage_year: number;
  generation_number_for_month: number;
  feedback?: AppPlanFeedback | null;
};

type AppPlanFeedback = {
  id: string;
  created_at: string;
  updated_at: string;
  app_user_id: string;
  app_saved_plan_id: string;
  usefulness_rating: number;
  used_this_week: string;
  what_worked: string;
  what_felt_unrealistic: string;
  what_should_shiftplan_remember: string;
  would_use_weekly: string;
  would_pay_9_month: string;
  additional_notes: string;
};

type WeeklyRequestResponse = {
  message?: string;
  request?: WeeklyRequest;
  requests?: WeeklyRequest[];
  usage?: AppUsageSummary;
  errors?: Record<string, string>;
};

type GeneratePlanResponse = {
  message?: string;
  plan?: AppSavedPlan;
  usage?: AppUsageSummary;
  request?: {
    id: string;
    status: WeeklyRequest["status"];
  };
};

type PlanFeedbackResponse = {
  message?: string;
  feedback?: AppPlanFeedback;
  errors?: Record<string, string>;
};

type AppUsageSummary = {
  month_used: number;
  month_limit: number;
  day_used: number;
  day_limit: number;
  monthly_limit_reached?: boolean;
  daily_limit_reached?: boolean;
};

type WeeklyRequestFormState = {
  weekStartDate: string;
  scheduleType: string;
  workSchedule: string;
  commuteTime: string;
  mainGoal: string;
  mealPrepNeeds: string;
  workoutTrainingGoals: string;
  appointments: string;
  errands: string;
  familyPersonalResponsibilities: string;
  topPriorities: string;
  anythingToAvoid: string;
  preferredPlanStyle: string;
  safetyAcknowledged: boolean;
};

type PlanFeedbackFormState = {
  usefulnessRating: string;
  usedThisWeek: string;
  whatWorked: string;
  whatFeltUnrealistic: string;
  whatShouldShiftPlanRemember: string;
  wouldUseWeekly: string;
  wouldPay9Month: string;
  additionalNotes: string;
};

const initialWeeklyRequestForm: WeeklyRequestFormState = {
  weekStartDate: "",
  scheduleType: "",
  workSchedule: "",
  commuteTime: "",
  mainGoal: "",
  mealPrepNeeds: "",
  workoutTrainingGoals: "",
  appointments: "",
  errands: "",
  familyPersonalResponsibilities: "",
  topPriorities: "",
  anythingToAvoid: "",
  preferredPlanStyle: "",
  safetyAcknowledged: false,
};

const initialPlanFeedbackForm: PlanFeedbackFormState = {
  usefulnessRating: "",
  usedThisWeek: "",
  whatWorked: "",
  whatFeltUnrealistic: "",
  whatShouldShiftPlanRemember: "",
  wouldUseWeekly: "",
  wouldPay9Month: "",
  additionalNotes: "",
};

const scheduleTypeOptions = [
  "3x12 days",
  "3x12 nights",
  "Rotating shifts",
  "4x10s",
  "5x8s",
  "Mixed/irregular",
  "Other",
];

const planStyleOptions = [
  "Simple",
  "Detailed",
  "Checklist-heavy",
  "Calendar-style",
];

const usedThisWeekOptions = ["Yes", "No", "Not yet"];
const yesNoMaybeOptions = ["Yes", "No", "Maybe"];

const safetyCopy =
  "ShiftPlan helps organize your weekly routine around your shift schedule. App-generated AI plans may not be manually reviewed before you see them, and they may contain errors, omissions, unrealistic suggestions, incorrect assumptions, or date and time mistakes. Review and adjust each plan before relying on it. ShiftPlan is for lifestyle and routine planning only. It does not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support. No outcome is guaranteed.";

const safetyAcknowledgmentText =
  "I understand ShiftPlan is for lifestyle and routine organization only. It does not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support. I will not submit protected health information, medication details, diagnoses, symptoms, emergency information, workplace safety complaints, or safety-sensitive details.";

export function ShiftPlanAppAccess({ initialAccess }: ShiftPlanAppAccessProps) {
  const [email, setEmail] = useState(initialAccess?.email || "");
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [access, setAccess] = useState<AccessResponse["user"] | null>(
    initialAccess
      ? {
          email: initialAccess.email,
          first_name: null,
          status: "Active",
          max_generations_per_month: null,
          max_generations_per_day: null,
        }
      : null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/app/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          access_code: accessCode,
        }),
      });
      const result = (await response.json()) as AccessResponse;

      if (!response.ok || !result.user) {
        setErrorMessage(
          result.message || "That email and access code did not work.",
        );
        return;
      }

      setAccess(result.user);
      setEmail(result.user.email);
      setAccessCode("");
    } catch {
      setErrorMessage(
        "We could not check ShiftPlan app access right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (access) {
    return <AppDashboard email={access.email} firstName={access.first_name} />;
  }

  return (
    <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-lg bg-teal-400/10 px-3 py-2 text-sm font-semibold uppercase text-teal-200 ring-1 ring-teal-300/20">
            ShiftPlan app preview
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Your weekly planning workspace is taking shape.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Enter your early access email and code to preview the gated
            ShiftPlan app foundation.
          </p>
          <p className="mt-5 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm leading-6 text-slate-300">
            {safetyCopy}
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-white p-5 text-slate-950 shadow-2xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase text-teal-700">
              Early access
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Open ShiftPlan app
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use the email and access code connected to your early access
              invite.
            </p>
          </div>

          {errorMessage ? (
            <div
              className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="app-email"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Email
              </label>
              <input
                id="app-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field-control"
                required
              />
            </div>

            <div>
              <label
                htmlFor="app-access-code"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Access code
              </label>
              <input
                id="app-access-code"
                name="access_code"
                type="password"
                autoComplete="one-time-code"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="field-control"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-teal-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Checking access..." : "Open app preview"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function AppDashboard({
  email,
  firstName,
}: {
  email: string;
  firstName: string | null;
}) {
  const [form, setForm] = useState<WeeklyRequestFormState>(
    initialWeeklyRequestForm,
  );
  const [requests, setRequests] = useState<WeeklyRequest[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestMessage, setRequestMessage] = useState("");
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isSavingRequest, setIsSavingRequest] = useState(false);
  const [generatingRequestId, setGeneratingRequestId] = useState("");
  const [generationMessages, setGenerationMessages] = useState<
    Record<string, string>
  >({});
  const [copiedPlanId, setCopiedPlanId] = useState("");
  const [usage, setUsage] = useState<AppUsageSummary>({
    month_used: 0,
    month_limit: 4,
    day_used: 0,
    day_limit: 2,
    monthly_limit_reached: false,
    daily_limit_reached: false,
  });
  const calculatedWeekEndDate = useMemo(
    () => calculateEndDate(form.weekStartDate),
    [form.weekStartDate],
  );
  const savedPlans = useMemo(
    () => requests.flatMap((request) => (request.saved_plan ? [request.saved_plan] : [])),
    [requests],
  );

  const loadRequests = useCallback(async () => {
    setIsLoadingRequests(true);

    try {
      const response = await fetch("/api/app/weekly-requests", {
        method: "GET",
      });
      const result = (await response.json()) as WeeklyRequestResponse;

      if (!response.ok) {
        setRequestMessage(
          result.message || "Could not load weekly requests right now.",
        );
        return;
      }

      setRequests(result.requests || []);
      if (result.usage) {
        setUsage(result.usage);
      }
    } catch {
      setRequestMessage("Could not load weekly requests right now.");
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRequests();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRequests]);

  function updateField(
    field: keyof WeeklyRequestFormState,
    value: string | boolean,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setRequestMessage("");
  }

  async function handleWeeklyRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingRequest) return;

    setIsSavingRequest(true);
    setRequestMessage("");
    setErrors({});

    try {
      const response = await fetch("/api/app/weekly-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          week_start_date: form.weekStartDate,
          schedule_type: form.scheduleType,
          work_schedule: form.workSchedule,
          commute_time: form.commuteTime,
          main_goal: form.mainGoal,
          meal_prep_needs: form.mealPrepNeeds,
          workout_training_goals: form.workoutTrainingGoals,
          appointments: form.appointments,
          errands: form.errands,
          family_personal_responsibilities:
            form.familyPersonalResponsibilities,
          top_priorities: form.topPriorities,
          anything_to_avoid: form.anythingToAvoid,
          preferred_plan_style: form.preferredPlanStyle,
          safety_acknowledged: form.safetyAcknowledged,
        }),
      });
      const result = (await response.json()) as WeeklyRequestResponse;

      if (!response.ok || !result.request) {
        setRequestMessage(
          result.message || "Could not save weekly request right now.",
        );
        setErrors(result.errors || {});
        return;
      }

      setRequests((current) => [result.request as WeeklyRequest, ...current]);
      setForm(initialWeeklyRequestForm);
      setRequestMessage("Weekly request saved.");
    } catch {
      setRequestMessage("Could not save weekly request right now.");
    } finally {
      setIsSavingRequest(false);
    }
  }

  async function handleGeneratePlan(planRequestId: string) {
    if (generatingRequestId) return;

    setGeneratingRequestId(planRequestId);
    setGenerationMessages((current) => ({
      ...current,
      [planRequestId]: "",
    }));

    try {
      const response = await fetch("/api/app/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_request_id: planRequestId,
        }),
      });
      const result = (await response.json()) as GeneratePlanResponse;

      if (!response.ok || !result.plan) {
        if (result.usage) {
          setUsage(result.usage);
        }
        setGenerationMessages((current) => ({
          ...current,
          [planRequestId]:
            result.message || "Could not generate this ShiftPlan right now.",
        }));
        return;
      }

      setRequests((current) =>
        current.map((request) =>
          request.id === planRequestId
            ? {
                ...request,
                status: result.request?.status || "generated",
                saved_plan: result.plan,
              }
            : request,
        ),
      );
      setUsage((current) => ({
        ...current,
        month_used: Math.min(current.month_used + 1, current.month_limit),
        day_used: Math.min(current.day_used + 1, current.day_limit),
        monthly_limit_reached: current.month_used + 1 >= current.month_limit,
        daily_limit_reached: current.day_used + 1 >= current.day_limit,
      }));
      setGenerationMessages((current) => ({
        ...current,
        [planRequestId]: "ShiftPlan generated and saved.",
      }));
    } catch {
      setGenerationMessages((current) => ({
        ...current,
        [planRequestId]: "Could not generate this ShiftPlan right now.",
      }));
    } finally {
      setGeneratingRequestId("");
    }
  }

  async function handleCopyPlan(plan: AppSavedPlan) {
    try {
      await navigator.clipboard.writeText(plan.plan_body);
      setCopiedPlanId(plan.id);
      window.setTimeout(() => setCopiedPlanId(""), 1800);
    } catch {
      setCopiedPlanId("");
    }
  }

  function handleFeedbackSaved(planId: string, feedback: AppPlanFeedback) {
    setRequests((current) =>
      current.map((request) =>
        request.saved_plan?.id === planId
          ? {
              ...request,
              saved_plan: {
                ...request.saved_plan,
                feedback,
              },
            }
          : request,
      ),
    );
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase text-teal-700">
            ShiftPlan app
          </p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                Welcome{firstName ? `, ${firstName}` : ""}.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Signed in for app preview as {email}.
              </p>
            </div>
            <a
              href="#weekly-request"
              className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
            >
              Create This Week&apos;s ShiftPlan
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Plans used this month
            </h2>
            <p className="mt-4 text-4xl font-semibold text-teal-800">
              {usage.month_used} / {usage.month_limit}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Plans generated today: {usage.day_used} of {usage.day_limit}
            </p>
            {usage.monthly_limit_reached || usage.daily_limit_reached ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                You&apos;ve used your included AI ShiftPlans for this period.
                You can still view and copy saved plans.
              </p>
            ) : null}
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Saved plans
            </h2>
            {savedPlans.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                Generated ShiftPlans will appear here after you create one from
                a weekly request.
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {savedPlans.map((plan) => (
                  <article
                    key={plan.id}
                    className="rounded-lg border border-teal-200 bg-teal-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {plan.plan_title || "Saved ShiftPlan"}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {formatDateRange(
                            plan.week_start_date,
                            plan.week_end_date,
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleCopyPlan(plan)}
                        className="inline-flex w-full items-center justify-center rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
                      >
                        {copiedPlanId === plan.id ? "Copied" : "Copy Plan"}
                      </button>
                    </div>
                    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                      AI-generated draft — this may not have been manually
                      reviewed. Check dates, times, assumptions, and fit before
                      using it.
                    </p>
                    <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-6 text-slate-800">
                      {plan.plan_body}
                    </pre>
                    <PlanFeedbackForm
                      plan={plan}
                      onFeedbackSaved={handleFeedbackSaved}
                    />
                  </article>
                ))}
              </div>
            )}
          </article>
        </div>

        <div
          id="weekly-request"
          className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
        >
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                Weekly request
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Create This Week&apos;s ShiftPlan
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Save your schedule and priorities for the week, then generate a
                routine-planning draft from the saved request.
              </p>
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                App-generated AI plans may not be manually reviewed before you
                see them. Review dates, shift times, appointments, and
                assumptions before relying on a plan.
              </p>
            </div>

            {requestMessage ? (
              <div
                className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950"
                role="status"
              >
                {requestMessage}
                {requestMessage === "Weekly request saved." ? (
                  <span className="mt-2 block">
                    You can generate a draft from this request below.
                  </span>
                ) : null}
              </div>
            ) : null}

            <form
              className="mt-6 grid gap-5"
              onSubmit={handleWeeklyRequestSubmit}
              noValidate
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  id="weekStartDate"
                  label="Week start date"
                  error={errors.week_start_date}
                >
                  <input
                    id="weekStartDate"
                    name="weekStartDate"
                    type="date"
                    min="2024-01-01"
                    max="2100-12-31"
                    value={form.weekStartDate}
                    onChange={(event) =>
                      updateField("weekStartDate", event.target.value)
                    }
                    className="field-control"
                    required
                  />
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {calculatedWeekEndDate
                      ? `We'll automatically build through ${formatReadableDate(calculatedWeekEndDate)}.`
                      : "Choose the first day of this weekly plan. We'll automatically build through the next 6 days."}
                  </p>
                </Field>

                <Field
                  id="scheduleType"
                  label="Schedule type"
                  error={errors.schedule_type}
                >
                  <select
                    id="scheduleType"
                    name="scheduleType"
                    value={form.scheduleType}
                    onChange={(event) =>
                      updateField("scheduleType", event.target.value)
                    }
                    className="field-control"
                    required
                  >
                    <option value="">Choose one</option>
                    {scheduleTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field
                id="workSchedule"
                label="Exact work schedule"
                helpText="Include days and times, for example: Monday 7a-7p, Tuesday 7a-7p, Wednesday 7a-7p."
                error={errors.work_schedule}
              >
                <textarea
                  id="workSchedule"
                  name="workSchedule"
                  value={form.workSchedule}
                  onChange={(event) =>
                    updateField("workSchedule", event.target.value)
                  }
                  className="field-control min-h-28"
                  required
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field id="commuteTime" label="Commute time">
                  <input
                    id="commuteTime"
                    name="commuteTime"
                    value={form.commuteTime}
                    onChange={(event) =>
                      updateField("commuteTime", event.target.value)
                    }
                    className="field-control"
                  />
                </Field>

                <Field
                  id="preferredPlanStyle"
                  label="Preferred plan style"
                  error={errors.preferred_plan_style}
                >
                  <select
                    id="preferredPlanStyle"
                    name="preferredPlanStyle"
                    value={form.preferredPlanStyle}
                    onChange={(event) =>
                      updateField("preferredPlanStyle", event.target.value)
                    }
                    className="field-control"
                    required
                  >
                    <option value="">Choose one</option>
                    {planStyleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field
                id="mainGoal"
                label="Main goal for this week"
                error={errors.main_goal}
              >
                <textarea
                  id="mainGoal"
                  name="mainGoal"
                  value={form.mainGoal}
                  onChange={(event) =>
                    updateField("mainGoal", event.target.value)
                  }
                  className="field-control min-h-24"
                  required
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <TextAreaField
                  id="mealPrepNeeds"
                  label="Meal prep needs"
                  value={form.mealPrepNeeds}
                  onChange={(value) => updateField("mealPrepNeeds", value)}
                />
                <TextAreaField
                  id="workoutTrainingGoals"
                  label="Workout/training goals"
                  value={form.workoutTrainingGoals}
                  onChange={(value) =>
                    updateField("workoutTrainingGoals", value)
                  }
                />
                <TextAreaField
                  id="appointments"
                  label="Appointments this week"
                  value={form.appointments}
                  onChange={(value) => updateField("appointments", value)}
                />
                <TextAreaField
                  id="errands"
                  label="Errands this week"
                  value={form.errands}
                  onChange={(value) => updateField("errands", value)}
                />
                <TextAreaField
                  id="familyPersonalResponsibilities"
                  label="Family/personal responsibilities"
                  value={form.familyPersonalResponsibilities}
                  onChange={(value) =>
                    updateField("familyPersonalResponsibilities", value)
                  }
                />
                <TextAreaField
                  id="topPriorities"
                  label="Top 3 priorities this week"
                  value={form.topPriorities}
                  onChange={(value) => updateField("topPriorities", value)}
                />
              </div>

              <Field id="anythingToAvoid" label="Anything to avoid">
                <textarea
                  id="anythingToAvoid"
                  name="anythingToAvoid"
                  value={form.anythingToAvoid}
                  onChange={(event) =>
                    updateField("anythingToAvoid", event.target.value)
                  }
                  className="field-control min-h-24"
                />
              </Field>

              <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Safety acknowledgment
                </legend>
                <label className="mt-2 flex cursor-pointer gap-3 text-sm leading-6 text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.safetyAcknowledged}
                    onChange={(event) =>
                      updateField("safetyAcknowledged", event.target.checked)
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
                    required
                  />
                  <span>{safetyAcknowledgmentText}</span>
                </label>
                {errors.safety_acknowledged ? (
                  <p className="mt-2 text-sm font-medium text-red-700">
                    {errors.safety_acknowledged}
                  </p>
                ) : null}
              </fieldset>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isSavingRequest}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
                >
                  {isSavingRequest ? "Saving..." : "Save weekly request"}
                </button>
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-base font-semibold text-slate-500 sm:w-fit"
                >
                  Generate from saved request
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950">
              Recent weekly requests
            </h2>
            {isLoadingRequests ? (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Loading requests...
              </p>
            ) : requests.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                No weekly requests saved yet.
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {requests.map((request) => (
                  <article
                    key={request.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {formatDateRange(
                            request.week_start_date,
                            request.week_end_date,
                          )}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {request.schedule_type}
                        </p>
                      </div>
                      <span className="w-fit rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold capitalize text-teal-800">
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {request.main_goal}
                    </p>
                    {request.saved_plan ? (
                      <div className="mt-4 rounded-lg border border-teal-200 bg-white p-3 text-sm leading-6 text-teal-950">
                        <p className="font-semibold">Generated plan saved.</p>
                        <p>
                          Review it in Saved plans, then check dates, times,
                          assumptions, and anything that does not fit your real
                          life.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-2">
                        <button
                          type="button"
                          onClick={() => void handleGeneratePlan(request.id)}
                          disabled={
                            Boolean(generatingRequestId) ||
                            !canGenerateRequest(request, usage)
                          }
                          className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {generatingRequestId === request.id
                            ? "Generating..."
                            : "Generate My ShiftPlan"}
                        </button>
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          AI draft may not be manually reviewed. Check dates,
                          times, and assumptions.
                        </p>
                      </div>
                    )}
                    {generationMessages[request.id] ? (
                      <p className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
                        {generationMessages[request.id]}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-blue-950">Safety note</p>
          <p className="mt-2">{safetyCopy}</p>
        </aside>
      </div>
    </section>
  );
}

function PlanFeedbackForm({
  plan,
  onFeedbackSaved,
}: {
  plan: AppSavedPlan;
  onFeedbackSaved: (planId: string, feedback: AppPlanFeedback) => void;
}) {
  const [form, setForm] = useState<PlanFeedbackFormState>(() =>
    createPlanFeedbackForm(plan.feedback),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateField(field: keyof PlanFeedbackFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/app/plan-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_saved_plan_id: plan.id,
          usefulness_rating: form.usefulnessRating,
          used_this_week: form.usedThisWeek,
          what_worked: form.whatWorked,
          what_felt_unrealistic: form.whatFeltUnrealistic,
          what_should_shiftplan_remember: form.whatShouldShiftPlanRemember,
          would_use_weekly: form.wouldUseWeekly,
          would_pay_9_month: form.wouldPay9Month,
          additional_notes: form.additionalNotes,
        }),
      });
      const result = (await response.json()) as PlanFeedbackResponse;

      if (!response.ok || !result.feedback) {
        setMessage(result.message || "Could not save feedback right now.");
        setErrors(result.errors || {});
        return;
      }

      onFeedbackSaved(plan.id, result.feedback);
      setForm(createPlanFeedbackForm(result.feedback));
      setMessage("Feedback saved.");
    } catch {
      setMessage("Could not save feedback right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="mt-4 rounded-lg border border-slate-200 bg-white p-4"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <h4 className="text-base font-semibold text-slate-950">
          Give feedback on this plan
        </h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Help tune ShiftPlan for future weekly planning. You can update this
          feedback later.
        </p>
      </div>

      {message ? (
        <p
          className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field
          id={`usefulness-${plan.id}`}
          label="Usefulness rating"
          error={errors.usefulness_rating}
        >
          <select
            id={`usefulness-${plan.id}`}
            value={form.usefulnessRating}
            onChange={(event) =>
              updateField("usefulnessRating", event.target.value)
            }
            className="field-control"
            required
          >
            <option value="">Choose 1-5</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </Field>

        <FeedbackSelect
          id={`used-${plan.id}`}
          label="Used this week"
          value={form.usedThisWeek}
          options={usedThisWeekOptions}
          error={errors.used_this_week}
          onChange={(value) => updateField("usedThisWeek", value)}
        />

        <FeedbackSelect
          id={`would-use-${plan.id}`}
          label="Use weekly?"
          value={form.wouldUseWeekly}
          options={yesNoMaybeOptions}
          error={errors.would_use_weekly}
          onChange={(value) => updateField("wouldUseWeekly", value)}
        />

        <FeedbackSelect
          id={`would-pay-${plan.id}`}
          label="Pay $9/month?"
          value={form.wouldPay9Month}
          options={yesNoMaybeOptions}
          error={errors.would_pay_9_month}
          onChange={(value) => updateField("wouldPay9Month", value)}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextAreaField
          id={`worked-${plan.id}`}
          label="What worked?"
          value={form.whatWorked}
          onChange={(value) => updateField("whatWorked", value)}
        />
        <TextAreaField
          id={`unrealistic-${plan.id}`}
          label="What felt unrealistic?"
          value={form.whatFeltUnrealistic}
          onChange={(value) => updateField("whatFeltUnrealistic", value)}
        />
        <TextAreaField
          id={`remember-${plan.id}`}
          label="What should ShiftPlan remember?"
          value={form.whatShouldShiftPlanRemember}
          onChange={(value) =>
            updateField("whatShouldShiftPlanRemember", value)
          }
        />
        <TextAreaField
          id={`notes-${plan.id}`}
          label="Additional notes"
          value={form.additionalNotes}
          onChange={(value) => updateField("additionalNotes", value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
      >
        {isSaving
          ? "Saving feedback..."
          : plan.feedback
            ? "Update feedback"
            : "Save feedback"}
      </button>
    </form>
  );
}

function FeedbackSelect({
  id,
  label,
  value,
  options,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field id={id} label={label} error={error}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-control"
        required
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Field({
  id,
  label,
  helpText,
  error,
  children,
}: {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>
      {helpText ? (
        <p className="mb-2 text-sm leading-6 text-slate-500">{helpText}</p>
      ) : null}
      {children}
      {error ? (
        <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field id={id} label={label}>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-control min-h-24"
      />
    </Field>
  );
}

function calculateEndDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return "";

  date.setUTCDate(date.getUTCDate() + 6);
  return formatDateInput(date);
}

function parseDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (year < 2024 || year > 2100) return null;

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDateInput(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function formatReadableDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return value;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDateRange(startDate: string, endDate: string) {
  return `${formatReadableDate(startDate)} - ${formatReadableDate(endDate)}`;
}

function canGenerateRequest(request: WeeklyRequest, usage: AppUsageSummary) {
  return (
    request.status !== "generated" &&
    !usage.monthly_limit_reached &&
    !usage.daily_limit_reached
  );
}

function createPlanFeedbackForm(
  feedback?: AppPlanFeedback | null,
): PlanFeedbackFormState {
  if (!feedback) return initialPlanFeedbackForm;

  return {
    usefulnessRating: String(feedback.usefulness_rating),
    usedThisWeek: feedback.used_this_week,
    whatWorked: feedback.what_worked,
    whatFeltUnrealistic: feedback.what_felt_unrealistic,
    whatShouldShiftPlanRemember: feedback.what_should_shiftplan_remember,
    wouldUseWeekly: feedback.would_use_weekly,
    wouldPay9Month: feedback.would_pay_9_month,
    additionalNotes: feedback.additional_notes,
  };
}
