import type { Metadata } from "next";
import { ShiftPlanDashboard } from "@/components/ShiftPlanDashboard";

export const metadata: Metadata = {
  title: "Dashboard Preview | ShiftPlan",
  description:
    "Preview the new ShiftPlan dashboard UI design.",
};

export default function DashboardPreviewPage() {
  return (
    <div className="shiftplan-app-theme min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <ShiftPlanDashboard />
    </div>
  );
}
