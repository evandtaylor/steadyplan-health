import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const relationshipOptions = new Set([
  "Parent",
  "Grandparent",
  "Spouse",
  "Other family member",
  "Friend",
  "Other",
]);
const careSituationOptions = new Set([
  "After hospital discharge",
  "Aging parent support",
  "Multiple appointments",
  "Medication organization",
  "Mobility/fall-risk concerns",
  "Memory/cognitive concerns",
  "Other",
]);
const caregiverCountOptions = new Set([
  "Just me",
  "2 people",
  "3-4 people",
  "5+ people",
]);
const willingnessOptions = new Set(["Yes", "No", "Maybe"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type KinPlanIntakePayload = {
  name?: unknown;
  email?: unknown;
  relationship_to_care_recipient?: unknown;
  main_care_situation?: unknown;
  caregiver_count?: unknown;
  biggest_challenge?: unknown;
  scattered_information?: unknown;
  plan_needs?: unknown;
  current_tools?: unknown;
  willingness_to_pay?: unknown;
};

type KinPlanIntakeData = {
  name: string;
  email: string;
  relationship_to_care_recipient: string;
  main_care_situation: string;
  caregiver_count: string;
  biggest_challenge: string;
  scattered_information: string;
  plan_needs: string;
  current_tools: string;
  willingness_to_pay: string;
};

type ValidationResult =
  | {
      ok: true;
      data: KinPlanIntakeData;
    }
  | {
      ok: false;
      message: string;
      errors: Record<string, string>;
    };

export async function POST(request: Request) {
  let payload: KinPlanIntakePayload;

  try {
    payload = (await request.json()) as KinPlanIntakePayload;
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
          "The KinPlan intake list is not connected yet. Please add Supabase environment variables and try again.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${supabaseRestUrl}/kinplan_intakes`, {
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
            "We could not save your KinPlan intake right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "Thanks. Your KinPlan intake was saved for manual review.",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not reach the KinPlan intake list right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

function validatePayload(payload: KinPlanIntakePayload): ValidationResult {
  const name = readText(payload.name);
  const email = readText(payload.email).toLowerCase();
  const relationship = readText(payload.relationship_to_care_recipient);
  const mainCareSituation = readText(payload.main_care_situation);
  const caregiverCount = readText(payload.caregiver_count);
  const biggestChallenge = readText(payload.biggest_challenge);
  const scatteredInformation = readText(payload.scattered_information);
  const planNeeds = readText(payload.plan_needs);
  const currentTools = readText(payload.current_tools);
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
    "relationship_to_care_recipient",
    relationship,
    relationshipOptions,
    "Choose a valid relationship.",
  );
  validateOption(
    errors,
    "main_care_situation",
    mainCareSituation,
    careSituationOptions,
    "Choose a valid care situation.",
  );
  validateOption(
    errors,
    "caregiver_count",
    caregiverCount,
    caregiverCountOptions,
    "Choose a valid caregiver count.",
  );
  if (!biggestChallenge) {
    errors.biggest_challenge = "Share the biggest challenge right now.";
  }
  if (!scatteredInformation) {
    errors.scattered_information =
      "Share what information feels scattered or confusing.";
  }
  if (!planNeeds) {
    errors.plan_needs =
      "Share what a clear family care plan would need to include.";
  }
  if (!currentTools) {
    errors.current_tools = "Share the current tools being used.";
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
      relationship_to_care_recipient: relationship,
      main_care_situation: mainCareSituation,
      caregiver_count: caregiverCount,
      biggest_challenge: biggestChallenge,
      scattered_information: scatteredInformation,
      plan_needs: planNeeds,
      current_tools: currentTools,
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
