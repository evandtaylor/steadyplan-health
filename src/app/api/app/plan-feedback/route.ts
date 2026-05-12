import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  APP_ACCESS_SESSION_COOKIE_NAME,
  verifyAppAccessSession,
} from "@/lib/app-access";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

export const runtime = "nodejs";

type PlanFeedbackPayload = {
  app_saved_plan_id?: unknown;
  usefulness_rating?: unknown;
  used_this_week?: unknown;
  what_worked?: unknown;
  what_felt_unrealistic?: unknown;
  what_should_shiftplan_remember?: unknown;
  would_use_weekly?: unknown;
  would_pay_9_month?: unknown;
  additional_notes?: unknown;
};

type AppSavedPlanOwner = {
  id: string;
  app_user_id: string;
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

const feedbackColumns = [
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

const usedThisWeekOptions = new Set(["Yes", "No", "Not yet"]);
const yesNoMaybeOptions = new Set(["Yes", "No", "Maybe"]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before saving feedback." },
      { status: 401 },
    );
  }

  let payload: PlanFeedbackPayload;
  try {
    payload = (await request.json()) as PlanFeedbackPayload;
  } catch {
    return NextResponse.json(
      { message: "Check your feedback and try again." },
      { status: 400 },
    );
  }

  const validation = validatePayload(payload, session.appUserId);
  if (!validation.ok) {
    return NextResponse.json(
      {
        message: "Please check the highlighted feedback fields and try again.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan feedback is not configured yet." },
      { status: 500 },
    );
  }

  const savedPlan = await getSavedPlanOwner(
    config.supabaseRestUrl,
    config.headers,
    session.appUserId,
    validation.data.app_saved_plan_id,
  );

  if (savedPlan === false) {
    return NextResponse.json(
      { message: "Could not check this saved plan right now." },
      { status: 502 },
    );
  }

  if (!savedPlan) {
    return NextResponse.json(
      { message: "Saved plan was not found for this app access." },
      { status: 404 },
    );
  }

  const query = new URLSearchParams({
    on_conflict: "app_saved_plan_id",
    select: feedbackColumns,
  });

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_plan_feedback?${query}`,
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
        { message: "Could not save feedback right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppPlanFeedback[];
    const feedback = rows[0];

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback was not saved." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Feedback saved.", feedback },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach feedback right now." },
      { status: 502 },
    );
  }
}

type ValidationResult =
  | {
      ok: true;
      data: {
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
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

function validatePayload(
  payload: PlanFeedbackPayload,
  appUserId: string,
): ValidationResult {
  const errors: Record<string, string> = {};
  const appSavedPlanId = readText(payload.app_saved_plan_id, 80);
  const usefulnessRating = readRating(payload.usefulness_rating);
  const usedThisWeek = readText(payload.used_this_week, 20);
  const wouldUseWeekly = readText(payload.would_use_weekly, 20);
  const wouldPay9Month = readText(payload.would_pay_9_month, 20);

  if (!appSavedPlanId) {
    errors.app_saved_plan_id = "Choose a saved plan before sending feedback.";
  }

  if (!usefulnessRating) {
    errors.usefulness_rating = "Choose a rating from 1 to 5.";
  }

  if (!usedThisWeek || !usedThisWeekOptions.has(usedThisWeek)) {
    errors.used_this_week = "Choose whether you used this plan this week.";
  }

  if (!wouldUseWeekly || !yesNoMaybeOptions.has(wouldUseWeekly)) {
    errors.would_use_weekly = "Choose whether you would use this weekly.";
  }

  if (!wouldPay9Month || !yesNoMaybeOptions.has(wouldPay9Month)) {
    errors.would_pay_9_month = "Choose whether you would pay $9/month.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      app_user_id: appUserId,
      app_saved_plan_id: appSavedPlanId,
      usefulness_rating: usefulnessRating,
      used_this_week: usedThisWeek,
      what_worked: readText(payload.what_worked, 1400),
      what_felt_unrealistic: readText(payload.what_felt_unrealistic, 1400),
      what_should_shiftplan_remember: readText(
        payload.what_should_shiftplan_remember,
        1400,
      ),
      would_use_weekly: wouldUseWeekly,
      would_pay_9_month: wouldPay9Month,
      additional_notes: readText(payload.additional_notes, 1400),
    },
  };
}

async function getSavedPlanOwner(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
  savedPlanId: string,
): Promise<AppSavedPlanOwner | null | false> {
  const query = new URLSearchParams({
    select: "id,app_user_id",
    id: `eq.${savedPlanId}`,
    app_user_id: `eq.${appUserId}`,
    limit: "1",
  });

  try {
    const response = await fetch(`${supabaseRestUrl}/app_saved_plans?${query}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) return false;

    const rows = (await response.json()) as AppSavedPlanOwner[];
    return rows[0] || null;
  } catch {
    return false;
  }
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

function readRating(value: unknown) {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 0;

  if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 5) {
    return 0;
  }

  return numberValue;
}
