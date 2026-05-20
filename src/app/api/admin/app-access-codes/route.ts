import { NextResponse } from "next/server";
import {
  hashAppAccessCode,
  normalizeAccessCode,
  normalizeAppEmail,
} from "@/lib/app-access";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

type AdminAppAccessCodeRequest = {
  password?: unknown;
  action?: unknown;
  id?: unknown;
  email?: unknown;
  access_code?: unknown;
  code_label?: unknown;
  max_generations_per_month?: unknown;
  max_generations_per_day?: unknown;
  notes?: unknown;
  is_active?: unknown;
  expires_at?: unknown;
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const appAccessCodeAdminColumns = [
  "id",
  "created_at",
  "email",
  "code_label",
  "is_active",
  "expires_at",
  "max_generations_per_month",
  "max_generations_per_day",
  "notes",
].join(",");

const defaultMonthlyLimit = 4;
const defaultDailyLimit = 2;

export async function POST(request: Request) {
  let payload: AdminAppAccessCodeRequest;

  try {
    payload = (await request.json()) as AdminAppAccessCodeRequest;
  } catch {
    return NextResponse.json(
      { message: "Check the app access code request and try again." },
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
    "Content-Type": "application/json",
  };

  const action = typeof payload.action === "string" ? payload.action : "list";

  if (action === "list") {
    return listAccessCodes(supabaseRestUrl, headers);
  }

  if (action === "create") {
    return createAccessCode(supabaseRestUrl, headers, payload);
  }

  if (action === "update") {
    return updateAccessCode(supabaseRestUrl, headers, payload);
  }

  if (action === "reset_code") {
    return resetAccessCode(supabaseRestUrl, headers, payload);
  }

  if (action === "set_active") {
    return setAccessCodeActive(supabaseRestUrl, headers, payload);
  }

  return NextResponse.json(
    { message: "Choose a valid app access code action." },
    { status: 400 },
  );
}

async function listAccessCodes(
  supabaseRestUrl: string,
  headers: Record<string, string>,
) {
  const query = new URLSearchParams({
    select: appAccessCodeAdminColumns,
    order: "created_at.desc",
    limit: "200",
  });

  try {
    const response = await fetch(`${supabaseRestUrl}/app_access_codes?${query}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not load app access codes right now." },
        { status: 502 },
      );
    }

    const accessCodes = (await response.json()) as AppAccessCodeAdmin[];
    return NextResponse.json(
      { accessCodes },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

async function createAccessCode(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  payload: AdminAppAccessCodeRequest,
) {
  const email = normalizeAppEmail(payload.email);
  const accessCode = normalizeAccessCode(payload.access_code);
  const codeLabel = cleanText(payload.code_label);
  const notes = cleanText(payload.notes) || "Private beta tester";
  const maxGenerationsPerMonth = parseLimit(
    payload.max_generations_per_month,
    defaultMonthlyLimit,
  );
  const maxGenerationsPerDay = parseLimit(
    payload.max_generations_per_day,
    defaultDailyLimit,
  );
  const expiresAt = parseOptionalDateTime(payload.expires_at);
  const isActive =
    typeof payload.is_active === "boolean" ? payload.is_active : true;

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json(
      { message: "Enter a valid email for this app access code." },
      { status: 400 },
    );
  }

  if (!accessCode) {
    return NextResponse.json(
      { message: "Enter the access code before saving it." },
      { status: 400 },
    );
  }

  if (maxGenerationsPerMonth === null || maxGenerationsPerDay === null) {
    return NextResponse.json(
      { message: "Generation limits must be zero or greater." },
      { status: 400 },
    );
  }

  if (expiresAt === "invalid") {
    return NextResponse.json(
      { message: "Enter a valid expiration date or leave it blank." },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({
    select: appAccessCodeAdminColumns,
  });
  const codeHash = hashAppAccessCode(email, accessCode);

  try {
    const response = await fetch(`${supabaseRestUrl}/app_access_codes?${query}`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        email,
        code_hash: codeHash,
        code_label: codeLabel || null,
        is_active: isActive,
        expires_at: expiresAt || null,
        max_generations_per_month: maxGenerationsPerMonth,
        max_generations_per_day: maxGenerationsPerDay,
        notes: notes || null,
      }),
      cache: "no-store",
    });

    if (response.status === 409) {
      return NextResponse.json(
        { message: "An access code with that email/code combination already exists." },
        { status: 409 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not create the app access code right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppAccessCodeAdmin[];
    const accessCodeRow = rows[0];

    if (!accessCodeRow) {
      return NextResponse.json(
        { message: "The app access code was not created." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        accessCode: accessCodeRow,
        message: "Access code created. Save this code now. ShiftPlan does not store raw access codes.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

async function updateAccessCode(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  payload: AdminAppAccessCodeRequest,
) {
  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  const codeLabel = cleanText(payload.code_label);
  const notes = cleanText(payload.notes);
  const maxGenerationsPerMonth = parseRequiredLimit(
    payload.max_generations_per_month,
  );
  const maxGenerationsPerDay = parseRequiredLimit(
    payload.max_generations_per_day,
  );
  const expiresAt = parseOptionalDateTime(payload.expires_at);

  if (!id) {
    return NextResponse.json(
      { message: "Choose an app access code to update." },
      { status: 400 },
    );
  }

  if (typeof payload.is_active !== "boolean") {
    return NextResponse.json(
      { message: "Choose whether the app access code is active." },
      { status: 400 },
    );
  }

  if (maxGenerationsPerMonth === null || maxGenerationsPerDay === null) {
    return NextResponse.json(
      { message: "Generation limits must be zero or greater." },
      { status: 400 },
    );
  }

  if (expiresAt === "invalid") {
    return NextResponse.json(
      { message: "Enter a valid expiration date or leave it blank." },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({
    id: `eq.${id}`,
    select: appAccessCodeAdminColumns,
  });

  try {
    const response = await fetch(`${supabaseRestUrl}/app_access_codes?${query}`, {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        code_label: codeLabel || null,
        is_active: payload.is_active,
        expires_at: expiresAt || null,
        max_generations_per_month: maxGenerationsPerMonth,
        max_generations_per_day: maxGenerationsPerDay,
        notes: notes || null,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not update the app access code right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppAccessCodeAdmin[];
    const accessCode = rows[0];

    if (!accessCode) {
      return NextResponse.json(
        { message: "App access code was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { accessCode, message: "Access code details updated." },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

async function resetAccessCode(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  payload: AdminAppAccessCodeRequest,
) {
  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  const accessCode = normalizeAccessCode(payload.access_code);

  if (!id) {
    return NextResponse.json(
      { message: "Choose an app access code to reset." },
      { status: 400 },
    );
  }

  if (!accessCode) {
    return NextResponse.json(
      { message: "Enter the new access code before resetting it." },
      { status: 400 },
    );
  }

  const lookupQuery = new URLSearchParams({
    id: `eq.${id}`,
    select: "id,email",
    limit: "1",
  });

  try {
    const lookupResponse = await fetch(
      `${supabaseRestUrl}/app_access_codes?${lookupQuery}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!lookupResponse.ok) {
      return NextResponse.json(
        { message: "Could not load the app access code before resetting it." },
        { status: 502 },
      );
    }

    const matchingRows = (await lookupResponse.json()) as {
      id: string;
      email: string;
    }[];
    const existingAccessCode = matchingRows[0];

    if (!existingAccessCode) {
      return NextResponse.json(
        { message: "App access code was not found." },
        { status: 404 },
      );
    }

    const updateQuery = new URLSearchParams({
      id: `eq.${id}`,
      select: appAccessCodeAdminColumns,
    });
    const codeHash = hashAppAccessCode(
      normalizeAppEmail(existingAccessCode.email),
      accessCode,
    );

    const updateResponse = await fetch(
      `${supabaseRestUrl}/app_access_codes?${updateQuery}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ code_hash: codeHash }),
        cache: "no-store",
      },
    );

    if (!updateResponse.ok) {
      return NextResponse.json(
        { message: "Could not reset the app access code right now." },
        { status: 502 },
      );
    }

    const rows = (await updateResponse.json()) as AppAccessCodeAdmin[];
    const updatedAccessCode = rows[0];

    if (!updatedAccessCode) {
      return NextResponse.json(
        { message: "App access code was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        accessCode: updatedAccessCode,
        message:
          "Access code reset. Save this code now. ShiftPlan does not store raw access codes.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

async function setAccessCodeActive(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  payload: AdminAppAccessCodeRequest,
) {
  const id = typeof payload.id === "string" ? payload.id.trim() : "";

  if (!id) {
    return NextResponse.json(
      { message: "Choose an app access code to update." },
      { status: 400 },
    );
  }

  if (typeof payload.is_active !== "boolean") {
    return NextResponse.json(
      { message: "Choose whether the app access code is active." },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({
    id: `eq.${id}`,
    select: appAccessCodeAdminColumns,
  });

  try {
    const response = await fetch(`${supabaseRestUrl}/app_access_codes?${query}`, {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ is_active: payload.is_active }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not update the app access code right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as AppAccessCodeAdmin[];
    const accessCode = rows[0];

    if (!accessCode) {
      return NextResponse.json(
        { message: "App access code was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { accessCode },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLimit(value: unknown, fallback: number) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isInteger(parsed) || parsed < 0) return null;

  return parsed;
}

function parseRequiredLimit(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isInteger(parsed) || parsed < 0) return null;

  return parsed;
}

function parseOptionalDateTime(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "invalid";

  return parsed.toISOString();
}
