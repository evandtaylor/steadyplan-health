import type { Metadata } from "next";
import { BetaForm } from "@/components/BetaForm";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Join the Beta",
  description:
    "Join the SteadyPlan Health beta list for ShiftPlan, KinPlan, SuppPlan, or all product lines.",
};

export default function BetaPage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Beta"
            title="Tell us what would make planning feel lighter."
            description="Submissions are saved to the Supabase waitlist when the project environment variables are configured. No authentication, payments, email service, or AI API is connected yet."
          />
          <div className="mt-8">
            <DisclaimerBox />
          </div>
        </div>
        <BetaForm />
      </div>
    </section>
  );
}
