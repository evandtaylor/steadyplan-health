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

type ShiftPlanIntake = {
  created_at: string;
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

type ShiftPlanPaidIntake = {
  created_at: string;
  intake_type: "custom_plan" | "founding_pro" | "founding_pro_weekly";
  first_name: string;
  email: string;
  plan_start_date: string | null;
  plan_end_date: string | null;
  week_start_date: string | null;
  week_end_date: string | null;
  job_role: string | null;
  schedule_type: string | null;
  typical_shift_pattern: string | null;
  exact_work_shifts: string | null;
  commute_time: string | null;
  typical_commute_time: string | null;
  main_goal: string | null;
  monthly_goal: string | null;
  meal_prep_preferences: string | null;
  meal_prep_needs_this_week: string | null;
  workout_training_goals: string | null;
  workout_training_preferences: string | null;
  workout_training_goals_this_week: string | null;
  appointments: string | null;
  appointments_this_week: string | null;
  errands: string | null;
  errands_this_week: string | null;
  family_personal_responsibilities: string | null;
  family_personal_responsibilities_this_week: string | null;
  top_3_priorities: string | null;
  top_3_priorities_this_week: string | null;
  anything_to_avoid: string | null;
  preferred_plan_style: string | null;
  organize_focus: string | null;
  recurring_responsibilities: string | null;
  avoid_after_work: string | null;
  messy_week_reason: string | null;
  changed_from_last_week: string | null;
  worked_from_last_plan: string | null;
  unrealistic_from_last_plan: string | null;
  specific_request_this_week: string | null;
  safety_acknowledged: boolean;
};

const betaSignupColumns = [
  "created_at",
  "name",
  "email",
  "product_interest",
  "biggest_problem",
  "current_tools",
  "willingness_to_pay",
  "optional_details",
].join(",");

const shiftPlanIntakeColumns = [
  "created_at",
  "name",
  "email",
  "role",
  "typical_shift_type",
  "shift_length",
  "workdays_this_week",
  "commute_time",
  "sleep_goal",
  "workout_goal",
  "nutrition_goal",
  "biggest_shift_work_struggle",
  "useful_plan_details",
  "willingness_to_pay",
].join(",");

const shiftPlanPaidIntakeColumns = [
  "created_at",
  "intake_type",
  "first_name",
  "email",
  "plan_start_date",
  "plan_end_date",
  "week_start_date",
  "week_end_date",
  "job_role",
  "schedule_type",
  "typical_shift_pattern",
  "exact_work_shifts",
  "commute_time",
  "typical_commute_time",
  "main_goal",
  "monthly_goal",
  "meal_prep_preferences",
  "meal_prep_needs_this_week",
  "workout_training_goals",
  "workout_training_preferences",
  "workout_training_goals_this_week",
  "appointments",
  "appointments_this_week",
  "errands",
  "errands_this_week",
  "family_personal_responsibilities",
  "family_personal_responsibilities_this_week",
  "top_3_priorities",
  "top_3_priorities_this_week",
  "anything_to_avoid",
  "preferred_plan_style",
  "organize_focus",
  "recurring_responsibilities",
  "avoid_after_work",
  "messy_week_reason",
  "changed_from_last_week",
  "worked_from_last_plan",
  "unrealistic_from_last_plan",
  "specific_request_this_week",
  "safety_acknowledged",
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

  const betaSignupQuery = new URLSearchParams({
    select: betaSignupColumns,
    order: "created_at.desc",
  });
  const shiftPlanIntakeQuery = new URLSearchParams({
    select: shiftPlanIntakeColumns,
    order: "created_at.desc",
  });
  const shiftPlanPaidIntakeQuery = new URLSearchParams({
    select: shiftPlanPaidIntakeColumns,
    order: "created_at.desc",
  });

  try {
    const headers = {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    };

    const [betaSignupResponse, shiftPlanIntakeResponse, shiftPlanPaidIntakeResponse] =
      await Promise.all([
        fetch(`${supabaseRestUrl}/beta_signups?${betaSignupQuery}`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${supabaseRestUrl}/shiftplan_intakes?${shiftPlanIntakeQuery}`, {
          headers,
          cache: "no-store",
        }),
        fetch(
          `${supabaseRestUrl}/shiftplan_paid_intakes?${shiftPlanPaidIntakeQuery}`,
          {
            headers,
            cache: "no-store",
          },
        ),
      ]);

    if (
      !betaSignupResponse.ok ||
      !shiftPlanIntakeResponse.ok ||
      !shiftPlanPaidIntakeResponse.ok
    ) {
      return NextResponse.json(
        {
          message:
            "Could not load admin submissions. Confirm the Supabase service role key and intake tables are configured.",
        },
        { status: 502 },
      );
    }

    const [signups, shiftPlanIntakes, shiftPlanPaidIntakes] = (await Promise.all([
      betaSignupResponse.json(),
      shiftPlanIntakeResponse.json(),
      shiftPlanPaidIntakeResponse.json(),
    ])) as [BetaSignup[], ShiftPlanIntake[], ShiftPlanPaidIntake[]];

    return NextResponse.json(
      { signups, shiftPlanIntakes, shiftPlanPaidIntakes },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach Supabase right now." },
      { status: 502 },
    );
  }
}
