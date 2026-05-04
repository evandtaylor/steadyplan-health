import type { Metadata } from "next";
import { ProductPage } from "@/components/ProductPage";

export const metadata: Metadata = {
  title: "ShiftPlan",
  description:
    "Organize sleep, meals, workouts, hydration, caffeine timing, and recovery around real shift work.",
};

export default function ShiftPlanPage() {
  return <ProductPage product="shiftplan" />;
}
