import { createHash, createHmac, timingSafeEqual } from "crypto";

export type AppAccessSession = {
  appUserId: string;
  email: string;
  expiresAt: string;
};

const appAccessSessionCookieName = "shiftplan_app_access";
const appAccessHashPrefix = "shiftplan_app_access:v1";
const appAccessSessionTtlSeconds = 60 * 60 * 24 * 14;

export const APP_ACCESS_SESSION_COOKIE_NAME = appAccessSessionCookieName;
export const APP_ACCESS_SESSION_TTL_SECONDS = appAccessSessionTtlSeconds;

export function normalizeAppEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function normalizeAccessCode(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function hashAppAccessCode(email: string, code: string) {
  return createHash("sha256")
    .update(`${appAccessHashPrefix}:${email}:${code}`)
    .digest("hex");
}

export function createAppAccessSession(session: AppAccessSession) {
  const secret = getAppAccessSessionSecret();
  if (!secret) return "";

  const payload = Buffer.from(JSON.stringify(session), "utf8").toString(
    "base64url",
  );
  const signature = signPayload(payload, secret);

  return `${payload}.${signature}`;
}

export function verifyAppAccessSession(value: string | undefined) {
  const secret = getAppAccessSessionSecret();
  if (!secret || !value) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload, secret);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<AppAccessSession>;

    if (
      typeof parsed.appUserId !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.expiresAt !== "string"
    ) {
      return null;
    }

    if (new Date(parsed.expiresAt).getTime() <= Date.now()) return null;

    return {
      appUserId: parsed.appUserId,
      email: parsed.email,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function getAppAccessSessionExpiresAt() {
  return new Date(Date.now() + appAccessSessionTtlSeconds * 1000);
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function getAppAccessSessionSecret() {
  return (
    process.env.APP_ACCESS_SESSION_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    ""
  );
}
