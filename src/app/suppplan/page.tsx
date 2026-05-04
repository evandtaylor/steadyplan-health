import type { Metadata } from "next";
import { ProductPage } from "@/components/ProductPage";

export const metadata: Metadata = {
  title: "SuppPlan",
  description:
    "Organize supplement timing, inventory, duplicate ingredients, and questions to ask a qualified professional.",
};

export default function SuppPlanPage() {
  return <ProductPage product="suppplan" />;
}
