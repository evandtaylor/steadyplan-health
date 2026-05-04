import type { Metadata } from "next";
import { KinPlanIntakeForm } from "@/components/KinPlanIntakeForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "KinPlan Beta Intake",
  description:
    "Share practical family care organization details for a manual KinPlan beta review.",
};

export default function KinPlanBetaIntakePage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="KinPlan beta"
            title="Tell us what family care needs to feel organized."
            description="This intake collects practical caregiver coordination details so a family care organization plan can be created manually later. Please avoid patient full legal names, dates of birth, diagnoses, prescription medication names, medical record numbers, insurance numbers, uploaded documents, lab values, or protected health information."
          />

          <aside className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-slate-700 shadow-sm">
            <p className="font-semibold text-blue-950">KinPlan safety note</p>
            <p className="mt-2">
              KinPlan provides organizational and educational support only. It
              does not diagnose, treat, prescribe, or replace medical advice
              from the care team.
            </p>
          </aside>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
            <p className="font-semibold text-slate-950">Storage choice</p>
            <p className="mt-2">
              This intake uses a separate <code>kinplan_intakes</code> table
              because caregiver coordination fields are different from the
              general beta waitlist and should stay structured for manual
              review.
            </p>
          </div>
        </div>

        <KinPlanIntakeForm />
      </div>
    </section>
  );
}
