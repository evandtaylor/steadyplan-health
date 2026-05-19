import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  APP_ACCESS_SESSION_COOKIE_NAME,
  verifyAppAccessSession,
} from "@/lib/app-access";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

export const runtime = "nodejs";

type GeneratePlanPayload = {
  plan_request_id?: unknown;
};

type AppPlanRequest = {
  id: string;
  created_at: string;
  app_user_id: string;
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
  safety_acknowledged: boolean;
  status: "submitted" | "generated" | "failed" | "blocked_safety";
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
};

type UpdatedPlanRequest = {
  id: string;
  status: AppPlanRequest["status"];
};

type OpenAIResponse = {
  output_text?: unknown;
  output?: unknown;
};

type AppUserAccess = {
  id: string;
  access_code_id: string | null;
};

type AppAccessCodeLimits = {
  max_generations_per_month: number | null;
  max_generations_per_day: number | null;
};

type AppUserPreferences = {
  id: string;
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

type UsageSummary = {
  monthUsed: number;
  monthLimit: number;
  dayUsed: number;
  dayLimit: number;
  monthlyLimitReached: boolean;
  dailyLimitReached: boolean;
};

const appPlanRequestColumns = [
  "id",
  "created_at",
  "app_user_id",
  "email",
  "week_start_date",
  "week_end_date",
  "schedule_type",
  "work_schedule",
  "commute_time",
  "main_goal",
  "meal_prep_needs",
  "workout_training_goals",
  "appointments",
  "errands",
  "family_personal_responsibilities",
  "top_priorities",
  "anything_to_avoid",
  "preferred_plan_style",
  "safety_acknowledged",
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
  "plan_body",
  "plan_json",
  "generation_source",
  "usage_month",
  "usage_year",
  "generation_number_for_month",
].join(",");

const appUserPreferencesColumns = [
  "id",
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

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before generating a plan." },
      { status: 401 },
    );
  }

  let payload: GeneratePlanPayload;
  try {
    payload = (await request.json()) as GeneratePlanPayload;
  } catch {
    return NextResponse.json(
      { message: "Choose a weekly request before generating a plan." },
      { status: 400 },
    );
  }

  const planRequestId =
    typeof payload.plan_request_id === "string"
      ? payload.plan_request_id.trim()
      : "";

  if (!planRequestId) {
    return NextResponse.json(
      { message: "Choose a weekly request before generating a plan." },
      { status: 400 },
    );
  }

  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    return NextResponse.json(
      { message: "OpenAI is not configured in this environment." },
      { status: 500 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan app generation is not configured yet." },
      { status: 500 },
    );
  }

  try {
    const planRequest = await getPlanRequest(
      config.supabaseRestUrl,
      config.headers,
      session.appUserId,
      planRequestId,
    );

    if (planRequest === false) {
      return NextResponse.json(
        { message: "Could not load this weekly request right now." },
        { status: 502 },
      );
    }

    if (!planRequest) {
      return NextResponse.json(
        { message: "Weekly request was not found for this app access." },
        { status: 404 },
      );
    }

    const validationMessage = getGenerationBlockMessage(planRequest);
    if (validationMessage) {
      return NextResponse.json({ message: validationMessage }, { status: 400 });
    }

    const existingPlan = await getExistingSavedPlan(
      config.supabaseRestUrl,
      config.headers,
      session.appUserId,
      planRequest.id,
    );

    if (existingPlan === false) {
      return NextResponse.json(
        { message: "Could not check saved plans right now." },
        { status: 502 },
      );
    }

    if (existingPlan && planRequest.status === "generated") {
      return NextResponse.json(
        {
          message: "Saved plan loaded.",
          plan: existingPlan,
          request: planRequest,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const usage = await getUsageSummary(
      config.supabaseRestUrl,
      config.headers,
      session.appUserId,
    );

    if (usage === false) {
      return NextResponse.json(
        { message: "Could not check app usage limits right now." },
        { status: 502 },
      );
    }

    if (usage.monthlyLimitReached || usage.dailyLimitReached) {
      const reason = usage.monthlyLimitReached
        ? "monthly_limit_reached"
        : "daily_limit_reached";

      await recordUsageEvent(config.supabaseRestUrl, config.headers, {
        appUserId: session.appUserId,
        eventType: "app_plan_generation_blocked",
        metadata: {
          app_plan_request_id: planRequest.id,
          reason,
          month_used: usage.monthUsed,
          month_limit: usage.monthLimit,
          day_used: usage.dayUsed,
          day_limit: usage.dayLimit,
        },
      });

      return NextResponse.json(
        {
          message:
            "You've used your included AI ShiftPlans for this period. You can still view and copy saved plans.",
          usage: {
            month_used: usage.monthUsed,
            month_limit: usage.monthLimit,
            day_used: usage.dayUsed,
            day_limit: usage.dayLimit,
          },
        },
        { status: 429 },
      );
    }

    const preferences = await getUserPreferences(
      config.supabaseRestUrl,
      config.headers,
      session.appUserId,
    );

    if (preferences === false) {
      return NextResponse.json(
        { message: "Could not load saved preferences right now." },
        { status: 502 },
      );
    }

    const draft = await generatePlan(
      openAiApiKey,
      process.env.OPENAI_MODEL || "gpt-5.2",
      buildPlanPrompt(planRequest, preferences),
    );

    if (!draft) {
      await markPlanRequestStatus(
        config.supabaseRestUrl,
        config.headers,
        planRequest.id,
        "failed",
      );

      return NextResponse.json(
        { message: "OpenAI could not generate a plan right now." },
        { status: 500 },
      );
    }

    const usageDate = new Date();
    const usageMonth = usageDate.getUTCMonth() + 1;
    const usageYear = usageDate.getUTCFullYear();
    const generationNumber =
      existingPlan?.generation_number_for_month ||
      (await getNextGenerationNumber(
        config.supabaseRestUrl,
        config.headers,
        session.appUserId,
        usageYear,
        usageMonth,
      ));

    const savedPlan = await saveGeneratedPlan(
      config.supabaseRestUrl,
      config.headers,
      existingPlan?.id || null,
      {
        app_user_id: session.appUserId,
        plan_request_id: planRequest.id,
        week_start_date: planRequest.week_start_date,
        week_end_date: planRequest.week_end_date,
        plan_title: buildPlanTitle(planRequest),
        plan_body: draft,
        plan_json: {
          request_status_before_generation: planRequest.status,
          schedule_type: planRequest.schedule_type,
          preferred_plan_style: planRequest.preferred_plan_style,
          saved_preferences_used: Boolean(preferences),
          generated_at: new Date().toISOString(),
        },
        generation_source: "openai",
        usage_month: usageMonth,
        usage_year: usageYear,
        generation_number_for_month: generationNumber,
      },
    );

    if (!savedPlan) {
      return NextResponse.json(
        { message: "Plan was generated, but it could not be saved." },
        { status: 502 },
      );
    }

    const updatedRequest = await markPlanRequestStatus(
      config.supabaseRestUrl,
      config.headers,
      planRequest.id,
      "generated",
    );

    await recordUsageEvent(config.supabaseRestUrl, config.headers, {
      appUserId: session.appUserId,
      eventType: "app_plan_generated",
      metadata: {
        app_saved_plan_id: savedPlan.id,
        app_plan_request_id: planRequest.id,
        month_used: usage.monthUsed + 1,
        month_limit: usage.monthLimit,
        day_used: usage.dayUsed + 1,
        day_limit: usage.dayLimit,
      },
    });

    return NextResponse.json(
      {
        message: "ShiftPlan generated and saved.",
        plan: savedPlan,
        request: updatedRequest || { id: planRequest.id, status: "generated" },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not generate your ShiftPlan right now." },
      { status: 500 },
    );
  }
}

async function getUsageSummary(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
): Promise<UsageSummary | false> {
  const [limits, monthUsed, dayUsed] = await Promise.all([
    getGenerationLimits(supabaseRestUrl, headers, appUserId),
    countSavedPlans(supabaseRestUrl, headers, appUserId, "month"),
    countSavedPlans(supabaseRestUrl, headers, appUserId, "day"),
  ]);

  if (limits === false || monthUsed === false || dayUsed === false) {
    return false;
  }

  return {
    monthUsed,
    monthLimit: limits.monthLimit,
    dayUsed,
    dayLimit: limits.dayLimit,
    monthlyLimitReached: monthUsed >= limits.monthLimit,
    dailyLimitReached: dayUsed >= limits.dayLimit,
  };
}

async function getGenerationLimits(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
): Promise<{ monthLimit: number; dayLimit: number } | false> {
  const fallback = { monthLimit: 4, dayLimit: 2 };
  const userQuery = new URLSearchParams({
    select: "id,access_code_id",
    id: `eq.${appUserId}`,
    limit: "1",
  });
  const userResponse = await fetch(`${supabaseRestUrl}/app_users?${userQuery}`, {
    headers,
    cache: "no-store",
  });

  if (!userResponse.ok) return false;

  const users = (await userResponse.json()) as AppUserAccess[];
  const user = users[0];
  if (!user?.access_code_id) return fallback;

  const accessQuery = new URLSearchParams({
    select: "max_generations_per_month,max_generations_per_day",
    id: `eq.${user.access_code_id}`,
    limit: "1",
  });
  const accessResponse = await fetch(
    `${supabaseRestUrl}/app_access_codes?${accessQuery}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!accessResponse.ok) return false;

  const accessCodes = (await accessResponse.json()) as AppAccessCodeLimits[];
  const accessCode = accessCodes[0];

  return {
    monthLimit: normalizeLimit(accessCode?.max_generations_per_month, 4),
    dayLimit: normalizeLimit(accessCode?.max_generations_per_day, 2),
  };
}

async function countSavedPlans(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
  period: "month" | "day",
) {
  const now = new Date();
  const query = new URLSearchParams({
    select: "id",
    app_user_id: `eq.${appUserId}`,
  });

  if (period === "month") {
    query.set("usage_year", `eq.${now.getUTCFullYear()}`);
    query.set("usage_month", `eq.${now.getUTCMonth() + 1}`);
  } else {
    const dayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    query.append("created_at", `gte.${dayStart.toISOString()}`);
    query.append("created_at", `lt.${dayEnd.toISOString()}`);
  }

  const response = await fetch(`${supabaseRestUrl}/app_saved_plans?${query}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) return false;

  const rows = (await response.json()) as { id: string }[];
  return rows.length;
}

async function getSession() {
  const cookieStore = await cookies();
  return verifyAppAccessSession(
    cookieStore.get(APP_ACCESS_SESSION_COOKIE_NAME)?.value,
  );
}

function getSupabaseConfig() {
  const supabaseRestUrl = getSupabaseRestUrl();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseRestUrl || !supabaseServiceRoleKey) return null;

  return {
    supabaseRestUrl,
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
    },
  };
}

async function getPlanRequest(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
  planRequestId: string,
) {
  const query = new URLSearchParams({
    select: appPlanRequestColumns,
    id: `eq.${planRequestId}`,
    app_user_id: `eq.${appUserId}`,
    limit: "1",
  });

  const response = await fetch(`${supabaseRestUrl}/app_plan_requests?${query}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) return false;

  const rows = (await response.json()) as AppPlanRequest[];
  return rows[0] || null;
}

async function getExistingSavedPlan(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
  planRequestId: string,
) {
  const query = new URLSearchParams({
    select: appSavedPlanColumns,
    app_user_id: `eq.${appUserId}`,
    plan_request_id: `eq.${planRequestId}`,
    limit: "1",
  });

  const response = await fetch(`${supabaseRestUrl}/app_saved_plans?${query}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) return false;

  const rows = (await response.json()) as AppSavedPlan[];
  return rows[0] || null;
}

async function getUserPreferences(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
) {
  const query = new URLSearchParams({
    select: appUserPreferencesColumns,
    app_user_id: `eq.${appUserId}`,
    limit: "1",
  });

  const response = await fetch(
    `${supabaseRestUrl}/app_user_preferences?${query}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) return false;

  const rows = (await response.json()) as AppUserPreferences[];
  return rows[0] || null;
}

async function getNextGenerationNumber(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
  usageYear: number,
  usageMonth: number,
) {
  const query = new URLSearchParams({
    select: "id",
    app_user_id: `eq.${appUserId}`,
    usage_year: `eq.${usageYear}`,
    usage_month: `eq.${usageMonth}`,
  });

  const response = await fetch(`${supabaseRestUrl}/app_saved_plans?${query}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) return 1;

  const rows = (await response.json()) as { id: string }[];
  return rows.length + 1;
}

async function generatePlan(
  openAiApiKey: string,
  model: string,
  prompt: string,
) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You create concise, human ShiftPlan weekly plans for app users. Follow the submitted schedule data exactly. Use the verified date list for every day heading, but do not mention the phrase verified date list in the final plan. Do not shift weekdays or dates. Do not invent shift days, shift times, appointments, errands, or responsibilities. Write in calm, practical, mobile-friendly language. Make the plan feel like a daily timeline, not a report. Redirect unsafe or medical-heavy requests back to lifestyle and routine organization only. Follow the safety boundaries exactly. Do not mention AI.",
      input: prompt,
    }),
    cache: "no-store",
  });

  if (!response.ok) return "";

  const result = (await response.json()) as OpenAIResponse;
  return extractOutputText(result).trim();
}

async function saveGeneratedPlan(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  existingPlanId: string | null,
  body: Record<string, unknown>,
) {
  const query = existingPlanId
    ? new URLSearchParams({
        id: `eq.${existingPlanId}`,
        select: appSavedPlanColumns,
      })
    : new URLSearchParams({
        select: appSavedPlanColumns,
      });

  const response = await fetch(`${supabaseRestUrl}/app_saved_plans?${query}`, {
    method: existingPlanId ? "PATCH" : "POST",
    headers: {
      ...headers,
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const rows = (await response.json()) as AppSavedPlan[];
  return rows[0] || null;
}

async function markPlanRequestStatus(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  planRequestId: string,
  status: AppPlanRequest["status"],
) {
  const query = new URLSearchParams({
    id: `eq.${planRequestId}`,
    select: "id,status",
  });

  const response = await fetch(`${supabaseRestUrl}/app_plan_requests?${query}`, {
    method: "PATCH",
    headers: {
      ...headers,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const rows = (await response.json()) as UpdatedPlanRequest[];
  return rows[0] || null;
}

async function recordUsageEvent(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  event: {
    appUserId: string;
    eventType: string;
    metadata: Record<string, unknown>;
  },
) {
  try {
    await fetch(`${supabaseRestUrl}/app_usage_events`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        app_user_id: event.appUserId,
        event_type: event.eventType,
        metadata: event.metadata,
      }),
      cache: "no-store",
    });
  } catch {
    // The app flow continues even if internal usage event tracking is unavailable.
  }
}

function normalizeLimit(value: number | null | undefined, fallback: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : fallback;
}

function getGenerationBlockMessage(planRequest: AppPlanRequest) {
  if (!planRequest.safety_acknowledged) {
    return "Confirm the safety acknowledgment before generating a ShiftPlan.";
  }

  if (!planRequest.work_schedule?.trim()) {
    return "Exact work schedule is required before generating a ShiftPlan.";
  }

  if (!planRequest.main_goal?.trim()) {
    return "A main goal is required before generating a ShiftPlan.";
  }

  if (!isIsoDate(planRequest.week_start_date) || !isIsoDate(planRequest.week_end_date)) {
    return "This weekly request needs a valid 7-day date range before generation.";
  }

  return "";
}

function buildPlanTitle(planRequest: AppPlanRequest) {
  return `ShiftPlan for ${formatReadableDate(planRequest.week_start_date)} - ${formatReadableDate(planRequest.week_end_date)}`;
}

function buildPlanPrompt(
  planRequest: AppPlanRequest,
  preferences: AppUserPreferences | null,
) {
  return [
    "SHIFTPLAN APP WEEKLY PLAN",
    "",
    "Product:",
    "ShiftPlan helps nurses and shift workers turn messy shift schedules into simple weekly life plans. It helps organize sleep/wind-down blocks, meals, workouts, recovery/reset blocks, errands, appointments, family responsibilities, training schedules, and personal tasks around irregular, long, or demanding schedules.",
    "",
    "Safety boundaries:",
    "ShiftPlan is lifestyle and routine planning only.",
    "Do not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, supplement guidance, healthcare advice, mental health guidance, workplace safety guidance, or emergency support.",
    "Do not claim to fix sleep problems, fatigue, burnout, anxiety, insomnia, sleep disorders, or any medical condition.",
    "If unsafe or medical-heavy content is requested, redirect to routine planning language only.",
    "Use safe language such as routine planning, weekly structure, wind-down block, reset block, recovery block, meal prep placement, workout placement, task batching, and checklist.",
    "",
    "Date and schedule rules:",
    "Use the submitted week_start_date and week_end_date exactly.",
    "Use the verified date list below for every day heading.",
    "Every day heading must include both weekday and a short date label, like Monday, May 18.",
    "The weekday must match the date.",
    "Do not shift the week.",
    "Do not invent a Sunday-start week if the submitted start date is Monday.",
    "Work shifts must stay on the submitted shift dates.",
    "Events must stay on submitted event days when provided.",
    "Do not invent shift days, shift times, appointments, errands, or responsibilities.",
    "Before finalizing the plan, internally verify that every day label matches the calendar date.",
    "",
    "Verified date list:",
    formatVerifiedDateList(planRequest.week_start_date, planRequest.week_end_date),
    "",
    "Customer weekly request:",
    formatPromptFields([
      ["Week dates", `${planRequest.week_start_date} to ${planRequest.week_end_date}`],
      ["Schedule type", planRequest.schedule_type],
      ["Exact work schedule", planRequest.work_schedule],
      ["Commute time", planRequest.commute_time],
      ["Main goal", planRequest.main_goal],
      ["Meal prep needs", planRequest.meal_prep_needs],
      ["Workout/training goals", planRequest.workout_training_goals],
      ["Appointments this week", planRequest.appointments],
      ["Errands this week", planRequest.errands],
      [
        "Family/personal responsibilities",
        planRequest.family_personal_responsibilities,
      ],
      ["Top 3 priorities", planRequest.top_priorities],
      ["Anything to avoid", planRequest.anything_to_avoid],
      ["Preferred plan style", planRequest.preferred_plan_style],
    ]),
    "",
    "Saved user preferences:",
    formatSavedPreferences(preferences),
    "",
    "Preference rules:",
    "Use saved user preferences only when they help personalize routine planning.",
    "Do not let saved preferences override the submitted week schedule, exact work shifts, safety boundaries, or customer request.",
    "If saved preferences mention recurring responsibilities without exact days or times, keep them flexible and ask the user to place them on confirmed days rather than inventing dates.",
    "Do not turn saved preferences into medical, diagnosis, medication, workplace safety, or emergency guidance.",
    "",
    "Output rules:",
    "1. Create a realistic 7-day plan that feels like a helpful person wrote it.",
    "2. Start naturally with: Here's your week.",
    "3. Keep the whole plan concise, skimmable, and app-ready.",
    "4. Keep workdays simple and do not overload post-shift periods.",
    "5. Batch errands and appointments when possible.",
    "6. Place workouts/training where they fit best around the schedule.",
    "7. Include meal prep placement, not nutrition coaching.",
    "8. Include recovery/reset blocks as lifestyle organization, not treatment.",
    "9. Use short day labels, like Monday, May 18.",
    "10. Make the day-by-day section a daily timeline with Morning, Midday, Afternoon, Evening, Work block if applicable, and Reset block if applicable.",
    "11. Keep the safety note compact and place it near the end.",
    "12. Avoid robotic phrasing and avoid words like canonical dates, framework, placeholder, and template week.",
    "13. Make the plan feel premium, organized, personalized, and calm.",
    "14. Do not mention that AI generated the plan.",
    "15. Do not use markdown checkbox lines in the Day-by-Day Timeline.",
    "16. Put checkbox-style items only in the Checklist section so the app can turn them into an interactive checklist.",
    "",
    "Required output structure:",
    "1. Header",
    "2. Here's your week",
    "3. Week Snapshot",
    "4. Main Strategy",
    "5. Day-by-Day Timeline",
    "6. Checklist",
    "7. Important Note",
    "",
    "Day-by-Day Timeline rules:",
    "For each day, use the verified weekday/date heading.",
    "Under each day, include only the relevant time blocks from this list: Morning, Midday, Afternoon, Evening, Work block, Reset block.",
    "Keep each time block to 1-2 practical lines.",
    "If a work shift is submitted for that day, include it in Work block exactly as submitted.",
    "If appointments, errands, family responsibilities, or training are submitted for a day, keep them on the submitted day.",
    "Do not invent unsubmitted appointments, school pickups, errands, or responsibilities.",
    "",
    "Checklist rules:",
    "Use compact checkbox lines like - [ ] Pack meals before first shift.",
    "Checklist items should be action-oriented and should not repeat every detail from the Day-by-Day Timeline.",
    "Group checklist items by day when useful.",
    "",
    "Important disclaimer text to include:",
    "ShiftPlan is for lifestyle and routine organization only. It does not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, supplement guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support.",
  ].join("\n");
}

function formatSavedPreferences(preferences: AppUserPreferences | null) {
  if (!preferences || !hasSavedPreferences(preferences)) {
    return "Not saved yet.";
  }

  return formatPromptFields([
    ["Typical shift type", preferences.typical_shift_type],
    ["Usual commute time", preferences.usual_commute_time],
    ["Preferred plan style", preferences.preferred_plan_style],
    ["Meal prep preferences", preferences.meal_prep_preferences],
    [
      "Workout/training preferences",
      preferences.workout_training_preferences,
    ],
    [
      "Recurring responsibilities",
      preferences.recurring_responsibilities,
    ],
    [
      "Things to avoid after work",
      preferences.things_to_avoid_after_work,
    ],
    ["Default week start day", preferences.default_week_start_day],
    ["Planning notes", preferences.planning_notes],
  ]);
}

function hasSavedPreferences(preferences: AppUserPreferences) {
  return [
    preferences.typical_shift_type,
    preferences.usual_commute_time,
    preferences.preferred_plan_style,
    preferences.meal_prep_preferences,
    preferences.workout_training_preferences,
    preferences.recurring_responsibilities,
    preferences.things_to_avoid_after_work,
    preferences.default_week_start_day,
    preferences.planning_notes,
  ].some((value) => value.trim());
}

function formatVerifiedDateList(start: string, end: string) {
  if (!isIsoDate(start) || !isIsoDate(end)) return "Not provided";

  const startDate = parseIsoDateAsUtc(start);
  const endDate = parseIsoDateAsUtc(end);
  const rows: string[] = [];
  const cursor = new Date(startDate);

  for (let index = 0; index < 7 && cursor.getTime() <= endDate.getTime(); index += 1) {
    const isoDate = cursor.toISOString().slice(0, 10);
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(cursor);
    const shortDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(cursor);
    rows.push(`- ${weekday}, ${shortDate} (${isoDate})`);
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

function formatReadableDate(value: string) {
  const date = parseIsoDateAsUtc(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatPromptFields(fields: [string, string | null | undefined][]) {
  return fields
    .map(([label, value]) => `- ${label}: ${valueOrFallback(value)}`)
    .join("\n");
}

function valueOrFallback(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : "Not provided";
}

function extractOutputText(result: OpenAIResponse) {
  if (typeof result.output_text === "string") {
    return result.output_text;
  }

  if (!Array.isArray(result.output)) {
    return "";
  }

  return result.output
    .flatMap((item) => {
      if (!item || typeof item !== "object" || !("content" in item)) return [];
      const content = (item as { content?: unknown }).content;
      if (!Array.isArray(content)) return [];

      return content.map((part) => {
        if (!part || typeof part !== "object") return "";
        const maybeText = part as { text?: unknown };
        return typeof maybeText.text === "string" ? maybeText.text : "";
      });
    })
    .filter(Boolean)
    .join("\n");
}
