import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const webhookToleranceSeconds = 300;
const internalRecipient = "evan@shiftplan.ai";
const internalSender = "ShiftPlan <notifications@shiftplan.ai>";
const adminDashboardUrl = "https://www.shiftplan.ai/admin";
const customPlanIntakeUrl = "https://www.shiftplan.ai/intake/custom-plan";
const foundingProIntakeUrl = "https://www.shiftplan.ai/intake/founding-pro";

type StripeWebhookEvent = {
  id?: string;
  type?: string;
  data?: {
    object?: unknown;
  };
};

type StripeCheckoutSession = {
  id?: string;
  mode?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  customer?: string | { id?: string } | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  payment_status?: string | null;
  subscription?: string | { id?: string } | null;
  line_items?: {
    data?: Array<{
      description?: string | null;
    }>;
  } | null;
};

type ShiftPlanOffer = {
  name: string;
  intakeUrl: string;
};

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!stripeSecretKey || !stripeWebhookSecret || !resendApiKey) {
    return NextResponse.json(
      { message: "Purchase notifications are not configured." },
      { status: 500 },
    );
  }

  const signatureHeader = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signatureHeader || !verifyStripeSignature(rawBody, signatureHeader, stripeWebhookSecret)) {
    return NextResponse.json(
      { message: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  let event: StripeWebhookEvent;

  try {
    event = JSON.parse(rawBody) as StripeWebhookEvent;
  } catch {
    return NextResponse.json(
      { message: "Invalid webhook payload." },
      { status: 400 },
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, handled: false });
  }

  const sessionFromEvent = event.data?.object as StripeCheckoutSession | undefined;
  const sessionId = sessionFromEvent?.id;

  if (!sessionId) {
    return NextResponse.json(
      { message: "Checkout session ID is missing." },
      { status: 400 },
    );
  }

  const session = await retrieveCheckoutSession(sessionId, stripeSecretKey);

  if (!session) {
    return NextResponse.json(
      { message: "Could not verify the checkout session." },
      { status: 502 },
    );
  }

  const emailPayload = buildPurchaseNotificationEmail(session);
  const emailSent = await sendInternalNotification(resendApiKey, emailPayload);

  if (!emailSent) {
    return NextResponse.json(
      { message: "Purchase notification could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ received: true, handled: true });
}

function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampNumber);
  if (ageSeconds > webhookToleranceSeconds) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");

  return signatures.some((signature) => safeCompare(signature, expectedSignature));
}

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

async function retrieveCheckoutSession(sessionId: string, stripeSecretKey: string) {
  const query = new URLSearchParams({
    "expand[]": "line_items.data.price.product",
  });

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
        },
      },
    );

    if (!response.ok) return null;

    return (await response.json()) as StripeCheckoutSession;
  } catch {
    return null;
  }
}

function buildPurchaseNotificationEmail(session: StripeCheckoutSession) {
  const offer = getOfferFromSession(session);
  const customerEmail =
    session.customer_details?.email || session.customer_email || "Not provided";
  const amount = formatAmount(session.amount_total, session.currency);
  const stripeCustomerId = readStripeId(session.customer) || "Not provided";
  const subscriptionId = readStripeId(session.subscription) || "Not applicable";
  const paymentStatus = session.payment_status || "Not provided";
  const checkoutSessionId = session.id || "Not provided";

  const subject = `New ShiftPlan purchase: ${offer.name}`;
  const text = [
    `New ShiftPlan purchase: ${offer.name}`,
    "",
    `Offer purchased: ${offer.name}`,
    `Customer email: ${customerEmail}`,
    `Amount: ${amount}`,
    `Stripe customer ID: ${stripeCustomerId}`,
    `Stripe checkout session ID: ${checkoutSessionId}`,
    `Stripe subscription ID: ${subscriptionId}`,
    `Payment status: ${paymentStatus}`,
    "",
    `Admin dashboard: ${adminDashboardUrl}`,
    `Customer intake link: ${offer.intakeUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">New ShiftPlan purchase</h1>
      <p><strong>Offer purchased:</strong> ${escapeHtml(offer.name)}</p>
      <p><strong>Customer email:</strong> ${escapeHtml(customerEmail)}</p>
      <p><strong>Amount:</strong> ${escapeHtml(amount)}</p>
      <p><strong>Stripe customer ID:</strong> ${escapeHtml(stripeCustomerId)}</p>
      <p><strong>Stripe checkout session ID:</strong> ${escapeHtml(checkoutSessionId)}</p>
      <p><strong>Stripe subscription ID:</strong> ${escapeHtml(subscriptionId)}</p>
      <p><strong>Payment status:</strong> ${escapeHtml(paymentStatus)}</p>
      <p><a href="${adminDashboardUrl}">Open admin dashboard</a></p>
      <p><a href="${offer.intakeUrl}">Open correct intake form</a></p>
    </div>
  `;

  return { subject, text, html };
}

function getOfferFromSession(session: StripeCheckoutSession): ShiftPlanOffer {
  if (session.mode === "subscription") {
    return {
      name: "ShiftPlan Founding Pro",
      intakeUrl: foundingProIntakeUrl,
    };
  }

  return {
    name: "Custom 7-Day ShiftPlan",
    intakeUrl: customPlanIntakeUrl,
  };
}

function formatAmount(amountTotal: number | null | undefined, currency: string | null | undefined) {
  if (typeof amountTotal !== "number" || !currency) {
    return "Not provided";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountTotal / 100);
}

function readStripeId(value: string | { id?: string } | null | undefined) {
  if (typeof value === "string") return value;
  return value?.id || "";
}

async function sendInternalNotification(
  resendApiKey: string,
  emailPayload: { subject: string; text: string; html: string },
) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: internalSender,
        to: [internalRecipient],
        subject: emailPayload.subject,
        text: emailPayload.text,
        html: emailPayload.html,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
