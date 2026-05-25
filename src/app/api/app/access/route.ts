import { NextResponse } from "next/server";
import {
  APP_ACCESS_SESSION_COOKIE_NAME,
  APP_ACCESS_SESSION_TTL_SECONDS,
  createAppAccessSession,
  getAppAccessSessionExpiresAt,
  hashAppAccessCode,
  normalizeAccessCode,
  normalizeAppEmail,
} from "@/lib/app-access";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

export const runtime = "nodejs";

type AppAccessRequest = {
  email?: unknown;
  access_code?: unknown;
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

type AppUser = {
  id: string;
  email: string;
  first_name: string | null;
  status: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const appUserColumns = ["id", "email", "first_name", "status"].join(",");
const accessCodeColumns = [
  "id",
  "email",
  "code_label",
  "is_active",
  "expires_at",
  "max_generations_per_month",
  "max_generations_per_day",
].join(",");

export async function POST(request: Request) {
  let payload: AppAccessRequest;

  try {
    payload = (await request.json()) as AppAccessRequest;
  } catch {
    return NextResponse.json(
      { message: "Check your email and access code, then try again." },
      { status: 400 },
    );
  }

  const email = normalizeAppEmail(payload.email);
  const accessCode = normalizeAccessCode(payload.access_code);

  if (!email || !emailPattern.test(email) || !accessCode) {
    return NextResponse.json(
      { message: "Enter the email and access code for your ShiftPlan app access." },
      { status: 400 },
    );
  }

  const supabaseRestUrl = getSupabaseRestUrl();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseRestUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { message: "ShiftPlan app access is not configured in this environment." },
      { status: 500 },
    );
  }

  const headers = {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };

  const codeHash = hashAppAccessCode(email, accessCode);
  const accessGrant = await findAccessCode(
    supabaseRestUrl,
    headers,
    email,
    codeHash,
  );

  if (!accessGrant || isExpired(accessGrant.expires_at)) {
    return NextResponse.json(
      { message: "That email and access code did not work." },
      { status: 401 },
    );
  }

  const appUser = await upsertAppUser(
    supabaseRestUrl,
    headers,
    email,
    accessGrant.id,
  );

  if (!appUser) {
    return NextResponse.json(
      { message: "Could not open ShiftPlan app access right now." },
      { status: 502 },
    );
  }

  await recordUsageEvent(supabaseRestUrl, headers, appUser.id, accessGrant);

  const expiresAt = getAppAccessSessionExpiresAt();
  const session = createAppAccessSession({
    appUserId: appUser.id,
    email: appUser.email,
    expiresAt: expiresAt.toISOString(),
  });

  if (!session) {
    return NextResponse.json(
      { message: "ShiftPlan app sessions are not configured yet." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({
    message: "Access confirmed.",
    user: {
      email: appUser.email,
      first_name: appUser.first_name,
      status: appUser.status,
      max_generations_per_month: accessGrant.max_generations_per_month,
      max_generations_per_day: accessGrant.max_generations_per_day,
    },
  });

  const cookieDomain = getAppAccessCookieDomain(request.url);
  response.cookies.set(APP_ACCESS_SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    maxAge: APP_ACCESS_SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });

  return response;
}

function getAppAccessCookieDomain(requestUrl: string) {
  const hostname = new URL(requestUrl).hostname;
  if (hostname === "shiftplan.ai" || hostname === "www.shiftplan.ai") {
    return ".shiftplan.ai";
  }

  return "";
}

async function findAccessCode(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  email: string,
  codeHash: string,
) {
  const query = new URLSearchParams({
    select: accessCodeColumns,
    email: `eq.${email}`,
    code_hash: `eq.${codeHash}`,
    is_active: "eq.true",
    limit: "1",
  });

  try {
    const response = await fetch(`${supabaseRestUrl}/app_access_codes?${query}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) return null;

    const rows = (await response.json()) as AppAccessCode[];
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function upsertAppUser(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  email: string,
  accessCodeId: string,
) {
  const query = new URLSearchParams({
    on_conflict: "email",
    select: appUserColumns,
  });

  try {
    const response = await fetch(`${supabaseRestUrl}/app_users?${query}`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        email,
        access_code_id: accessCodeId,
        last_seen_at: new Date().toISOString(),
        status: "Active",
      }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const rows = (await response.json()) as AppUser[];
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function recordUsageEvent(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  appUserId: string,
  accessGrant: AppAccessCode,
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
        event_type: "access_granted",
        metadata: {
          code_label: accessGrant.code_label,
          max_generations_per_month: accessGrant.max_generations_per_month,
          max_generations_per_day: accessGrant.max_generations_per_day,
        },
      }),
      cache: "no-store",
    });
  } catch {
    // Access should not fail just because an internal usage event could not save.
  }
}

function isExpired(value: string | null) {
  if (!value) return false;
  return new Date(value).getTime() <= Date.now();
}
