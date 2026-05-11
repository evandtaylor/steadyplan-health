import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const fulfillmentStatuses = new Set([
  "New",
  "In Progress",
  "Prompt Copied",
  "Generated",
  "Reviewed",
  "Delivered",
  "Needs Info",
  "Canceled",
  "Refunded",
]);

type AdminStatusRequest = {
  password?: unknown;
  id?: unknown;
  fulfillment_status?: unknown;
  admin_notes?: unknown;
};

type ExistingStatus = {
  id: string;
  delivered_at: string | null;
};

type UpdatedStatus = {
  id: string;
  fulfillment_status: string;
  admin_notes: string | null;
  delivered_at: string | null;
  updated_at: string;
};

export async function POST(request: Request) {
  let payload: AdminStatusRequest;

  try {
    payload = (await request.json()) as AdminStatusRequest;
  } catch {
    return NextResponse.json(
      { message: "Check the status update and try again." },
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
  const fulfillmentStatus =
    typeof payload.fulfillment_status === "string"
      ? payload.fulfillment_status.trim()
      : "";
  const adminNotes =
    typeof payload.admin_notes === "string" ? payload.admin_notes.trim() : "";

  if (!id) {
    return NextResponse.json(
      { message: "Choose a paid intake submission to update." },
      { status: 400 },
    );
  }

  if (!fulfillmentStatuses.has(fulfillmentStatus)) {
    return NextResponse.json(
      { message: "Choose a valid fulfillment status." },
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
      select: "id,delivered_at",
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
        { message: "Could not load the paid intake status." },
        { status: 502 },
      );
    }

    const existingRows = (await existingResponse.json()) as ExistingStatus[];
    const existing = existingRows[0];

    if (!existing) {
      return NextResponse.json(
        { message: "Paid intake submission was not found." },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();
    const updateBody: {
      fulfillment_status: string;
      admin_notes: string | null;
      updated_at: string;
      delivered_at?: string;
    } = {
      fulfillment_status: fulfillmentStatus,
      admin_notes: adminNotes || null,
      updated_at: now,
    };

    if (fulfillmentStatus === "Delivered" && !existing.delivered_at) {
      updateBody.delivered_at = now;
    }

    const updateQuery = new URLSearchParams({
      id: `eq.${id}`,
      select: "id,fulfillment_status,admin_notes,delivered_at,updated_at",
    });
    const updateResponse = await fetch(
      `${supabaseRestUrl}/shiftplan_paid_intakes?${updateQuery}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(updateBody),
        cache: "no-store",
      },
    );

    if (!updateResponse.ok) {
      return NextResponse.json(
        { message: "Could not save fulfillment status right now." },
        { status: 502 },
      );
    }

    const updatedRows = (await updateResponse.json()) as UpdatedStatus[];
    const updated = updatedRows[0];

    if (!updated) {
      return NextResponse.json(
        { message: "Fulfillment status was not updated." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Fulfillment status saved.", intake: updated },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}
