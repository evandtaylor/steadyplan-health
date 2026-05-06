import type { Metadata } from "next";
import { ParkedRouteNotice } from "@/components/ParkedRouteNotice";

export const metadata: Metadata = {
  title: "SuppPlan Parked Future Concept",
  description:
    "SuppPlan is parked while ShiftPlan launches as the first deployable product.",
};

export default function SuppPlanPage() {
  return (
    <ParkedRouteNotice
      title="SuppPlan is parked while ShiftPlan launches first."
      description="SuppPlan remains a future SteadyPlan Health concept for supplement routine organization, but the current MVP is focused on ShiftPlan for nurses and shift workers."
    />
  );
}
