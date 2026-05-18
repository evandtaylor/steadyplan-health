import type { Metadata } from "next";
import { ShiftPlanPaidIntakeForm } from "@/components/ShiftPlanPaidIntakeForm";

export const metadata: Metadata = {
  title: "Custom 7-Day ShiftPlan Intake",
  description:
    "Submit schedule details for one custom 7-day ShiftPlan during early access.",
};

const fields = [
  { name: "first_name", label: "First name" },
  {
    name: "email",
    label: "Email used at checkout",
    type: "email" as const,
  },
  { name: "plan_start_date", label: "Plan start date", type: "date" as const },
  { name: "job_role", label: "Job/role" },
  { name: "schedule_type", label: "Schedule type" },
  {
    name: "exact_work_shifts",
    label: "Exact work shifts for the 7-day period",
    type: "textarea" as const,
    helpText: "Include days, start times, end times, and any call blocks.",
  },
  { name: "commute_time", label: "Commute time" },
  {
    name: "main_goal",
    label: "Main goal for the week",
    type: "textarea" as const,
  },
  {
    name: "meal_prep_preferences",
    label: "Meal prep preferences",
    type: "textarea" as const,
  },
  {
    name: "workout_training_goals",
    label: "Workout/training goals",
    type: "textarea" as const,
  },
  {
    name: "appointments",
    label: "Appointments",
    type: "textarea" as const,
    helpText: "If none, write none.",
  },
  {
    name: "errands",
    label: "Errands",
    type: "textarea" as const,
    helpText: "If none, write none.",
  },
  {
    name: "family_personal_responsibilities",
    label: "Family/personal responsibilities",
    type: "textarea" as const,
  },
  {
    name: "top_3_priorities",
    label: "Top 3 priorities",
    type: "textarea" as const,
  },
  {
    name: "anything_to_avoid",
    label: "Anything to avoid",
    type: "textarea" as const,
  },
  {
    name: "preferred_plan_style",
    label: "Preferred plan style",
    type: "textarea" as const,
    helpText:
      "Example: detailed schedule, checklist, flexible blocks, or simple reset plan.",
  },
];

export default function CustomPlanIntakePage() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.26),transparent_32%),radial-gradient(circle_at_92%_10%,rgba(96,165,250,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#08111f_50%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            Custom 7-day plan
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Custom 7-Day ShiftPlan intake
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Submit the practical schedule details needed to create one 7-day
            routine plan around your actual shifts, responsibilities, and goals.
          </p>
          <aside className="mt-8 rounded-lg border border-teal-300/20 bg-teal-300/10 p-5 text-sm leading-6 text-teal-50 shadow-sm backdrop-blur">
            ShiftPlan is for lifestyle and routine organization only. It does
            not provide medical advice, diagnosis, treatment, healthcare
            guidance, or emergency support.
          </aside>
        </div>
        <ShiftPlanPaidIntakeForm
          intakeType="custom_plan"
          title="Tell us about the week you want planned"
          description="Keep this focused on schedule, routines, responsibilities, and preferences. Do not submit medical records, diagnoses, medications, lab values, or emergency requests."
          fields={fields}
          successTitle="Your custom ShiftPlan intake is submitted."
        />
      </div>
    </section>
  );
}
