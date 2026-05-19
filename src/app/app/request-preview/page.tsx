import type { Metadata } from "next";
import { WeeklyRequestForm } from "@/components/WeeklyRequestForm";

export const metadata: Metadata = {
  title: "Request Form Preview | ShiftPlan",
  description:
    "Preview the new ShiftPlan weekly request form UI design.",
};

export default function RequestFormPreviewPage() {
  return (
    <div className="shiftplan-app-theme min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <WeeklyRequestForm />
    </div>
  );
}
