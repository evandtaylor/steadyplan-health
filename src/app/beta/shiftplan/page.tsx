import type { Metadata } from "next";
import { ShiftPlanIntakeForm } from "@/components/ShiftPlanIntakeForm";

export const metadata: Metadata = {
  title: "Free 3x12 Shift Worker Reset Plan",
  description:
    "Request a practical ShiftPlan routine template for three 12-hour shifts.",
};

export default function ShiftPlanBetaIntakePage() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.28),transparent_32%),radial-gradient(circle_at_90%_8%,rgba(96,165,250,0.2),transparent_28%),linear-gradient(180deg,#020617_0%,#08111f_52%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            ShiftPlan beta
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Free 3x12 Shift Worker Reset Plan
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Get a practical routine template for sleep, meals, workouts,
            errands, and recovery around three 12-hour shifts. Please keep this
            focused on lifestyle planning needs and avoid diagnoses,
            prescriptions, lab values, detailed medical history, date of birth,
            Social Security number, or protected health information.
          </p>

          <aside className="mt-8 rounded-lg border border-teal-300/20 bg-teal-300/10 p-5 text-sm leading-6 text-teal-50 shadow-sm backdrop-blur">
            <p className="font-semibold text-teal-100">ShiftPlan safety note</p>
            <p className="mt-2">
              ShiftPlan is a lifestyle organization and routine planning tool.
              It does not provide medical advice, diagnosis, or treatment. It
              does not treat fatigue, burnout, sleep disorders, anxiety, or any
              medical condition.
            </p>
          </aside>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.06] p-5 text-sm leading-6 text-slate-300 shadow-sm backdrop-blur">
            <p className="font-semibold text-white">
              Optional $9 custom plan interest
            </p>
            <p className="mt-2">
              The form includes a simple paid-interest question using the
              existing intake fields. No payment is collected on this page.
            </p>
          </div>
        </div>

        <ShiftPlanIntakeForm />
      </div>
    </section>
  );
}
