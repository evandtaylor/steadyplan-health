import type { Metadata } from "next";
import { ParkedRouteNotice } from "@/components/ParkedRouteNotice";

export const metadata: Metadata = {
  title: "KinPlan Parked Future Concept",
  description:
    "KinPlan is parked while ShiftPlan launches as the first deployable product.",
};

export default function KinPlanPage() {
  return (
    <ParkedRouteNotice
      title="KinPlan is parked while ShiftPlan launches first."
      description="KinPlan remains a future SteadyPlan Health concept for family care organization, but the current MVP is focused on ShiftPlan for nurses and shift workers."
    />
  );
}
