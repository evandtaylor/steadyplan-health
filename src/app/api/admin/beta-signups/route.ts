import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

type AdminRequest = {
  password?: unknown;
};

type BetaSignup = {
  created_at: string;
  name: string;
  email: string;
  product_interest: string;
  biggest_problem: string;
  current_tools: string | null;
  willingness_to_pay: string;
  optional_details: string | null;
};

const selectColumns = [
  "created_at",
  "name",
  "email",
  "product_interest",
  "biggest_problem",
  "current_tools",
  "willingness_to_pay",
  "optional_details",
].join(",");

export async function POST(request: Request) {
  let payload: AdminRequest;

  try {
    payload = (await request.json()) as AdminRequest;
  } catch {
    return NextResponse.json(
      { message: "Enter the admin password and try again." },
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

  const query = new URLSearchParams({
    select: selectColumns,
    order: "created_at.desc",
  });

  try {
    const response = await fetch(`${supabaseRestUrl}/beta_signups?${query}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            "Could not load beta signups. Confirm the Supabase service role key is configured.",
        },
        { status: 502 },
      );
    }

    const signups = (await response.json()) as BetaSignup[];

    return NextResponse.json(
      { signups },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}
