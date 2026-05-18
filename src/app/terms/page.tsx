import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Plain-English terms for using ShiftPlan.",
};

export default function TermsPage() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.24),transparent_32%),radial-gradient(circle_at_86%_4%,rgba(96,165,250,0.18),transparent_26%),linear-gradient(180deg,#020617_0%,#08111f_48%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
      <div className="relative mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
          Terms
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          ShiftPlan terms
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          These terms explain the basic rules, safety boundaries, and current
          ShiftPlan offers.
        </p>

        <div className="mt-8 grid gap-5 text-base leading-8 text-slate-300">
          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              What ShiftPlan provides
            </h2>
            <p className="mt-3">
              ShiftPlan is a lifestyle and routine planning tool for nurses and
              shift workers. It helps organize schedules, meals, workouts,
              errands, appointments, recovery blocks, family responsibilities,
              and personal tasks into a simple weekly plan.
            </p>
          </section>

          <section className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-teal-50">
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

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
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

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Current offers
            </h2>
            <div className="mt-3 grid gap-4">
              <div className="rounded-lg border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-semibold text-white">
                  Free 3x12 Shift Worker Reset Plan
                </h3>
                <p className="mt-2">
                  A free routine template for shift workers organizing a week
                  around three 12-hour shifts.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-semibold text-white">
                  $9 one-time Custom 7-Day ShiftPlan
                </h3>
                <p className="mt-2">
                  One personalized 7-day routine plan based on the schedule and
                  planning details you submit.
                </p>
              </div>
              <div className="rounded-lg border border-teal-300/30 bg-teal-300/10 p-4">
                <h3 className="font-semibold text-teal-50">
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

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Payments, cancellations, and refunds
            </h2>
            <p className="mt-3">
              Completed personalized plans are generally non-refundable once
              delivered. Founding Pro is month-to-month. Users may cancel before
              the next billing date to avoid future charges.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              No guaranteed outcomes
            </h2>
            <p className="mt-3">
              ShiftPlan can help organize a week, but it does not guarantee a
              specific result, outcome, schedule success, health outcome,
              workplace outcome, or personal outcome.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
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

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-3">
              For questions about these terms, contact{" "}
              <a
                href="mailto:support@shiftplan.ai"
                className="font-semibold text-teal-200 underline-offset-4 hover:underline"
              >
                support@shiftplan.ai
              </a>
              .
            </p>
          </section>
        </div>

        <aside className="mt-6 rounded-lg border border-white/10 bg-slate-950/70 p-5 text-sm leading-6 text-slate-300 shadow-sm">
          ShiftPlan is for lifestyle and routine organization only. It does not
          provide medical advice, diagnosis, treatment, healthcare guidance, or
          emergency support.
        </aside>
      </div>
    </section>
  );
}
