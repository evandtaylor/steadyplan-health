import type { Metadata } from "next";
import { SavedPlanView } from "@/components/SavedPlanView";

export const metadata: Metadata = {
  title: "Plan View Preview | ShiftPlan",
  description:
    "Preview the new ShiftPlan saved plan view UI design.",
};

export default function PlanViewPreviewPage() {
  return (
    <div className="shiftplan-app-theme min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <SavedPlanView />
    </div>
  );
}
