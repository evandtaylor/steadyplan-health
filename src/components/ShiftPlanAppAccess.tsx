"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

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
  work_schedule: string;
  commute_time: string | null;
  main_goal: string;
  meal_prep_needs: string | null;
  workout_training_goals: string | null;
  appointments: string | null;
  errands: string | null;
  family_personal_responsibilities: string | null;
  top_priorities: string | null;
  anything_to_avoid: string | null;
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

type AppUserPreferences = {
  id: string;
  created_at: string;
  updated_at: string;
  app_user_id: string;
  typical_shift_type: string;
  usual_commute_time: string;
  preferred_plan_style: string;
  meal_prep_preferences: string;
  workout_training_preferences: string;
  recurring_responsibilities: string;
  things_to_avoid_after_work: string;
  default_week_start_day: string;
  planning_notes: string;
};

type PreferencesResponse = {
  message?: string;
  preferences?: AppUserPreferences | null;
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
  weekSummary: string;
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

type WeeklyRequestDraft = Omit<
  WeeklyRequestFormState,
  "safetyAcknowledged"
> & {
  weeklyChangeNote: string;
  savedAt: string;
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

type PreferencesFormState = {
  typicalShiftType: string;
  usualCommuteTime: string;
  preferredPlanStyle: string;
  mealPrepPreferences: string;
  workoutTrainingPreferences: string;
  recurringResponsibilities: string;
  thingsToAvoidAfterWork: string;
  defaultWeekStartDay: string;
  planningNotes: string;
};

type ChecklistItem = {
  id: string;
  text: string;
};

type ChecklistGroup = {
  id: string;
  label: string;
  items: ChecklistItem[];
};

const initialWeeklyRequestForm: WeeklyRequestFormState = {
  weekStartDate: "",
  weekSummary: "",
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

const initialPreferencesForm: PreferencesFormState = {
  typicalShiftType: "",
  usualCommuteTime: "",
  preferredPlanStyle: "",
  mealPrepPreferences: "",
  workoutTrainingPreferences: "",
  recurringResponsibilities: "",
  thingsToAvoidAfterWork: "",
  defaultWeekStartDay: "",
  planningNotes: "",
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
const weekStartDayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const futureFeatureOptions = [
  "Interactive checklist",
  "Add to calendar",
  "Weekly reminders",
  "Better mobile layout",
  "Editable plans",
  "Plan history",
  "Today view",
  "iPhone app",
  "Voice input",
];

const safetyCopy =
  "ShiftPlan helps organize your weekly routine around your shift schedule. App-generated AI plans may not be manually reviewed before you see them, and they may contain errors, omissions, unrealistic suggestions, incorrect assumptions, or date and time mistakes. Review and adjust each plan before relying on it. ShiftPlan is for lifestyle and routine planning only. It does not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support. No outcome is guaranteed.";

const safetyAcknowledgmentText =
  "I understand ShiftPlan is for lifestyle and routine organization only. It does not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support. I will not submit protected health information, medication details, diagnoses, symptoms, emergency information, workplace safety complaints, or safety-sensitive details.";

const collapsedPlanLineLimit = 52;

const quickSelectAvoidErrands = "No errands after work.";
const quickSelectLightOffDay =
  "Keep the first off day light with only essential tasks.";
const quickSelectBatchErrands = "Batch errands on an off day.";
const quickSelectSimpleMealPrep =
  "Simple meal prep before the work stretch.";
const quickSelectShortWorkouts = "Short workouts only this week.";

const shiftScheduleTemplates = [
  {
    label: "3x12 days: Mon/Tue/Wed 7a-7p",
    value: "Monday 7a-7p\nTuesday 7a-7p\nWednesday 7a-7p",
  },
  {
    label: "3x12 days: Wed/Thu/Fri 7a-7p",
    value: "Wednesday 7a-7p\nThursday 7a-7p\nFriday 7a-7p",
  },
  {
    label: "3x12 nights: Mon/Tue/Wed 7p-7a",
    value: "Monday 7p-7a\nTuesday 7p-7a\nWednesday 7p-7a",
  },
  {
    label: "3x12 nights: Wed/Thu/Fri 7p-7a",
    value: "Wednesday 7p-7a\nThursday 7p-7a\nFriday 7p-7a",
  },
  {
    label: "4x10s",
    value: "Monday 7a-5p\nTuesday 7a-5p\nWednesday 7a-5p\nThursday 7a-5p",
  },
  {
    label: "Custom / clear",
    value: "",
  },
];

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
    <section className="shiftplan-app-theme shiftplan-dark-form px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-lg bg-teal-400/10 px-3 py-2 text-sm font-semibold uppercase text-teal-200 ring-1 ring-teal-300/20">
            Private beta access
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Open your ShiftPlan app workspace.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            ShiftPlan is in private beta. Use the email and access code you
            were given to open your weekly planning workspace.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/beta/shiftplan"
              className="inline-flex w-full items-center justify-center rounded-lg border border-teal-300/30 bg-teal-300/10 px-5 py-3 text-sm font-semibold text-teal-100 transition hover:bg-teal-300/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300 sm:w-fit"
            >
              Don&apos;t have access? Join the waitlist
            </Link>
          </div>
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
              Have beta access? Log in
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter the exact email and access code from your ShiftPlan beta
              invite. Access codes are private and not the same as a public
              account.
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
  const [lastSavedRequestId, setLastSavedRequestId] = useState("");
  const [requestReuseMessage, setRequestReuseMessage] = useState("");
  const [weeklyChangeNote, setWeeklyChangeNote] = useState("");
  const [isWeeklyDraftLoaded, setIsWeeklyDraftLoaded] = useState(false);
  const [weeklyDraftMessage, setWeeklyDraftMessage] = useState("");
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isSavingRequest, setIsSavingRequest] = useState(false);
  const [preferences, setPreferences] = useState<AppUserPreferences | null>(
    null,
  );
  const [preferencesForm, setPreferencesForm] = useState<PreferencesFormState>(
    initialPreferencesForm,
  );
  const [preferencesErrors, setPreferencesErrors] = useState<
    Record<string, string>
  >({});
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [generatingRequestId, setGeneratingRequestId] = useState("");
  const [generationMessages, setGenerationMessages] = useState<
    Record<string, string>
  >({});
  const [copiedPlanId, setCopiedPlanId] = useState("");
  const [copiedSummaryPlanId, setCopiedSummaryPlanId] = useState("");
  const [copiedChecklistPlanId, setCopiedChecklistPlanId] = useState("");
  const [downloadedCalendarPlanId, setDownloadedCalendarPlanId] = useState("");
  const [calendarDownloadFailedPlanId, setCalendarDownloadFailedPlanId] =
    useState("");
  const [expandedPlanIds, setExpandedPlanIds] = useState<Record<string, boolean>>(
    {},
  );
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
  const weeklyRequestDraftStorageKey = useMemo(
    () => `shiftplan:weekly-request-draft:${normalizeStorageKey(email)}`,
    [email],
  );
  const savedPlans = useMemo(
    () => requests.flatMap((request) => (request.saved_plan ? [request.saved_plan] : [])),
    [requests],
  );
  const hasWeeklyDraftContent = useMemo(
    () => hasWeeklyRequestDraftContent(form, weeklyChangeNote),
    [form, weeklyChangeNote],
  );
  const shouldShowFirstRunPath =
    !isLoadingRequests && requests.length === 0 && savedPlans.length === 0;

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

  const loadPreferences = useCallback(async () => {
    setIsLoadingPreferences(true);

    try {
      const response = await fetch("/api/app/preferences", {
        method: "GET",
      });
      const result = (await response.json()) as PreferencesResponse;

      if (!response.ok) {
        setPreferencesMessage(
          result.message || "Could not load preferences right now.",
        );
        return;
      }

      setPreferences(result.preferences || null);
      setPreferencesForm(createPreferencesForm(result.preferences || null));
    } catch {
      setPreferencesMessage("Could not load preferences right now.");
    } finally {
      setIsLoadingPreferences(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRequests();
      void loadPreferences();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPreferences, loadRequests]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const draft = readStoredWeeklyRequestDraft(weeklyRequestDraftStorageKey);

      if (draft) {
        setForm({
          weekStartDate: draft.weekStartDate,
          weekSummary: draft.weekSummary,
          scheduleType: draft.scheduleType,
          workSchedule: draft.workSchedule,
          commuteTime: draft.commuteTime,
          mainGoal: draft.mainGoal,
          mealPrepNeeds: draft.mealPrepNeeds,
          workoutTrainingGoals: draft.workoutTrainingGoals,
          appointments: draft.appointments,
          errands: draft.errands,
          familyPersonalResponsibilities:
            draft.familyPersonalResponsibilities,
          topPriorities: draft.topPriorities,
          anythingToAvoid: draft.anythingToAvoid,
          preferredPlanStyle: draft.preferredPlanStyle,
          safetyAcknowledged: false,
        });
        setWeeklyChangeNote(draft.weeklyChangeNote);
        setWeeklyDraftMessage("Draft restored on this device.");
      }

      setIsWeeklyDraftLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [weeklyRequestDraftStorageKey]);

  useEffect(() => {
    if (!isWeeklyDraftLoaded) return;

    const timeoutId = window.setTimeout(() => {
      if (!hasWeeklyRequestDraftContent(form, weeklyChangeNote)) {
        clearStoredWeeklyRequestDraft(weeklyRequestDraftStorageKey);
        setWeeklyDraftMessage("");
        return;
      }

      saveWeeklyRequestDraft(
        weeklyRequestDraftStorageKey,
        createWeeklyRequestDraft(form, weeklyChangeNote),
      );
      setWeeklyDraftMessage("Draft saved on this device.");
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [
    form,
    isWeeklyDraftLoaded,
    weeklyChangeNote,
    weeklyRequestDraftStorageKey,
  ]);

  function updateField(
    field: keyof WeeklyRequestFormState,
    value: string | boolean,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setRequestMessage("");
  }

  function setQuickWeekStartDate(value: string) {
    updateField("weekStartDate", value);
  }

  function applyShiftScheduleTemplate(value: string) {
    updateField("workSchedule", value);
  }

  function clearWeeklyRequestDraft() {
    clearStoredWeeklyRequestDraft(weeklyRequestDraftStorageKey);
    setForm(initialWeeklyRequestForm);
    setWeeklyChangeNote("");
    setErrors({});
    setLastSavedRequestId("");
    setRequestReuseMessage("");
    setWeeklyDraftMessage("");
    setRequestMessage("Draft cleared on this device.");
  }

  function handleUseAsStartingPoint(request: WeeklyRequest) {
    setForm({
      weekStartDate: "",
      weekSummary: "",
      scheduleType: request.schedule_type || "",
      workSchedule: request.work_schedule || "",
      commuteTime: request.commute_time || "",
      mainGoal: request.main_goal || "",
      mealPrepNeeds: request.meal_prep_needs || "",
      workoutTrainingGoals: request.workout_training_goals || "",
      appointments: request.appointments || "",
      errands: request.errands || "",
      familyPersonalResponsibilities:
        request.family_personal_responsibilities || "",
      topPriorities: request.top_priorities || "",
      anythingToAvoid: request.anything_to_avoid || "",
      preferredPlanStyle: request.preferred_plan_style || "",
      safetyAcknowledged: false,
    });
    setErrors({});
    setRequestMessage("");
    setWeeklyChangeNote("");
    setRequestReuseMessage(
      "We copied your previous request. Update anything that changed, then save this week's request.",
    );
    setLastSavedRequestId("");
    window.setTimeout(() => {
      document
        .getElementById("weekly-request")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function handlePlanNextWeekFromPlan(request?: WeeklyRequest) {
    if (!request) {
      setRequestReuseMessage(
        "This saved plan does not have request details available. Start a new weekly request and copy over anything still useful.",
      );
      window.setTimeout(() => {
        document
          .getElementById("weekly-request")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return;
    }

    const nextWeekStart = isValidIsoDate(request.week_start_date)
      ? addDaysToIsoDate(request.week_start_date, 7)
      : "";

    setForm({
      weekStartDate: nextWeekStart,
      weekSummary: "",
      scheduleType: request.schedule_type || "",
      workSchedule: request.work_schedule || "",
      commuteTime: request.commute_time || "",
      mainGoal: request.main_goal || "",
      mealPrepNeeds: request.meal_prep_needs || "",
      workoutTrainingGoals: request.workout_training_goals || "",
      appointments: request.appointments || "",
      errands: request.errands || "",
      familyPersonalResponsibilities:
        request.family_personal_responsibilities || "",
      topPriorities: request.top_priorities || "",
      anythingToAvoid: request.anything_to_avoid || "",
      preferredPlanStyle: request.preferred_plan_style || "",
      safetyAcknowledged: false,
    });
    setErrors({});
    setRequestMessage("");
    setWeeklyChangeNote("");
    setRequestReuseMessage(
      "We copied this plan's request. Update what changed, then save next week's request.",
    );
    setLastSavedRequestId("");
    window.setTimeout(() => {
      document
        .getElementById("weekly-request")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function updatePreferenceField(
    field: keyof PreferencesFormState,
    value: string,
  ) {
    setPreferencesForm((current) => ({ ...current, [field]: value }));
    setPreferencesErrors((current) => ({ ...current, [field]: "" }));
    setPreferencesMessage("");
  }

  function applyWeeklyHelperChip(
    chip:
      | "commute"
      | "meal-preferences"
      | "workout-preferences"
      | "no-errands-after-work"
      | "light-first-off-day"
      | "batch-errands"
      | "simple-meal-prep"
      | "short-workouts",
  ) {
    if (chip === "commute" && preferences?.usual_commute_time) {
      updateField("commuteTime", preferences.usual_commute_time);
      return;
    }

    if (chip === "meal-preferences" && preferences?.meal_prep_preferences) {
      updateField("mealPrepNeeds", preferences.meal_prep_preferences);
      return;
    }

    if (
      chip === "workout-preferences" &&
      preferences?.workout_training_preferences
    ) {
      updateField("workoutTrainingGoals", preferences.workout_training_preferences);
      return;
    }

    if (chip === "no-errands-after-work") {
      updateField(
        "anythingToAvoid",
        appendUniqueText(form.anythingToAvoid, quickSelectAvoidErrands),
      );
      return;
    }

    if (chip === "batch-errands") {
      updateField("errands", appendUniqueText(form.errands, quickSelectBatchErrands));
      return;
    }

    if (chip === "simple-meal-prep") {
      updateField(
        "mealPrepNeeds",
        appendUniqueText(form.mealPrepNeeds, quickSelectSimpleMealPrep),
      );
      return;
    }

    if (chip === "short-workouts") {
      updateField(
        "workoutTrainingGoals",
        appendUniqueText(form.workoutTrainingGoals, quickSelectShortWorkouts),
      );
      return;
    }

    updateField(
      "topPriorities",
      appendUniqueText(form.topPriorities, quickSelectLightOffDay),
    );
  }

  async function handlePreferencesSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingPreferences) return;

    setIsSavingPreferences(true);
    setPreferencesErrors({});
    setPreferencesMessage("");

    try {
      const response = await fetch("/api/app/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          typical_shift_type: preferencesForm.typicalShiftType,
          usual_commute_time: preferencesForm.usualCommuteTime,
          preferred_plan_style: preferencesForm.preferredPlanStyle,
          meal_prep_preferences: preferencesForm.mealPrepPreferences,
          workout_training_preferences:
            preferencesForm.workoutTrainingPreferences,
          recurring_responsibilities:
            preferencesForm.recurringResponsibilities,
          things_to_avoid_after_work:
            preferencesForm.thingsToAvoidAfterWork,
          default_week_start_day: preferencesForm.defaultWeekStartDay,
          planning_notes: preferencesForm.planningNotes,
        }),
      });
      const result = (await response.json()) as PreferencesResponse;

      if (!response.ok || !result.preferences) {
        setPreferencesMessage(
          result.message || "Could not save preferences right now.",
        );
        setPreferencesErrors(result.errors || {});
        return;
      }

      setPreferences(result.preferences);
      setPreferencesForm(createPreferencesForm(result.preferences));
      setPreferencesMessage("Preferences saved.");
    } catch {
      setPreferencesMessage("Could not save preferences right now.");
    } finally {
      setIsSavingPreferences(false);
    }
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
          main_goal: buildMainGoalWithWeeklyContext(
            form.mainGoal,
            form.weekSummary,
            weeklyChangeNote,
          ),
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
      clearStoredWeeklyRequestDraft(weeklyRequestDraftStorageKey);
      setForm(initialWeeklyRequestForm);
      setWeeklyChangeNote("");
      setWeeklyDraftMessage("");
      setLastSavedRequestId(result.request.id);
      setRequestMessage("Weekly request saved.");
      setRequestReuseMessage("");
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

  async function handleCopyWeekSummary(plan: AppSavedPlan) {
    try {
      await navigator.clipboard.writeText(buildWeekSummary(plan));
      setCopiedSummaryPlanId(plan.id);
      window.setTimeout(() => setCopiedSummaryPlanId(""), 1800);
    } catch {
      setCopiedSummaryPlanId("");
    }
  }

  async function handleCopyChecklist(plan: AppSavedPlan) {
    const checklistText = buildChecklistCopyText(plan.plan_body);
    if (!checklistText) return;

    try {
      await navigator.clipboard.writeText(checklistText);
      setCopiedChecklistPlanId(plan.id);
      window.setTimeout(() => setCopiedChecklistPlanId(""), 1800);
    } catch {
      setCopiedChecklistPlanId("");
    }
  }

  function handleDownloadCalendar(plan: AppSavedPlan, request?: WeeklyRequest) {
    try {
      const calendarText = buildCalendarFile(plan, request);
      const blob = new Blob([calendarText], {
        type: "text/calendar;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = buildCalendarFileName(plan);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setCalendarDownloadFailedPlanId("");
      setDownloadedCalendarPlanId(plan.id);
      window.setTimeout(() => setDownloadedCalendarPlanId(""), 1800);
    } catch {
      setDownloadedCalendarPlanId("");
      setCalendarDownloadFailedPlanId(plan.id);
      window.setTimeout(() => setCalendarDownloadFailedPlanId(""), 2200);
    }
  }

  function togglePlanExpanded(planId: string) {
    setExpandedPlanIds((current) => ({
      ...current,
      [planId]: !current[planId],
    }));
  }

  function scrollToPlanFeedback(planId: string) {
    document
      .getElementById(buildPlanFeedbackId(planId))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <section className="shiftplan-app-theme shiftplan-dark-form min-h-[70vh] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase text-teal-700">
            ShiftPlan app
          </p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                Welcome{firstName ? `, ${firstName}` : ""}.
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Saved preferences are your defaults. This week&apos;s request is
                only what changed.
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Signed in as {email}
              </p>
            </div>
            <a
              href="#weekly-request"
              className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
            >
              Start This Week&apos;s Request
            </a>
          </div>
        </div>

        <nav
          aria-label="App dashboard shortcuts"
          className="mt-4 flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
        >
          {[
            ["New Request", "#weekly-request"],
            ["Reuse Last Week", "#recent-requests"],
            ["Defaults", "#app-preferences"],
            ["Saved Plans", "#saved-plans"],
            ["Feedback", "#saved-plans"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="shrink-0 rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col">
          {shouldShowFirstRunPath ? (
            <article className="order-0 mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-teal-800">
                    First time here?
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">
                    Start with one real week.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-950">
                    Create a weekly request first. Saved defaults can help
                    later, but your exact shifts are the main thing ShiftPlan
                    needs.
                  </p>
                </div>
                <a
                  href="#weekly-request"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
                >
                  Start with this week
                </a>
              </div>
            </article>
          ) : null}

        <article className="order-1 mt-4 rounded-lg border border-teal-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                Private beta
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">
                Start here
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use this path the first time you test ShiftPlan.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href="#weekly-request"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
                >
                  Create this week
                </a>
                <a
                  href="#saved-plans"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
                >
                  Already used ShiftPlan? View saved plans
                </a>
              </div>
            </div>
            <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 lg:max-w-sm">
              Review dates, shift times, and assumptions before using a plan.
            </p>
          </div>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 md:grid-cols-3">
            {[
              "Save your defaults",
              "Create this week's request",
              "Generate and review your plan",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 rounded-lg bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="order-5 mt-6 rounded-lg border border-slate-200 bg-slate-950 p-4 text-white shadow-sm sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-200">
                iPhone quick access
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Use ShiftPlan like an app.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Add ShiftPlan to your iPhone Home Screen for quicker access.
              </p>
            </div>
            <ol className="grid gap-3 text-sm leading-6 text-slate-200 sm:grid-cols-3">
              {["Open in Safari", "Tap Share", "Tap Add to Home Screen"].map(
                (step, index) => (
                  <li
                    key={step}
                    className="rounded-lg border border-white/10 bg-white/[0.06] p-3"
                  >
                    <span className="text-xs font-semibold uppercase text-teal-200">
                      Step {index + 1}
                    </span>
                    <span className="mt-1 block font-semibold text-white">
                      {step}
                    </span>
                  </li>
                ),
              )}
            </ol>
          </div>
        </article>

        <div className="order-4 mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <article
            id="saved-plans"
            className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
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
              <GuidanceCard
                title="No saved plans yet"
                body="Create your first weekly request, then generate a ShiftPlan. Saved plans will appear here so you can review, copy, reuse, and leave feedback."
              />
            ) : (
              <div className="mt-4 grid gap-4">
                {savedPlans.map((plan) => {
                  const planRequest = requests.find(
                    (request) => request.id === plan.plan_request_id,
                  );
                  const hasInteractiveChecklist =
                    parseChecklistGroups(plan.plan_body).length > 0;
                  const planTitle = plan.plan_title || "Generated weekly plan";
                  const planDateRange = formatDateRange(
                    plan.week_start_date,
                    plan.week_end_date,
                  );

                  return (
                    <article
                      key={plan.id}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="border-b border-slate-800 bg-slate-950 p-4 text-white sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">
                              Saved ShiftPlan
                            </p>
                            <h3 className="mt-2 text-xl font-semibold leading-7 text-white">
                              {planTitle}
                            </h3>
                            <p className="mt-1 text-sm font-semibold text-slate-300">
                              {planDateRange}
                            </p>
                            <p className="mt-3 max-w-2xl rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-50">
                              AI-generated draft. Review dates, shift times,
                              appointments, assumptions, and fit before using
                              it.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                            <button
                              type="button"
                              onClick={() => void handleCopyWeekSummary(plan)}
                              className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-teal-300 hover:bg-teal-300/15 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                            >
                              {copiedSummaryPlanId === plan.id
                                ? "Copied"
                                : "Copy Summary"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleCopyPlan(plan)}
                              className="inline-flex w-full items-center justify-center rounded-lg border border-teal-300/70 bg-teal-300/15 px-3 py-2 text-sm font-semibold text-teal-50 transition hover:bg-teal-300/25 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                            >
                              {copiedPlanId === plan.id ? "Copied" : "Copy Plan"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleCopyChecklist(plan)}
                              disabled={!hasInteractiveChecklist}
                              className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-teal-300 hover:bg-teal-300/15 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500 sm:w-fit"
                            >
                              {copiedChecklistPlanId === plan.id
                                ? "Copied"
                                : "Copy Checklist"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDownloadCalendar(plan, planRequest)
                              }
                              className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-teal-300 hover:bg-teal-300/15 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                            >
                              {calendarDownloadFailedPlanId === plan.id
                                ? "Download failed"
                                : downloadedCalendarPlanId === plan.id
                                  ? "Downloaded"
                                  : "Download Calendar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollToPlanFeedback(plan.id)}
                              className="col-span-2 inline-flex w-full items-center justify-center rounded-lg border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-300/20 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                            >
                              Was this plan useful?
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePlanNextWeekFromPlan(planRequest)
                              }
                              className="col-span-2 inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-teal-300 hover:bg-teal-300/15 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                            >
                              Plan next week from this
                            </button>
                          </div>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-slate-400">
                          Downloads an .ics file with all-day ShiftPlan plan
                          events. Review times before relying on it. No
                          automatic reminders are added.
                        </p>
                        <CalendarExportPreview plan={plan} />
                        <GeneratedPlanReviewChecklist />
                      </div>

                    <div className="grid gap-4 p-4 sm:p-5">
                      <SavedPlanQuickView plan={plan} />

                      <section aria-label="Plan content">
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="text-base font-semibold text-slate-950">
                            Timeline
                          </h4>
                          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Review, then use the checklist
                          </span>
                        </div>
                        <PlanBody
                          body={plan.plan_body}
                          isExpanded={Boolean(expandedPlanIds[plan.id])}
                          hideChecklistSection={hasInteractiveChecklist}
                        />
                        {isLongPlanBody(plan.plan_body) ? (
                          <button
                            type="button"
                            onClick={() => togglePlanExpanded(plan.id)}
                            className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
                          >
                            {expandedPlanIds[plan.id]
                              ? "Show less"
                              : "Show full plan"}
                          </button>
                        ) : null}
                        <InteractiveChecklist
                          planId={plan.id}
                          planBody={plan.plan_body}
                        />
                      </section>

                      <section
                        id={buildPlanFeedbackId(plan.id)}
                        aria-label="Feedback"
                        className="scroll-mt-28 border-t border-slate-200 pt-4"
                      >
                        <PlanFeedbackForm
                          plan={plan}
                          onFeedbackSaved={handleFeedbackSaved}
                        />
                      </section>
                    </div>
                  </article>
                  );
                })}
              </div>
            )}
          </article>
        </div>

        <section
          id="app-preferences"
          className="order-3 mt-6 scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                Saved defaults
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                What ShiftPlan should remember most weeks
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Saved preferences are your defaults. This week&apos;s request is
                only what changed.
              </p>
              {!isLoadingPreferences && !preferences ? (
                <p className="mt-3 rounded-lg border border-dashed border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
                  Optional, but useful: add your usual commute, planning style,
                  meal prep defaults, and recurring responsibilities once.
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                {isLoadingPreferences
                  ? "Loading"
                  : preferences
                    ? "Defaults saved"
                    : "Optional"}
              </span>
              <button
                type="button"
                onClick={() => setIsPreferencesOpen((current) => !current)}
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
                aria-expanded={isPreferencesOpen}
                aria-controls="saved-preferences-form"
              >
                {isPreferencesOpen ? "Hide defaults" : "Edit defaults"}
              </button>
            </div>
          </div>

          {preferencesMessage ? (
            <p
              className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950"
              role="status"
            >
              {preferencesMessage}
            </p>
          ) : null}

          {isPreferencesOpen ? (
          <form
            id="saved-preferences-form"
            className="mt-5 grid gap-5"
            onSubmit={handlePreferencesSubmit}
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-3">
              <Field
                id="typicalShiftType"
                label="Usual shift pattern"
                helpText="Pick the schedule pattern ShiftPlan should assume most weeks."
                error={preferencesErrors.typical_shift_type}
              >
                <select
                  id="typicalShiftType"
                  value={preferencesForm.typicalShiftType}
                  onChange={(event) =>
                    updatePreferenceField(
                      "typicalShiftType",
                      event.target.value,
                    )
                  }
                  className="field-control"
                >
                  <option value="">Choose one</option>
                  {scheduleTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="usualCommuteTime"
                label="Usual commute"
                helpText="Example: 25 minutes each way, plus 10 minutes to park or change."
              >
                <input
                  id="usualCommuteTime"
                  value={preferencesForm.usualCommuteTime}
                  onChange={(event) =>
                    updatePreferenceField(
                      "usualCommuteTime",
                      event.target.value,
                    )
                  }
                  className="field-control"
                />
              </Field>

              <Field
                id="savedPreferredPlanStyle"
                label="Default plan style"
                helpText="Choose how much structure you usually want in your weekly plan."
                error={preferencesErrors.preferred_plan_style}
              >
                <select
                  id="savedPreferredPlanStyle"
                  value={preferencesForm.preferredPlanStyle}
                  onChange={(event) =>
                    updatePreferenceField(
                      "preferredPlanStyle",
                      event.target.value,
                    )
                  }
                  className="field-control"
                >
                  <option value="">Choose one</option>
                  {planStyleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="defaultWeekStartDay"
                label="Default week start day"
                helpText="Example: Monday if you usually plan Monday through Sunday."
                error={preferencesErrors.default_week_start_day}
              >
                <select
                  id="defaultWeekStartDay"
                  value={preferencesForm.defaultWeekStartDay}
                  onChange={(event) =>
                    updatePreferenceField(
                      "defaultWeekStartDay",
                      event.target.value,
                    )
                  }
                  className="field-control"
                >
                  <option value="">Choose one</option>
                  {weekStartDayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <TextAreaField
                id="savedMealPrepPreferences"
                label="Usual meal prep"
                helpText="Example: simple high-protein meals, chicken/rice, yogurt, no cooking after shifts."
                value={preferencesForm.mealPrepPreferences}
                onChange={(value) =>
                  updatePreferenceField("mealPrepPreferences", value)
                }
              />
              <TextAreaField
                id="savedWorkoutTrainingPreferences"
                label="Usual workout or training"
                helpText="Example: strength on first off day, short workouts only during work stretches."
                value={preferencesForm.workoutTrainingPreferences}
                onChange={(value) =>
                  updatePreferenceField("workoutTrainingPreferences", value)
                }
              />
              <TextAreaField
                id="savedRecurringResponsibilities"
                label="Recurring life tasks"
                helpText="Example: school pickup on confirmed days, laundry weekly, family dinner Sunday."
                value={preferencesForm.recurringResponsibilities}
                onChange={(value) =>
                  updatePreferenceField("recurringResponsibilities", value)
                }
              />
              <TextAreaField
                id="thingsToAvoidAfterWork"
                label="Avoid after work"
                helpText="Example: no errands, no workouts, no big chores after 12-hour shifts."
                value={preferencesForm.thingsToAvoidAfterWork}
                onChange={(value) =>
                  updatePreferenceField("thingsToAvoidAfterWork", value)
                }
              />
            </div>

            <TextAreaField
              id="planningNotes"
              label="Other defaults"
              helpText="Example: keep plans realistic, leave buffer on transition days, avoid overpacking off days."
              value={preferencesForm.planningNotes}
              onChange={(value) => updatePreferenceField("planningNotes", value)}
            />

            <button
              type="submit"
              disabled={isSavingPreferences}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
            >
              {isSavingPreferences ? "Saving..." : "Save preferences"}
            </button>
          </form>
          ) : null}
        </section>

        <div
          id="weekly-request"
          className="order-2 mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
        >
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                This week
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Create this week&apos;s ShiftPlan
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add the real schedule and anything different this week. Saved
                defaults fill in the usual stuff.
              </p>
              {requestReuseMessage ? (
                <p className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
                  {requestReuseMessage}
                </p>
              ) : null}
              <p className="mt-3 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
                Saved preferences are your defaults. This week&apos;s request is
                only what changed.
              </p>
            </div>

            {requestMessage ? (
              <div
                className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950"
                role="status"
              >
                {requestMessage}
              </div>
            ) : null}

            {requestMessage === "Weekly request saved." &&
            lastSavedRequestId ? (
              <div className="mt-4 rounded-lg border border-teal-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">
                  Request saved. Next: generate your ShiftPlan.
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Your saved request is waiting in the recent requests list.
                </p>
                <a
                  href={`#weekly-request-${lastSavedRequestId}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
                >
                  Find the Generate button
                </a>
              </div>
            ) : null}

            <form
              className="mt-6 grid gap-5"
              onSubmit={handleWeeklyRequestSubmit}
              noValidate
            >
              <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {weeklyDraftMessage ||
                    "Draft saves on this device as you type."}
                </span>
                <button
                  type="button"
                  onClick={clearWeeklyRequestDraft}
                  disabled={!hasWeeklyDraftContent}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-fit"
                >
                  Clear draft
                </button>
              </div>

              <Field
                id="weekSummary"
                label="Tell ShiftPlan your week"
                helpText="Short on time? Type a quick summary here, then fill in anything important below."
              >
                <textarea
                  id="weekSummary"
                  name="weekSummary"
                  value={form.weekSummary}
                  onChange={(event) =>
                    updateField("weekSummary", event.target.value)
                  }
                  className="field-control min-h-24"
                />
              </Field>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Quick adds
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <QuickSelectButton
                    label="Use saved commute"
                    disabled={!preferences?.usual_commute_time}
                    onClick={() => applyWeeklyHelperChip("commute")}
                  />
                  <QuickSelectButton
                    label="Use saved meal preferences"
                    disabled={!preferences?.meal_prep_preferences}
                    onClick={() => applyWeeklyHelperChip("meal-preferences")}
                  />
                  <QuickSelectButton
                    label="Use saved workout preferences"
                    disabled={!preferences?.workout_training_preferences}
                    onClick={() => applyWeeklyHelperChip("workout-preferences")}
                  />
                  <QuickSelectButton
                    label="No errands after work"
                    onClick={() => applyWeeklyHelperChip("no-errands-after-work")}
                  />
                  <QuickSelectButton
                    label="Keep first off day light"
                    onClick={() => applyWeeklyHelperChip("light-first-off-day")}
                  />
                  <QuickSelectButton
                    label="Batch errands on an off day"
                    onClick={() => applyWeeklyHelperChip("batch-errands")}
                  />
                  <QuickSelectButton
                    label="Simple meal prep before work stretch"
                    onClick={() => applyWeeklyHelperChip("simple-meal-prep")}
                  />
                  <QuickSelectButton
                    label="Short workouts only this week"
                    onClick={() => applyWeeklyHelperChip("short-workouts")}
                  />
                </div>
              </div>

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
                  <div
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label="Quick week start dates"
                  >
                    <QuickSelectButton
                      label="Today"
                      onClick={() => setQuickWeekStartDate(getLocalIsoDate())}
                    />
                    <QuickSelectButton
                      label="Next Monday"
                      onClick={() =>
                        setQuickWeekStartDate(getUpcomingWeekdayIsoDate(1))
                      }
                    />
                    <QuickSelectButton
                      label="Next Sunday"
                      onClick={() =>
                        setQuickWeekStartDate(getUpcomingWeekdayIsoDate(0))
                      }
                    />
                    <QuickSelectButton
                      label="Next week"
                      onClick={() =>
                        setQuickWeekStartDate(
                          addDaysToIsoDate(
                            isValidIsoDate(form.weekStartDate)
                              ? form.weekStartDate
                              : getLocalIsoDate(),
                            7,
                          ),
                        )
                      }
                    />
                  </div>
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
                label="This week's work schedule"
                helpText="Example: Monday 7a-7p, Tuesday 7a-7p, Wednesday 7a-7p."
                error={errors.work_schedule}
              >
                <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Quick-fill a common pattern
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pick a template, then edit the exact days and times below.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {shiftScheduleTemplates.map((template) => (
                      <QuickSelectButton
                        key={template.label}
                        label={template.label}
                        onClick={() =>
                          applyShiftScheduleTemplate(template.value)
                        }
                      />
                    ))}
                  </div>
                </div>
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
                <Field
                  id="commuteTime"
                  label="Commute this week"
                  helpText="Only add this if it changed from your saved default."
                >
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
                label="What matters most this week?"
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

              {requestReuseMessage ? (
                <Field
                  id="weeklyChangeNote"
                  label="What changed from the last plan?"
                  helpText="Optional. Add what is different this week so the new request does not feel like a stale copy."
                >
                  <textarea
                    id="weeklyChangeNote"
                    name="weeklyChangeNote"
                    value={weeklyChangeNote}
                    onChange={(event) => setWeeklyChangeNote(event.target.value)}
                    className="field-control min-h-24"
                  />
                </Field>
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                <TextAreaField
                  id="mealPrepNeeds"
                  label="Meal changes this week"
                  helpText="Example: Need lunches for three shifts; no big grocery run until Friday."
                  value={form.mealPrepNeeds}
                  onChange={(value) => updateField("mealPrepNeeds", value)}
                />
                <TextAreaField
                  id="workoutTrainingGoals"
                  label="Workout changes this week"
                  helpText="Example: One short strength session and one walk if the week allows."
                  value={form.workoutTrainingGoals}
                  onChange={(value) =>
                    updateField("workoutTrainingGoals", value)
                  }
                />
                <TextAreaField
                  id="appointments"
                  label="Appointments this week"
                  helpText="Example: Dentist Friday 10a, haircut Saturday afternoon."
                  value={form.appointments}
                  onChange={(value) => updateField("appointments", value)}
                />
                <TextAreaField
                  id="errands"
                  label="Errands this week"
                  helpText="Example: Groceries, pharmacy pickup, return package."
                  value={form.errands}
                  onChange={(value) => updateField("errands", value)}
                />
                <TextAreaField
                  id="familyPersonalResponsibilities"
                  label="People or home responsibilities"
                  helpText="Example: School event Thursday, family dinner Sunday."
                  value={form.familyPersonalResponsibilities}
                  onChange={(value) =>
                    updateField("familyPersonalResponsibilities", value)
                  }
                />
                <TextAreaField
                  id="topPriorities"
                  label="Top priorities this week"
                  helpText="Example: Keep workdays simple, batch errands Friday, prep before first shift."
                  value={form.topPriorities}
                  onChange={(value) => updateField("topPriorities", value)}
                />
              </div>

              <Field
                id="anythingToAvoid"
                label="Anything to avoid this week"
                helpText="Example: No errands after work; avoid stacking chores on the first off day."
              >
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
                  {isSavingRequest ? "Saving..." : "Save This Week's Request"}
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

          <section
            id="recent-requests"
            className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-xl font-semibold text-slate-950">
              Continue from a previous week
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Reuse a saved request when this week is mostly the same.
            </p>
            {isLoadingRequests ? (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Loading requests...
              </p>
            ) : requests.length === 0 ? (
              <GuidanceCard
                title="No weekly requests yet"
                body="Create your first weekly request with exact shift days and anything different this week. Saved defaults can fill in the usual details later."
              />
            ) : (
              <div className="mt-4 grid gap-3">
                {requests.map((request) => (
                  <article
                    key={request.id}
                    id={`weekly-request-${request.id}`}
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
                    <button
                      type="button"
                      onClick={() => handleUseAsStartingPoint(request)}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-fit"
                    >
                      Use as starting point
                    </button>
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

        <aside className="order-6 mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-blue-950">Safety note</p>
          <p className="mt-2">{safetyCopy}</p>
        </aside>
        </div>
      </div>
    </section>
  );
}

function GuidanceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2">{body}</p>
    </div>
  );
}

function QuickSelectButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-full border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
    >
      {label}
    </button>
  );
}

function buildCalendarFile(plan: AppSavedPlan, request?: WeeklyRequest) {
  const dateList = buildPlanDateList(plan.week_start_date, plan.week_end_date);
  if (dateList.length === 0) {
    throw new Error("Cannot build calendar without a valid date range.");
  }

  const checklistGroups = parseChecklistGroups(plan.plan_body);
  const generalGroup = checklistGroups.find((group) => group.label === "General");
  const timestamp = formatIcsTimestamp(new Date());
  const events = dateList.map((day, index) => {
    const matchingGroup = checklistGroups.find(
      (group) =>
        group.label !== "General" &&
        normalizeChecklistKey(group.label).startsWith(
          normalizeChecklistKey(day.weekday),
        ),
    );
    const items = matchingGroup?.items || [];
    const generalItems = index === 0 ? generalGroup?.items || [] : [];
    const daySummary = buildCalendarDaySummary(plan.plan_body, day.weekday);
    const descriptionParts = [
      "Generated by ShiftPlan. Review dates, times, and assumptions before relying on this draft.",
      `Plan day: ${formatCompactReadableDate(day.date)}`,
      request?.work_schedule
        ? `Submitted work schedule: ${request.work_schedule}`
        : "",
      daySummary ? `Day summary:\n${daySummary}` : "",
      items.length > 0
        ? `Checklist:\n${items.map((item) => `- ${item.text}`).join("\n")}`
        : "Review the saved ShiftPlan for this day.",
      generalItems.length > 0
        ? `General notes:\n${generalItems
            .map((item) => `- ${item.text}`)
            .join("\n")}`
        : "",
      "No automatic reminders are added.",
    ].filter(Boolean);

    return buildAllDayIcsEvent({
      uid: `shiftplan-${plan.id}-${day.date}@shiftplan.ai`,
      timestamp,
      date: day.date,
      summary: `ShiftPlan: ${day.weekday} Plan`,
      description: descriptionParts.join("\n\n"),
    });
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ShiftPlan//ShiftPlan App//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function buildCalendarFileName(plan: AppSavedPlan) {
  const dateLabel = isValidIsoDate(plan.week_start_date)
    ? plan.week_start_date
    : "week";

  return `shiftplan-week-${dateLabel}.ics`;
}

function buildAllDayIcsEvent({
  uid,
  timestamp,
  date,
  summary,
  description,
}: {
  uid: string;
  timestamp: string;
  date: string;
  summary: string;
  description: string;
}) {
  return [
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${formatIcsDate(date)}`,
    `DTEND;VALUE=DATE:${formatIcsDate(addDaysToIsoDate(date, 1))}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
  ].join("\r\n");
}

function buildPlanDateList(startDate: string, endDate: string) {
  if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) return [];

  const dates: Array<{ date: string; weekday: string }> = [];
  let currentDate = startDate;

  for (let index = 0; index < 7; index += 1) {
    if (currentDate > endDate) break;

    dates.push({
      date: currentDate,
      weekday: formatWeekday(currentDate),
    });
    currentDate = addDaysToIsoDate(currentDate, 1);
  }

  return dates;
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function addDaysToIsoDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatWeekday(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatIcsDate(value: string) {
  return value.replace(/-/g, "");
}

function formatIcsTimestamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildWeekSummary(plan: AppSavedPlan) {
  const title = plan.plan_title || "Generated weekly ShiftPlan";
  const dateRange = formatDateRange(plan.week_start_date, plan.week_end_date);
  const snapshot = extractPlanSection(plan.plan_body, "Week Snapshot");
  const fallback = plan.plan_body
    .split(/\r?\n/)
    .map(cleanSummaryLine)
    .filter(Boolean)
    .slice(0, 6);
  const summaryLines = snapshot.length > 0 ? snapshot : fallback;

  return [
    title,
    dateRange,
    "",
    "Week summary:",
    ...summaryLines.map((line) => (line.startsWith("-") ? line : `- ${line}`)),
  ].join("\n");
}

function buildChecklistCopyText(body: string) {
  return parseChecklistGroups(body)
    .map((group) => {
      const groupLines = group.items.map((item) => `[ ] ${item.text}`);

      return [group.label, ...groupLines].join("\n");
    })
    .join("\n\n");
}

function buildCalendarPreviewEvents(plan: AppSavedPlan) {
  return buildPlanDateList(plan.week_start_date, plan.week_end_date).map(
    (day) => ({
      date: day.date,
      title: `ShiftPlan: ${day.weekday} Plan`,
      timing: "All-day",
    }),
  );
}

function buildCalendarDaySummary(body: string, weekday: string) {
  const lines = body.split(/\r?\n/);
  const summaryLines: string[] = [];
  let isInDay = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const dayLabel = extractDayLabel(trimmed);

    if (dayLabel) {
      if (isInDay) break;
      isInDay =
        normalizeChecklistKey(dayLabel).startsWith(
          normalizeChecklistKey(weekday),
        );
      continue;
    }

    if (!isInDay || !trimmed || isChecklistSectionHeading(trimmed)) continue;
    if (isLikelyPlanHeading(trimmed) && summaryLines.length > 0) break;

    const cleaned = cleanSummaryLine(trimmed);
    if (cleaned && !/^\[[ xX]\]/.test(cleaned)) {
      summaryLines.push(cleaned);
    }

    if (summaryLines.length >= 4) break;
  }

  return summaryLines.map((line) => `- ${line}`).join("\n");
}

function buildPlanFeedbackId(planId: string) {
  return `plan-feedback-${planId}`;
}

function buildSavedPlanQuickView(plan: AppSavedPlan) {
  const today = getLocalIsoDate();
  const dateList = buildPlanDateList(plan.week_start_date, plan.week_end_date);
  const fallback = {
    title: "Next up",
    dateLabel: "",
    groupLabel: "",
    items: [] as ChecklistItem[],
    moreCount: 0,
    message: "Open the full plan below.",
  };

  if (dateList.length === 0) return fallback;

  const todayDay = dateList.find((day) => day.date === today);
  const upcomingDay = dateList.find((day) => day.date > today);
  const targetDay = todayDay || upcomingDay;

  if (!targetDay) {
    return {
      ...fallback,
      message:
        "This saved plan is outside today's date range. Open the full plan below.",
    };
  }

  const group = findChecklistGroupForDate(
    parseChecklistGroups(plan.plan_body),
    targetDay,
  );
  const items = group?.items.slice(0, 4) || [];

  if (!group || items.length === 0) {
    return {
      ...fallback,
      title: todayDay ? "Today" : "Next up",
      dateLabel: formatCompactReadableDate(targetDay.date),
      groupLabel: "",
      message: "Open the full plan below.",
    };
  }

  return {
    title: todayDay ? "Today" : "Next up",
    dateLabel: formatCompactReadableDate(targetDay.date),
    groupLabel: group.label,
    items,
    moreCount: group.items.length - items.length,
    message: "",
  };
}

function findChecklistGroupForDate(
  groups: ChecklistGroup[],
  day: { date: string; weekday: string },
) {
  const weekdayKey = normalizeChecklistKey(day.weekday);

  return groups.find(
    (group) =>
      group.label !== "General" &&
      normalizeChecklistKey(group.label).startsWith(weekdayKey),
  );
}

function getLocalIsoDate() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getUpcomingWeekdayIsoDate(targetDay: number) {
  const date = new Date();
  const todayDay = date.getDay();
  const daysUntilTarget = (targetDay - todayDay + 7) % 7 || 7;

  date.setDate(date.getDate() + daysUntilTarget);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatCompactReadableDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return value;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function extractPlanSection(body: string, heading: string) {
  const lines = body.split(/\r?\n/);
  const sectionLines: string[] = [];
  let isInSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const normalizedHeading = trimmed
      .replace(/^#{1,4}\s+/, "")
      .replace(/:$/, "")
      .toLowerCase();

    if (normalizedHeading === heading.toLowerCase()) {
      isInSection = true;
      continue;
    }

    if (isInSection && isLikelyPlanHeading(trimmed)) break;

    if (isInSection) {
      const cleaned = cleanSummaryLine(trimmed);
      if (cleaned) sectionLines.push(cleaned);
    }
  }

  return sectionLines.slice(0, 6);
}

function isLikelyPlanHeading(value: string) {
  if (!value) return false;
  if (/^#{1,4}\s+/.test(value)) return true;
  return value.endsWith(":") && value.length < 80;
}

function cleanSummaryLine(value: string) {
  return value
    .replace(/^#{1,4}\s+/, "")
    .replace(/^[-*•]\s*/, "")
    .replace(/^(?:\[[ xX]\]|[☐☑])\s*/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();
}

function buildMainGoalWithWeeklyContext(
  mainGoal: string,
  weekSummary: string,
  changeNote: string,
) {
  const trimmedGoal = mainGoal.trim();
  const trimmedSummary = weekSummary.trim();
  const trimmedChange = changeNote.trim();
  const contextParts = [trimmedGoal];

  if (trimmedSummary) {
    contextParts.push("", "Tell ShiftPlan your week:", trimmedSummary);
  }

  if (trimmedChange) {
    contextParts.push("", "What changed from the last plan:", trimmedChange);
  }

  return contextParts.join("\n");
}

function appendUniqueText(currentValue: string, nextValue: string) {
  const current = currentValue.trim();
  const next = nextValue.trim();

  if (!next) return current;
  if (current.toLowerCase().includes(next.toLowerCase())) return current;
  if (!current) return next;

  return `${current}\n${next}`;
}

function normalizeStorageKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "local";
}

function createWeeklyRequestDraft(
  form: WeeklyRequestFormState,
  weeklyChangeNote: string,
): WeeklyRequestDraft {
  return {
    weekStartDate: form.weekStartDate,
    weekSummary: form.weekSummary,
    scheduleType: form.scheduleType,
    workSchedule: form.workSchedule,
    commuteTime: form.commuteTime,
    mainGoal: form.mainGoal,
    mealPrepNeeds: form.mealPrepNeeds,
    workoutTrainingGoals: form.workoutTrainingGoals,
    appointments: form.appointments,
    errands: form.errands,
    familyPersonalResponsibilities: form.familyPersonalResponsibilities,
    topPriorities: form.topPriorities,
    anythingToAvoid: form.anythingToAvoid,
    preferredPlanStyle: form.preferredPlanStyle,
    weeklyChangeNote,
    savedAt: new Date().toISOString(),
  };
}

function hasWeeklyRequestDraftContent(
  form: WeeklyRequestFormState,
  weeklyChangeNote: string,
) {
  return [
    form.weekStartDate,
    form.weekSummary,
    form.scheduleType,
    form.workSchedule,
    form.commuteTime,
    form.mainGoal,
    form.mealPrepNeeds,
    form.workoutTrainingGoals,
    form.appointments,
    form.errands,
    form.familyPersonalResponsibilities,
    form.topPriorities,
    form.anythingToAvoid,
    form.preferredPlanStyle,
    weeklyChangeNote,
  ].some((value) => value.trim() !== "");
}

function saveWeeklyRequestDraft(storageKey: string, draft: WeeklyRequestDraft) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // Draft autosave is device-only convenience; the form remains usable.
  }
}

function clearStoredWeeklyRequestDraft(storageKey: string) {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Draft autosave is device-only convenience; the form remains usable.
  }
}

function readStoredWeeklyRequestDraft(storageKey: string) {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<WeeklyRequestDraft>;

    return {
      weekStartDate: readDraftString(parsed.weekStartDate),
      weekSummary: readDraftString(parsed.weekSummary),
      scheduleType: readDraftString(parsed.scheduleType),
      workSchedule: readDraftString(parsed.workSchedule),
      commuteTime: readDraftString(parsed.commuteTime),
      mainGoal: readDraftString(parsed.mainGoal),
      mealPrepNeeds: readDraftString(parsed.mealPrepNeeds),
      workoutTrainingGoals: readDraftString(parsed.workoutTrainingGoals),
      appointments: readDraftString(parsed.appointments),
      errands: readDraftString(parsed.errands),
      familyPersonalResponsibilities: readDraftString(
        parsed.familyPersonalResponsibilities,
      ),
      topPriorities: readDraftString(parsed.topPriorities),
      anythingToAvoid: readDraftString(parsed.anythingToAvoid),
      preferredPlanStyle: readDraftString(parsed.preferredPlanStyle),
      weeklyChangeNote: readDraftString(parsed.weeklyChangeNote),
      savedAt: readDraftString(parsed.savedAt),
    };
  } catch {
    return null;
  }
}

function readDraftString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function SavedPlanQuickView({ plan }: { plan: AppSavedPlan }) {
  const quickView = buildSavedPlanQuickView(plan);

  return (
    <section
      aria-label={quickView.title}
      className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-white shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">
            {quickView.title}
          </p>
          <h4 className="mt-1 text-base font-semibold leading-6 text-white">
            {quickView.dateLabel || "Quick view"}
          </h4>
        </div>
        {quickView.groupLabel ? (
          <span className="w-fit rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-50">
            {quickView.groupLabel}
          </span>
        ) : null}
      </div>

      {quickView.items.length > 0 ? (
        <div className="mt-3 grid gap-2">
          {quickView.items.map((item) => (
            <p
              key={item.id}
              className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm leading-6 text-slate-100"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
              <span>{item.text}</span>
            </p>
          ))}
          {quickView.moreCount > 0 ? (
            <p className="text-xs font-semibold text-slate-400">
              +{quickView.moreCount} more in the checklist below.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm leading-6 text-slate-300">
          {quickView.message}
        </p>
      )}
    </section>
  );
}

function CalendarExportPreview({ plan }: { plan: AppSavedPlan }) {
  const events = buildCalendarPreviewEvents(plan);

  if (events.length === 0) return null;

  return (
    <details className="mt-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <summary className="cursor-pointer text-sm font-semibold text-teal-100">
        Preview calendar events
      </summary>
      <p className="mt-2 text-xs leading-5 text-slate-300">
        Review before importing. These are all-day events and no reminders are
        added.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {events.map((event) => (
          <div
            key={`${event.date}-${event.title}`}
            className="rounded-lg border border-white/10 bg-slate-950/60 p-3"
          >
            <p className="text-sm font-semibold text-white">{event.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              {formatCompactReadableDate(event.date)} - {event.timing}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}

function GeneratedPlanReviewChecklist() {
  const reviewItems = [
    "Check dates",
    "Check shift times",
    "Check appointments/errands",
    "Check assumptions",
    "Adjust for real life",
  ];

  return (
    <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <p className="text-sm font-semibold text-white">
        Quick review before using
      </p>
      <ul className="mt-2 grid gap-2 text-xs font-semibold leading-5 text-slate-300 sm:grid-cols-2">
        {reviewItems.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlanBody({
  body,
  isExpanded,
  hideChecklistSection,
}: {
  body: string;
  isExpanded: boolean;
  hideChecklistSection: boolean;
}) {
  const lines = preparePlanBodyLines(body, hideChecklistSection);
  const visibleLines = isExpanded ? lines : lines.slice(0, collapsedPlanLineLimit);
  const isCollapsed = !isExpanded && lines.length > collapsedPlanLineLimit;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm leading-6 text-slate-200 shadow-inner sm:p-5">
      <div className="mx-auto max-w-3xl">
        {visibleLines.map((line, index) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={`space-${index}`} className="h-2" />;
          }

          const dayLabel = extractDayLabel(trimmed);
          if (dayLabel) {
            const dayTone = getTimelineDayTone(visibleLines, index);

            return (
              <div
                key={`${trimmed}-${index}`}
                className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-3 first:mt-0"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h5 className="text-base font-semibold leading-6 text-white">
                    {dayLabel}
                  </h5>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${dayTone.className}`}>
                    {dayTone.label}
                  </span>
                </div>
              </div>
            );
          }

          const heading = trimmed.match(/^#{1,4}\s+(.+)$/);
          if (heading) {
            const headingText = cleanPlanDisplayText(heading[1]);
            const isImportant = isImportantPlanNote(headingText);

            return (
              <h5
                key={`${trimmed}-${index}`}
                className={
                  isImportant
                    ? "mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm font-semibold leading-6 text-amber-50 first:mt-0"
                    : "mt-5 border-t border-slate-800 pt-4 text-base font-semibold leading-7 text-white first:mt-0 first:border-t-0 first:pt-0"
                }
              >
                {headingText}
              </h5>
            );
          }

          const checklist = trimmed.match(/^[-*]\s+\[[ xX]\]\s+(.+)$/);
          const checklistText = checklist
            ? cleanPlanDisplayText(checklist[1])
            : "";
          if (checklist) {
            return (
              <div
                key={`${trimmed}-${index}`}
                className={`mt-2 flex gap-3 rounded-lg border px-3 py-2 ${getTimelineLineTone(checklistText)}`}
              >
                <span className="mt-1 h-4 w-4 shrink-0 rounded border border-slate-500 bg-slate-900" />
                <span>{checklistText}</span>
              </div>
            );
          }

          const bullet = trimmed.match(/^[-*]\s+(.+)$/);
          const bulletText = bullet ? cleanPlanDisplayText(bullet[1]) : "";
          if (bullet) {
            return (
              <p
                key={`${trimmed}-${index}`}
                className={`mt-2 flex gap-3 rounded-lg border px-3 py-2 ${getTimelineLineTone(bulletText)}`}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
                <span>{bulletText}</span>
              </p>
            );
          }

          const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
          const numberedText = numbered ? cleanPlanDisplayText(trimmed) : "";
          if (numbered) {
            return (
              <p
                key={`${trimmed}-${index}`}
                className={`mt-2 rounded-lg border px-3 py-2 ${getTimelineLineTone(numberedText)}`}
              >
                {numberedText}
              </p>
            );
          }

          const cleanedLine = cleanPlanDisplayText(trimmed);
          const sectionLabel =
            cleanedLine.endsWith(":") && cleanedLine.length < 80 ? cleanedLine : "";
          if (sectionLabel) {
            const isImportant = isImportantPlanNote(sectionLabel);

            return (
              <h5
                key={`${trimmed}-${index}`}
                className={
                  isImportant
                    ? "mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm font-semibold leading-6 text-amber-50 first:mt-0"
                    : "mt-5 border-t border-slate-800 pt-4 text-base font-semibold leading-7 text-white first:mt-0 first:border-t-0 first:pt-0"
                }
              >
                {sectionLabel}
              </h5>
            );
          }

          return (
            <p
              key={`${trimmed}-${index}`}
              className={`mt-2 rounded-lg border px-3 py-2 ${getTimelineLineTone(cleanedLine)}`}
            >
              {cleanedLine}
            </p>
          );
        })}
        {isCollapsed ? (
          <p className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm font-semibold text-slate-300">
            Preview shown. Use Show full plan to read the rest.
          </p>
        ) : null}
        {hideChecklistSection ? (
          <p className="mt-4 rounded-lg border border-teal-300/30 bg-teal-300/10 p-3 text-sm font-semibold text-teal-50">
            Checklist items are shown below as an interactive checklist.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function getTimelineDayTone(lines: string[], index: number) {
  const context = lines
    .slice(index, index + 8)
    .map(cleanPlanDisplayText)
    .join(" ");

  if (isShiftTimelineText(context)) {
    return {
      label: "Shift day",
      className: "border border-teal-300/40 bg-teal-300/15 text-teal-50",
    };
  }

  if (isResetTimelineText(context)) {
    return {
      label: "Off/reset day",
      className: "border border-sky-300/40 bg-sky-300/15 text-sky-50",
    };
  }

  return {
    label: "Day plan",
    className: "border border-slate-600 bg-slate-800 text-slate-200",
  };
}

function getTimelineLineTone(value: string) {
  if (isImportantPlanNote(value)) {
    return "border-amber-300/30 bg-amber-300/10 text-amber-50";
  }

  if (isShiftTimelineText(value)) {
    return "border-teal-300/25 bg-teal-300/10 text-slate-100";
  }

  if (isResetTimelineText(value)) {
    return "border-sky-300/25 bg-sky-300/10 text-slate-100";
  }

  return "border-slate-800 bg-slate-900/70 text-slate-200";
}

function isShiftTimelineText(value: string) {
  const normalized = value.toLowerCase();

  return (
    /\b(shift|commute|workday)\b/.test(normalized) ||
    normalized.includes("work block") ||
    normalized.includes("before work") ||
    normalized.includes("after work") ||
    normalized.includes("pre-shift") ||
    normalized.includes("post-shift") ||
    normalized.includes("clock in") ||
    normalized.includes("clock out")
  );
}

function isResetTimelineText(value: string) {
  const normalized = value.toLowerCase();

  return (
    normalized.includes("off day") ||
    normalized.includes("day off") ||
    normalized.includes("reset") ||
    normalized.includes("light day") ||
    normalized.includes("light chore") ||
    normalized.includes("errand") ||
    normalized.includes("meal prep")
  );
}

function isImportantPlanNote(value: string) {
  const normalized = cleanPlanDisplayText(value)
    .replace(/:$/, "")
    .toLowerCase();

  return (
    normalized === "important note" ||
    normalized.startsWith("important note") ||
    normalized.startsWith("note") ||
    normalized.includes("lifestyle/routine planning")
  );
}

function isLongPlanBody(body: string) {
  return preparePlanBodyLines(body, false).length > collapsedPlanLineLimit;
}

function preparePlanBodyLines(body: string, hideChecklistSection: boolean) {
  const displayLines = body
    .split(/\r?\n/)
    .filter((line) => !isMarkdownDividerLine(line));
  const collapsedLines = collapseRepeatedBlankLines(displayLines);
  if (!hideChecklistSection) return collapsedLines;

  return removeStaticChecklistSection(collapsedLines);
}

function isMarkdownDividerLine(value: string) {
  return /^[-*_]{3,}$/.test(value.trim().replace(/\s+/g, ""));
}

function removeStaticChecklistSection(lines: string[]) {
  const filtered: string[] = [];
  let isSkippingChecklist = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (isChecklistSectionHeading(trimmed)) {
      isSkippingChecklist = true;
      return;
    }

    if (isSkippingChecklist) {
      if (trimmed && isPlanDisplaySectionHeading(trimmed)) {
        isSkippingChecklist = false;
      } else {
        return;
      }
    }

    filtered.push(line);
  });

  return collapseRepeatedBlankLines(filtered);
}

function collapseRepeatedBlankLines(lines: string[]) {
  const collapsed: string[] = [];
  let previousWasBlank = false;

  lines.forEach((line) => {
    const isBlank = line.trim() === "";
    if (isBlank && previousWasBlank) return;

    collapsed.push(line);
    previousWasBlank = isBlank;
  });

  return collapsed;
}

function cleanPlanDisplayText(value: string) {
  return value
    .replace(/^#{1,6}\s+/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function isChecklistSectionHeading(value: string) {
  const normalized = cleanPlanDisplayText(value)
    .replace(/^\d+\.\s*/, "")
    .replace(/:$/, "")
    .toLowerCase();

  return normalized === "checklist";
}

function isPlanDisplaySectionHeading(value: string) {
  const cleaned = cleanPlanDisplayText(value);
  return (
    isLikelyPlanHeading(value) ||
    extractDayLabel(value) !== "" ||
    (/^\d+\.\s+/.test(cleaned) && cleaned.length < 80)
  );
}

function InteractiveChecklist({
  planId,
  planBody,
}: {
  planId: string;
  planBody: string;
}) {
  const groups = useMemo(() => parseChecklistGroups(planBody), [planBody]);
  const items = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const storageKey = `shiftplan:checklist:${planId}`;
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () => readStoredChecklist(storageKey),
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => createInitialChecklistGroupState(groups),
  );
  const [copyState, setCopyState] = useState<"" | "copied" | "failed">("");
  const [hideCompleted, setHideCompleted] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-600">
        <p className="font-semibold text-slate-800">No checklist items found.</p>
        <p className="mt-1">
          When a saved plan includes checkbox-style lines, ShiftPlan will turn
          them into a tappable checklist here.
        </p>
      </div>
    );
  }

  const completedCount = items.filter((item) => checkedItems[item.id]).length;

  function toggleGroup(groupId: string) {
    setExpandedGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  }

  function toggleItem(itemId: string) {
    setCheckedItems((current) => {
      const next = { ...current, [itemId]: !current[itemId] };

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Checklist state is a convenience feature; the plan remains usable.
      }

      return next;
    });
  }

  function setAllGroupsExpanded(isExpanded: boolean) {
    setExpandedGroups(
      groups.reduce<Record<string, boolean>>((state, group) => {
        state[group.id] = isExpanded;
        return state;
      }, {}),
    );
  }

  async function copyChecklist() {
    try {
      const checklistText = groups
        .map((group) => {
          const groupLines = group.items.map(
            (item) =>
              `${checkedItems[item.id] ? "[x]" : "[ ]"} ${item.text}`,
          );

          return [group.label, ...groupLines].join("\n");
        })
        .join("\n\n");

      await navigator.clipboard.writeText(checklistText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState(""), 1800);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState(""), 2200);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-teal-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h5 className="text-base font-semibold text-slate-950">
            Interactive checklist
          </h5>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Tap items as you work through this plan.
          </p>
        </div>
        <span className="w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
          {completedCount} of {items.length} complete
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAllGroupsExpanded(true)}
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={() => setAllGroupsExpanded(false)}
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
        >
          Collapse all
        </button>
        <button
          type="button"
          onClick={() => setHideCompleted(true)}
          disabled={hideCompleted}
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-fit"
        >
          Hide completed
        </button>
        <button
          type="button"
          onClick={() => setHideCompleted(false)}
          disabled={!hideCompleted}
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-fit"
        >
          Show completed
        </button>
        <button
          type="button"
          onClick={() => void copyChecklist()}
          className="inline-flex w-full items-center justify-center rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
        >
          {copyState === "failed"
            ? "Copy failed"
            : copyState === "copied"
              ? "Copied"
              : "Copy Checklist"}
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        {groups.map((group, groupIndex) => {
          const groupCompletedCount = group.items.filter(
            (item) => checkedItems[item.id],
          ).length;
          const isExpanded = expandedGroups[group.id] ?? groupIndex === 0;
          const visibleItems = hideCompleted
            ? group.items.filter((item) => !checkedItems[item.id])
            : group.items;

          return (
            <section
              key={group.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
            >
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between gap-3 p-3 text-left transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                aria-expanded={isExpanded}
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-950">
                    {group.label}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase text-slate-500">
                    {groupCompletedCount} of {group.items.length} complete
                  </span>
                </span>
                <span className="text-sm font-semibold text-teal-800">
                  {isExpanded ? "Hide" : "Show"}
                </span>
              </button>

              {isExpanded ? (
                <div className="grid gap-2 border-t border-slate-200 bg-white p-3">
                  {visibleItems.length > 0 ? (
                    visibleItems.map((item) => {
                    const isChecked = Boolean(checkedItems[item.id]);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm leading-6 text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        aria-pressed={isChecked}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-semibold ${
                            isChecked
                              ? "border-teal-700 bg-teal-700 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span
                          className={
                            isChecked ? "text-slate-500 line-through" : ""
                          }
                        >
                          {item.text}
                        </span>
                      </button>
                    );
                    })
                  ) : (
                    <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-500">
                      Completed items are hidden for this day.
                    </p>
                  )}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function createInitialChecklistGroupState(groups: ChecklistGroup[]) {
  return groups.reduce<Record<string, boolean>>((state, group, index) => {
    state[group.id] = index === 0;
    return state;
  }, {});
}

function readStoredChecklist(storageKey: string) {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function parseChecklistGroups(body: string) {
  const groupMap = new Map<string, ChecklistGroup>();
  const seenByGroup = new Map<string, Set<string>>();
  let currentGroupLabel = "General";

  function getGroup(label: string) {
    const groupLabel = label || "General";
    const groupId = normalizeChecklistKey(groupLabel) || "general";
    const existing = groupMap.get(groupId);

    if (existing) return existing;

    const group = {
      id: groupId,
      label: groupLabel,
      items: [],
    };

    groupMap.set(groupId, group);
    seenByGroup.set(groupId, new Set());

    return group;
  }

  body.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const dayHeading = extractDayLabel(trimmed);
    if (dayHeading) {
      currentGroupLabel = dayHeading;
      return;
    }

    const checklist = trimmed.match(
      /^(?:[-*•]\s*)?(?:\[[ xX]\]|[☐☑])\s*(.+)$/,
    );
    if (!checklist) return;

    const cleaned = cleanChecklistText(checklist[1]);
    const itemDay = extractLeadingDayFromItem(cleaned);
    const group = getGroup(itemDay?.label || currentGroupLabel);
    const text = itemDay?.text || cleaned;
    const itemKey = normalizeChecklistKey(text);
    const seenItems = seenByGroup.get(group.id) || new Set<string>();

    if (!text || !itemKey || seenItems.has(itemKey)) return;

    seenItems.add(itemKey);
    seenByGroup.set(group.id, seenItems);
    group.items.push({
      id: itemKey,
      text,
    });
  });

  return Array.from(groupMap.values()).filter((group) => group.items.length > 0);
}

function cleanChecklistText(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

const dayNamePattern =
  "(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Tues|Wed|Thu|Thur|Thurs|Fri|Sat|Sun)";

function extractDayLabel(value: string) {
  const cleaned = cleanPlanLabel(value);
  const dayMatch = cleaned.match(
    new RegExp(
      `^(${dayNamePattern})(?:day)?(?:,?\\s+[A-Z][a-z]+\\s+\\d{1,2}(?:,\\s*\\d{4})?)?:?$`,
      "i",
    ),
  );

  if (!dayMatch) return "";

  return normalizeDayLabel(cleaned.replace(/:$/, ""));
}

function extractLeadingDayFromItem(value: string) {
  const cleaned = cleanChecklistText(value);
  const dayMatch = cleaned.match(
    new RegExp(
      `^(${dayNamePattern}(?:day)?(?:,?\\s+[A-Z][a-z]+\\s+\\d{1,2}(?:,\\s*\\d{4})?)?)\\s*[:\\-–—]\\s*(.+)$`,
      "i",
    ),
  );

  if (!dayMatch) return null;

  return {
    label: normalizeDayLabel(dayMatch[1]),
    text: cleanChecklistText(dayMatch[2]),
  };
}

function cleanPlanLabel(value: string) {
  return value
    .replace(/^#{1,6}\s+/, "")
    .replace(/^[-*•]\s*/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();
}

function normalizeDayLabel(value: string) {
  const trimmed = cleanPlanLabel(value).replace(/\s+/g, " ").trim();
  const dayMatch = trimmed.match(new RegExp(`^(${dayNamePattern})`, "i"));
  const day = dayMatch ? expandDayName(dayMatch[1]) : "";

  if (!day) return trimmed;

  return trimmed.replace(dayMatch?.[1] || day, day).replace(/:$/, "");
}

function expandDayName(value: string) {
  const key = value.toLowerCase();
  const dayMap: Record<string, string> = {
    mon: "Monday",
    monday: "Monday",
    tue: "Tuesday",
    tues: "Tuesday",
    tuesday: "Tuesday",
    wed: "Wednesday",
    wednesday: "Wednesday",
    thu: "Thursday",
    thur: "Thursday",
    thurs: "Thursday",
    thursday: "Thursday",
    fri: "Friday",
    friday: "Friday",
    sat: "Saturday",
    saturday: "Saturday",
    sun: "Sunday",
    sunday: "Sunday",
  };

  return dayMap[key] || value;
}

function normalizeChecklistKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const futureFeatureNotesPrefix = "Future feature picks:";

function readFutureFeatureSelections(notes: string) {
  const featureLine = notes
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith(futureFeatureNotesPrefix));

  if (!featureLine) return [];

  return futureFeatureOptions.filter((feature) =>
    featureLine.includes(feature),
  );
}

function toggleFutureFeatureInNotes(notes: string, feature: string) {
  const selected = new Set(readFutureFeatureSelections(notes));

  if (selected.has(feature)) {
    selected.delete(feature);
  } else {
    selected.add(feature);
  }

  const noteLines = notes
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith(futureFeatureNotesPrefix));
  const compactNoteLines = trimTrailingBlankLines(noteLines);

  if (selected.size > 0) {
    compactNoteLines.push(
      `${futureFeatureNotesPrefix} ${Array.from(selected).join(", ")}`,
    );
  }

  return compactNoteLines.join("\n").trim();
}

function trimTrailingBlankLines(lines: string[]) {
  const next = [...lines];

  while (next.length > 0 && next[next.length - 1].trim() === "") {
    next.pop();
  }

  return next;
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
  const selectedFutureFeatures = useMemo(
    () => readFutureFeatureSelections(form.additionalNotes),
    [form.additionalNotes],
  );

  function updateField(field: keyof PlanFeedbackFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setMessage("");
  }

  function toggleFutureFeature(feature: string) {
    updateField(
      "additionalNotes",
      toggleFutureFeatureInNotes(form.additionalNotes, feature),
    );
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
          {plan.feedback
            ? "Feedback is saved. You can update it after using or reviewing this plan."
            : "No feedback saved yet. After reviewing the plan, leave quick notes so future versions can improve."}
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
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-950">
            Which future features matter most?
          </p>
          <p className="mt-2 text-sm leading-6 text-teal-900">
            Tap any that matter. Your picks stay editable in Additional notes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {futureFeatureOptions.map((feature) => {
              const isSelected = selectedFutureFeatures.includes(feature);

              return (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFutureFeature(feature)}
                  aria-pressed={isSelected}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                    isSelected
                      ? "bg-teal-800 text-white ring-teal-800"
                      : "bg-white text-teal-900 ring-teal-200 hover:bg-teal-100"
                  }`}
                >
                  {feature}
                </button>
              );
            })}
          </div>
        </div>
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
  helpText,
  value,
  onChange,
}: {
  id: string;
  label: string;
  helpText?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field id={id} label={label} helpText={helpText}>
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

function createPreferencesForm(
  preferences?: AppUserPreferences | null,
): PreferencesFormState {
  if (!preferences) return initialPreferencesForm;

  return {
    typicalShiftType: preferences.typical_shift_type,
    usualCommuteTime: preferences.usual_commute_time,
    preferredPlanStyle: preferences.preferred_plan_style,
    mealPrepPreferences: preferences.meal_prep_preferences,
    workoutTrainingPreferences: preferences.workout_training_preferences,
    recurringResponsibilities: preferences.recurring_responsibilities,
    thingsToAvoidAfterWork: preferences.things_to_avoid_after_work,
    defaultWeekStartDay: preferences.default_week_start_day,
    planningNotes: preferences.planning_notes,
  };
}
