import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

type AdminRequest = {
  password?: unknown;
};

type AppUser = {
  id: string;
  created_at: string;
  email: string;
  first_name: string | null;
  access_code_id: string | null;
  last_seen_at: string | null;
  status: string;
};

type AppAccessCode = {
  id: string;
  email: string;
  code_label: string | null;
  is_active: boolean;
  expires_at: string | null;
  max_generations_per_month: number | null;
  max_generations_per_day: number | null;
};

type AppUserPreference = {
  id: string;
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

type AppPlanRequest = {
  id: string;
  created_at: string;
  app_user_id: string;
  week_start_date: string;
  week_end_date: string;
  schedule_type: string;
  work_schedule: string;
  main_goal: string;
  preferred_plan_style: string;
  status: string;
};

type AppSavedPlan = {
  id: string;
  created_at: string;
  app_user_id: string;
  plan_request_id: string;
  week_start_date: string;
  week_end_date: string;
  plan_title: string | null;
  usage_month: number;
  usage_year: number;
  generation_number_for_month: number;
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

type AppUsageEvent = {
  id: string;
  created_at: string;
  app_user_id: string | null;
  event_type: string;
  metadata: Record<string, unknown>;
};

const appUserColumns = [
  "id",
  "created_at",
  "email",
  "first_name",
  "access_code_id",
  "last_seen_at",
  "status",
].join(",");

const appAccessCodeColumns = [
  "id",
  "email",
  "code_label",
  "is_active",
  "expires_at",
  "max_generations_per_month",
  "max_generations_per_day",
].join(",");

const appUserPreferenceColumns = [
  "id",
  "updated_at",
  "app_user_id",
  "typical_shift_type",
  "usual_commute_time",
  "preferred_plan_style",
  "meal_prep_preferences",
  "workout_training_preferences",
  "recurring_responsibilities",
  "things_to_avoid_after_work",
  "default_week_start_day",
  "planning_notes",
].join(",");

const appPlanRequestColumns = [
  "id",
  "created_at",
  "app_user_id",
  "week_start_date",
  "week_end_date",
  "schedule_type",
  "work_schedule",
  "main_goal",
  "preferred_plan_style",
  "status",
].join(",");

const appSavedPlanColumns = [
  "id",
  "created_at",
  "app_user_id",
  "plan_request_id",
  "week_start_date",
  "week_end_date",
  "plan_title",
  "usage_month",
  "usage_year",
  "generation_number_for_month",
].join(",");

const appPlanFeedbackColumns = [
  "id",
  "created_at",
  "updated_at",
  "app_user_id",
  "app_saved_plan_id",
  "usefulness_rating",
  "used_this_week",
  "what_worked",
  "what_felt_unrealistic",
  "what_should_shiftplan_remember",
  "would_use_weekly",
  "would_pay_9_month",
  "additional_notes",
].join(",");

const appUsageEventColumns = [
  "id",
  "created_at",
  "app_user_id",
  "event_type",
  "metadata",
].join(",");

export async function POST(request: Request) {
  let payload: AdminRequest;

  try {
    payload = (await request.json()) as AdminRequest;
  } catch {
    return NextResponse.json(
      { message: "Enter the admin password and try again." },
      { status: 400 },
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!adminPassword) {
    return NextResponse.json(
      { message: "ADMIN_PASSWORD is not configured for this environment." },
      { status: 500 },
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { message: "That password did not work." },
      { status: 401 },
    );
  }

  const supabaseRestUrl = getSupabaseRestUrl();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseRestUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { message: "Supabase admin environment variables are not configured." },
      { status: 500 },
    );
  }

  const headers = {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
  };

  const queries = {
    users: new URLSearchParams({
      select: appUserColumns,
      order: "created_at.desc",
      limit: "100",
    }),
    accessCodes: new URLSearchParams({
      select: appAccessCodeColumns,
      limit: "200",
    }),
    preferences: new URLSearchParams({
      select: appUserPreferenceColumns,
      order: "updated_at.desc",
      limit: "200",
    }),
    requests: new URLSearchParams({
      select: appPlanRequestColumns,
      order: "created_at.desc",
      limit: "500",
    }),
    savedPlans: new URLSearchParams({
      select: appSavedPlanColumns,
      order: "created_at.desc",
      limit: "500",
    }),
    feedback: new URLSearchParams({
      select: appPlanFeedbackColumns,
      order: "updated_at.desc",
      limit: "500",
    }),
    usageEvents: new URLSearchParams({
      select: appUsageEventColumns,
      order: "created_at.desc",
      limit: "300",
    }),
  };

  try {
    const [
      usersResponse,
      accessCodesResponse,
      preferencesResponse,
      requestsResponse,
      savedPlansResponse,
      feedbackResponse,
      usageEventsResponse,
    ] = await Promise.all([
      fetch(`${supabaseRestUrl}/app_users?${queries.users}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${supabaseRestUrl}/app_access_codes?${queries.accessCodes}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${supabaseRestUrl}/app_user_preferences?${queries.preferences}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${supabaseRestUrl}/app_plan_requests?${queries.requests}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${supabaseRestUrl}/app_saved_plans?${queries.savedPlans}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${supabaseRestUrl}/app_plan_feedback?${queries.feedback}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${supabaseRestUrl}/app_usage_events?${queries.usageEvents}`, {
        headers,
        cache: "no-store",
      }),
    ]);

    if (
      !usersResponse.ok ||
      !accessCodesResponse.ok ||
      !preferencesResponse.ok ||
      !requestsResponse.ok ||
      !savedPlansResponse.ok ||
      !feedbackResponse.ok ||
      !usageEventsResponse.ok
    ) {
      return NextResponse.json(
        {
          message:
            "Could not load app beta data. Confirm the Supabase service role key and app tables are configured.",
        },
        { status: 502 },
      );
    }

    const [
      users,
      accessCodes,
      preferences,
      requests,
      savedPlans,
      feedback,
      usageEvents,
    ] = (await Promise.all([
      usersResponse.json(),
      accessCodesResponse.json(),
      preferencesResponse.json(),
      requestsResponse.json(),
      savedPlansResponse.json(),
      feedbackResponse.json(),
      usageEventsResponse.json(),
    ])) as [
      AppUser[],
      AppAccessCode[],
      AppUserPreference[],
      AppPlanRequest[],
      AppSavedPlan[],
      AppPlanFeedback[],
      AppUsageEvent[],
    ];

    const appBetaUsers = buildAppBetaUsers({
      users,
      accessCodes,
      preferences,
      requests,
      savedPlans,
      feedback,
      usageEvents,
    });

    return NextResponse.json(
      { appBetaUsers },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

function buildAppBetaUsers({
  users,
  accessCodes,
  preferences,
  requests,
  savedPlans,
  feedback,
  usageEvents,
}: {
  users: AppUser[];
  accessCodes: AppAccessCode[];
  preferences: AppUserPreference[];
  requests: AppPlanRequest[];
  savedPlans: AppSavedPlan[];
  feedback: AppPlanFeedback[];
  usageEvents: AppUsageEvent[];
}) {
  const now = new Date();
  const usageMonth = now.getUTCMonth() + 1;
  const usageYear = now.getUTCFullYear();
  const dayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;
  const accessCodeById = new Map(accessCodes.map((code) => [code.id, code]));
  const preferencesByUserId = new Map(
    preferences.map((preference) => [preference.app_user_id, preference]),
  );
  const requestsByUserId = groupByUserId(requests);
  const savedPlansByUserId = groupByUserId(savedPlans);
  const feedbackByUserId = groupByUserId(feedback);
  const usageEventsByUserId = groupByUserId(
    usageEvents.filter((event) => event.app_user_id),
  ) as Record<string, AppUsageEvent[]>;

  return users.map((user) => {
    const userAccessCode = user.access_code_id
      ? accessCodeById.get(user.access_code_id) || null
      : null;
    const userRequests = requestsByUserId[user.id] || [];
    const userSavedPlans = savedPlansByUserId[user.id] || [];
    const userFeedback = feedbackByUserId[user.id] || [];
    const userUsageEvents = usageEventsByUserId[user.id] || [];
    const plansUsedThisMonth = userSavedPlans.filter(
      (plan) => plan.usage_month === usageMonth && plan.usage_year === usageYear,
    ).length;
    const plansGeneratedToday = userSavedPlans.filter((plan) => {
      const createdAt = new Date(plan.created_at).getTime();
      return createdAt >= dayStart && createdAt < dayEnd;
    }).length;

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      status: user.status,
      created_at: user.created_at,
      last_seen_at: user.last_seen_at,
      access_code_label: userAccessCode?.code_label || null,
      access_code_active: userAccessCode?.is_active ?? null,
      access_code_expires_at: userAccessCode?.expires_at || null,
      max_generations_per_month:
        userAccessCode?.max_generations_per_month ?? null,
      max_generations_per_day: userAccessCode?.max_generations_per_day ?? null,
      plans_used_this_month: plansUsedThisMonth,
      plans_generated_today: plansGeneratedToday,
      weekly_request_count: userRequests.length,
      saved_plan_count: userSavedPlans.length,
      feedback_count: userFeedback.length,
      latest_request: userRequests[0] || null,
      latest_saved_plan: userSavedPlans[0] || null,
      latest_feedback: userFeedback[0] || null,
      saved_preferences: preferencesByUserId.get(user.id) || null,
      recent_usage_events: userUsageEvents.slice(0, 8),
    };
  });
}

function groupByUserId<T extends { app_user_id?: string | null }>(rows: T[]) {
  return rows.reduce<Record<string, T[]>>((groups, row) => {
    if (!row.app_user_id) return groups;
    groups[row.app_user_id] = groups[row.app_user_id] || [];
    groups[row.app_user_id].push(row);
    return groups;
  }, {});
}
