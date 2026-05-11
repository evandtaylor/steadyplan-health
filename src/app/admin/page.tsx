import type { Metadata } from "next";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Internal MVP dashboard for reviewing ShiftPlan free and paid submissions.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
