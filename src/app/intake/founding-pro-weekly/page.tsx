import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";
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
  { name: "week_end_date", label: "Week end date", type: "date" as const },
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
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Weekly schedule"
            title="Founding Pro weekly schedule"
            description="Send the practical details for the upcoming week so your weekly ShiftPlan can be built around the schedule you actually have."
          />
          <div className="mt-8">
            <DisclaimerBox />
          </div>
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
