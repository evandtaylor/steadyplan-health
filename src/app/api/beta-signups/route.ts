import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const productInterests = new Set(["ShiftPlan", "KinPlan", "SuppPlan", "All"]);
const willingnessOptions = new Set(["Yes", "No", "Maybe"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BetaSignupPayload = {
  name?: unknown;
  email?: unknown;
  product_interest?: unknown;
  biggest_problem?: unknown;
  current_tools?: unknown;
  willingness_to_pay?: unknown;
  optional_details?: unknown;
};

type ValidationResult =
  | {
      ok: true;
      data: {
        name: string;
        email: string;
        product_interest: string;
        biggest_problem: string;
        current_tools: string | null;
        willingness_to_pay: string;
        optional_details: string | null;
      };
    }
  | {
      ok: false;
      message: string;
      errors: Record<string, string>;
    };

export async function POST(request: Request) {
  let payload: BetaSignupPayload;

  try {
    payload = (await request.json()) as BetaSignupPayload;
  } catch {
    return NextResponse.json(
      { message: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const validation = validatePayload(payload);

  if (!validation.ok) {
    return NextResponse.json(
      { message: validation.message, errors: validation.errors },
      { status: 400 },
    );
  }

  const supabaseRestUrl = getSupabaseRestUrl();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseRestUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        message:
          "The beta list is not connected yet. Please add Supabase environment variables and try again.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${supabaseRestUrl}/beta_signups`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            "We could not save your beta signup right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message:
        "Thanks. Your beta signup was saved. We will use your note to shape the first planning workflows.",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not reach the beta list right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

function validatePayload(payload: BetaSignupPayload): ValidationResult {
  const name = readText(payload.name);
  const email = readText(payload.email).toLowerCase();
  const productInterest = readText(payload.product_interest);
  const biggestProblem = readText(payload.biggest_problem);
  const currentTools = readOptionalText(payload.current_tools);
  const willingnessToPay = readText(payload.willingness_to_pay);
  const optionalDetails = readOptionalText(payload.optional_details);
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Name is required.";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!productInterest) {
    errors.product_interest = "Choose a product interest.";
  } else if (!productInterests.has(productInterest)) {
    errors.product_interest = "Choose a valid product interest.";
  }
  if (!biggestProblem) {
    errors.biggest_problem = "Share the problem you want solved.";
  }
  if (!willingnessToPay) {
    errors.willingness_to_pay = "Choose Yes, No, or Maybe.";
  } else if (!willingnessOptions.has(willingnessToPay)) {
    errors.willingness_to_pay = "Choose a valid payment interest option.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      errors,
    };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      product_interest: productInterest,
      biggest_problem: biggestProblem,
      current_tools: currentTools,
      willingness_to_pay: willingnessToPay,
      optional_details: optionalDetails,
    },
  };
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalText(value: unknown) {
  const text = readText(value);
  return text ? text : null;
}
