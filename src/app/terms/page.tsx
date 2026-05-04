import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Terms",
  description: "Plain-English terms placeholder for SteadyPlan Health.",
};

export default function TermsPage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Terms"
          title="Plain-English terms placeholder"
          description="These placeholder terms explain the current safety boundaries for the MVP."
        />
        <div className="mt-8 space-y-5 text-base leading-8 text-slate-700">
          <p>
            SteadyPlan Health provides organizational and educational support
            only. It is not a medical provider and does not replace care from
            licensed professionals.
          </p>
          <p>
            Users should always follow instructions from their healthcare team.
            For emergency symptoms, users should call 911 or seek emergency
            care.
          </p>
          <p>
            This MVP should not be used to diagnose, treat, prescribe, change
            medication use, recommend peptides or research chemicals, or provide
            disease-specific medical nutrition therapy.
          </p>
          <p>
            Before launch, these terms should be reviewed and expanded with
            qualified legal guidance.
          </p>
        </div>
        <div className="mt-8">
          <DisclaimerBox />
        </div>
      </div>
    </section>
  );
}
