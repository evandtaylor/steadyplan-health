import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const paidIntakeColumns = [
  "id",
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
  "fulfillment_status",
  "admin_notes",
  "delivered_at",
  "founding_pro_plan_number",
  "founding_pro_plan_limit",
  "billing_period_start",
  "billing_period_end",
  "subscription_status",
  "usage_notes",
  "updated_at",
].join(",");

const preferenceColumns = [
  "subscriber_email",
  "typical_shift_pattern",
  "typical_commute_time",
  "preferred_plan_style",
  "meal_prep_preferences",
  "workout_training_preferences",
  "recurring_responsibilities",
  "avoid_after_work",
  "monthly_focus",
  "plan_style_notes",
].join(",");

const deliveredPlanColumns = [
  "id",
  "created_at",
  "updated_at",
  "paid_intake_id",
  "customer_email",
  "customer_name",
  "plan_type",
  "plan_title",
  "plan_start_date",
  "plan_end_date",
  "plan_body",
  "delivery_status",
  "delivered_at",
  "admin_notes",
].join(",");

type AdminGenerateRequest = {
  password?: unknown;
  paid_intake_id?: unknown;
};

type PaidIntakeType = "custom_plan" | "founding_pro" | "founding_pro_weekly";

type ShiftPlanPaidIntake = {
  id: string;
  intake_type: PaidIntakeType;
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
  founding_pro_plan_number: number | null;
  founding_pro_plan_limit: number | null;
  billing_period_start: string | null;
  billing_period_end: string | null;
  subscription_status: string | null;
};

type ShiftPlanSubscriberPreference = {
  subscriber_email: string;
  typical_shift_pattern: string | null;
  typical_commute_time: string | null;
  preferred_plan_style: string | null;
  meal_prep_preferences: string | null;
  workout_training_preferences: string | null;
  recurring_responsibilities: string | null;
  avoid_after_work: string | null;
  monthly_focus: string | null;
  plan_style_notes: string | null;
};

type ExistingPlan = {
  id: string;
};

type DeliveredPlan = {
  id: string;
  created_at: string;
  updated_at: string;
  paid_intake_id: string | null;
  customer_email: string;
  customer_name: string | null;
  plan_type: string;
  plan_title: string | null;
  plan_start_date: string | null;
  plan_end_date: string | null;
  plan_body: string;
  delivery_status: string;
  delivered_at: string | null;
  admin_notes: string | null;
};

type UpdatedIntake = {
  id: string;
  fulfillment_status: string;
  admin_notes: string | null;
  delivered_at: string | null;
  updated_at: string;
};

type OpenAIResponse = {
  output_text?: unknown;
  output?: unknown;
};

export async function POST(request: Request) {
  let payload: AdminGenerateRequest;

  try {
    payload = (await request.json()) as AdminGenerateRequest;
  } catch {
    return NextResponse.json(
      { message: "Check the draft generation request and try again." },
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

  const paidIntakeId =
    typeof payload.paid_intake_id === "string" ? payload.paid_intake_id.trim() : "";

  if (!paidIntakeId) {
    return NextResponse.json(
      { message: "Choose a paid intake before generating a draft." },
      { status: 400 },
    );
  }

  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (!openAiApiKey) {
    return NextResponse.json(
      { message: "OpenAI is not configured in this environment." },
      { status: 500 },
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
    const intake = await getPaidIntake(supabaseRestUrl, headers, paidIntakeId);

    if (intake === false) {
      return NextResponse.json(
        { message: "Could not load the paid intake for draft generation." },
        { status: 502 },
      );
    }

    if (!intake) {
      return NextResponse.json(
        { message: "Paid intake submission was not found." },
        { status: 404 },
      );
    }

    const savedPreference = await getSubscriberPreference(
      supabaseRestUrl,
      headers,
      intake.email,
    );

    if (savedPreference === false) {
      return NextResponse.json(
        { message: "Could not load saved subscriber preferences." },
        { status: 502 },
      );
    }

    const draft = await generateDraftPlan(
      openAiApiKey,
      process.env.OPENAI_MODEL || "gpt-5.2",
      buildDraftPrompt(intake, savedPreference),
    );

    if (!draft) {
      return NextResponse.json(
        { message: "OpenAI could not generate a draft right now." },
        { status: 500 },
      );
    }

    const now = new Date().toISOString();
    const plan = await saveDraftPlan(supabaseRestUrl, headers, {
      paid_intake_id: intake.id,
      customer_email: intake.email.toLowerCase(),
      customer_name: intake.first_name,
      plan_type: intake.intake_type,
      plan_title: buildPlanTitle(intake),
      plan_start_date: intake.plan_start_date || intake.week_start_date,
      plan_end_date: intake.plan_end_date || intake.week_end_date,
      plan_body: draft,
      delivery_status: "Draft",
      delivered_at: null,
      admin_notes: "AI draft generated for admin review.",
      updated_at: now,
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Draft was generated, but it could not be saved." },
        { status: 502 },
      );
    }

    const updatedIntake = await markIntakeGenerated(supabaseRestUrl, headers, intake.id);

    return NextResponse.json(
      {
        message: "Draft saved.",
        plan,
        intake: updatedIntake,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not generate a draft plan right now." },
      { status: 500 },
    );
  }
}

async function getPaidIntake(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  paidIntakeId: string,
) {
  const query = new URLSearchParams({
    select: paidIntakeColumns,
    id: `eq.${paidIntakeId}`,
    limit: "1",
  });
  const response = await fetch(
    `${supabaseRestUrl}/shiftplan_paid_intakes?${query}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) return false;

  const rows = (await response.json()) as ShiftPlanPaidIntake[];
  return rows[0] || null;
}

async function getSubscriberPreference(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  email: string,
) {
  const query = new URLSearchParams({
    select: preferenceColumns,
    subscriber_email: `eq.${email.toLowerCase()}`,
    limit: "1",
  });
  const response = await fetch(
    `${supabaseRestUrl}/shiftplan_subscriber_preferences?${query}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) return false;

  const rows = (await response.json()) as ShiftPlanSubscriberPreference[];
  return rows[0] || null;
}

async function generateDraftPlan(
  openAiApiKey: string,
  model: string,
  prompt: string,
) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You create customer-ready ShiftPlan drafts for admin review. Follow the safety boundaries exactly. Do not mention AI. Do not include medical advice, diagnosis, treatment, medication guidance, healthcare guidance, or emergency support.",
      input: prompt,
    }),
    cache: "no-store",
  });

  if (!response.ok) return "";

  const result = (await response.json()) as OpenAIResponse;
  return extractOutputText(result).trim();
}

async function saveDraftPlan(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  updateBody: Record<string, unknown>,
) {
  const existingPlan = await getExistingPlan(
    supabaseRestUrl,
    headers,
    String(updateBody.paid_intake_id || ""),
  );

  if (existingPlan === false) return null;

  const query = existingPlan
    ? new URLSearchParams({
        id: `eq.${existingPlan.id}`,
        select: deliveredPlanColumns,
      })
    : new URLSearchParams({
        select: deliveredPlanColumns,
      });
  const response = await fetch(
    `${supabaseRestUrl}/shiftplan_delivered_plans?${query}`,
    {
      method: existingPlan ? "PATCH" : "POST",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updateBody),
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const rows = (await response.json()) as DeliveredPlan[];
  return rows[0] || null;
}

async function getExistingPlan(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  paidIntakeId: string,
) {
  const query = new URLSearchParams({
    select: "id",
    paid_intake_id: `eq.${paidIntakeId}`,
    limit: "1",
  });
  const response = await fetch(
    `${supabaseRestUrl}/shiftplan_delivered_plans?${query}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) return false;

  const rows = (await response.json()) as ExistingPlan[];
  return rows[0] || null;
}

async function markIntakeGenerated(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  paidIntakeId: string,
) {
  const now = new Date().toISOString();
  const query = new URLSearchParams({
    id: `eq.${paidIntakeId}`,
    select: "id,fulfillment_status,admin_notes,delivered_at,updated_at",
  });
  const response = await fetch(
    `${supabaseRestUrl}/shiftplan_paid_intakes?${query}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        fulfillment_status: "Generated",
        updated_at: now,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const rows = (await response.json()) as UpdatedIntake[];
  return rows[0] || null;
}

function buildDraftPrompt(
  intake: ShiftPlanPaidIntake,
  savedPreference: ShiftPlanSubscriberPreference | null,
) {
  const isCustomPlan = intake.intake_type === "custom_plan";
  const header = isCustomPlan
    ? "CUSTOM 7-DAY SHIFTPLAN"
    : "SHIFTPLAN FOUNDING PRO - WEEKLY PLAN";

  return [
    header,
    "",
    "Product:",
    "ShiftPlan helps nurses and shift workers turn messy shift schedules into simple weekly life plans. It helps organize sleep/wind-down blocks, meals, workouts, recovery/reset blocks, errands, appointments, family responsibilities, training schedules, and personal tasks around irregular, long, or demanding schedules.",
    "",
    "Safety boundaries:",
    "ShiftPlan is lifestyle and routine planning only.",
    "Do not provide medical advice, diagnosis, treatment, sleep disorder guidance, fatigue treatment, burnout treatment, medication guidance, supplement guidance, healthcare advice, mental health guidance, workplace safety guidance, or emergency support.",
    "Do not claim to fix sleep problems, fatigue, burnout, anxiety, insomnia, sleep disorders, or any medical condition.",
    "Use safe language such as routine planning, weekly structure, wind-down block, reset block, recovery block, meal prep placement, workout placement, task batching, and checklist.",
    "",
    "Customer intake data:",
    formatPromptFields([
      ["Intake type", formatPaidLabel(intake.intake_type)],
      ["First name", intake.first_name],
      ["Plan dates or week dates", formatPlanDates(intake)],
      [
        "Founding Pro usage",
        isCustomPlan ? "Not applicable" : formatUsageBadge(intake),
      ],
      ["Billing period", isCustomPlan ? "Not applicable" : formatBillingPeriod(intake)],
      [
        "Subscription status",
        isCustomPlan ? "Not applicable" : intake.subscription_status || "Unknown",
      ],
      ["Job / role", intake.job_role],
      ["Schedule type", intake.schedule_type],
      ["Typical shift pattern", intake.typical_shift_pattern],
      ["Exact work shifts", intake.exact_work_shifts],
      ["Commute time", intake.commute_time || intake.typical_commute_time],
      ["Main goal", intake.main_goal],
      ["Monthly goal", intake.monthly_goal],
      [
        "Meal prep preferences or needs",
        intake.meal_prep_preferences || intake.meal_prep_needs_this_week,
      ],
      [
        "Workout / training goals or preferences",
        intake.workout_training_goals ||
          intake.workout_training_preferences ||
          intake.workout_training_goals_this_week,
      ],
      ["Appointments", intake.appointments || intake.appointments_this_week],
      ["Errands", intake.errands || intake.errands_this_week],
      [
        "Family / personal responsibilities",
        intake.family_personal_responsibilities ||
          intake.family_personal_responsibilities_this_week,
      ],
      ["Top 3 priorities", intake.top_3_priorities || intake.top_3_priorities_this_week],
      ["Anything to avoid", intake.anything_to_avoid],
      ["Preferred plan style", intake.preferred_plan_style],
      ["Organizing focus", intake.organize_focus],
      ["Recurring responsibilities", intake.recurring_responsibilities],
      ["Avoid after work", intake.avoid_after_work],
      ["Messy week reason", intake.messy_week_reason],
      ["Changed from last week", intake.changed_from_last_week],
      ["What worked from last plan", intake.worked_from_last_plan],
      ["What felt unrealistic", intake.unrealistic_from_last_plan],
      ["Specific request this week", intake.specific_request_this_week],
    ]),
    "",
    !isCustomPlan && savedPreference
      ? formatSavedPreferences(savedPreference)
      : "Saved preferences: Not saved yet.",
    "",
    "Output rules:",
    "1. Create a realistic 7-day plan.",
    "2. Keep workdays simple.",
    "3. Do not overload post-shift periods.",
    "4. Batch errands and appointments when possible.",
    "5. Place workouts/training where they fit best around the schedule.",
    "6. Include meal prep placement, not nutrition coaching.",
    "7. Include recovery/reset blocks as lifestyle organization, not treatment.",
    "8. Include a copy/paste checklist.",
    "9. Include the safety disclaimer.",
    "10. Use plain, practical language.",
    "11. Make the plan feel premium, organized, and personalized.",
    "12. Do not mention that AI generated the plan.",
    "",
    isCustomPlan
      ? "Required output structure:\n" + customPlanOutputStructure
      : "Required output structure:\n" + foundingProOutputStructure,
    "",
    "Important disclaimer text to include in the prompt output:",
    "ShiftPlan is for lifestyle and routine organization only. This plan helps organize your week around work, meals, workouts, errands, appointments, recovery blocks, and personal responsibilities. It does not provide medical advice, diagnosis, treatment, sleep disorder guidance, fatigue treatment, burnout treatment, medication guidance, or healthcare advice.",
  ].join("\n");
}

function formatSavedPreferences(preference: ShiftPlanSubscriberPreference) {
  return [
    "Saved preferences used:",
    formatPromptFields([
      ["Commute", preference.typical_commute_time],
      ["Preferred plan style", preference.preferred_plan_style],
      ["Meal prep preferences", preference.meal_prep_preferences],
      ["Workout/training preferences", preference.workout_training_preferences],
      ["Recurring responsibilities", preference.recurring_responsibilities],
      ["Avoid after work", preference.avoid_after_work],
      ["Monthly focus", preference.monthly_focus],
      ["Plan style notes", preference.plan_style_notes],
    ]),
  ].join("\n");
}

function buildPlanTitle(intake: ShiftPlanPaidIntake) {
  if (intake.intake_type === "custom_plan") return "Custom 7-Day ShiftPlan";
  if (intake.intake_type === "founding_pro") {
    return "Founding Pro Weekly ShiftPlan";
  }
  return "Founding Pro Weekly Schedule ShiftPlan";
}

function formatPaidLabel(value: PaidIntakeType) {
  if (value === "custom_plan") return "Custom Plan";
  if (value === "founding_pro") return "Founding Pro";
  return "Weekly Schedule";
}

function formatPlanDates(intake: ShiftPlanPaidIntake) {
  const start = intake.plan_start_date || intake.week_start_date;
  const end = intake.plan_end_date || intake.week_end_date;

  if (!start && !end) return "Not provided";
  if (start && end) return `${start} to ${end}`;
  return start || end || "Not provided";
}

function formatUsageBadge(intake: ShiftPlanPaidIntake) {
  const planLimit = intake.founding_pro_plan_limit || 4;

  if (!intake.founding_pro_plan_number) {
    return "Plan usage: Not set";
  }

  return `Plan ${intake.founding_pro_plan_number} of ${planLimit} this billing period`;
}

function formatBillingPeriod(intake: ShiftPlanPaidIntake) {
  const start = intake.billing_period_start;
  const end = intake.billing_period_end;

  if (!start && !end) return "Not set";
  if (start && end) return `${start} to ${end}`;
  return start || end || "Not set";
}

const customPlanOutputStructure = [
  "1. Header",
  "2. Important note",
  "3. Your week at a glance",
  "4. 7-day plan",
  "5. Workday routine",
  "6. Post-shift reset",
  "7. Off-day routine",
  "8. Meal prep structure",
  "9. Workout/training placement",
  "10. Errands, appointments, and family responsibilities",
  "11. Top 3 priorities this week",
  "12. Simple copy/paste checklist",
  "13. Final note",
].join("\n");

const foundingProOutputStructure = [
  "1. Header",
  "2. Plan usage placeholder if exact usage is not tracked yet",
  "3. Saved preferences used if available",
  "4. Important note",
  "5. This week's game plan",
  "6. Your week at a glance",
  "7. 7-day plan",
  "8. Workday routine",
  "9. Post-shift reset",
  "10. Off-day routine",
  "11. Meal prep structure",
  "12. Workout/training placement",
  "13. Errands, appointments, and family responsibilities",
  "14. Top 3 priorities this week",
  "15. Copy/paste checklist",
  "16. Founding Pro weekly check-in",
  "17. Final note",
].join("\n");

function formatPromptFields(fields: [string, string | null | undefined][]) {
  return fields
    .map(([label, value]) => `- ${label}: ${valueOrFallback(value)}`)
    .join("\n");
}

function valueOrFallback(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : "Not provided";
}

function extractOutputText(result: OpenAIResponse) {
  if (typeof result.output_text === "string") {
    return result.output_text;
  }

  if (!Array.isArray(result.output)) {
    return "";
  }

  return result.output
    .flatMap((item) => {
      if (!item || typeof item !== "object" || !("content" in item)) return [];
      const content = (item as { content?: unknown }).content;
      if (!Array.isArray(content)) return [];

      return content.map((part) => {
        if (!part || typeof part !== "object") return "";
        const maybeText = part as { text?: unknown };
        return typeof maybeText.text === "string" ? maybeText.text : "";
      });
    })
    .filter(Boolean)
    .join("\n");
}
