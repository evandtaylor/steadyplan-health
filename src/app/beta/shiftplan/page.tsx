import type { Metadata } from "next";
import { ShiftPlanIntakeForm } from "@/components/ShiftPlanIntakeForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Free 3x12 Shift Worker Reset Plan",
  description:
    "Request a practical ShiftPlan routine template for three 12-hour shifts.",
};

export default function ShiftPlanBetaIntakePage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="ShiftPlan beta"
            title="Free 3x12 Shift Worker Reset Plan"
            description="Get a practical routine template for sleep, meals, workouts, errands, and recovery around three 12-hour shifts. Please keep this focused on lifestyle planning needs and avoid diagnoses, prescriptions, lab values, detailed medical history, date of birth, Social Security number, or protected health information."
          />

          <aside className="mt-8 rounded-lg border border-teal-200 bg-teal-50 p-5 text-sm leading-6 text-slate-700 shadow-sm">
            <p className="font-semibold text-teal-950">ShiftPlan safety note</p>
            <p className="mt-2">
              ShiftPlan is a lifestyle organization and routine planning tool.
              It does not provide medical advice, diagnosis, or treatment. It
              does not treat fatigue, burnout, sleep disorders, anxiety, or any
              medical condition.
            </p>
          </aside>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
            <p className="font-semibold text-slate-950">
              Optional $9 custom plan interest
            </p>
            <p className="mt-2">
              The form includes a simple paid-interest question using the
              existing intake fields. No payment is collected on this page.
            </p>
          </div>
        </div>

        <ShiftPlanIntakeForm />
      </div>
    </section>
  );
}
