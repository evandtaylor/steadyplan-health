import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";
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
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Custom 7-day plan"
            title="Custom 7-Day ShiftPlan intake"
            description="Submit the practical schedule details needed to create one 7-day routine plan around your actual shifts, responsibilities, and goals."
          />
          <div className="mt-8">
            <DisclaimerBox />
          </div>
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
