"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";

type AdminGroup = "free" | "custom" | "founding" | "weekly" | "app";
type ProductFilter = "All" | "ShiftPlan" | "KinPlan" | "SuppPlan";
type PaidIntakeType = "custom_plan" | "founding_pro" | "founding_pro_weekly";
type FulfillmentStatus =
  | "New"
  | "In Progress"
  | "Prompt Copied"
  | "Generated"
  | "Reviewed"
  | "Delivered"
  | "Needs Info"
  | "Canceled"
  | "Refunded";
type SubscriptionStatus =
  | "Unknown"
  | "Active"
  | "Canceled"
  | "Past Due"
  | "Trial"
  | "Not Applicable";
type DeliveryStatus =
  | "Draft"
  | "Reviewed"
  | "Delivered"
  | "Needs Revision"
  | "Archived";

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
  id: string;
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
  fulfillment_status: FulfillmentStatus | null;
  admin_notes: string | null;
  delivered_at: string | null;
  founding_pro_plan_number: number | null;
  founding_pro_plan_limit: number | null;
  billing_period_start: string | null;
  billing_period_end: string | null;
  subscription_status: SubscriptionStatus | null;
  usage_notes: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archive_reason: string | null;
  updated_at: string | null;
};

type PaidIntakeStatusUpdate = {
  id: string;
  fulfillment_status: FulfillmentStatus;
  admin_notes: string | null;
  delivered_at: string | null;
  updated_at: string;
};

type FoundingProUsageUpdate = {
  id: string;
  founding_pro_plan_number: number | null;
  founding_pro_plan_limit: number;
  billing_period_start: string | null;
  billing_period_end: string | null;
  subscription_status: SubscriptionStatus;
  usage_notes: string | null;
  updated_at: string;
};

type PaidIntakeArchiveUpdate = {
  id: string;
  is_archived: boolean;
  archived_at: string | null;
  archive_reason: string | null;
  updated_at: string;
};

type ShiftPlanSubscriberPreference = {
  id: string;
  created_at: string;
  updated_at: string;
  subscriber_email: string;
  first_name: string | null;
  job_role: string | null;
  typical_shift_pattern: string | null;
  typical_commute_time: string | null;
  preferred_plan_style: string | null;
  meal_prep_preferences: string | null;
  workout_training_preferences: string | null;
  recurring_responsibilities: string | null;
  avoid_after_work: string | null;
  monthly_focus: string | null;
  plan_style_notes: string | null;
  last_tuneup_date: string | null;
  admin_notes: string | null;
};

type ShiftPlanDeliveredPlan = {
  id: string;
  created_at: string;
  updated_at: string;
  paid_intake_id: string | null;
  customer_email: string;
  customer_name: string | null;
  plan_type: PaidIntakeType;
  plan_title: string | null;
  plan_start_date: string | null;
  plan_end_date: string | null;
  plan_body: string;
  delivery_status: DeliveryStatus;
  delivered_at: string | null;
  admin_notes: string | null;
};

type AppBetaLatestRequest = {
  id: string;
  created_at: string;
  week_start_date: string;
  week_end_date: string;
  schedule_type: string;
  work_schedule: string;
  main_goal: string;
  preferred_plan_style: string;
  status: string;
};

type AppBetaLatestSavedPlan = {
  id: string;
  created_at: string;
  plan_request_id: string;
  week_start_date: string;
  week_end_date: string;
  plan_title: string | null;
  usage_month: number;
  usage_year: number;
  generation_number_for_month: number;
};

type AppBetaLatestFeedback = {
  id: string;
  created_at: string;
  updated_at: string;
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

type AppBetaSavedPreferences = {
  id: string;
  updated_at: string;
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

type AppBetaUsageEvent = {
  id: string;
  created_at: string;
  event_type: string;
  metadata: Record<string, unknown>;
};

type AppBetaUser = {
  id: string;
  email: string;
  first_name: string | null;
  status: string;
  created_at: string;
  last_seen_at: string | null;
  access_code_label: string | null;
  access_code_active: boolean | null;
  access_code_expires_at: string | null;
  max_generations_per_month: number | null;
  max_generations_per_day: number | null;
  plans_used_this_month: number;
  plans_generated_today: number;
  weekly_request_count: number;
  saved_plan_count: number;
  feedback_count: number;
  latest_request: AppBetaLatestRequest | null;
  latest_saved_plan: AppBetaLatestSavedPlan | null;
  latest_feedback: AppBetaLatestFeedback | null;
  saved_preferences: AppBetaSavedPreferences | null;
  recent_usage_events: AppBetaUsageEvent[];
};

type AppAccessCodeAdmin = {
  id: string;
  created_at: string;
  email: string;
  code_label: string | null;
  is_active: boolean;
  expires_at: string | null;
  max_generations_per_month: number;
  max_generations_per_day: number;
  notes: string | null;
};

type AdminResponse = {
  message?: string;
  signups?: BetaSignup[];
  shiftPlanIntakes?: ShiftPlanIntake[];
  shiftPlanPaidIntakes?: ShiftPlanPaidIntake[];
  shiftPlanSubscriberPreferences?: ShiftPlanSubscriberPreference[];
  shiftPlanDeliveredPlans?: ShiftPlanDeliveredPlan[];
};

type AppBetaAdminResponse = {
  message?: string;
  appBetaUsers?: AppBetaUser[];
};

type AppAccessCodeAdminResponse = {
  message?: string;
  accessCodes?: AppAccessCodeAdmin[];
  accessCode?: AppAccessCodeAdmin;
};

const groups: { id: AdminGroup; label: string }[] = [
  { id: "free", label: "Free Reset / Beta" },
  { id: "custom", label: "Custom Plan" },
  { id: "founding", label: "Founding Pro" },
  { id: "weekly", label: "Weekly Schedule" },
  { id: "app", label: "App Beta" },
];

const fulfillmentStatuses: FulfillmentStatus[] = [
  "New",
  "In Progress",
  "Prompt Copied",
  "Generated",
  "Reviewed",
  "Delivered",
  "Needs Info",
  "Canceled",
  "Refunded",
];

const subscriptionStatuses: SubscriptionStatus[] = [
  "Unknown",
  "Active",
  "Canceled",
  "Past Due",
  "Trial",
  "Not Applicable",
];

const deliveryStatuses: DeliveryStatus[] = [
  "Draft",
  "Reviewed",
  "Delivered",
  "Needs Revision",
  "Archived",
];

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [shiftPlanIntakes, setShiftPlanIntakes] = useState<ShiftPlanIntake[]>([]);
  const [shiftPlanPaidIntakes, setShiftPlanPaidIntakes] = useState<
    ShiftPlanPaidIntake[]
  >([]);
  const [subscriberPreferences, setSubscriberPreferences] = useState<
    ShiftPlanSubscriberPreference[]
  >([]);
  const [deliveredPlans, setDeliveredPlans] = useState<ShiftPlanDeliveredPlan[]>([]);
  const [appBetaUsers, setAppBetaUsers] = useState<AppBetaUser[]>([]);
  const [appAccessCodes, setAppAccessCodes] = useState<AppAccessCodeAdmin[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<AdminGroup>("free");
  const [showArchived, setShowArchived] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const visiblePaidIntakes = useMemo(
    () =>
      shiftPlanPaidIntakes.filter((intake) =>
        showArchived ? Boolean(intake.is_archived) : !intake.is_archived,
      ),
    [shiftPlanPaidIntakes, showArchived],
  );

  const paidGroups = useMemo(() => {
    return {
      custom: visiblePaidIntakes.filter(
        (intake) => intake.intake_type === "custom_plan",
      ),
      founding: visiblePaidIntakes.filter(
        (intake) => intake.intake_type === "founding_pro",
      ),
      weekly: visiblePaidIntakes.filter(
        (intake) => intake.intake_type === "founding_pro_weekly",
      ),
    };
  }, [visiblePaidIntakes]);

  const preferencesByEmail = useMemo(() => {
    return subscriberPreferences.reduce<Record<string, ShiftPlanSubscriberPreference>>(
      (preferences, preference) => {
        preferences[preference.subscriber_email.toLowerCase()] = preference;
        return preferences;
      },
      {},
    );
  }, [subscriberPreferences]);

  const deliveredPlansByIntakeId = useMemo(() => {
    return deliveredPlans.reduce<Record<string, ShiftPlanDeliveredPlan>>(
      (plans, plan) => {
        if (plan.paid_intake_id) {
          plans[plan.paid_intake_id] = plan;
        }
        return plans;
      },
      {},
    );
  }, [deliveredPlans]);

  const groupCounts = {
    free: signups.length + shiftPlanIntakes.length,
    custom: paidGroups.custom.length,
    founding: paidGroups.founding.length,
    weekly: paidGroups.weekly.length,
    app: appBetaUsers.length,
  };
  const archivedPaidCount = shiftPlanPaidIntakes.filter(
    (intake) => intake.is_archived,
  ).length;

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
      const appBetaResponse = await fetch("/api/admin/app-beta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: nextPassword }),
      });
      const appBetaResult = (await appBetaResponse.json()) as AppBetaAdminResponse;
      const appAccessCodesResponse = await fetch("/api/admin/app-access-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: nextPassword, action: "list" }),
      });
      const appAccessCodesResult =
        (await appAccessCodesResponse.json()) as AppAccessCodeAdminResponse;

      if (
        !response.ok ||
        !appBetaResponse.ok ||
        !appAccessCodesResponse.ok ||
        !result.signups ||
        !result.shiftPlanIntakes ||
        !result.shiftPlanPaidIntakes ||
        !result.shiftPlanSubscriberPreferences ||
        !result.shiftPlanDeliveredPlans ||
        !appBetaResult.appBetaUsers ||
        !appAccessCodesResult.accessCodes
      ) {
        setMessage(
          result.message ||
            appBetaResult.message ||
            appAccessCodesResult.message ||
            "Unable to load admin submissions.",
        );
        setIsUnlocked(false);
        return;
      }

      setSignups(result.signups);
      setShiftPlanIntakes(result.shiftPlanIntakes);
      setShiftPlanPaidIntakes(result.shiftPlanPaidIntakes);
      setSubscriberPreferences(result.shiftPlanSubscriberPreferences);
      setDeliveredPlans(result.shiftPlanDeliveredPlans);
      setAppBetaUsers(appBetaResult.appBetaUsers);
      setAppAccessCodes(appAccessCodesResult.accessCodes);
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

  function handlePaidIntakeStatusUpdate(update: PaidIntakeStatusUpdate) {
    setShiftPlanPaidIntakes((currentIntakes) =>
      currentIntakes.map((intake) =>
        intake.id === update.id
          ? {
              ...intake,
              fulfillment_status: update.fulfillment_status,
              admin_notes: update.admin_notes,
              delivered_at: update.delivered_at,
              updated_at: update.updated_at,
            }
          : intake,
      ),
    );
  }

  function handleFoundingProUsageUpdate(update: FoundingProUsageUpdate) {
    setShiftPlanPaidIntakes((currentIntakes) =>
      currentIntakes.map((intake) =>
        intake.id === update.id
          ? {
              ...intake,
              founding_pro_plan_number: update.founding_pro_plan_number,
              founding_pro_plan_limit: update.founding_pro_plan_limit,
              billing_period_start: update.billing_period_start,
              billing_period_end: update.billing_period_end,
              subscription_status: update.subscription_status,
              usage_notes: update.usage_notes,
              updated_at: update.updated_at,
            }
          : intake,
      ),
    );
  }

  function handlePaidIntakeArchiveUpdate(update: PaidIntakeArchiveUpdate) {
    setShiftPlanPaidIntakes((currentIntakes) =>
      currentIntakes.map((intake) =>
        intake.id === update.id
          ? {
              ...intake,
              is_archived: update.is_archived,
              archived_at: update.archived_at,
              archive_reason: update.archive_reason,
              updated_at: update.updated_at,
            }
          : intake,
      ),
    );
  }

  function handleSubscriberPreferenceUpdate(update: ShiftPlanSubscriberPreference) {
    setSubscriberPreferences((currentPreferences) => {
      const nextPreference = {
        ...update,
        subscriber_email: update.subscriber_email.toLowerCase(),
      };
      const existingIndex = currentPreferences.findIndex(
        (preference) =>
          preference.subscriber_email.toLowerCase() ===
          nextPreference.subscriber_email,
      );

      if (existingIndex === -1) {
        return [nextPreference, ...currentPreferences];
      }

      return currentPreferences.map((preference, index) =>
        index === existingIndex ? nextPreference : preference,
      );
    });
  }

  function handleDeliveredPlanUpdate(update: ShiftPlanDeliveredPlan) {
    setDeliveredPlans((currentPlans) => {
      const existingIndex = currentPlans.findIndex((plan) => plan.id === update.id);

      if (existingIndex === -1) {
        return [update, ...currentPlans];
      }

      return currentPlans.map((plan, index) =>
        index === existingIndex ? update : plan,
      );
    });
  }

  function handleAppAccessCodeUpdate(update: AppAccessCodeAdmin) {
    setAppAccessCodes((currentCodes) => [
      update,
      ...currentCodes.filter((code) => code.id !== update.id),
    ]);
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

        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              {showArchived ? "Showing archived paid records" : "Archived records hidden"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {archivedPaidCount} paid intake
              {archivedPaidCount === 1 ? "" : "s"} archived. Archived records
              stay stored for history and can be restored.
            </p>
          </div>
          <label className="flex w-fit cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
            />
            Show archived
          </label>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
              password={password}
              onStatusSaved={handlePaidIntakeStatusUpdate}
              onUsageSaved={handleFoundingProUsageUpdate}
              preferencesByEmail={preferencesByEmail}
              onPreferenceSaved={handleSubscriberPreferenceUpdate}
              deliveredPlansByIntakeId={deliveredPlansByIntakeId}
              onPlanSaved={handleDeliveredPlanUpdate}
              onArchiveSaved={handlePaidIntakeArchiveUpdate}
            />
          ) : null}
          {selectedGroup === "founding" ? (
            <PaidSubmissionGroup
              title="Founding Pro onboarding submissions"
              intakes={paidGroups.founding}
              password={password}
              onStatusSaved={handlePaidIntakeStatusUpdate}
              onUsageSaved={handleFoundingProUsageUpdate}
              preferencesByEmail={preferencesByEmail}
              onPreferenceSaved={handleSubscriberPreferenceUpdate}
              deliveredPlansByIntakeId={deliveredPlansByIntakeId}
              onPlanSaved={handleDeliveredPlanUpdate}
              onArchiveSaved={handlePaidIntakeArchiveUpdate}
            />
          ) : null}
          {selectedGroup === "weekly" ? (
            <PaidSubmissionGroup
              title="Founding Pro weekly schedule submissions"
              intakes={paidGroups.weekly}
              password={password}
              onStatusSaved={handlePaidIntakeStatusUpdate}
              onUsageSaved={handleFoundingProUsageUpdate}
              preferencesByEmail={preferencesByEmail}
              onPreferenceSaved={handleSubscriberPreferenceUpdate}
              deliveredPlansByIntakeId={deliveredPlansByIntakeId}
              onPlanSaved={handleDeliveredPlanUpdate}
              onArchiveSaved={handlePaidIntakeArchiveUpdate}
            />
          ) : null}
          {selectedGroup === "app" ? (
            <AppBetaGroup
              users={appBetaUsers}
              accessCodes={appAccessCodes}
              password={password}
              onAccessCodeSaved={handleAppAccessCodeUpdate}
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

function AppBetaGroup({
  users,
  accessCodes,
  password,
  onAccessCodeSaved,
}: {
  users: AppBetaUser[];
  accessCodes: AppAccessCodeAdmin[];
  password: string;
  onAccessCodeSaved: (update: AppAccessCodeAdmin) => void;
}) {
  return (
    <div className="grid gap-6">
      <AppAccessCodeManager
        accessCodes={accessCodes}
        password={password}
        onAccessCodeSaved={onAccessCodeSaved}
      />

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <GroupHeader title="App Beta testers" count={users.length} />
        {users.length === 0 ? (
          <EmptyState message="No app beta users yet." />
        ) : (
          <div className="grid gap-4 p-4">
            {users.map((user) => (
              <article
                key={user.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">
                    {user.first_name || "App beta user"}
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-600">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="w-fit rounded-lg bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                    {user.status}
                  </span>
                  <span className="w-fit rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
                    {user.access_code_label || "No access label"}
                  </span>
                </div>
              </div>

              <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <AdminField label="Created" value={formatDate(user.created_at)} />
                <AdminField
                  label="Last seen"
                  value={user.last_seen_at ? formatDate(user.last_seen_at) : "-"}
                />
                <AdminField
                  label="Access active"
                  value={formatBooleanStatus(user.access_code_active)}
                />
                <AdminField
                  label="Access expires"
                  value={
                    user.access_code_expires_at
                      ? formatDate(user.access_code_expires_at)
                      : "-"
                  }
                />
                <AdminField
                  label="Monthly limit"
                  value={formatNullableNumber(user.max_generations_per_month)}
                />
                <AdminField
                  label="Day limit"
                  value={formatNullableNumber(user.max_generations_per_day)}
                />
                <AdminField
                  label="Plans used this month"
                  value={String(user.plans_used_this_month)}
                />
                <AdminField
                  label="Plans generated today"
                  value={String(user.plans_generated_today)}
                />
                <AdminField
                  label="Weekly requests"
                  value={String(user.weekly_request_count)}
                />
                <AdminField
                  label="Saved plans"
                  value={String(user.saved_plan_count)}
                />
                <AdminField
                  label="Feedback records"
                  value={String(user.feedback_count)}
                />
              </dl>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <AppBetaPanel title="Latest request">
                  {user.latest_request ? (
                    <dl className="grid gap-3">
                      <AdminField
                        label="Dates"
                        value={`${formatPlainDate(user.latest_request.week_start_date)} to ${formatPlainDate(user.latest_request.week_end_date)}`}
                      />
                      <AdminField
                        label="Schedule type"
                        value={user.latest_request.schedule_type}
                      />
                      <AdminField
                        label="Status"
                        value={user.latest_request.status}
                      />
                      <AdminField
                        label="Main goal"
                        value={user.latest_request.main_goal}
                      />
                      <details className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <summary className="cursor-pointer font-semibold text-slate-800">
                          Work schedule
                        </summary>
                        <p className="mt-2 whitespace-pre-wrap leading-6 text-slate-700">
                          {user.latest_request.work_schedule || "-"}
                        </p>
                      </details>
                    </dl>
                  ) : (
                    <p className="text-sm text-slate-600">No requests yet.</p>
                  )}
                </AppBetaPanel>

                <AppBetaPanel title="Latest saved plan">
                  {user.latest_saved_plan ? (
                    <dl className="grid gap-3">
                      <AdminField
                        label="Title"
                        value={user.latest_saved_plan.plan_title || "Saved ShiftPlan"}
                      />
                      <AdminField
                        label="Dates"
                        value={`${formatPlainDate(user.latest_saved_plan.week_start_date)} to ${formatPlainDate(user.latest_saved_plan.week_end_date)}`}
                      />
                      <AdminField
                        label="Generation number"
                        value={String(
                          user.latest_saved_plan.generation_number_for_month,
                        )}
                      />
                      <AdminField
                        label="Created"
                        value={formatDate(user.latest_saved_plan.created_at)}
                      />
                    </dl>
                  ) : (
                    <p className="text-sm text-slate-600">No saved plans yet.</p>
                  )}
                </AppBetaPanel>

                <AppBetaPanel title="Latest feedback">
                  {user.latest_feedback ? (
                    <dl className="grid gap-3">
                      <AdminField
                        label="Usefulness"
                        value={`${user.latest_feedback.usefulness_rating} / 5`}
                      />
                      <AdminField
                        label="Used this week"
                        value={user.latest_feedback.used_this_week}
                      />
                      <AdminField
                        label="Would use weekly"
                        value={user.latest_feedback.would_use_weekly}
                      />
                      <AdminField
                        label="Would pay $9/month"
                        value={user.latest_feedback.would_pay_9_month}
                      />
                      <AdminField
                        label="What worked"
                        value={user.latest_feedback.what_worked || "-"}
                      />
                      <AdminField
                        label="What felt unrealistic"
                        value={user.latest_feedback.what_felt_unrealistic || "-"}
                      />
                    </dl>
                  ) : (
                    <p className="text-sm text-slate-600">No feedback yet.</p>
                  )}
                </AppBetaPanel>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <AppBetaPanel title="Saved preferences">
                  {user.saved_preferences ? (
                    <dl className="grid gap-3 md:grid-cols-2">
                      <AdminField
                        label="Typical shift type"
                        value={user.saved_preferences.typical_shift_type || "-"}
                      />
                      <AdminField
                        label="Usual commute"
                        value={user.saved_preferences.usual_commute_time || "-"}
                      />
                      <AdminField
                        label="Preferred style"
                        value={user.saved_preferences.preferred_plan_style || "-"}
                      />
                      <AdminField
                        label="Week starts"
                        value={
                          user.saved_preferences.default_week_start_day || "-"
                        }
                      />
                      <AdminField
                        label="Meal prep"
                        value={
                          user.saved_preferences.meal_prep_preferences || "-"
                        }
                      />
                      <AdminField
                        label="Workout/training"
                        value={
                          user.saved_preferences
                            .workout_training_preferences || "-"
                        }
                      />
                      <AdminField
                        label="Recurring responsibilities"
                        value={
                          user.saved_preferences.recurring_responsibilities ||
                          "-"
                        }
                      />
                      <AdminField
                        label="Avoid after work"
                        value={
                          user.saved_preferences.things_to_avoid_after_work ||
                          "-"
                        }
                      />
                      <AdminField
                        label="Planning notes"
                        value={user.saved_preferences.planning_notes || "-"}
                      />
                    </dl>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No saved preferences yet.
                    </p>
                  )}
                </AppBetaPanel>

                <AppBetaPanel title="Recent usage events">
                  {user.recent_usage_events.length === 0 ? (
                    <p className="text-sm text-slate-600">No usage events yet.</p>
                  ) : (
                    <div className="grid gap-3">
                      {user.recent_usage_events.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <p className="text-sm font-semibold text-slate-950">
                            {event.event_type}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(event.created_at)}
                          </p>
                          <details className="mt-2 text-xs text-slate-700">
                            <summary className="cursor-pointer font-semibold">
                              Metadata
                            </summary>
                            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-2">
                              {formatMetadata(event.metadata)}
                            </pre>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </AppBetaPanel>
              </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppAccessCodeManager({
  accessCodes,
  password,
  onAccessCodeSaved,
}: {
  accessCodes: AppAccessCodeAdmin[];
  password: string;
  onAccessCodeSaved: (update: AppAccessCodeAdmin) => void;
}) {
  const [form, setForm] = useState({
    email: "",
    accessCode: "",
    codeLabel: "",
    monthlyLimit: "4",
    dailyLimit: "2",
    notes: "Private beta tester",
    expiresAt: "",
    isActive: true,
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  async function handleCreateAccessCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/app-access-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          action: "create",
          email: form.email,
          access_code: form.accessCode,
          code_label: form.codeLabel,
          max_generations_per_month: form.monthlyLimit,
          max_generations_per_day: form.dailyLimit,
          notes: form.notes,
          expires_at: form.expiresAt,
          is_active: form.isActive,
        }),
      });
      const result = (await response.json()) as AppAccessCodeAdminResponse;

      if (!response.ok || !result.accessCode) {
        setMessage(result.message || "Could not create the app access code.");
        return;
      }

      onAccessCodeSaved(result.accessCode);
      setForm({
        email: "",
        accessCode: "",
        codeLabel: "",
        monthlyLimit: "4",
        dailyLimit: "2",
        notes: "Private beta tester",
        expiresAt: "",
        isActive: true,
      });
      setMessage(
        result.message ||
          "Access code created. Save this code now. ShiftPlan does not store raw access codes.",
      );
    } catch {
      setMessage("Could not reach the app access code route right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAccessCodeActiveChange(
    accessCode: AppAccessCodeAdmin,
    isActive: boolean,
  ) {
    setUpdatingId(accessCode.id);
    setMessage("");

    try {
      const response = await fetch("/api/admin/app-access-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          action: "set_active",
          id: accessCode.id,
          is_active: isActive,
        }),
      });
      const result = (await response.json()) as AppAccessCodeAdminResponse;

      if (!response.ok || !result.accessCode) {
        setMessage(result.message || "Could not update the app access code.");
        return;
      }

      onAccessCodeSaved(result.accessCode);
      setMessage(isActive ? "Access code reactivated." : "Access code deactivated.");
    } catch {
      setMessage("Could not reach the app access code route right now.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <GroupHeader title="App Access Codes" count={accessCodes.length} />
      <div className="grid gap-5 p-4">
        <form
          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          onSubmit={handleCreateAccessCode}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">
                Create private beta access
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Enter the raw code once. ShiftPlan stores only its hash, so save
                the code before leaving this screen.
              </p>
            </div>
            <label className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    isActive: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
              />
              Active
            </label>
          </div>

          {message ? (
            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
              {message}
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="appAccessEmail"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Email
              </label>
              <input
                id="appAccessEmail"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    email: event.target.value,
                  }))
                }
                className="field-control"
                required
              />
            </div>
            <div>
              <label
                htmlFor="appAccessCode"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Access code
              </label>
              <input
                id="appAccessCode"
                type="text"
                value={form.accessCode}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    accessCode: event.target.value,
                  }))
                }
                className="field-control"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label
                htmlFor="appAccessLabel"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Label
              </label>
              <input
                id="appAccessLabel"
                type="text"
                value={form.codeLabel}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    codeLabel: event.target.value,
                  }))
                }
                className="field-control"
                placeholder="Founder test access"
              />
            </div>
            <div>
              <label
                htmlFor="appAccessMonthlyLimit"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Monthly limit
              </label>
              <input
                id="appAccessMonthlyLimit"
                type="number"
                min="0"
                value={form.monthlyLimit}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    monthlyLimit: event.target.value,
                  }))
                }
                className="field-control"
              />
            </div>
            <div>
              <label
                htmlFor="appAccessDailyLimit"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Daily limit
              </label>
              <input
                id="appAccessDailyLimit"
                type="number"
                min="0"
                value={form.dailyLimit}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    dailyLimit: event.target.value,
                  }))
                }
                className="field-control"
              />
            </div>
            <div>
              <label
                htmlFor="appAccessExpiresAt"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Expires at optional
              </label>
              <input
                id="appAccessExpiresAt"
                type="datetime-local"
                value={form.expiresAt}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    expiresAt: event.target.value,
                  }))
                }
                className="field-control"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="appAccessNotes"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Notes
            </label>
            <textarea
              id="appAccessNotes"
              value={form.notes}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  notes: event.target.value,
                }))
              }
              className="field-control min-h-20"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
          >
            {isSaving ? "Creating..." : "Create access code"}
          </button>
        </form>

        {accessCodes.length === 0 ? (
          <EmptyState message="No app access codes yet." />
        ) : (
          <div className="grid gap-3">
            {accessCodes.map((accessCode) => (
              <article
                key={accessCode.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="break-all font-semibold text-slate-950">
                      {accessCode.email}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {accessCode.code_label || "No label"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`w-fit rounded-lg px-3 py-1 text-sm font-semibold ${
                        accessCode.is_active
                          ? "bg-teal-50 text-teal-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {accessCode.is_active ? "Active" : "Inactive"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        void handleAccessCodeActiveChange(
                          accessCode,
                          !accessCode.is_active,
                        )
                      }
                      disabled={updatingId === accessCode.id}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      {updatingId === accessCode.id
                        ? "Saving..."
                        : accessCode.is_active
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  </div>
                </div>

                <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <AdminField
                    label="Created"
                    value={formatDate(accessCode.created_at)}
                  />
                  <AdminField
                    label="Monthly limit"
                    value={String(accessCode.max_generations_per_month)}
                  />
                  <AdminField
                    label="Daily limit"
                    value={String(accessCode.max_generations_per_day)}
                  />
                  <AdminField
                    label="Expires"
                    value={
                      accessCode.expires_at
                        ? formatDate(accessCode.expires_at)
                        : "-"
                    }
                  />
                  <AdminField label="Notes" value={accessCode.notes || "-"} />
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppBetaPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold uppercase text-slate-500">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PaidSubmissionGroup({
  title,
  intakes,
  password,
  onStatusSaved,
  onUsageSaved,
  preferencesByEmail,
  onPreferenceSaved,
  deliveredPlansByIntakeId,
  onPlanSaved,
  onArchiveSaved,
}: {
  title: string;
  intakes: ShiftPlanPaidIntake[];
  password: string;
  onStatusSaved: (update: PaidIntakeStatusUpdate) => void;
  onUsageSaved: (update: FoundingProUsageUpdate) => void;
  preferencesByEmail: Record<string, ShiftPlanSubscriberPreference>;
  onPreferenceSaved: (update: ShiftPlanSubscriberPreference) => void;
  deliveredPlansByIntakeId: Record<string, ShiftPlanDeliveredPlan>;
  onPlanSaved: (update: ShiftPlanDeliveredPlan) => void;
  onArchiveSaved: (update: PaidIntakeArchiveUpdate) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <GroupHeader title={title} count={intakes.length} />
      {intakes.length === 0 ? (
        <EmptyState message="No submissions in this group yet." />
      ) : (
        <div className="grid gap-4 p-4">
          {intakes.map((intake) => (
            <PaidIntakeCard
              key={intake.id}
              intake={intake}
              password={password}
              onStatusSaved={onStatusSaved}
              onUsageSaved={onUsageSaved}
              savedPreference={preferencesByEmail[intake.email.toLowerCase()] || null}
              onPreferenceSaved={onPreferenceSaved}
              deliveredPlan={deliveredPlansByIntakeId[intake.id] || null}
              onPlanSaved={onPlanSaved}
              onArchiveSaved={onArchiveSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PaidIntakeCard({
  intake,
  password,
  onStatusSaved,
  onUsageSaved,
  savedPreference,
  onPreferenceSaved,
  deliveredPlan,
  onPlanSaved,
  onArchiveSaved,
}: {
  intake: ShiftPlanPaidIntake;
  password: string;
  onStatusSaved: (update: PaidIntakeStatusUpdate) => void;
  onUsageSaved: (update: FoundingProUsageUpdate) => void;
  savedPreference: ShiftPlanSubscriberPreference | null;
  onPreferenceSaved: (update: ShiftPlanSubscriberPreference) => void;
  deliveredPlan: ShiftPlanDeliveredPlan | null;
  onPlanSaved: (update: ShiftPlanDeliveredPlan) => void;
  onArchiveSaved: (update: PaidIntakeArchiveUpdate) => void;
}) {
  const [copiedKey, setCopiedKey] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus>(
    intake.fulfillment_status || "New",
  );
  const [adminNotes, setAdminNotes] = useState(intake.admin_notes || "");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isArchived, setIsArchived] = useState(Boolean(intake.is_archived));
  const [archivedAt, setArchivedAt] = useState(intake.archived_at || "");
  const [archiveReason, setArchiveReason] = useState(intake.archive_reason || "");
  const [archiveMessage, setArchiveMessage] = useState("");
  const [isSavingArchive, setIsSavingArchive] = useState(false);
  const isFoundingPro = intake.intake_type !== "custom_plan";
  const startingPlanLimit = intake.founding_pro_plan_limit || 4;
  const [planNumber, setPlanNumber] = useState(
    intake.founding_pro_plan_number ? String(intake.founding_pro_plan_number) : "",
  );
  const [planLimit, setPlanLimit] = useState(String(startingPlanLimit));
  const [billingPeriodStart, setBillingPeriodStart] = useState(
    intake.billing_period_start || "",
  );
  const [billingPeriodEnd, setBillingPeriodEnd] = useState(
    intake.billing_period_end || "",
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(
    intake.subscription_status || "Unknown",
  );
  const [usageNotes, setUsageNotes] = useState(intake.usage_notes || "");
  const [usageMessage, setUsageMessage] = useState("");
  const [isSavingUsage, setIsSavingUsage] = useState(false);
  const [preferenceTypicalShiftPattern, setPreferenceTypicalShiftPattern] =
    useState(savedPreference?.typical_shift_pattern || intake.typical_shift_pattern || "");
  const [preferenceTypicalCommuteTime, setPreferenceTypicalCommuteTime] = useState(
    savedPreference?.typical_commute_time || intake.typical_commute_time || "",
  );
  const [preferencePreferredPlanStyle, setPreferencePreferredPlanStyle] = useState(
    savedPreference?.preferred_plan_style || intake.preferred_plan_style || "",
  );
  const [preferenceMealPrep, setPreferenceMealPrep] = useState(
    savedPreference?.meal_prep_preferences || intake.meal_prep_preferences || "",
  );
  const [preferenceWorkoutTraining, setPreferenceWorkoutTraining] = useState(
    savedPreference?.workout_training_preferences ||
      intake.workout_training_preferences ||
      "",
  );
  const [preferenceRecurringResponsibilities, setPreferenceRecurringResponsibilities] =
    useState(
      savedPreference?.recurring_responsibilities ||
        intake.recurring_responsibilities ||
        "",
    );
  const [preferenceAvoidAfterWork, setPreferenceAvoidAfterWork] = useState(
    savedPreference?.avoid_after_work || intake.avoid_after_work || "",
  );
  const [preferenceMonthlyFocus, setPreferenceMonthlyFocus] = useState(
    savedPreference?.monthly_focus || intake.monthly_goal || "",
  );
  const [preferencePlanStyleNotes, setPreferencePlanStyleNotes] = useState(
    savedPreference?.plan_style_notes || "",
  );
  const [preferenceLastTuneupDate, setPreferenceLastTuneupDate] = useState(
    savedPreference?.last_tuneup_date || "",
  );
  const [preferenceAdminNotes, setPreferenceAdminNotes] = useState(
    savedPreference?.admin_notes || "",
  );
  const [preferenceMessage, setPreferenceMessage] = useState("");
  const [isSavingPreference, setIsSavingPreference] = useState(false);
  const [planTitle, setPlanTitle] = useState(deliveredPlan?.plan_title || "");
  const [planBody, setPlanBody] = useState(deliveredPlan?.plan_body || "");
  const [planStartDate, setPlanStartDate] = useState(
    deliveredPlan?.plan_start_date ||
      intake.plan_start_date ||
      intake.week_start_date ||
      "",
  );
  const [planEndDate, setPlanEndDate] = useState(
    deliveredPlan?.plan_end_date || intake.plan_end_date || intake.week_end_date || "",
  );
  const [planDeliveryStatus, setPlanDeliveryStatus] = useState<DeliveryStatus>(
    deliveredPlan?.delivery_status || "Draft",
  );
  const [planAdminNotes, setPlanAdminNotes] = useState(
    deliveredPlan?.admin_notes || "",
  );
  const [planMessage, setPlanMessage] = useState("");
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const numericPlanNumber = planNumber ? Number(planNumber) : null;
  const numericPlanLimit = Number(planLimit) || 4;
  const hasReachedPlanLimit =
    numericPlanNumber !== null && numericPlanNumber >= numericPlanLimit;
  const generationBlockMessage = getDraftGenerationBlockMessage(intake);

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(""), 1800);
    } catch {
      setCopiedKey(`${key}-failed`);
      window.setTimeout(() => setCopiedKey(""), 2200);
    }
  }

  async function saveStatus(nextStatus = fulfillmentStatus) {
    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/admin/paid-intake-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          id: intake.id,
          fulfillment_status: nextStatus,
          admin_notes: adminNotes,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        intake?: PaidIntakeStatusUpdate;
      };

      if (!response.ok || !result.intake) {
        setSaveMessage(result.message || "Could not save status.");
        return;
      }

      setFulfillmentStatus(result.intake.fulfillment_status);
      setAdminNotes(result.intake.admin_notes || "");
      onStatusSaved(result.intake);
      setSaveMessage(result.message || "Fulfillment status saved.");
    } catch {
      setSaveMessage("Could not reach the admin update route right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function markDelivered() {
    setFulfillmentStatus("Delivered");
    await saveStatus("Delivered");
  }

  async function saveArchiveState(nextArchivedState: boolean) {
    setIsSavingArchive(true);
    setArchiveMessage("");

    try {
      const response = await fetch("/api/admin/archive-paid-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          id: intake.id,
          is_archived: nextArchivedState,
          archive_reason: archiveReason,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        intake?: PaidIntakeArchiveUpdate;
      };

      if (!response.ok || !result.intake) {
        setArchiveMessage(result.message || "Could not update archive status.");
        return;
      }

      setIsArchived(result.intake.is_archived);
      setArchivedAt(result.intake.archived_at || "");
      setArchiveReason(result.intake.archive_reason || "");
      onArchiveSaved(result.intake);
      setArchiveMessage(result.message || "Archive status saved.");
    } catch {
      setArchiveMessage("Could not reach the archive update route right now.");
    } finally {
      setIsSavingArchive(false);
    }
  }

  async function saveUsage() {
    setIsSavingUsage(true);
    setUsageMessage("");

    try {
      const response = await fetch("/api/admin/founding-pro-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          id: intake.id,
          founding_pro_plan_number: planNumber || null,
          founding_pro_plan_limit: planLimit,
          billing_period_start: billingPeriodStart || null,
          billing_period_end: billingPeriodEnd || null,
          subscription_status: subscriptionStatus,
          usage_notes: usageNotes,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        intake?: FoundingProUsageUpdate;
      };

      if (!response.ok || !result.intake) {
        setUsageMessage(result.message || "Could not save usage.");
        return;
      }

      setPlanNumber(
        result.intake.founding_pro_plan_number
          ? String(result.intake.founding_pro_plan_number)
          : "",
      );
      setPlanLimit(String(result.intake.founding_pro_plan_limit || 4));
      setBillingPeriodStart(result.intake.billing_period_start || "");
      setBillingPeriodEnd(result.intake.billing_period_end || "");
      setSubscriptionStatus(result.intake.subscription_status || "Unknown");
      setUsageNotes(result.intake.usage_notes || "");
      onUsageSaved(result.intake);
      setUsageMessage(result.message || "Founding Pro usage saved.");
    } catch {
      setUsageMessage("Could not reach the usage update route right now.");
    } finally {
      setIsSavingUsage(false);
    }
  }

  async function savePreferences() {
    setIsSavingPreference(true);
    setPreferenceMessage("");

    try {
      const response = await fetch("/api/admin/subscriber-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          action: "upsert",
          subscriber_email: intake.email,
          first_name: intake.first_name,
          job_role: intake.job_role,
          typical_shift_pattern: preferenceTypicalShiftPattern,
          typical_commute_time: preferenceTypicalCommuteTime,
          preferred_plan_style: preferencePreferredPlanStyle,
          meal_prep_preferences: preferenceMealPrep,
          workout_training_preferences: preferenceWorkoutTraining,
          recurring_responsibilities: preferenceRecurringResponsibilities,
          avoid_after_work: preferenceAvoidAfterWork,
          monthly_focus: preferenceMonthlyFocus,
          plan_style_notes: preferencePlanStyleNotes,
          last_tuneup_date: preferenceLastTuneupDate || null,
          admin_notes: preferenceAdminNotes,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        preference?: ShiftPlanSubscriberPreference;
      };

      if (!response.ok || !result.preference) {
        setPreferenceMessage(result.message || "Could not save preferences.");
        return;
      }

      setPreferenceTypicalShiftPattern(result.preference.typical_shift_pattern || "");
      setPreferenceTypicalCommuteTime(result.preference.typical_commute_time || "");
      setPreferencePreferredPlanStyle(result.preference.preferred_plan_style || "");
      setPreferenceMealPrep(result.preference.meal_prep_preferences || "");
      setPreferenceWorkoutTraining(
        result.preference.workout_training_preferences || "",
      );
      setPreferenceRecurringResponsibilities(
        result.preference.recurring_responsibilities || "",
      );
      setPreferenceAvoidAfterWork(result.preference.avoid_after_work || "");
      setPreferenceMonthlyFocus(result.preference.monthly_focus || "");
      setPreferencePlanStyleNotes(result.preference.plan_style_notes || "");
      setPreferenceLastTuneupDate(result.preference.last_tuneup_date || "");
      setPreferenceAdminNotes(result.preference.admin_notes || "");
      onPreferenceSaved(result.preference);
      setPreferenceMessage(result.message || "Subscriber preferences saved.");
    } catch {
      setPreferenceMessage("Could not reach the saved preferences route right now.");
    } finally {
      setIsSavingPreference(false);
    }
  }

  async function savePlan(nextStatus = planDeliveryStatus, markPlanDelivered = false) {
    setIsSavingPlan(true);
    setPlanMessage("");

    try {
      const response = await fetch("/api/admin/delivered-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          paid_intake_id: intake.id,
          customer_email: intake.email,
          customer_name: intake.first_name,
          plan_type: intake.intake_type,
          plan_title: planTitle,
          plan_start_date: planStartDate || null,
          plan_end_date: planEndDate || null,
          plan_body: planBody,
          delivery_status: nextStatus,
          admin_notes: planAdminNotes,
          mark_delivered: markPlanDelivered,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        plan?: ShiftPlanDeliveredPlan;
        intake?: PaidIntakeStatusUpdate | null;
      };

      if (!response.ok || !result.plan) {
        setPlanMessage(result.message || "Could not save plan output.");
        return;
      }

      setPlanTitle(result.plan.plan_title || "");
      setPlanBody(result.plan.plan_body);
      setPlanStartDate(result.plan.plan_start_date || "");
      setPlanEndDate(result.plan.plan_end_date || "");
      setPlanDeliveryStatus(result.plan.delivery_status);
      setPlanAdminNotes(result.plan.admin_notes || "");
      onPlanSaved(result.plan);

      if (result.intake) {
        setFulfillmentStatus(result.intake.fulfillment_status);
        onStatusSaved(result.intake);
      }

      setPlanMessage(result.message || "Plan output saved.");
    } catch {
      setPlanMessage("Could not reach the plan output route right now.");
    } finally {
      setIsSavingPlan(false);
    }
  }

  async function markPlanDelivered() {
    setPlanDeliveryStatus("Delivered");
    await savePlan("Delivered", true);
  }

  function copyDeliveryEmail() {
    if (!deliveredPlan?.plan_body?.trim()) {
      setPlanMessage("Save a plan before copying the delivery email.");
      return;
    }

    setPlanMessage("");
    void copyText(
      `delivery-email-${intake.id}`,
      buildDeliveryEmailDraft(intake, deliveredPlan, {
        planNumber,
        planLimit,
      }),
    );
  }

  async function generateDraftPlan() {
    if (generationBlockMessage) {
      setDraftMessage(generationBlockMessage);
      return;
    }

    setIsGeneratingDraft(true);
    setDraftMessage("");

    try {
      const response = await fetch("/api/admin/generate-draft-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          paid_intake_id: intake.id,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        plan?: ShiftPlanDeliveredPlan;
        intake?: PaidIntakeStatusUpdate | null;
      };

      if (!response.ok || !result.plan) {
        setDraftMessage(result.message || "Could not generate a draft.");
        return;
      }

      setPlanTitle(result.plan.plan_title || "");
      setPlanBody(result.plan.plan_body);
      setPlanStartDate(result.plan.plan_start_date || "");
      setPlanEndDate(result.plan.plan_end_date || "");
      setPlanDeliveryStatus(result.plan.delivery_status);
      setPlanAdminNotes(result.plan.admin_notes || "");
      onPlanSaved(result.plan);

      if (result.intake) {
        setFulfillmentStatus(result.intake.fulfillment_status);
        onStatusSaved(result.intake);
      }

      setDraftMessage(result.message || "Draft saved.");
      setPlanMessage("Draft saved. Review and edit before delivery.");
    } catch {
      setDraftMessage("Could not reach the draft generation route right now.");
    } finally {
      setIsGeneratingDraft(false);
    }
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{intake.first_name}</p>
            <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              {formatPaidLabel(intake.intake_type)}
            </span>
            <span className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {fulfillmentStatus}
            </span>
            {isArchived ? (
              <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                Archived
              </span>
            ) : null}
            {isFoundingPro ? (
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                {formatUsageBadge(intake)}
              </span>
            ) : null}
          </div>
          <p className="mt-1 break-all text-sm text-slate-600">{intake.email}</p>
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
        <AdminField
          label="Delivered"
          value={intake.delivered_at ? formatDate(intake.delivered_at) : "-"}
        />
        <AdminField
          label="Last updated"
          value={intake.updated_at ? formatDate(intake.updated_at) : "-"}
        />
        <AdminField label="Archived" value={isArchived ? "Yes" : "No"} />
        {isArchived ? (
          <>
            <AdminField
              label="Archived at"
              value={archivedAt ? formatDate(archivedAt) : "-"}
            />
            <AdminField label="Archive reason" value={archiveReason || "-"} />
          </>
        ) : null}
        {isFoundingPro ? (
          <>
            <AdminField label="Plan usage" value={formatUsageBadge(intake)} />
            <AdminField
              label="Billing period"
              value={formatBillingPeriod(intake)}
            />
            <AdminField
              label="Subscription status"
              value={intake.subscription_status || "Unknown"}
            />
          </>
        ) : (
          <AdminField label="Founding Pro usage" value="Not applicable" />
        )}
      </dl>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-4 lg:grid-cols-[14rem_1fr]">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Fulfillment status
            <select
              value={fulfillmentStatus}
              onChange={(event) =>
                setFulfillmentStatus(event.target.value as FulfillmentStatus)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {fulfillmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Admin notes
            <textarea
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              className="field-control min-h-24"
              placeholder="Internal notes about fulfillment, edits, or customer follow-up."
            />
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => void saveStatus()}
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
          >
            {isSaving ? "Saving..." : "Save status"}
          </button>
          <button
            type="button"
            onClick={() => void markDelivered()}
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 sm:w-fit"
          >
            Mark Delivered
          </button>
          {saveMessage ? (
            <p className="text-sm font-medium text-slate-600" role="status">
              {saveMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/70 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Archive status
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Archive old test, completed, or bad test records without deleting
              them.
            </p>
          </div>
          <span className="w-fit rounded-lg bg-white px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
            {isArchived ? "Archived" : "Active"}
          </span>
        </div>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
          Archive reason
          <textarea
            value={archiveReason}
            onChange={(event) => setArchiveReason(event.target.value)}
            className="field-control min-h-20"
            placeholder="Optional internal reason, such as test record or completed cleanup."
          />
        </label>
        {isArchived && archivedAt ? (
          <p className="mt-3 text-sm font-medium text-slate-700">
            Archived: {formatDate(archivedAt)}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {isArchived ? (
            <button
              type="button"
              onClick={() => void saveArchiveState(false)}
              disabled={isSavingArchive}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
            >
              {isSavingArchive ? "Restoring..." : "Restore"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void saveArchiveState(true)}
              disabled={isSavingArchive}
              className="inline-flex w-full items-center justify-center rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-900 transition hover:border-amber-400 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 sm:w-fit"
            >
              {isSavingArchive ? "Archiving..." : "Archive"}
            </button>
          )}
          {archiveMessage ? (
            <p className="text-sm font-medium text-slate-700" role="status">
              {archiveMessage}
            </p>
          ) : null}
        </div>
      </div>

      {isFoundingPro ? (
        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Founding Pro usage
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Manual tracking for the current monthly billing period. This
                does not change billing or block fulfillment.
              </p>
            </div>
            <span className="w-fit rounded-lg bg-white px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
              {planNumber
                ? `Plan ${planNumber} of ${numericPlanLimit}`
                : "Plan usage: Not set"}
            </span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Plan number
              <select
                value={planNumber}
                onChange={(event) => setPlanNumber(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Not set</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Plan limit
              <input
                type="number"
                min="1"
                max="99"
                value={planLimit}
                onChange={(event) => setPlanLimit(event.target.value)}
                className="field-control"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Billing period start
              <input
                type="date"
                value={billingPeriodStart}
                onChange={(event) => setBillingPeriodStart(event.target.value)}
                className="field-control"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Billing period end
              <input
                type="date"
                value={billingPeriodEnd}
                onChange={(event) => setBillingPeriodEnd(event.target.value)}
                className="field-control"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[14rem_1fr]">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Subscription status
              <select
                value={subscriptionStatus}
                onChange={(event) =>
                  setSubscriptionStatus(event.target.value as SubscriptionStatus)
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {subscriptionStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Usage notes
              <textarea
                value={usageNotes}
                onChange={(event) => setUsageNotes(event.target.value)}
                className="field-control min-h-24"
                placeholder="Internal notes about billing period, plan count, or usage context."
              />
            </label>
          </div>

          {hasReachedPlanLimit ? (
            <div
              className="mt-4 grid gap-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-950"
              role="status"
            >
              {numericPlanNumber === 4 && numericPlanLimit === 4 ? (
                <p>Included plans used after this delivery.</p>
              ) : null}
              <p>
                This subscriber has reached the included plan limit for this
                billing period.
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => void saveUsage()}
              disabled={isSavingUsage}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
            >
              {isSavingUsage ? "Saving..." : "Save usage"}
            </button>
            {usageMessage ? (
              <p className="text-sm font-medium text-slate-600" role="status">
                {usageMessage}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {isFoundingPro ? (
        <div className="mt-5 rounded-lg border border-teal-100 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Saved Preferences
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {savedPreference
                  ? "Preferences exist for this subscriber email and will be included in copied AI prompts."
                  : "No saved preferences yet for this subscriber email."}
              </p>
            </div>
            <span
              className={`w-fit rounded-lg px-3 py-1 text-xs font-semibold ring-1 ${
                savedPreference
                  ? "bg-teal-50 text-teal-800 ring-teal-100"
                  : "bg-slate-50 text-slate-700 ring-slate-200"
              }`}
            >
              {savedPreference ? "Saved" : "Not saved yet"}
            </span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Typical shift pattern
              <textarea
                value={preferenceTypicalShiftPattern}
                onChange={(event) =>
                  setPreferenceTypicalShiftPattern(event.target.value)
                }
                className="field-control min-h-20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Typical commute time
              <input
                type="text"
                value={preferenceTypicalCommuteTime}
                onChange={(event) =>
                  setPreferenceTypicalCommuteTime(event.target.value)
                }
                className="field-control"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Preferred plan style
              <textarea
                value={preferencePreferredPlanStyle}
                onChange={(event) =>
                  setPreferencePreferredPlanStyle(event.target.value)
                }
                className="field-control min-h-20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Meal prep preferences
              <textarea
                value={preferenceMealPrep}
                onChange={(event) => setPreferenceMealPrep(event.target.value)}
                className="field-control min-h-20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Workout/training preferences
              <textarea
                value={preferenceWorkoutTraining}
                onChange={(event) =>
                  setPreferenceWorkoutTraining(event.target.value)
                }
                className="field-control min-h-20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Recurring responsibilities
              <textarea
                value={preferenceRecurringResponsibilities}
                onChange={(event) =>
                  setPreferenceRecurringResponsibilities(event.target.value)
                }
                className="field-control min-h-20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Avoid after work
              <textarea
                value={preferenceAvoidAfterWork}
                onChange={(event) => setPreferenceAvoidAfterWork(event.target.value)}
                className="field-control min-h-20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Monthly focus
              <textarea
                value={preferenceMonthlyFocus}
                onChange={(event) => setPreferenceMonthlyFocus(event.target.value)}
                className="field-control min-h-20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Last tune-up date
              <input
                type="date"
                value={preferenceLastTuneupDate}
                onChange={(event) => setPreferenceLastTuneupDate(event.target.value)}
                className="field-control"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Plan style notes
              <textarea
                value={preferencePlanStyleNotes}
                onChange={(event) => setPreferencePlanStyleNotes(event.target.value)}
                className="field-control min-h-24"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Preference admin notes
              <textarea
                value={preferenceAdminNotes}
                onChange={(event) => setPreferenceAdminNotes(event.target.value)}
                className="field-control min-h-24"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => void savePreferences()}
              disabled={isSavingPreference}
              className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
            >
              {isSavingPreference ? "Saving..." : "Save Preferences"}
            </button>
            {preferenceMessage ? (
              <p className="text-sm font-medium text-slate-600" role="status">
                {preferenceMessage}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Plan Output</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Paste the final customer-ready plan here after you generate and
              review it. This is internal-only storage for fulfillment.
            </p>
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
              Before delivery, verify dates, shift times, and appointments
              match the customer&apos;s intake.
            </p>
          </div>
          <span
            className={`w-fit rounded-lg px-3 py-1 text-xs font-semibold ring-1 ${
              deliveredPlan
                ? "bg-teal-50 text-teal-800 ring-teal-100"
                : "bg-slate-50 text-slate-700 ring-slate-200"
            }`}
          >
            {deliveredPlan ? "Saved plan exists" : "No saved plan yet"}
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Plan title
            <input
              type="text"
              value={planTitle}
              onChange={(event) => setPlanTitle(event.target.value)}
              className="field-control"
              placeholder="Custom 7-Day ShiftPlan"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Plan start date
            <input
              type="date"
              value={planStartDate}
              onChange={(event) => setPlanStartDate(event.target.value)}
              className="field-control"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Plan end date
            <input
              type="date"
              value={planEndDate}
              onChange={(event) => setPlanEndDate(event.target.value)}
              className="field-control"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[14rem_1fr]">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Delivery status
            <select
              value={planDeliveryStatus}
              onChange={(event) =>
                setPlanDeliveryStatus(event.target.value as DeliveryStatus)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {deliveryStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Plan output admin notes
            <textarea
              value={planAdminNotes}
              onChange={(event) => setPlanAdminNotes(event.target.value)}
              className="field-control min-h-24"
              placeholder="Internal notes about review, revision, or delivery."
            />
          </label>
        </div>

        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
          Final plan body
          <textarea
            value={planBody}
            onChange={(event) => setPlanBody(event.target.value)}
            className="field-control min-h-72 font-mono text-sm"
            placeholder="Paste the final ShiftPlan here after review."
          />
        </label>

        {deliveredPlan?.delivered_at ? (
          <p className="mt-3 text-sm font-medium text-slate-600">
            Plan delivered: {formatDate(deliveredPlan.delivered_at)}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => void generateDraftPlan()}
            disabled={isGeneratingDraft || isSavingPlan || Boolean(generationBlockMessage)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
          >
            {isGeneratingDraft ? "Generating..." : "Generate Draft Plan"}
          </button>
          <button
            type="button"
            onClick={() => void savePlan()}
            disabled={isSavingPlan || isGeneratingDraft}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
          >
            {isSavingPlan ? "Saving..." : "Save Plan"}
          </button>
          <button
            type="button"
            onClick={() => void markPlanDelivered()}
            disabled={isSavingPlan || isGeneratingDraft}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 sm:w-fit"
          >
            Mark Delivered
          </button>
          <CopyButton
            copied={copiedKey === `saved-plan-${intake.id}`}
            failed={copiedKey === `saved-plan-${intake.id}-failed`}
            label="Copy Saved Plan"
            onClick={() =>
              void copyText(
                `saved-plan-${intake.id}`,
                planBody || "No saved plan body yet.",
              )
            }
            variant="secondary"
          />
          <CopyButton
            copied={copiedKey === `delivery-email-${intake.id}`}
            failed={copiedKey === `delivery-email-${intake.id}-failed`}
            label="Copy Delivery Email"
            onClick={copyDeliveryEmail}
            variant="secondary"
          />
          {planMessage ? (
            <p className="text-sm font-medium text-slate-600" role="status">
              {planMessage}
            </p>
          ) : null}
          {draftMessage ? (
            <p className="text-sm font-medium text-slate-600" role="status">
              {draftMessage}
            </p>
          ) : null}
          {generationBlockMessage && !draftMessage ? (
            <p className="text-sm font-medium text-amber-800" role="status">
              {generationBlockMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <CopyButton
          copied={copiedKey === `prompt-${intake.id}`}
          failed={copiedKey === `prompt-${intake.id}-failed`}
          label="Copy AI Prompt"
          onClick={() =>
            void copyText(
              `prompt-${intake.id}`,
              buildAiPrompt(intake, savedPreference),
            )
          }
        />
        <CopyButton
          copied={copiedKey === `email-${intake.id}`}
          failed={copiedKey === `email-${intake.id}-failed`}
          label="Copy Customer Email Draft"
          onClick={() =>
            void copyText(`email-${intake.id}`, buildCustomerEmailDraft(intake))
          }
          variant="secondary"
        />
      </div>

      <details className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-teal-800">
          View planning details
        </summary>
        <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AdminField label="Exact work shifts" value={intake.exact_work_shifts || "-"} />
          <AdminField
            label="Commute time"
            value={intake.commute_time || intake.typical_commute_time || "-"}
          />
          <AdminField
            label="Meal prep"
            value={
              intake.meal_prep_preferences || intake.meal_prep_needs_this_week || "-"
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
          <AdminField label="What to organize" value={intake.organize_focus || "-"} />
        </dl>
      </details>
    </article>
  );
}

function CopyButton({
  copied,
  failed,
  label,
  onClick,
  variant = "primary",
}: {
  copied: boolean;
  failed: boolean;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const baseClasses =
    "inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit";
  const variantClasses =
    variant === "primary"
      ? "bg-teal-800 text-white hover:bg-teal-900"
      : "border border-slate-300 bg-white text-slate-800 hover:border-teal-300 hover:text-teal-900";

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {failed ? "Copy failed" : copied ? "Copied" : label}
    </button>
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

function formatBooleanStatus(value: boolean | null) {
  if (value === null) return "-";
  return value ? "Active" : "Inactive";
}

function formatNullableNumber(value: number | null) {
  return typeof value === "number" ? String(value) : "-";
}

function formatMetadata(value: Record<string, unknown>) {
  return JSON.stringify(value || {}, null, 2);
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

function formatUsageBadge(intake: ShiftPlanPaidIntake) {
  const planLimit = intake.founding_pro_plan_limit || 4;

  if (!intake.founding_pro_plan_number) {
    return "Plan usage: Not set";
  }

  return `Plan ${intake.founding_pro_plan_number} of ${planLimit} for this billing period.`;
}

function formatBillingPeriod(intake: ShiftPlanPaidIntake) {
  const start = intake.billing_period_start;
  const end = intake.billing_period_end;

  if (!start && !end) return "Not set";
  if (start && end) return `${formatPlainDate(start)} to ${formatPlainDate(end)}`;
  return formatPlainDate(start || end || "");
}

function buildAiPrompt(
  intake: ShiftPlanPaidIntake,
  savedPreference: ShiftPlanSubscriberPreference | null,
) {
  const isCustomPlan = intake.intake_type === "custom_plan";
  const header = isCustomPlan
    ? "CUSTOM 7-DAY SHIFTPLAN"
    : "SHIFTPLAN FOUNDING PRO — WEEKLY PLAN";

  return [
    header,
    "",
    "Product:",
    "ShiftPlan helps nurses and shift workers turn messy shift schedules into simple weekly life plans. It helps organize sleep/wind-down blocks, meals, workouts, recovery/reset blocks, errands, appointments, family responsibilities, training schedules, and personal tasks around irregular, long, or demanding schedules.",
    "",
    "Safety boundaries:",
    "ShiftPlan is lifestyle and routine planning only.",
    "Do not provide medical advice, diagnosis, treatment, sleep disorder guidance, fatigue treatment, burnout treatment, medication guidance, supplement guidance, healthcare advice, mental health guidance, workplace safety guidance, or emergency support.",
    "Do not claim to fix sleep problems, fatigue, burnout, anxiety, insomnia, sleep disorders, or any medical condition.",
    "Use safe language such as routine planning, weekly structure, wind-down block, reset block, recovery block, meal prep placement, workout placement, task batching, and checklist.",
    "",
    "Schedule-data quality rules:",
    "Paid plans must be based on the actual submitted shift days and times.",
    "Use the submitted plan_start_date/plan_end_date or week_start_date/week_end_date exactly.",
    "Calculate each calendar date and weekday correctly.",
    "Do not shift the week.",
    "Do not invent a Sunday-start week if the submitted start date is Monday.",
    "Do not invent shift days or shift times.",
    "Do not use generic Mon/Wed/Fri templates unless the submitted intake explicitly says those are the workdays.",
    "If the user mentions an event such as Sunday family dinner, place it on the actual Sunday date inside the submitted week.",
    "Before finalizing the plan, internally verify that every day label matches the calendar date.",
    "If required schedule details are missing, do not produce a customer-ready plan. Instead, ask for the missing shift days and times.",
    "If saved preferences mention recurring responsibilities without exact days or times, treat them as flexible. For example: Place school pickup on the confirmed pickup days this week. Do not invent Tuesday/Thursday unless the intake says Tuesday/Thursday.",
    "",
    "Canonical date list to use for day headings:",
    formatCanonicalDateList(intake),
    "",
    "Customer intake data:",
    formatPromptFields([
      ["Intake type", formatPaidLabel(intake.intake_type)],
      ["First name", intake.first_name],
      ["Email", intake.email],
      ["Plan dates or week dates", formatPlanDates(intake)],
      [
        "Founding Pro usage",
        isCustomPlan ? "Not applicable" : formatUsageBadge(intake),
      ],
      ["Billing period", isCustomPlan ? "Not applicable" : formatBillingPeriod(intake)],
      [
        "Subscription status",
        isCustomPlan ? "Not applicable" : intake.subscription_status || "Unknown",
      ],
      ["Job / role", intake.job_role],
      ["Schedule type", intake.schedule_type],
      ["Typical shift pattern", intake.typical_shift_pattern],
      ["Exact work shifts", intake.exact_work_shifts],
      ["Commute time", intake.commute_time || intake.typical_commute_time],
      ["Main goal", intake.main_goal],
      ["Monthly goal", intake.monthly_goal],
      [
        "Meal prep preferences or needs",
        intake.meal_prep_preferences || intake.meal_prep_needs_this_week,
      ],
      [
        "Workout / training goals or preferences",
        intake.workout_training_goals ||
          intake.workout_training_preferences ||
          intake.workout_training_goals_this_week,
      ],
      ["Appointments", intake.appointments || intake.appointments_this_week],
      ["Errands", intake.errands || intake.errands_this_week],
      [
        "Family / personal responsibilities",
        intake.family_personal_responsibilities ||
          intake.family_personal_responsibilities_this_week,
      ],
      ["Top 3 priorities", intake.top_3_priorities || intake.top_3_priorities_this_week],
      ["Anything to avoid", intake.anything_to_avoid],
      ["Preferred plan style", intake.preferred_plan_style],
      ["Organizing focus", intake.organize_focus],
      ["Recurring responsibilities", intake.recurring_responsibilities],
      ["Avoid after work", intake.avoid_after_work],
      ["Messy week reason", intake.messy_week_reason],
      ["Changed from last week", intake.changed_from_last_week],
      ["What worked from last plan", intake.worked_from_last_plan],
      ["What felt unrealistic", intake.unrealistic_from_last_plan],
      ["Specific request this week", intake.specific_request_this_week],
    ]),
    "",
    !isCustomPlan && savedPreference
      ? formatSavedPreferences(savedPreference)
      : "Saved preferences: Not saved yet.",
    "",
    "Output rules:",
    "1. Create a realistic 7-day plan.",
    "2. Build around the exact submitted shift days and times.",
    "3. Do not overload post-shift periods.",
    "4. Batch errands and appointments when possible.",
    "5. Place workouts/training where they fit best around the schedule.",
    "6. Include meal prep placement, not nutrition coaching.",
    "7. Include recovery/reset blocks as lifestyle organization, not treatment.",
    "8. Include a copy/paste checklist.",
    "9. Include the safety disclaimer.",
    "10. Use plain, practical language.",
    "11. Make the plan feel premium, organized, and personalized.",
    "12. Do not mention that AI generated the plan.",
    "13. Date alignment review: each day heading must include both weekday and date, the weekday must match the date, work shifts must stay on the submitted shift dates, and events must stay on the submitted event days when provided.",
    "",
    `Required output structure for ${isCustomPlan ? "custom_plan" : "founding_pro / founding_pro_weekly"}:`,
    isCustomPlan ? customPlanOutputStructure : foundingProOutputStructure,
    "",
    "Important disclaimer text to include in the prompt output:",
    "ShiftPlan is for lifestyle and routine organization only. This plan helps organize your week around work, meals, workouts, errands, appointments, recovery blocks, and personal responsibilities. It does not provide medical advice, diagnosis, treatment, sleep disorder guidance, fatigue treatment, burnout treatment, medication guidance, or healthcare advice.",
  ].join("\n");
}

function formatSavedPreferences(preference: ShiftPlanSubscriberPreference) {
  return [
    "Saved preferences used:",
    formatPromptFields([
      ["Commute", preference.typical_commute_time],
      ["Preferred plan style", preference.preferred_plan_style],
      ["Meal prep preferences", preference.meal_prep_preferences],
      ["Workout/training preferences", preference.workout_training_preferences],
      ["Recurring responsibilities", preference.recurring_responsibilities],
      ["Avoid after work", preference.avoid_after_work],
      ["Monthly focus", preference.monthly_focus],
      ["Plan style notes", preference.plan_style_notes],
    ]),
  ].join("\n");
}

function buildCustomerEmailDraft(intake: ShiftPlanPaidIntake) {
  const firstName = valueOrFallback(intake.first_name);
  const planName = formatPaidLabel(intake.intake_type);

  return [
    `Subject: Your ${planName} is ready`,
    "",
    `Hi ${firstName},`,
    "",
    `Your ${planName} is ready. I built it around the schedule details and preferences you submitted, with a focus on keeping the week practical and easy to follow.`,
    "",
    "Important note: ShiftPlan is for lifestyle and routine organization only. It does not provide medical advice, diagnosis, treatment, sleep disorder guidance, fatigue treatment, burnout treatment, medication guidance, or healthcare advice.",
    "",
    "Best,",
    "ShiftPlan",
  ].join("\n");
}

function buildDeliveryEmailDraft(
  intake: ShiftPlanPaidIntake,
  deliveredPlan: ShiftPlanDeliveredPlan,
  usage: { planNumber: string; planLimit: string },
) {
  const firstName = valueOrFallback(intake.first_name);
  const planDates = formatDeliveryPlanDates(deliveredPlan, intake);
  const planBody = deliveredPlan.plan_body.trim();
  const foundingProWeeklySection =
    intake.intake_type === "founding_pro_weekly"
      ? [
          "Plan usage:",
          `This is Plan ${usage.planNumber || "X"} of ${usage.planLimit || "Y"} for your current billing period.`,
          "",
          "Founding Pro check-in:",
          "After this week, reply with:",
          "1. What worked?",
          "2. What felt unrealistic?",
          "3. What changed?",
          "4. What should be adjusted next week?",
          "",
        ]
      : [];

  return [
    `Subject: Your ShiftPlan for ${planDates} is ready`,
    "",
    `Hi ${firstName},`,
    "",
    `Your ShiftPlan for ${planDates} is ready.`,
    "",
    "This plan was built around the schedule and priorities you submitted.",
    "",
    "Inside your plan, you'll find:",
    "- Your week at a glance",
    "- A 7-day routine structure",
    "- Workday and off-day planning",
    "- Meal prep placement",
    "- Workout/training placement",
    "- Errand and appointment batching",
    "- Top priorities",
    "- A simple copy/paste checklist",
    "",
    "Important note:",
    "ShiftPlan is for lifestyle and routine organization only. It does not provide medical advice, diagnosis, treatment, sleep disorder guidance, fatigue treatment, burnout treatment, medication guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support.",
    "",
    ...foundingProWeeklySection,
    "Your plan:",
    "",
    planBody,
    "",
    "Thanks,",
    "ShiftPlan",
  ].join("\n");
}

function formatDeliveryPlanDates(
  deliveredPlan: ShiftPlanDeliveredPlan,
  intake: ShiftPlanPaidIntake,
) {
  const start =
    deliveredPlan.plan_start_date || intake.plan_start_date || intake.week_start_date;
  const end = deliveredPlan.plan_end_date || intake.plan_end_date || intake.week_end_date;

  if (start && end) {
    return `${formatPlainDate(start)} to ${formatPlainDate(end)}`;
  }

  if (start || end) {
    return formatPlainDate(start || end || "");
  }

  return "your requested week";
}

const customPlanOutputStructure = [
  "1. Header",
  "2. Important note",
  "3. Your week at a glance",
  "4. 7-day plan",
  "5. Workday routine",
  "6. Post-shift reset",
  "7. Off-day routine",
  "8. Meal prep structure",
  "9. Workout/training placement",
  "10. Errands, appointments, and family responsibilities",
  "11. Top 3 priorities this week",
  "12. Simple copy/paste checklist",
  "13. Final note",
].join("\n");

const foundingProOutputStructure = [
  "1. Header",
  "2. Plan usage for this billing period if available",
  "3. Saved preferences used if available",
  "4. Important note",
  "5. This week’s game plan",
  "6. Your week at a glance",
  "7. 7-day plan",
  "8. Workday routine",
  "9. Post-shift reset",
  "10. Off-day routine",
  "11. Meal prep structure",
  "12. Workout/training placement",
  "13. Errands, appointments, and family responsibilities",
  "14. Top 3 priorities this week",
  "15. Copy/paste checklist",
  "16. Founding Pro weekly check-in",
  "17. Final note",
].join("\n");

function formatPromptFields(fields: [string, string | null | undefined][]) {
  return fields
    .map(([label, value]) => `- ${label}: ${valueOrFallback(value)}`)
    .join("\n");
}

function valueOrFallback(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : "Not provided";
}

function formatCanonicalDateList(intake: ShiftPlanPaidIntake) {
  const start = intake.plan_start_date || intake.week_start_date;
  const end = intake.plan_end_date || intake.week_end_date;

  if (!isIsoDate(start) || !isIsoDate(end)) {
    return "Not provided";
  }

  const startDate = parseIsoDateAsUtc(start);
  const endDate = parseIsoDateAsUtc(end);

  if (endDate.getTime() < startDate.getTime()) {
    return "Not provided";
  }

  const rows: string[] = [];
  const cursor = new Date(startDate);

  for (let index = 0; index < 7 && cursor.getTime() <= endDate.getTime(); index += 1) {
    const isoDate = cursor.toISOString().slice(0, 10);
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(cursor);
    rows.push(`- ${weekday}, ${isoDate}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return rows.length ? rows.join("\n") : "Not provided";
}

function isIsoDate(value: string | null | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function parseIsoDateAsUtc(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getDraftGenerationBlockMessage(intake: ShiftPlanPaidIntake) {
  if (intake.intake_type === "founding_pro") {
    return "Founding Pro onboarding saves preferences. Ask the subscriber to submit a weekly schedule before generating a weekly plan.";
  }

  if (intake.intake_type === "custom_plan" && !intake.exact_work_shifts?.trim()) {
    return "Exact work shifts are required before generating a paid ShiftPlan.";
  }

  if (
    intake.intake_type === "founding_pro_weekly" &&
    !intake.exact_work_shifts?.trim()
  ) {
    return "This weekly schedule needs exact shift days and times before generating a plan.";
  }

  return "";
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
