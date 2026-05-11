import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";

const problemPoints = [
  "Most planners assume normal mornings, normal evenings, and predictable weekends.",
  "Shift workers are planning around long shifts, commute time, sleep windows, errands, meals, training, and family life.",
  "ShiftPlan starts with the schedule you actually have, then helps shape the week around it.",
];

const howItWorksSteps = [
  {
    step: "Step 1",
    title: "Tell us what your schedule looks like",
    description:
      "Share your role, shift type, workdays, commute, routine goals, and what feels hardest to organize.",
  },
  {
    step: "Step 2",
    title: "Get a practical reset template",
    description:
      "The free 3x12 reset plan is built around sleep, meals, workouts, errands, and recovery blocks for a demanding shift week.",
  },
  {
    step: "Step 3",
    title: "Choose one-time or ongoing support",
    description:
      "If the free plan is useful, you can choose one custom 7-day plan or Founding Pro weekly planning support.",
  },
];

const weeklyPlanPreview = [
  {
    day: "Mon",
    shift: "12-hour shift",
    plan: "Pack meals, protect wind-down time, keep errands off the calendar.",
  },
  {
    day: "Tue",
    shift: "12-hour shift",
    plan: "Repeat simple food plan, light movement only if it fits, reset bag for tomorrow.",
  },
  {
    day: "Wed",
    shift: "12-hour shift",
    plan: "Use the minimum routine: commute, meals, sleep window, one small home task.",
  },
  {
    day: "Thu",
    shift: "Reset day",
    plan: "Laundry, groceries, family admin, and an easy training block if wanted.",
  },
  {
    day: "Fri",
    shift: "Off day",
    plan: "Appointments, workout, meal prep, and a short review of next week.",
  },
];

const faqItems = [
  {
    question: "Is ShiftPlan medical advice?",
    answer:
      "No. ShiftPlan is a lifestyle organization and routine planning tool. It does not provide medical advice, diagnosis, or treatment.",
  },
  {
    question: "Who is this first MVP for?",
    answer:
      "The first launch focus is nurses and healthcare shift workers who want a simpler weekly routine around irregular or demanding schedules.",
  },
  {
    question: "What is the free reset plan?",
    answer:
      "It is a practical routine template for three 12-hour shifts, focused on sleep windows, meals, workouts, errands, recovery blocks, and life admin.",
  },
  {
    question: "What paid options are planned?",
    answer:
      "ShiftPlan Founding Pro is $9/month for ongoing weekly planning support. A Custom 7-Day ShiftPlan is $9 one-time for one upcoming week.",
  },
];

const foundingProPaymentLink = "https://buy.stripe.com/dRmcN53lz6qvej7g5r0RG00";
const customPlanPaymentLink = "https://buy.stripe.com/14AaEXcW9g155MBcTf0RG01";

export default function Home() {
  return (
    <>
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12">
          <div>
            <p className="inline-flex rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold uppercase text-teal-800 ring-1 ring-teal-100">
              Free reset plan now open
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Turn your shift schedule into a simple weekly life plan.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              ShiftPlan helps nurses and shift workers organize sleep, meals,
              workouts, errands, appointments, recovery blocks, family
              responsibilities, and personal tasks around long, irregular, or
              demanding schedules.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/beta/shiftplan"
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
              >
                Get My Free Reset Plan
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
              >
                See How It Works
              </Link>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Start with the Free 3x12 Shift Worker Reset Plan. If it is useful,
              tell us whether ongoing Founding Pro support or one custom
              7-day plan would fit your schedule.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="rounded-lg bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    3x12 reset preview
                  </p>
                  <p className="text-sm text-slate-500">
                    Built around real shift days
                  </p>
                </div>
                <span className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
                  Free
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  "Map shift days and commute windows",
                  "Place simple meals and recovery blocks",
                  "Protect errands and family tasks from piling up",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <span className="h-3 w-3 rounded-full bg-teal-500" />
                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Before shift", "After shift", "Reset day"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <DisclaimerBox />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Problem"
            title="Normal life planning breaks when your schedule is not normal."
            description="Normal planners are built for normal schedules. Shift workers need something different."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problemPoints.map((point) => (
              <div
                key={point}
                className="rounded-lg border border-slate-200 bg-white p-6 text-base leading-7 text-slate-700 shadow-sm"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How it works"
            title="A simple path from messy schedule to usable week."
            description="The first version is intentionally focused: collect practical schedule details, create a reset template, and learn whether a custom plan is worth building next."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase text-teal-700">
                  {step.step}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Weekly plan preview"
            title="A realistic week, not a perfect routine."
            description="ShiftPlan is designed to make the week easier to see: what needs to happen before work, what can wait, and what belongs on a reset day."
          />
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3">
              {weeklyPlanPreview.map((item) => (
                <div
                  key={item.day}
                  className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[4rem_8rem_1fr] sm:items-start"
                >
                  <p className="text-sm font-semibold text-teal-800">
                    {item.day}
                  </p>
                  <p className="text-sm font-semibold text-slate-950">
                    {item.shift}
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    {item.plan}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-blue-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Beta offers"
            title="Choose the ShiftPlan that fits your schedule."
            description="Start with a free 3x12 reset template, get one custom weekly plan, or join Founding Pro for ongoing weekly planning support when your schedule keeps changing."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <article className="rounded-lg border border-teal-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold uppercase text-teal-700">
                  Free starter
                </p>
                <p className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  $0
                </p>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                3x12 Shift Worker Reset Plan
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                A simple weekly routine template for nurses and shift workers
                working three 12-hour shifts.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                {[
                  "Example 3x12 weekly structure",
                  "Workday routine template",
                  "Post-shift reset template",
                  "Off-day reset template",
                  "Meal prep and workout placement ideas",
                  "Weekly reset checklist",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/beta/shiftplan"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Get the Free Reset Plan
              </Link>
            </article>

            <article className="relative rounded-lg border-2 border-teal-600 bg-white p-6 shadow-lg ring-1 ring-teal-100">
              <div className="absolute right-5 top-5 rounded-lg bg-teal-800 px-3 py-1 text-sm font-semibold text-white">
                Best Value
              </div>
              <p className="pr-28 text-sm font-semibold uppercase text-teal-700">
                Founding Pro
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                ShiftPlan Founding Pro
              </h3>
              <p className="mt-4 text-4xl font-semibold text-slate-950">
                $9<span className="text-lg font-medium text-slate-500">/month</span>
              </p>
              <p className="mt-3 leading-7 text-slate-600">
                Ongoing weekly planning support for shift workers with changing
                schedules.
              </p>
              <p className="mt-3 rounded-lg bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900">
                Your schedule changes. Your plan should too.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                {[
                  "Up to 4 custom weekly ShiftPlans per month",
                  "Submit your schedule each week",
                  "Plans built around shifts, meals, workouts, errands, recovery blocks, appointments, and personal tasks",
                  "Monthly routine tune-up",
                  "Copy/paste checklist version",
                  "Founding member pricing while subscribed",
                  "Early access to future app features",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={foundingProPaymentLink}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Join Founding Pro
              </Link>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                After checkout, you&apos;ll be sent to the intake form. Please
                use the same email at checkout and intake.
              </p>
              <p className="mt-5 text-xs leading-5 text-slate-500">
                Founding Pro includes up to 4 custom weekly ShiftPlans per
                monthly billing period. One plan covers one 7-day schedule.
                Unused weekly plans do not roll over. Minor corrections are
                included, but major schedule changes may count as a new weekly
                plan. During early access, plans may be manually reviewed before
                delivery.
              </p>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold uppercase text-blue-700">
                  One-time
                </p>
                <p className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
                  $9
                </p>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                Custom 7-Day ShiftPlan
              </h3>
              <p className="mt-3 text-lg font-semibold text-slate-800">
                $9 one-time
              </p>
              <p className="mt-3 leading-7 text-slate-600">
                Send your upcoming week and get one custom routine plan built
                around your actual schedule.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                {[
                  "One custom 7-day plan",
                  "Workday and off-day structure",
                  "Meal prep blocks",
                  "Workout placement",
                  "Errand and appointment batching",
                  "Recovery/reset blocks",
                  "Copy/paste checklist version",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={customPlanPaymentLink}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Get My 7-Day Plan
              </Link>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                After checkout, you&apos;ll be sent to the intake form. Please
                use the same email at checkout and intake.
              </p>
            </article>
          </div>
          <aside className="mt-6 rounded-lg border border-blue-200 bg-white/80 p-4 text-sm leading-6 text-slate-700 shadow-sm">
            <p className="font-semibold text-slate-950">Safety note</p>
            <p className="mt-2">
              ShiftPlan is for routine and lifestyle organization only. It does
              not provide medical advice, diagnosis, treatment, or healthcare
              guidance.
            </p>
          </aside>
        </div>
      </section>

      <section id="faq" className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Built for planning, with clear boundaries."
            description="ShiftPlan is meant to make a complicated week easier to organize. It is not a healthcare tool."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqItems.map((item) => (
              <FeatureCard
                key={item.question}
                title={item.question}
                description={item.answer}
              />
            ))}
          </div>
          <div className="mt-8">
            <DisclaimerBox />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-teal-200 bg-teal-800 p-8 text-center shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase text-teal-100">
            Ready for the first reset?
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Get the Free 3x12 Shift Worker Reset Plan.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-teal-50">
            Share practical schedule details and help shape the first
            deployable ShiftPlan product.
          </p>
          <Link
            href="/beta/shiftplan"
            className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-base font-semibold text-teal-900 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-800 sm:w-fit"
          >
            Get My Free Reset Plan
          </Link>
        </div>
      </section>
    </>
  );
}
