import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const roleOptions = new Set([
  "Nurse",
  "First responder",
  "Healthcare worker",
  "Student",
  "Other shift worker",
]);
const shiftTypeOptions = new Set([
  "Day shift",
  "Night shift",
  "Rotating shifts",
  "Call schedule",
  "Mixed/varies",
]);
const shiftLengthOptions = new Set([
  "8 hours",
  "10 hours",
  "12 hours",
  "16+ hours",
  "Varies",
]);
const willingnessOptions = new Set(["Yes", "No", "Maybe"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ShiftPlanIntakePayload = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
  typical_shift_type?: unknown;
  shift_length?: unknown;
  workdays_this_week?: unknown;
  commute_time?: unknown;
  sleep_goal?: unknown;
  workout_goal?: unknown;
  nutrition_goal?: unknown;
  biggest_shift_work_struggle?: unknown;
  useful_plan_details?: unknown;
  willingness_to_pay?: unknown;
};

type ShiftPlanIntakeData = {
  name: string;
  email: string;
  role: string;
  typical_shift_type: string;
  shift_length: string;
  workdays_this_week: string;
  commute_time: string;
  sleep_goal: string;
  workout_goal: string;
  nutrition_goal: string;
  biggest_shift_work_struggle: string;
  useful_plan_details: string;
  willingness_to_pay: string;
};

type ValidationResult =
  | {
      ok: true;
      data: ShiftPlanIntakeData;
    }
  | {
      ok: false;
      message: string;
      errors: Record<string, string>;
    };

export async function POST(request: Request) {
  let payload: ShiftPlanIntakePayload;

  try {
    payload = (await request.json()) as ShiftPlanIntakePayload;
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
          "The ShiftPlan intake list is not connected yet. Please add Supabase environment variables and try again.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${supabaseRestUrl}/shiftplan_intakes`, {
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
            "We could not save your ShiftPlan intake right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message:
        "Thanks. Your Free 3x12 Shift Worker Reset Plan request was saved for manual review.",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not reach the ShiftPlan intake list right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

function validatePayload(payload: ShiftPlanIntakePayload): ValidationResult {
  const name = readText(payload.name);
  const email = readText(payload.email).toLowerCase();
  const role = readText(payload.role);
  const typicalShiftType = readText(payload.typical_shift_type);
  const shiftLength = readText(payload.shift_length);
  const workdaysThisWeek = readText(payload.workdays_this_week);
  const commuteTime = readText(payload.commute_time);
  const sleepGoal = readText(payload.sleep_goal);
  const workoutGoal = readText(payload.workout_goal);
  const nutritionGoal = readText(payload.nutrition_goal);
  const biggestShiftWorkStruggle = readText(
    payload.biggest_shift_work_struggle,
  );
  const usefulPlanDetails = readText(payload.useful_plan_details);
  const willingnessToPay = readText(payload.willingness_to_pay);
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Name is required.";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  validateOption(errors, "role", role, roleOptions, "Choose a valid role.");
  validateOption(
    errors,
    "typical_shift_type",
    typicalShiftType,
    shiftTypeOptions,
    "Choose a valid shift type.",
  );
  validateOption(
    errors,
    "shift_length",
    shiftLength,
    shiftLengthOptions,
    "Choose a valid shift length.",
  );
  if (!workdaysThisWeek) {
    errors.workdays_this_week = "Share your workdays this week.";
  }
  if (!commuteTime) errors.commute_time = "Share your commute time.";
  if (!sleepGoal) errors.sleep_goal = "Share your sleep goal.";
  if (!workoutGoal) errors.workout_goal = "Share your workout goal.";
  if (!nutritionGoal) errors.nutrition_goal = "Share your nutrition goal.";
  if (!biggestShiftWorkStruggle) {
    errors.biggest_shift_work_struggle =
      "Share the shift-work struggle you want help organizing around.";
  }
  if (!usefulPlanDetails) {
    errors.useful_plan_details = "Share what would make this plan useful.";
  }
  validateOption(
    errors,
    "willingness_to_pay",
    willingnessToPay,
    willingnessOptions,
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
      role,
      typical_shift_type: typicalShiftType,
      shift_length: shiftLength,
      workdays_this_week: workdaysThisWeek,
      commute_time: commuteTime,
      sleep_goal: sleepGoal,
      workout_goal: workoutGoal,
      nutrition_goal: nutritionGoal,
      biggest_shift_work_struggle: biggestShiftWorkStruggle,
      useful_plan_details: usefulPlanDetails,
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
