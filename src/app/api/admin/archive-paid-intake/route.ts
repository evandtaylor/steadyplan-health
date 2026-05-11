import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

type AdminArchiveRequest = {
  password?: unknown;
  id?: unknown;
  is_archived?: unknown;
  archive_reason?: unknown;
};

type UpdatedArchiveState = {
  id: string;
  is_archived: boolean;
  archived_at: string | null;
  archive_reason: string | null;
  updated_at: string;
};

export async function POST(request: Request) {
  let payload: AdminArchiveRequest;

  try {
    payload = (await request.json()) as AdminArchiveRequest;
  } catch {
    return NextResponse.json(
      { message: "Check the archive update and try again." },
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
  const shouldArchive = payload.is_archived === true;
  const archiveReason =
    typeof payload.archive_reason === "string"
      ? payload.archive_reason.trim()
      : "";

  if (!id) {
    return NextResponse.json(
      { message: "Choose a paid intake submission to update." },
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

  const now = new Date().toISOString();
  const updateBody = {
    is_archived: shouldArchive,
    archived_at: shouldArchive ? now : null,
    archive_reason: archiveReason || null,
    updated_at: now,
  };
  const query = new URLSearchParams({
    id: `eq.${id}`,
    select: "id,is_archived,archived_at,archive_reason,updated_at",
  });

  try {
    const response = await fetch(
      `${supabaseRestUrl}/shiftplan_paid_intakes?${query}`,
      {
        method: "PATCH",
        headers: {
          apikey: supabaseServiceRoleKey,
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(updateBody),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not update archive status right now." },
        { status: 502 },
      );
    }

    const rows = (await response.json()) as UpdatedArchiveState[];
    const updated = rows[0];

    if (!updated) {
      return NextResponse.json(
        { message: "Paid intake submission was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: shouldArchive ? "Submission archived." : "Submission restored.",
        intake: updated,
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
