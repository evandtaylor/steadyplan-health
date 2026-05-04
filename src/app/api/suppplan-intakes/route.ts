import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const mainGoalOptions = new Set([
  "Remembering supplements",
  "Organizing timing",
  "Avoiding duplicate ingredients",
  "Inventory tracking",
  "Questions to ask a provider",
  "General supplement education",
  "Other",
]);
const routineComplexityOptions = new Set([
  "1-2 products",
  "3-5 products",
  "6-10 products",
  "10+ products",
]);
const yesNoMaybeOptions = new Set(["Yes", "No", "Maybe"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SuppPlanIntakePayload = {
  name?: unknown;
  email?: unknown;
  main_goal?: unknown;
  routine_complexity?: unknown;
  biggest_organization_problem?: unknown;
  current_tools?: unknown;
  useful_planner_details?: unknown;
  wants_inventory_reminders?: unknown;
  willingness_to_pay?: unknown;
};

type SuppPlanIntakeData = {
  name: string;
  email: string;
  main_goal: string;
  routine_complexity: string;
  biggest_organization_problem: string;
  current_tools: string;
  useful_planner_details: string;
  wants_inventory_reminders: string;
  willingness_to_pay: string;
};

type ValidationResult =
  | {
      ok: true;
      data: SuppPlanIntakeData;
    }
  | {
      ok: false;
      message: string;
      errors: Record<string, string>;
    };

export async function POST(request: Request) {
  let payload: SuppPlanIntakePayload;

  try {
    payload = (await request.json()) as SuppPlanIntakePayload;
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
          "The SuppPlan intake list is not connected yet. Please add Supabase environment variables and try again.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${supabaseRestUrl}/suppplan_intakes`, {
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
            "We could not save your SuppPlan intake right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "Thanks. Your SuppPlan intake was saved for manual review.",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not reach the SuppPlan intake list right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

function validatePayload(payload: SuppPlanIntakePayload): ValidationResult {
  const name = readText(payload.name);
  const email = readText(payload.email).toLowerCase();
  const mainGoal = readText(payload.main_goal);
  const routineComplexity = readText(payload.routine_complexity);
  const biggestProblem = readText(payload.biggest_organization_problem);
  const currentTools = readText(payload.current_tools);
  const usefulPlannerDetails = readText(payload.useful_planner_details);
  const wantsInventoryReminders = readText(payload.wants_inventory_reminders);
  const willingnessToPay = readText(payload.willingness_to_pay);
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Name is required.";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  validateOption(
    errors,
    "main_goal",
    mainGoal,
    mainGoalOptions,
    "Choose a valid main goal.",
  );
  validateOption(
    errors,
    "routine_complexity",
    routineComplexity,
    routineComplexityOptions,
    "Choose a valid routine complexity.",
  );
  if (!biggestProblem) {
    errors.biggest_organization_problem =
      "Share the biggest supplement organization problem.";
  }
  if (!currentTools) {
    errors.current_tools = "Share the current tools being used.";
  }
  if (!usefulPlannerDetails) {
    errors.useful_planner_details =
      "Share what would make a supplement planner useful.";
  }
  validateOption(
    errors,
    "wants_inventory_reminders",
    wantsInventoryReminders,
    yesNoMaybeOptions,
    "Choose Yes, No, or Maybe.",
  );
  validateOption(
    errors,
    "willingness_to_pay",
    willingnessToPay,
    yesNoMaybeOptions,
    "Choose Yes, No, or Maybe.",
  );

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
      main_goal: mainGoal,
      routine_complexity: routineComplexity,
      biggest_organization_problem: biggestProblem,
      current_tools: currentTools,
      useful_planner_details: usefulPlannerDetails,
      wants_inventory_reminders: wantsInventoryReminders,
      willingness_to_pay: willingnessToPay,
    },
  };
}

function validateOption(
  errors: Record<string, string>,
  key: string,
  value: string,
  options: Set<string>,
  message: string,
) {
  if (!value || !options.has(value)) {
    errors[key] = message;
  }
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
