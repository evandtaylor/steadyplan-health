import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  APP_ACCESS_SESSION_COOKIE_NAME,
  verifyAppAccessSession,
} from "@/lib/app-access";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

export const runtime = "nodejs";

type PreferencesPayload = {
  typical_shift_type?: unknown;
  usual_commute_time?: unknown;
  preferred_plan_style?: unknown;
  meal_prep_preferences?: unknown;
  workout_training_preferences?: unknown;
  recurring_responsibilities?: unknown;
  things_to_avoid_after_work?: unknown;
  default_week_start_day?: unknown;
  planning_notes?: unknown;
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

const preferencesColumns = [
  "id",
  "created_at",
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

const shiftTypeOptions = new Set([
  "",
  "3x12 days",
  "3x12 nights",
  "Rotating shifts",
  "4x10s",
  "5x8s",
  "Mixed/irregular",
  "Other",
]);

const planStyleOptions = new Set([
  "",
  "Simple",
  "Detailed",
  "Checklist-heavy",
  "Calendar-style",
]);

const weekStartDayOptions = new Set([
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before loading preferences." },
      { status: 401 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan preferences are not configured yet." },
      { status: 500 },
    );
  }

  try {
    const preferences = await getPreferences(
      config.supabaseRestUrl,
      config.headers,
      session.appUserId,
    );

    if (preferences === false) {
      return NextResponse.json(
        { message: "Could not load preferences right now." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { preferences },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach preferences right now." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before saving preferences." },
      { status: 401 },
    );
  }

  let payload: PreferencesPayload;
  try {
    payload = (await request.json()) as PreferencesPayload;
  } catch {
    return NextResponse.json(
      { message: "Check your preferences and try again." },
      { status: 400 },
    );
  }

  const validation = validatePayload(payload, session.appUserId);
  if (!validation.ok) {
    return NextResponse.json(
      {
        message: "Please check the highlighted preference fields and try again.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan preferences are not configured yet." },
      { status: 500 },
    );
  }

  const query = new URLSearchParams({
    on_conflict: "app_user_id",
    select: preferencesColumns,
  });

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_user_preferences?${query}`,
      {
        method: "POST",
        headers: {
          ...config.headers,
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify({
          ...validation.data,
          updated_at: new Date().toISOString(),
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not save preferences right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppUserPreferences[];
    const preferences = rows[0];

    if (!preferences) {
      return NextResponse.json(
        { message: "Preferences were not saved." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Preferences saved.", preferences },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach preferences right now." },
      { status: 502 },
    );
  }
}

type ValidationResult =
  | {
      ok: true;
      data: {
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
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

function validatePayload(
  payload: PreferencesPayload,
  appUserId: string,
): ValidationResult {
  const errors: Record<string, string> = {};
  const typicalShiftType = readText(payload.typical_shift_type, 80);
  const preferredPlanStyle = readText(payload.preferred_plan_style, 80);
  const defaultWeekStartDay = readText(payload.default_week_start_day, 20);

  if (!shiftTypeOptions.has(typicalShiftType)) {
    errors.typical_shift_type = "Choose a supported shift type.";
  }

  if (!planStyleOptions.has(preferredPlanStyle)) {
    errors.preferred_plan_style = "Choose a supported plan style.";
  }

  if (!weekStartDayOptions.has(defaultWeekStartDay)) {
    errors.default_week_start_day = "Choose a supported week start day.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      app_user_id: appUserId,
      typical_shift_type: typicalShiftType,
      usual_commute_time: readText(payload.usual_commute_time, 240),
      preferred_plan_style: preferredPlanStyle,
      meal_prep_preferences: readText(payload.meal_prep_preferences, 1400),
      workout_training_preferences: readText(
        payload.workout_training_preferences,
        1400,
      ),
      recurring_responsibilities: readText(
        payload.recurring_responsibilities,
        1400,
      ),
      things_to_avoid_after_work: readText(
        payload.things_to_avoid_after_work,
        1400,
      ),
      default_week_start_day: defaultWeekStartDay,
      planning_notes: readText(payload.planning_notes, 1400),
    },
  };
}

async function getPreferences(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
): Promise<AppUserPreferences | null | false> {
  const query = new URLSearchParams({
    select: preferencesColumns,
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

function readText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}
