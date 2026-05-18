import type { Metadata } from "next";
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
    <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.26),transparent_32%),radial-gradient(circle_at_92%_10%,rgba(96,165,250,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#08111f_50%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            Founding Pro
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Founding Pro onboarding
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Share the practical routine and schedule preferences that help
            shape ongoing weekly planning support during early access.
          </p>
          <aside className="mt-8 rounded-lg border border-teal-300/20 bg-teal-300/10 p-5 text-sm leading-6 text-teal-50 shadow-sm backdrop-blur">
            ShiftPlan is for lifestyle and routine organization only. It does
            not provide medical advice, diagnosis, treatment, healthcare
            guidance, or emergency support.
          </aside>
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
