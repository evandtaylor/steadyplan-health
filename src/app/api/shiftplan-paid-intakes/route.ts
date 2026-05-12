import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const intakeTypes = new Set([
  "custom_plan",
  "founding_pro",
  "founding_pro_weekly",
]);

const requiredFieldsByType = {
  custom_plan: [
    "first_name",
    "email",
    "plan_start_date",
    "job_role",
    "schedule_type",
    "exact_work_shifts",
    "commute_time",
    "main_goal",
    "meal_prep_preferences",
    "workout_training_goals",
    "appointments",
    "errands",
    "family_personal_responsibilities",
    "top_3_priorities",
    "anything_to_avoid",
    "preferred_plan_style",
  ],
  founding_pro: [
    "first_name",
    "email",
    "job_role",
    "typical_shift_pattern",
    "typical_commute_time",
    "preferred_plan_style",
    "organize_focus",
    "meal_prep_preferences",
    "workout_training_preferences",
    "recurring_responsibilities",
    "avoid_after_work",
    "messy_week_reason",
    "monthly_goal",
  ],
  founding_pro_weekly: [
    "first_name",
    "email",
    "week_start_date",
    "exact_work_shifts",
    "appointments_this_week",
    "errands_this_week",
    "family_personal_responsibilities_this_week",
    "workout_training_goals_this_week",
    "meal_prep_needs_this_week",
    "top_3_priorities_this_week",
    "changed_from_last_week",
    "worked_from_last_plan",
    "unrealistic_from_last_plan",
    "specific_request_this_week",
  ],
} satisfies Record<string, string[]>;

type PaidIntakePayload = {
  intake_type?: unknown;
  safety_acknowledged?: unknown;
  [key: string]: unknown;
};

type ValidationResult =
  | {
      ok: true;
      data: Record<string, string | boolean>;
    }
  | {
      ok: false;
      message: string;
      errors: Record<string, string>;
    };

export async function POST(request: Request) {
  let payload: PaidIntakePayload;

  try {
    payload = (await request.json()) as PaidIntakePayload;
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
          "The paid intake list is not connected yet. Please add Supabase environment variables and try again.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${supabaseRestUrl}/shiftplan_paid_intakes`, {
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
            "We could not save your paid intake right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: getSuccessMessage(String(validation.data.intake_type)),
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not reach the paid intake list right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

function validatePayload(payload: PaidIntakePayload): ValidationResult {
  const intakeType = readText(payload.intake_type);
  const errors: Record<string, string> = {};

  if (!intakeType || !intakeTypes.has(intakeType)) {
    errors.intake_type = "Choose a valid ShiftPlan intake type.";
  }

  if (payload.safety_acknowledged !== true) {
    errors.safety_acknowledged =
      "Confirm that this is lifestyle planning only.";
  }

  if (!intakeType || !intakeTypes.has(intakeType)) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      errors,
    };
  }

  const requiredFields =
    requiredFieldsByType[intakeType as keyof typeof requiredFieldsByType];
  const data: Record<string, string | boolean> = {
    intake_type: intakeType,
    safety_acknowledged: true,
  };

  for (const field of requiredFields) {
    const value = readText(payload[field]);
    if (!value) {
      errors[field] = "This field is required.";
    } else {
      data[field] = field === "email" ? value.toLowerCase() : value;
    }
  }

  const email = typeof data.email === "string" ? data.email : "";
  if (email && !emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (intakeType === "custom_plan") {
    const planStartDate =
      typeof data.plan_start_date === "string" ? data.plan_start_date : "";
    const calculatedPlanEndDate = calculateEndDate(planStartDate);

    if (!calculatedPlanEndDate) {
      errors.plan_start_date = "Enter a valid plan start date.";
    } else {
      data.plan_end_date = calculatedPlanEndDate;
    }
  }

  if (intakeType === "founding_pro_weekly") {
    const weekStartDate =
      typeof data.week_start_date === "string" ? data.week_start_date : "";
    const calculatedWeekEndDate = calculateEndDate(weekStartDate);

    if (!calculatedWeekEndDate) {
      errors.week_start_date = "Enter a valid week start date.";
    } else {
      data.week_end_date = calculatedWeekEndDate;
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      errors,
    };
  }

  return { ok: true, data };
}

function getSuccessMessage(intakeType: string) {
  if (intakeType === "custom_plan") {
    return "Your custom ShiftPlan intake is submitted.";
  }

  if (intakeType === "founding_pro") {
    return "Your Founding Pro onboarding is submitted.";
  }

  return "Your weekly schedule is submitted.";
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function calculateEndDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return "";

  date.setUTCDate(date.getUTCDate() + 6);
  return formatDateInput(date);
}

function parseDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (year < 2024 || year > 2100) return null;

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDateInput(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}
