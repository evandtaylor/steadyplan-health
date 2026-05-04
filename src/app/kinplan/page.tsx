import type { Metadata } from "next";
import { ProductPage } from "@/components/ProductPage";

export const metadata: Metadata = {
  title: "KinPlan",
  description:
    "Organize family care tasks, appointments, discharge instructions, provider notes, and questions for the care team.",
};

export default function KinPlanPage() {
  return <ProductPage product="kinplan" />;
}
