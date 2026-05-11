import { NextResponse } from "next/server";
import { getSupabaseRestUrl } from "@/lib/supabase-url";

const deliveryStatuses = new Set([
  "Draft",
  "Reviewed",
  "Delivered",
  "Needs Revision",
  "Archived",
]);

const planTypes = new Set(["custom_plan", "founding_pro", "founding_pro_weekly"]);

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

type AdminDeliveredPlanRequest = {
  password?: unknown;
  paid_intake_id?: unknown;
  customer_email?: unknown;
  customer_name?: unknown;
  plan_type?: unknown;
  plan_title?: unknown;
  plan_start_date?: unknown;
  plan_end_date?: unknown;
  plan_body?: unknown;
  delivery_status?: unknown;
  admin_notes?: unknown;
  mark_delivered?: unknown;
};

type ExistingPlan = {
  id: string;
  delivered_at: string | null;
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

type ExistingIntake = {
  id: string;
  delivered_at: string | null;
};

type UpdatedIntake = {
  id: string;
  fulfillment_status: string;
  admin_notes: string | null;
  delivered_at: string | null;
  updated_at: string;
};

export async function POST(request: Request) {
  let payload: AdminDeliveredPlanRequest;

  try {
    payload = (await request.json()) as AdminDeliveredPlanRequest;
  } catch {
    return NextResponse.json(
      { message: "Check the plan output request and try again." },
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
  const customerEmail = normalizeEmail(payload.customer_email);
  const customerName = optionalText(payload.customer_name);
  const planType = typeof payload.plan_type === "string" ? payload.plan_type.trim() : "";
  const planTitle = optionalText(payload.plan_title);
  const planStartDate = parseOptionalDate(payload.plan_start_date);
  const planEndDate = parseOptionalDate(payload.plan_end_date);
  const planBody = typeof payload.plan_body === "string" ? payload.plan_body.trim() : "";
  const requestedStatus =
    typeof payload.delivery_status === "string"
      ? payload.delivery_status.trim()
      : "Draft";
  const shouldMarkDelivered =
    payload.mark_delivered === true || requestedStatus === "Delivered";
  const deliveryStatus = shouldMarkDelivered ? "Delivered" : requestedStatus;
  const adminNotes = optionalText(payload.admin_notes);

  if (!paidIntakeId) {
    return NextResponse.json(
      { message: "Choose a paid intake before saving a plan." },
      { status: 400 },
    );
  }

  if (!customerEmail) {
    return NextResponse.json(
      { message: "Customer email is required for the saved plan." },
      { status: 400 },
    );
  }

  if (!planTypes.has(planType)) {
    return NextResponse.json(
      { message: "Choose a valid plan type." },
      { status: 400 },
    );
  }

  if (planStartDate === false || planEndDate === false) {
    return NextResponse.json(
      { message: "Use valid plan dates." },
      { status: 400 },
    );
  }

  if (!planBody) {
    return NextResponse.json(
      { message: "Paste the final plan body before saving." },
      { status: 400 },
    );
  }

  if (!deliveryStatuses.has(deliveryStatus)) {
    return NextResponse.json(
      { message: "Choose a valid delivery status." },
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
    const existingIntake = await getExistingIntake(
      supabaseRestUrl,
      headers,
      paidIntakeId,
    );

    if (existingIntake === false) {
      return NextResponse.json(
        { message: "Could not load the paid intake for this plan." },
        { status: 502 },
      );
    }

    if (!existingIntake) {
      return NextResponse.json(
        { message: "Paid intake submission was not found." },
        { status: 404 },
      );
    }

    const existingPlan = await getExistingPlan(
      supabaseRestUrl,
      headers,
      paidIntakeId,
    );

    if (existingPlan === false) {
      return NextResponse.json(
        { message: "Could not load the saved plan." },
        { status: 502 },
      );
    }

    const now = new Date().toISOString();
    const updateBody: {
      paid_intake_id: string;
      customer_email: string;
      customer_name: string | null;
      plan_type: string;
      plan_title: string | null;
      plan_start_date: string | null;
      plan_end_date: string | null;
      plan_body: string;
      delivery_status: string;
      admin_notes: string | null;
      updated_at: string;
      delivered_at?: string;
    } = {
      paid_intake_id: paidIntakeId,
      customer_email: customerEmail,
      customer_name: customerName,
      plan_type: planType,
      plan_title: planTitle,
      plan_start_date: planStartDate,
      plan_end_date: planEndDate,
      plan_body: planBody,
      delivery_status: deliveryStatus,
      admin_notes: adminNotes,
      updated_at: now,
    };

    if (deliveryStatus === "Delivered" && !existingPlan?.delivered_at) {
      updateBody.delivered_at = now;
    }

    const plan = existingPlan
      ? await updateDeliveredPlan(supabaseRestUrl, headers, existingPlan.id, updateBody)
      : await createDeliveredPlan(supabaseRestUrl, headers, updateBody);

    if (!plan) {
      return NextResponse.json(
        { message: "Plan output was not saved." },
        { status: 502 },
      );
    }

    let intake: UpdatedIntake | null = null;
    if (deliveryStatus === "Delivered") {
      intake = await markIntakeDelivered(
        supabaseRestUrl,
        headers,
        existingIntake,
        now,
      );
    }

    return NextResponse.json(
      {
        message:
          deliveryStatus === "Delivered"
            ? "Plan saved and marked delivered."
            : "Plan output saved.",
        plan,
        intake,
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

async function getExistingIntake(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  paidIntakeId: string,
) {
  const query = new URLSearchParams({
    select: "id,delivered_at",
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

  const rows = (await response.json()) as ExistingIntake[];
  return rows[0] || null;
}

async function getExistingPlan(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  paidIntakeId: string,
) {
  const query = new URLSearchParams({
    select: "id,delivered_at",
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

async function createDeliveredPlan(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  updateBody: Record<string, unknown>,
) {
  const query = new URLSearchParams({
    select: deliveredPlanColumns,
  });
  const response = await fetch(
    `${supabaseRestUrl}/shiftplan_delivered_plans?${query}`,
    {
      method: "POST",
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

async function updateDeliveredPlan(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  planId: string,
  updateBody: Record<string, unknown>,
) {
  const query = new URLSearchParams({
    id: `eq.${planId}`,
    select: deliveredPlanColumns,
  });
  const response = await fetch(
    `${supabaseRestUrl}/shiftplan_delivered_plans?${query}`,
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

  if (!response.ok) return null;

  const rows = (await response.json()) as DeliveredPlan[];
  return rows[0] || null;
}

async function markIntakeDelivered(
  supabaseRestUrl: string,
  headers: Record<string, string>,
  existingIntake: ExistingIntake,
  now: string,
) {
  const updateBody: {
    fulfillment_status: string;
    updated_at: string;
    delivered_at?: string;
  } = {
    fulfillment_status: "Delivered",
    updated_at: now,
  };

  if (!existingIntake.delivered_at) {
    updateBody.delivered_at = now;
  }

  const query = new URLSearchParams({
    id: `eq.${existingIntake.id}`,
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
      body: JSON.stringify(updateBody),
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const rows = (await response.json()) as UpdatedIntake[];
  return rows[0] || null;
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function optionalText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function parseOptionalDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return value;
}
