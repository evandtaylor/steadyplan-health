import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  APP_ACCESS_SESSION_COOKIE_NAME,
  verifyAppAccessSession,
} from "@/lib/app-access";
import { ShiftPlanAppAccess } from "@/components/ShiftPlanAppAccess";

export const metadata: Metadata = {
  title: "ShiftPlan App",
  description:
    "Early access ShiftPlan app preview for weekly routine planning around shift schedules.",
};

export default async function ShiftPlanAppPage() {
  const cookieStore = await cookies();
  const session = verifyAppAccessSession(
    cookieStore.get(APP_ACCESS_SESSION_COOKIE_NAME)?.value,
  );

  return (
    <ShiftPlanAppAccess
      initialAccess={session ? { email: session.email } : null}
    />
  );
}
