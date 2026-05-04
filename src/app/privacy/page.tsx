import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Plain-English privacy placeholder for SteadyPlan Health.",
};

export default function PrivacyPage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Privacy"
          title="Plain-English privacy placeholder"
          description="This early MVP is designed to avoid collecting unnecessary sensitive health data."
        />
        <div className="mt-8 space-y-5 text-base leading-8 text-slate-700">
          <p>
            SteadyPlan Health is currently a basic marketing and beta interest
            site. Beta forms are stored in Supabase so the founder can review
            early user interest and manually shape the first planning workflows.
          </p>
          <p>
            A later secure version may add account features, database storage,
            email notifications, and AI plan drafts. Before that happens, this
            privacy page should be replaced with a complete policy that explains
            what is collected, why it is collected, how it is protected, and how
            users can request changes or deletion.
          </p>
          <p>
            The MVP should avoid collecting diagnoses, prescription medication
            lists, lab values, or protected health information unless a later
            secure version explicitly requires it.
          </p>
        </div>
        <div className="mt-8">
          <DisclaimerBox />
        </div>
      </div>
    </section>
  );
}
