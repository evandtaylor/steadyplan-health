import type { Metadata } from "next";
import { ParkedRouteNotice } from "@/components/ParkedRouteNotice";

export const metadata: Metadata = {
  title: "KinPlan Intake Parked",
  description:
    "KinPlan intake is parked while ShiftPlan launches as the first deployable product.",
};

export default function KinPlanBetaIntakePage() {
  return (
    <ParkedRouteNotice
      title="KinPlan intake is parked for the first launch."
      description="The KinPlan beta intake route is preserved for later, but ShiftPlan is the current launch focus and the only promoted intake flow."
    />
  );
}
