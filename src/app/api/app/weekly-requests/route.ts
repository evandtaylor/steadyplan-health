import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  APP_ACCESS_SESSION_COOKIE_NAME,
  verifyAppAccessSession,
} from "@/lib/app-access";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

export const runtime = "nodejs";

type WeeklyRequestPayload = {
  week_start_date?: unknown;
  schedule_type?: unknown;
  work_schedule?: unknown;
  commute_time?: unknown;
  main_goal?: unknown;
  meal_prep_needs?: unknown;
  workout_training_goals?: unknown;
  appointments?: unknown;
  errands?: unknown;
  family_personal_responsibilities?: unknown;
  top_priorities?: unknown;
  anything_to_avoid?: unknown;
  preferred_plan_style?: unknown;
  safety_acknowledged?: unknown;
};

type WeeklyRequest = {
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

const weeklyRequestColumns = [
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

const scheduleTypes = new Set([
  "3x12 days",
  "3x12 nights",
  "Rotating shifts",
  "4x10s",
  "5x8s",
  "Mixed/irregular",
  "Other",
]);

const planStyles = new Set([
  "Simple",
  "Detailed",
  "Checklist-heavy",
  "Calendar-style",
]);

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before loading requests." },
      { status: 401 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan app requests are not configured yet." },
      { status: 500 },
    );
  }

  const query = new URLSearchParams({
    select: weeklyRequestColumns,
    app_user_id: `eq.${session.appUserId}`,
    order: "created_at.desc",
    limit: "10",
  });

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_plan_requests?${query}`,
      {
        headers: config.headers,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not load weekly requests right now." },
        { status: 502 },
      );
    }

    const requests = (await response.json()) as WeeklyRequest[];
    return NextResponse.json(
      { requests },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach weekly requests right now." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before saving a request." },
      { status: 401 },
    );
  }

  let payload: WeeklyRequestPayload;
  try {
    payload = (await request.json()) as WeeklyRequestPayload;
  } catch {
    return NextResponse.json(
      { message: "Check the weekly request and try again." },
      { status: 400 },
    );
  }

  const validation = validatePayload(payload, session);
  if (!validation.ok) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields and try again.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan app requests are not configured yet." },
      { status: 500 },
    );
  }

  const query = new URLSearchParams({
    select: weeklyRequestColumns,
  });

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_plan_requests?${query}`,
      {
        method: "POST",
        headers: {
          ...config.headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(validation.data),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not save your weekly request right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as WeeklyRequest[];
    const savedRequest = rows[0];

    if (!savedRequest) {
      return NextResponse.json(
        { message: "Weekly request was not saved." },
        { status: 502 },
      );
    }

    await recordUsageEvent(
      config.supabaseRestUrl,
      config.headers,
      session.appUserId,
      savedRequest.id,
    );

    return NextResponse.json(
      { message: "Weekly request saved.", request: savedRequest },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach weekly requests right now." },
      { status: 502 },
    );
  }
}

type ValidationResult =
  | {
      ok: true;
      data: Record<string, string | boolean>;
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

function validatePayload(
  payload: WeeklyRequestPayload,
  session: { appUserId: string; email: string },
): ValidationResult {
  const errors: Record<string, string> = {};
  const weekStartDate = readText(payload.week_start_date);
  const weekEndDate = calculateEndDate(weekStartDate);
  const scheduleType = readText(payload.schedule_type);
  const preferredPlanStyle = readText(payload.preferred_plan_style);
  const workSchedule = readText(payload.work_schedule, 1400);
  const mainGoal = readText(payload.main_goal, 1000);

  if (!weekStartDate || !weekEndDate) {
    errors.week_start_date = "Enter a valid week start date.";
  }

  if (!scheduleType || !scheduleTypes.has(scheduleType)) {
    errors.schedule_type = "Choose a schedule type.";
  }

  if (!workSchedule) {
    errors.work_schedule = "Share your exact work schedule for this week.";
  }

  if (!mainGoal) {
    errors.main_goal = "Share your main goal for this week.";
  }

  if (!preferredPlanStyle || !planStyles.has(preferredPlanStyle)) {
    errors.preferred_plan_style = "Choose a preferred plan style.";
  }

  if (payload.safety_acknowledged !== true) {
    errors.safety_acknowledged =
      "Confirm that this is lifestyle and routine planning only.";
  }

  const limitedFields = [
    ["commute_time", payload.commute_time, 240],
    ["meal_prep_needs", payload.meal_prep_needs, 1000],
    ["workout_training_goals", payload.workout_training_goals, 1000],
    ["appointments", payload.appointments, 1000],
    ["errands", payload.errands, 1000],
    [
      "family_personal_responsibilities",
      payload.family_personal_responsibilities,
      1000,
    ],
    ["top_priorities", payload.top_priorities, 1000],
    ["anything_to_avoid", payload.anything_to_avoid, 1000],
  ] as const;

  const optionalFields = Object.fromEntries(
    limitedFields.map(([field, value, maxLength]) => [
      field,
      readText(value, maxLength) || "",
    ]),
  ) as Record<string, string>;

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      app_user_id: session.appUserId,
      email: session.email,
      week_start_date: weekStartDate,
      week_end_date: weekEndDate,
      schedule_type: scheduleType,
      work_schedule: workSchedule,
      commute_time: optionalFields.commute_time,
      main_goal: mainGoal,
      meal_prep_needs: optionalFields.meal_prep_needs,
      workout_training_goals: optionalFields.workout_training_goals,
      appointments: optionalFields.appointments,
      errands: optionalFields.errands,
      family_personal_responsibilities:
        optionalFields.family_personal_responsibilities,
      top_priorities: optionalFields.top_priorities,
      anything_to_avoid: optionalFields.anything_to_avoid,
      preferred_plan_style: preferredPlanStyle,
      safety_acknowledged: true,
      status: "submitted",
    },
  };
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

async function recordUsageEvent(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
  requestId: string,
) {
  try {
    await fetch(`${supabaseRestUrl}/app_usage_events`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        app_user_id: appUserId,
        event_type: "weekly_request_submitted",
        metadata: {
          app_plan_request_id: requestId,
        },
      }),
      cache: "no-store",
    });
  } catch {
    // The request is saved even if internal usage event tracking is unavailable.
  }
}

function readText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
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
