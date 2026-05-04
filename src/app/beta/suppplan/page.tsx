import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SuppPlanIntakeForm } from "@/components/SuppPlanIntakeForm";

export const metadata: Metadata = {
  title: "SuppPlan Beta Intake",
  description:
    "Share practical supplement organization details for a manual SuppPlan beta review.",
};

export default function SuppPlanBetaIntakePage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="SuppPlan beta"
            title="Tell us what would make supplement organization simpler."
            description="This intake collects practical routine details so a supplement organization plan can be created manually later. Please avoid specific peptide use, research chemical use, injection details, prescription medication lists, diagnoses, lab values, dosing instructions, or sensitive medical information."
          />

          <aside className="mt-8 rounded-lg border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-slate-700 shadow-sm">
            <p className="font-semibold text-cyan-950">SuppPlan safety note</p>
            <p className="mt-2">
              SuppPlan provides organizational and educational support only. It
              does not diagnose, treat, prescribe, recommend peptides or
              research chemicals, or replace medical advice.
            </p>
          </aside>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
            <p className="font-semibold text-slate-950">Storage choice</p>
            <p className="mt-2">
              This intake uses a separate <code>suppplan_intakes</code> table
              because supplement organization fields are different from the
              general beta waitlist and should stay structured for manual
              review.
            </p>
          </div>
        </div>

        <SuppPlanIntakeForm />
      </div>
    </section>
  );
}
