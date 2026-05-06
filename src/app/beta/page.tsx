import type { Metadata } from "next";
import { BetaForm } from "@/components/BetaForm";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "General Beta Waitlist",
  description:
    "General SteadyPlan beta waitlist preserved while ShiftPlan launches first.",
};

export default function BetaPage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="General beta"
            title="The focused ShiftPlan intake is the main launch flow."
            description="This general waitlist is preserved for internal continuity, but the current public launch focus is the Free 3x12 Shift Worker Reset Plan at /beta/shiftplan."
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
