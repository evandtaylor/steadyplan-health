import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How ShiftPlan works",
  description:
    "A simple step-by-step guide to using ShiftPlan: add your schedule, generate a realistic weekly plan, and follow it one day at a time.",
};

const steps = [
  {
    number: "01",
    headline: "Add what ShiftPlan should know",
    copy: "Save your usual commute, meal prep style, workout preferences, and anything you want ShiftPlan to remember.",
    mockup: "defaults",
  },
  {
    number: "02",
    headline: "Tell ShiftPlan your week",
    copy: "Add your week start date, exact shifts, known schedule events, and anything that changed this week.",
    mockup: "create",
  },
  {
    number: "03",
    headline: "Generate your ShiftPlan",
    copy: "ShiftPlan turns your shifts, priorities, workouts, meals, errands, and responsibilities into a weekly plan.",
    mockup: "generate",
  },
  {
    number: "04",
    headline: "Follow Today and your checklist",
    copy: "Use Today / Next Up and the checklist to move through the week without digging through a long plan.",
    mockup: "today",
  },
  {
    number: "05",
    headline: "Adjust, export, and give feedback",
    copy: "Copy your plan, download a calendar file, update what changed, and leave feedback so future plans improve.",
    mockup: "actions",
  },
];

const safetyNote =
  "ShiftPlan is for lifestyle and routine organization only. It is not medical advice, diagnosis, treatment, sleep disorder guidance, fatigue treatment, medication guidance, workplace safety guidance, or emergency support.";

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(21,87,255,0.42),transparent_34%),radial-gradient(ellipse_at_top_left,rgba(18,191,174,0.24),transparent_30%),linear-gradient(180deg,#020617_0%,#07111f_52%,#0f172a_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg border border-teal-300/25 bg-teal-300/10 px-3 py-2 text-sm font-semibold uppercase text-teal-100 shadow-[0_0_32px_rgba(20,184,166,0.18)]">
              ShiftPlan guide
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl">
              How ShiftPlan works
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Add your schedule, generate a realistic weekly plan, and follow it
              one day at a time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/beta/shiftplan"
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-400 px-5 py-3 text-base font-semibold text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.24)] transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
              >
                Join the private beta
              </Link>
              <Link
                href="/app"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
              >
                Have beta access? Log in
              </Link>
            </div>
          </div>
          <HeroFlowMockup />
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,191,174,0.16),transparent_44%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-5">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
              >
                <div>
                  <p className="text-sm font-semibold uppercase text-teal-200">
                    Step {step.number}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                    {step.headline}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                    {step.copy}
                  </p>
                </div>
                <StepMockup type={step.mockup} index={index} />
              </article>
            ))}
          </div>

          <aside className="mt-8 rounded-lg border border-blue-300/20 bg-blue-300/10 p-5 text-sm leading-6 text-slate-300 shadow-sm backdrop-blur">
            <p className="font-semibold text-blue-100">Safety note</p>
            <p className="mt-2">{safetyNote}</p>
          </aside>

          <div className="mt-8 rounded-lg border border-teal-300/20 bg-white/[0.06] p-6 text-center shadow-[0_0_60px_rgba(20,184,166,0.12)] backdrop-blur sm:p-8">
            <p className="text-sm font-semibold uppercase text-teal-200">
              Ready to try it
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Start with your real week.
            </h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/beta/shiftplan"
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
              >
                Join the private beta
              </Link>
              <Link
                href="/app"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
              >
                Have beta access? Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroFlowMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-400/20 via-blue-500/20 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-lg border border-white/15 bg-slate-950 p-4 shadow-2xl sm:p-5">
        <div className="grid gap-3">
          {["Schedule", "Create", "Plan", "Checklist", "Feedback"].map(
            (item, index) => (
              <div
                key={item}
                className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-300/15 text-sm font-semibold text-teal-100 ring-1 ring-teal-300/20">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item}</p>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-teal-300"
                      style={{ width: `${38 + index * 12}%` }}
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function StepMockup({ type, index }: { type: string; index: number }) {
  const accent = index % 2 === 0 ? "bg-teal-300" : "bg-blue-300";

  if (type === "defaults") {
    return (
      <MockupShell title="Saved defaults" eyebrow="Settings">
        <MockupField label="Commute" value="30 min each way" />
        <MockupField label="Meal prep" value="Simple grab-and-go meals" />
        <MockupField label="Workout preference" value="Off days, 30-45 min" />
      </MockupShell>
    );
  }

  if (type === "create") {
    return (
      <MockupShell title="Tell ShiftPlan your week" eyebrow="Create">
        <MockupField label="Week start" value="Monday, May 18" />
        <MockupField label="Exact shifts" value="Mon / Tue / Wed 7a-7p" />
        <MockupField label="Known this week" value="Appointment, errands, workout" />
      </MockupShell>
    );
  }

  if (type === "generate") {
    return (
      <MockupShell title="Generate your ShiftPlan" eyebrow="AI plan">
        <div className="rounded-lg border border-teal-300/30 bg-teal-300/10 p-4">
          <p className="text-sm font-semibold text-teal-50">
            Ready to generate
          </p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className={`h-2 w-4/5 rounded-full ${accent}`} />
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-300">
          Uses shifts, priorities, workouts, meals, errands, and known
          commitments.
        </p>
      </MockupShell>
    );
  }

  if (type === "today") {
    return (
      <MockupShell title="Today / Next Up" eyebrow="Plan">
        {["Pack meals before shift", "Keep errands off workday", "Review Thursday reset"].map(
          (item, itemIndex) => (
            <div key={item} className="flex items-center gap-3 rounded-lg bg-white/[0.06] p-3">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                  itemIndex === 0
                    ? "border-teal-300 bg-teal-300 text-slate-950"
                    : "border-white/20 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="text-sm text-slate-200">{item}</span>
            </div>
          ),
        )}
      </MockupShell>
    );
  }

  return (
    <MockupShell title="Export and feedback" eyebrow="Actions">
      <div className="grid gap-2 sm:grid-cols-2">
        <MockupButton label="Copy plan" />
        <MockupButton label="Download calendar" />
        <MockupButton label="Update request" />
        <MockupButton label="Leave feedback" />
      </div>
    </MockupShell>
  );
}

function MockupShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/80 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-200">
            {eyebrow}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">{title}</p>
        </div>
        <span className="rounded-lg bg-teal-300/15 px-3 py-1 text-xs font-semibold text-teal-100">
          ShiftPlan
        </span>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function MockupField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function MockupButton({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-center text-sm font-semibold text-slate-200">
      {label}
    </div>
  );
}
