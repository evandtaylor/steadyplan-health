import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";
import { ShiftPlanPaidIntakeForm } from "@/components/ShiftPlanPaidIntakeForm";

export const metadata: Metadata = {
  title: "Founding Pro Onboarding",
  description:
    "Submit onboarding details for ShiftPlan Founding Pro during early access.",
};

const fields = [
  { name: "first_name", label: "First name" },
  {
    name: "email",
    label: "Email used at checkout",
    type: "email" as const,
  },
  { name: "job_role", label: "Job/role" },
  {
    name: "typical_shift_pattern",
    label: "Typical shift pattern",
    type: "textarea" as const,
  },
  { name: "typical_commute_time", label: "Typical commute time" },
  {
    name: "preferred_plan_style",
    label: "Preferred plan style",
    type: "textarea" as const,
  },
  {
    name: "organize_focus",
    label: "What do you want ShiftPlan to organize?",
    type: "textarea" as const,
  },
  {
    name: "meal_prep_preferences",
    label: "Meal prep preferences",
    type: "textarea" as const,
  },
  {
    name: "workout_training_preferences",
    label: "Workout/training preferences",
    type: "textarea" as const,
  },
  {
    name: "recurring_responsibilities",
    label: "Recurring responsibilities",
    type: "textarea" as const,
  },
  {
    name: "avoid_after_work",
    label: "What should we avoid scheduling after work?",
    type: "textarea" as const,
  },
  {
    name: "messy_week_reason",
    label: "What makes your week feel messy?",
    type: "textarea" as const,
  },
  {
    name: "monthly_goal",
    label: "Main goal for the next month",
    type: "textarea" as const,
  },
];

export default function FoundingProIntakePage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Founding Pro"
            title="Founding Pro onboarding"
            description="Share the practical routine and schedule preferences that help shape ongoing weekly planning support during early access."
          />
          <div className="mt-8">
            <DisclaimerBox />
          </div>
        </div>
        <ShiftPlanPaidIntakeForm
          intakeType="founding_pro"
          title="Set up your Founding Pro planning preferences"
          description="This onboarding form helps us understand the routines, responsibilities, and planning style you want reflected across weekly ShiftPlans."
          fields={fields}
          successTitle="Your Founding Pro onboarding is submitted."
        />
      </div>
    </section>
  );
}
