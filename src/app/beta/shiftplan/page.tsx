import type { Metadata } from "next";
import { ShiftPlanIntakeForm } from "@/components/ShiftPlanIntakeForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "ShiftPlan Beta Intake",
  description:
    "Share shift-work planning details for a manual ShiftPlan beta review.",
};

export default function ShiftPlanBetaIntakePage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="ShiftPlan beta"
            title="Tell us what your week actually looks like."
            description="This intake collects practical schedule and routine details so a ShiftPlan draft can be created manually later. Please keep it focused on planning needs and avoid diagnoses, prescriptions, lab values, detailed medical history, date of birth, Social Security number, or protected health information."
          />

          <aside className="mt-8 rounded-lg border border-teal-200 bg-teal-50 p-5 text-sm leading-6 text-slate-700 shadow-sm">
            <p className="font-semibold text-teal-950">ShiftPlan safety note</p>
            <p className="mt-2">
              ShiftPlan provides organizational and educational support only. It
              does not diagnose, treat, prescribe, or replace medical advice.
            </p>
          </aside>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
            <p className="font-semibold text-slate-950">Storage choice</p>
            <p className="mt-2">
              This intake uses a separate <code>shiftplan_intakes</code> table
              because these fields are specific to shift-work planning and need
              to stay structured for manual review.
            </p>
          </div>
        </div>

        <ShiftPlanIntakeForm />
      </div>
    </section>
  );
}
