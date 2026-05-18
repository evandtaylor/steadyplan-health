import type { Metadata } from "next";
import { ShiftPlanPaidIntakeForm } from "@/components/ShiftPlanPaidIntakeForm";

export const metadata: Metadata = {
  title: "Founding Pro Weekly Schedule",
  description:
    "Submit this week's schedule for ShiftPlan Founding Pro during early access.",
};

const fields = [
  { name: "first_name", label: "First name" },
  { name: "email", label: "Email", type: "email" as const },
  { name: "week_start_date", label: "Week start date", type: "date" as const },
  {
    name: "exact_work_shifts",
    label: "Exact work shifts for this week",
    type: "textarea" as const,
    helpText: "Include days, start times, end times, and any call blocks.",
  },
  {
    name: "appointments_this_week",
    label: "Appointments this week",
    type: "textarea" as const,
    helpText: "If none, write none.",
  },
  {
    name: "errands_this_week",
    label: "Errands this week",
    type: "textarea" as const,
    helpText: "If none, write none.",
  },
  {
    name: "family_personal_responsibilities_this_week",
    label: "Family/personal responsibilities this week",
    type: "textarea" as const,
  },
  {
    name: "workout_training_goals_this_week",
    label: "Workout/training goals this week",
    type: "textarea" as const,
  },
  {
    name: "meal_prep_needs_this_week",
    label: "Meal prep needs this week",
    type: "textarea" as const,
  },
  {
    name: "top_3_priorities_this_week",
    label: "Top 3 priorities this week",
    type: "textarea" as const,
  },
  {
    name: "changed_from_last_week",
    label: "Anything that changed from last week",
    type: "textarea" as const,
    helpText: "If this is your first weekly submission, write first week.",
  },
  {
    name: "worked_from_last_plan",
    label: "What worked from the last plan?",
    type: "textarea" as const,
    helpText: "If this is your first weekly submission, write first week.",
  },
  {
    name: "unrealistic_from_last_plan",
    label: "What felt unrealistic from the last plan?",
    type: "textarea" as const,
    helpText: "If this is your first weekly submission, write first week.",
  },
  {
    name: "specific_request_this_week",
    label: "Any specific request for this week?",
    type: "textarea" as const,
  },
];

export default function FoundingProWeeklyIntakePage() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.26),transparent_32%),radial-gradient(circle_at_92%_10%,rgba(96,165,250,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#08111f_50%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            Weekly schedule
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Founding Pro weekly schedule
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Send the practical details for the upcoming week so your weekly
            ShiftPlan can be built around the schedule you actually have.
          </p>
          <aside className="mt-8 rounded-lg border border-teal-300/20 bg-teal-300/10 p-5 text-sm leading-6 text-teal-50 shadow-sm backdrop-blur">
            ShiftPlan is for lifestyle and routine organization only. It does
            not provide medical advice, diagnosis, treatment, healthcare
            guidance, or emergency support.
          </aside>
        </div>
        <ShiftPlanPaidIntakeForm
          intakeType="founding_pro_weekly"
          title="Submit this week's schedule"
          description="Use this for schedule, responsibilities, routines, and planning preferences only. Do not include medical details or emergency requests."
          fields={fields}
          successTitle="Your weekly schedule is submitted."
        />
      </div>
    </section>
  );
}
