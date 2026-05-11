import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

type AdminPreferenceRequest = {
  password?: unknown;
  action?: unknown;
  subscriber_email?: unknown;
  first_name?: unknown;
  job_role?: unknown;
  typical_shift_pattern?: unknown;
  typical_commute_time?: unknown;
  preferred_plan_style?: unknown;
  meal_prep_preferences?: unknown;
  workout_training_preferences?: unknown;
  recurring_responsibilities?: unknown;
  avoid_after_work?: unknown;
  monthly_focus?: unknown;
  plan_style_notes?: unknown;
  last_tuneup_date?: unknown;
  admin_notes?: unknown;
};

type SubscriberPreference = {
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

const preferenceColumns = [
  "id",
  "created_at",
  "updated_at",
  "subscriber_email",
  "first_name",
  "job_role",
  "typical_shift_pattern",
  "typical_commute_time",
  "preferred_plan_style",
  "meal_prep_preferences",
  "workout_training_preferences",
  "recurring_responsibilities",
  "avoid_after_work",
  "monthly_focus",
  "plan_style_notes",
  "last_tuneup_date",
  "admin_notes",
].join(",");

export async function POST(request: Request) {
  let payload: AdminPreferenceRequest;

  try {
    payload = (await request.json()) as AdminPreferenceRequest;
  } catch {
    return NextResponse.json(
      { message: "Check the saved preferences request and try again." },
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

  const action = typeof payload.action === "string" ? payload.action : "upsert";
  const headers = {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };

  if (action === "list") {
    return listPreferences(supabaseRestUrl, headers);
  }

  if (action !== "upsert") {
    return NextResponse.json(
      { message: "Choose a valid saved preferences action." },
      { status: 400 },
    );
  }

  const subscriberEmail = normalizeEmail(payload.subscriber_email);
  const lastTuneupDate = parseOptionalDate(payload.last_tuneup_date);

  if (!subscriberEmail) {
    return NextResponse.json(
      { message: "Subscriber email is required for saved preferences." },
      { status: 400 },
    );
  }

  if (lastTuneupDate === false) {
    return NextResponse.json(
      { message: "Use a valid last tune-up date." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const updateBody = {
    subscriber_email: subscriberEmail,
    first_name: optionalText(payload.first_name),
    job_role: optionalText(payload.job_role),
    typical_shift_pattern: optionalText(payload.typical_shift_pattern),
    typical_commute_time: optionalText(payload.typical_commute_time),
    preferred_plan_style: optionalText(payload.preferred_plan_style),
    meal_prep_preferences: optionalText(payload.meal_prep_preferences),
    workout_training_preferences: optionalText(payload.workout_training_preferences),
    recurring_responsibilities: optionalText(payload.recurring_responsibilities),
    avoid_after_work: optionalText(payload.avoid_after_work),
    monthly_focus: optionalText(payload.monthly_focus),
    plan_style_notes: optionalText(payload.plan_style_notes),
    last_tuneup_date: lastTuneupDate,
    admin_notes: optionalText(payload.admin_notes),
    updated_at: now,
  };

  try {
    const query = new URLSearchParams({
      on_conflict: "subscriber_email",
      select: preferenceColumns,
    });
    const response = await fetch(
      `${supabaseRestUrl}/shiftplan_subscriber_preferences?${query}`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(updateBody),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not save subscriber preferences right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as SubscriberPreference[];
    const preference = rows[0];

    if (!preference) {
      return NextResponse.json(
        { message: "Subscriber preferences were not saved." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Subscriber preferences saved.", preference },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

async function listPreferences(
  supabaseRestUrl: string,
  headers: Record<string, string>,
) {
  const query = new URLSearchParams({
    select: preferenceColumns,
    order: "updated_at.desc",
  });

  try {
    const response = await fetch(
      `${supabaseRestUrl}/shiftplan_subscriber_preferences?${query}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not load subscriber preferences right now." },
        { status: 502 },
      );
    }

    const preferences = (await response.json()) as SubscriberPreference[];

    return NextResponse.json(
      { preferences },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function optionalText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function parseOptionalDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return value;
}
