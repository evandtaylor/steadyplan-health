import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Terms",
  description: "Plain-English terms for using ShiftPlan.",
};

export default function TermsPage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Terms"
          title="ShiftPlan terms"
          description="These terms explain the basic rules, safety boundaries, and current ShiftPlan offers."
        />

        <div className="mt-8 space-y-8 text-base leading-8 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              What ShiftPlan provides
            </h2>
            <p className="mt-3">
              ShiftPlan is a lifestyle and routine planning tool for nurses and
              shift workers. It helps organize schedules, meals, workouts,
              errands, appointments, recovery blocks, family responsibilities,
              and personal tasks into a simple weekly plan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Safety boundaries
            </h2>
            <p className="mt-3">
              ShiftPlan is not medical advice, diagnosis, treatment, healthcare
              guidance, sleep disorder guidance, fatigue treatment, burnout
              treatment, medication guidance, mental health guidance, workplace
              safety guidance, or emergency support. Users are responsible for
              their own decisions and should follow workplace policies,
              professional guidance, and instructions from qualified
              professionals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              AI-assisted planning
            </h2>
            <p className="mt-3">
              ShiftPlan may use AI-assisted tools to help draft routine plans
              from the intake details you submit. The ShiftPlan app may also
              generate AI plans directly for users, and those app-generated
              plans may not be manually reviewed before you see them.
              AI-generated plans may contain errors, omissions, unrealistic
              suggestions, incorrect assumptions, or date and time mistakes.
            </p>
            <p className="mt-3">
              During the MVP and founding period, plans generated through the
              admin fulfillment workflow may be reviewed before delivery. In all
              cases, you are responsible for reviewing any plan, adjusting it
              for your real life, and deciding what fits your work policies,
              obligations, schedule, and personal situation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Current offers
            </h2>
            <div className="mt-3 grid gap-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-950">
                  Free 3x12 Shift Worker Reset Plan
                </h3>
                <p className="mt-2">
                  A free routine template for shift workers organizing a week
                  around three 12-hour shifts.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-950">
                  $9 one-time Custom 7-Day ShiftPlan
                </h3>
                <p className="mt-2">
                  One personalized 7-day routine plan based on the schedule and
                  planning details you submit.
                </p>
              </div>
              <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                <h3 className="font-semibold text-slate-950">
                  $9/month ShiftPlan Founding Pro
                </h3>
                <p className="mt-2">
                  Founding Pro includes up to 4 custom weekly ShiftPlans per
                  monthly billing period. One plan covers one 7-day schedule.
                  Unused plans do not roll over. Minor corrections may be
                  included, but major schedule changes may count as a new plan.
                  During early access, plans delivered through manual
                  fulfillment may be manually reviewed before delivery.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Payments, cancellations, and refunds
            </h2>
            <p className="mt-3">
              Completed personalized plans are generally non-refundable once
              delivered. Founding Pro is month-to-month. Users may cancel before
              the next billing date to avoid future charges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              No guaranteed outcomes
            </h2>
            <p className="mt-3">
              ShiftPlan can help organize a week, but it does not guarantee a
              specific result, outcome, schedule success, health outcome,
              workplace outcome, or personal outcome.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Acceptable use
            </h2>
            <p className="mt-3">
              Do not submit emergencies, medical requests, unsafe requests,
              private medical information, protected health information,
              medication details, diagnoses, symptoms, emergency information,
              workplace safety complaints, safety-sensitive details,
              prescription medication lists, lab values, medical records,
              insurance numbers, Social Security numbers, or requests for
              professional advice that ShiftPlan is not designed to provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Contact</h2>
            <p className="mt-3">
              For questions about these terms, contact{" "}
              <a
                href="mailto:support@shiftplan.ai"
                className="font-semibold text-teal-800 underline-offset-4 hover:underline"
              >
                support@shiftplan.ai
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-8">
          <DisclaimerBox />
        </div>
      </div>
    </section>
  );
}
