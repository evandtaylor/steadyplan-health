import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  APP_ACCESS_SESSION_COOKIE_NAME,
  verifyAppAccessSession,
} from "@/lib/app-access";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

export const runtime = "nodejs";

type ScheduleEventPayload = {
  id?: unknown;
  title?: unknown;
  category?: unknown;
  event_date?: unknown;
  date?: unknown;
  start_time?: unknown;
  end_time?: unknown;
  all_day?: unknown;
  notes?: unknown;
  source?: unknown;
  action?: unknown;
  archived_reason?: unknown;
};

type AppScheduleEvent = {
  id: string;
  created_at: string;
  updated_at: string;
  app_user_id: string;
  title: string;
  category: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  all_day: boolean;
  notes: string;
  source: string;
  is_archived: boolean;
  archived_at: string | null;
  archived_reason: string | null;
};

type ValidationResult =
  | {
      ok: true;
      data: {
        app_user_id: string;
        title: string;
        category: string;
        event_date: string;
        start_time: string | null;
        end_time: string | null;
        all_day: boolean;
        notes: string;
        source: string;
      };
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

const scheduleEventColumns = [
  "id",
  "created_at",
  "updated_at",
  "app_user_id",
  "title",
  "category",
  "event_date",
  "start_time",
  "end_time",
  "all_day",
  "notes",
  "source",
  "is_archived",
  "archived_at",
  "archived_reason",
].join(",");

const scheduleEventCategories = new Set([
  "Work shift",
  "Clinical",
  "Class/school",
  "Assignment/deadline",
  "Appointment",
  "Errand",
  "Workout/training",
  "Family/personal",
  "Travel",
  "Other",
]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before loading schedule events." },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const startDate = readDate(url.searchParams.get("start"));
  const endDate = readDate(url.searchParams.get("end"));

  if (url.searchParams.get("start") && !startDate) {
    return NextResponse.json(
      { message: "Choose a valid schedule start date." },
      { status: 400 },
    );
  }

  if (url.searchParams.get("end") && !endDate) {
    return NextResponse.json(
      { message: "Choose a valid schedule end date." },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan schedule events are not configured yet." },
      { status: 500 },
    );
  }

  const query = new URLSearchParams({
    select: scheduleEventColumns,
    app_user_id: `eq.${session.appUserId}`,
    order: "event_date.asc,start_time.asc,created_at.asc",
    limit: "200",
  });

  if (url.searchParams.get("include_archived") !== "true") {
    query.set("is_archived", "eq.false");
  }

  if (startDate) query.set("event_date", `gte.${startDate}`);
  if (endDate) query.append("event_date", `lte.${endDate}`);

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_schedule_events?${query}`,
      {
        headers: config.headers,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not load schedule events right now." },
        { status: 502 },
      );
    }

    const events = (await response.json()) as AppScheduleEvent[];
    return NextResponse.json(
      { events },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach schedule events right now." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before saving schedule events." },
      { status: 401 },
    );
  }

  let payload: ScheduleEventPayload;
  try {
    payload = (await request.json()) as ScheduleEventPayload;
  } catch {
    return NextResponse.json(
      { message: "Check the schedule event and try again." },
      { status: 400 },
    );
  }

  const action = readText(payload.action, 20);
  if (action === "archive" || action === "restore") {
    return updateArchiveState(payload, session.appUserId, action);
  }

  const validation = validatePayload(payload, session.appUserId);
  if (!validation.ok) {
    return NextResponse.json(
      {
        message: "Please check the schedule event fields and try again.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan schedule events are not configured yet." },
      { status: 500 },
    );
  }

  const query = new URLSearchParams({
    select: scheduleEventColumns,
  });

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_schedule_events?${query}`,
      {
        method: "POST",
        headers: {
          ...config.headers,
          Prefer: "return=representation",
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
        { message: "Could not save the schedule event right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppScheduleEvent[];
    const event = rows[0];

    if (!event) {
      return NextResponse.json(
        { message: "The schedule event was not saved." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Schedule event saved.", event },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach schedule events right now." },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Open ShiftPlan app access before updating schedule events." },
      { status: 401 },
    );
  }

  let payload: ScheduleEventPayload;
  try {
    payload = (await request.json()) as ScheduleEventPayload;
  } catch {
    return NextResponse.json(
      { message: "Check the schedule event and try again." },
      { status: 400 },
    );
  }

  const id = readUuid(payload.id);
  if (!id) {
    return NextResponse.json(
      { message: "Choose a schedule event to update." },
      { status: 400 },
    );
  }

  const validation = validatePayload(payload, session.appUserId);
  if (!validation.ok) {
    return NextResponse.json(
      {
        message: "Please check the schedule event fields and try again.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan schedule events are not configured yet." },
      { status: 500 },
    );
  }

  const query = new URLSearchParams({
    select: scheduleEventColumns,
    id: `eq.${id}`,
    app_user_id: `eq.${session.appUserId}`,
  });

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_schedule_events?${query}`,
      {
        method: "PATCH",
        headers: {
          ...config.headers,
          Prefer: "return=representation",
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
        { message: "Could not update the schedule event right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppScheduleEvent[];
    const event = rows[0];

    if (!event) {
      return NextResponse.json(
        { message: "Schedule event was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Schedule event updated.", event },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach schedule events right now." },
      { status: 502 },
    );
  }
}

async function updateArchiveState(
  payload: ScheduleEventPayload,
  appUserId: string,
  action: "archive" | "restore",
) {
  const id = readUuid(payload.id);
  if (!id) {
    return NextResponse.json(
      { message: "Choose a schedule event to update." },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { message: "ShiftPlan schedule events are not configured yet." },
      { status: 500 },
    );
  }

  const query = new URLSearchParams({
    select: scheduleEventColumns,
    id: `eq.${id}`,
    app_user_id: `eq.${appUserId}`,
  });
  const isArchiving = action === "archive";

  try {
    const response = await fetch(
      `${config.supabaseRestUrl}/app_schedule_events?${query}`,
      {
        method: "PATCH",
        headers: {
          ...config.headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          is_archived: isArchiving,
          archived_at: isArchiving ? new Date().toISOString() : null,
          archived_reason: isArchiving
            ? readText(payload.archived_reason, 240)
            : null,
          updated_at: new Date().toISOString(),
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not update the schedule event right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppScheduleEvent[];
    const event = rows[0];

    if (!event) {
      return NextResponse.json(
        { message: "Schedule event was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: isArchiving
          ? "Schedule event archived."
          : "Schedule event restored.",
        event,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach schedule events right now." },
      { status: 502 },
    );
  }
}

function validatePayload(
  payload: ScheduleEventPayload,
  appUserId: string,
): ValidationResult {
  const errors: Record<string, string> = {};
  const title = readText(payload.title, 160);
  const category = readText(payload.category, 80);
  const eventDate = readDate(payload.event_date) || readDate(payload.date);
  const allDay = readBoolean(payload.all_day, false);
  const startTime = allDay ? null : readOptionalText(payload.start_time, 80);
  const endTime = allDay ? null : readOptionalText(payload.end_time, 80);
  const source = readText(payload.source, 80) || "manual";

  if (!title) {
    errors.title = "Add a title.";
  }

  if (!scheduleEventCategories.has(category)) {
    errors.category = "Choose a supported schedule category.";
  }

  if (!eventDate) {
    errors.event_date = "Choose a valid event date.";
  }

  if (!source) {
    errors.source = "Choose a valid event source.";
  }

  if (Object.keys(errors).length > 0 || !eventDate) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      app_user_id: appUserId,
      title,
      category,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime,
      all_day: allDay,
      notes: readText(payload.notes, 2000),
      source,
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

function readText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function readOptionalText(value: unknown, maxLength = 500) {
  const text = readText(value, maxLength);
  return text || null;
}

function readBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function readDate(value: unknown) {
  if (typeof value !== "string") return "";

  const date = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime())) return "";
  if (parsedDate.toISOString().slice(0, 10) !== date) return "";

  return date;
}

function readUuid(value: unknown) {
  const id = readText(value, 80);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    return "";
  }

  return id;
}
