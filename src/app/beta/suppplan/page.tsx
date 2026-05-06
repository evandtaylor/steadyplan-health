import type { Metadata } from "next";
import { ParkedRouteNotice } from "@/components/ParkedRouteNotice";

export const metadata: Metadata = {
  title: "SuppPlan Intake Parked",
  description:
    "SuppPlan intake is parked while ShiftPlan launches as the first deployable product.",
};

export default function SuppPlanBetaIntakePage() {
  return (
    <ParkedRouteNotice
      title="SuppPlan intake is parked for the first launch."
      description="The SuppPlan beta intake route is preserved for later, but ShiftPlan is the current launch focus and the only promoted intake flow."
    />
  );
}
