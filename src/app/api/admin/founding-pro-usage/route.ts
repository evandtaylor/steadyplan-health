import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const subscriptionStatuses = new Set([
  "Unknown",
  "Active",
  "Canceled",
  "Past Due",
  "Trial",
  "Not Applicable",
]);

type AdminUsageRequest = {
  password?: unknown;
  id?: unknown;
  founding_pro_plan_number?: unknown;
  founding_pro_plan_limit?: unknown;
  billing_period_start?: unknown;
  billing_period_end?: unknown;
  subscription_status?: unknown;
  usage_notes?: unknown;
};

type ExistingIntake = {
  id: string;
  intake_type: "custom_plan" | "founding_pro" | "founding_pro_weekly";
};

type UpdatedUsage = {
  id: string;
  founding_pro_plan_number: number | null;
  founding_pro_plan_limit: number;
  billing_period_start: string | null;
  billing_period_end: string | null;
  subscription_status: string;
  usage_notes: string | null;
  updated_at: string;
};

export async function POST(request: Request) {
  let payload: AdminUsageRequest;

  try {
    payload = (await request.json()) as AdminUsageRequest;
  } catch {
    return NextResponse.json(
      { message: "Check the usage update and try again." },
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

  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  const planNumber = parseOptionalPositiveInteger(payload.founding_pro_plan_number);
  const planLimit = parsePositiveInteger(payload.founding_pro_plan_limit, 4);
  const billingPeriodStart = parseOptionalDate(payload.billing_period_start);
  const billingPeriodEnd = parseOptionalDate(payload.billing_period_end);
  const subscriptionStatus =
    typeof payload.subscription_status === "string"
      ? payload.subscription_status.trim()
      : "";
  const usageNotes =
    typeof payload.usage_notes === "string" ? payload.usage_notes.trim() : "";

  if (!id) {
    return NextResponse.json(
      { message: "Choose a Founding Pro submission to update." },
      { status: 400 },
    );
  }

  if (planNumber === false) {
    return NextResponse.json(
      { message: "Plan number must be blank or a positive whole number." },
      { status: 400 },
    );
  }

  if (planLimit === false) {
    return NextResponse.json(
      { message: "Plan limit must be a positive whole number." },
      { status: 400 },
    );
  }

  if (billingPeriodStart === false || billingPeriodEnd === false) {
    return NextResponse.json(
      { message: "Use valid billing period dates." },
      { status: 400 },
    );
  }

  if (!subscriptionStatuses.has(subscriptionStatus)) {
    return NextResponse.json(
      { message: "Choose a valid subscription status." },
      { status: 400 },
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

  try {
    const existingQuery = new URLSearchParams({
      select: "id,intake_type",
      id: `eq.${id}`,
      limit: "1",
    });
    const existingResponse = await fetch(
      `${supabaseRestUrl}/shiftplan_paid_intakes?${existingQuery}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!existingResponse.ok) {
      return NextResponse.json(
        { message: "Could not load the Founding Pro submission." },
        { status: 502 },
      );
    }

    const existingRows = (await existingResponse.json()) as ExistingIntake[];
    const existing = existingRows[0];

    if (!existing) {
      return NextResponse.json(
        { message: "Paid intake submission was not found." },
        { status: 404 },
      );
    }

    if (existing.intake_type === "custom_plan") {
      return NextResponse.json(
        { message: "Usage tracking only applies to Founding Pro submissions." },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const updateQuery = new URLSearchParams({
      id: `eq.${id}`,
      select:
        "id,founding_pro_plan_number,founding_pro_plan_limit,billing_period_start,billing_period_end,subscription_status,usage_notes,updated_at",
    });
    const updateResponse = await fetch(
      `${supabaseRestUrl}/shiftplan_paid_intakes?${updateQuery}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          founding_pro_plan_number: planNumber,
          founding_pro_plan_limit: planLimit,
          billing_period_start: billingPeriodStart,
          billing_period_end: billingPeriodEnd,
          subscription_status: subscriptionStatus,
          usage_notes: usageNotes || null,
          updated_at: now,
        }),
        cache: "no-store",
      },
    );

    if (!updateResponse.ok) {
      return NextResponse.json(
        { message: "Could not save Founding Pro usage right now." },
        { status: 502 },
      );
    }

    const updatedRows = (await updateResponse.json()) as UpdatedUsage[];
    const updated = updatedRows[0];

    if (!updated) {
      return NextResponse.json(
        { message: "Founding Pro usage was not updated." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Founding Pro usage saved.", intake: updated },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}

function parseOptionalPositiveInteger(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 99) {
    return false;
  }

  return numberValue;
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (value === null || value === undefined || value === "") return fallback;

  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 99) {
    return false;
  }

  return numberValue;
}

function parseOptionalDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return value;
}
