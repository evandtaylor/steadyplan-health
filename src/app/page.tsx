import { ShiftPlanMark } from "@/components/ShiftPlanLogo";
import { TrackedLink } from "@/components/TrackedLink";
import { AppPreviewSection } from "@/components/AppPreviewSection";
import Link from "next/link";

const problemPoints = [
  "Most planners assume normal mornings, evenings, and weekends.",
  "Shift workers are planning around long shifts, commute time, meals, training, errands, and family life.",
  "ShiftPlan starts with the week you actually have, then shapes a realistic routine around it.",
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Share your schedule",
    description:
      "Add your shifts, commute, appointments, meals, workouts, responsibilities, and the week&apos;s main goal.",
  },
  {
    step: "02",
    title: "Add what matters this week",
    description:
      "Tell ShiftPlan what needs attention, what should stay light, and what you want off your workdays.",
  },
  {
    step: "03",
    title: "Get a realistic weekly plan",
    description:
      "Review a simple plan you can copy, adjust, reuse, and bend around real life.",
  },
];

const weeklyPlanPreview = [
  {
    day: "Mon",
    shift: "7a-7p",
    plan: "Pack meals, keep errands off the calendar, protect the wind-down block.",
  },
  {
    day: "Tue",
    shift: "7a-7p",
    plan: "Repeat the simple workday routine and reset the bag for tomorrow.",
  },
  {
    day: "Wed",
    shift: "7a-7p",
    plan: "Use the minimum routine: commute, meal, sleep window, one tiny task.",
  },
  {
    day: "Thu",
    shift: "Reset",
    plan: "Laundry, groceries, short strength session, and family admin.",
  },
  {
    day: "Fri",
    shift: "Off",
    plan: "Dentist, meal prep, appointment batching, and next-week review.",
  },
];

const appSignals = [
  { label: "Workdays mapped", value: "3" },
  { label: "Open reset blocks", value: "4" },
  { label: "Errands batched", value: "Fri" },
];

const appBetaFeatures = [
  "AI weekly plan generation",
  "Saved preferences",
  "Plan history",
  "Use last week as a starting point",
  "Feedback under each plan",
];

const comingNextFeatures = [
  "More human plan output",
  "Interactive checklist",
  "Add-to-calendar export",
  "Weekly reminders",
  "Better mobile app layout",
  "Public accounts later",
  "iPhone app later",
];

const appPreviewChecklist = [
  "Pack meals before first shift",
  "Keep errands off workdays",
  "Dentist Friday morning",
  "Family dinner Saturday",
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

const foundingProPaymentLink = "https://buy.stripe.com/14A8wP4pDg152Ap4mJ0RG03";
const customPlanPaymentLink = "https://buy.stripe.com/14AaEXcW9g155MBcTf0RG01";

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(21,87,255,0.45),transparent_34%),radial-gradient(ellipse_at_top_left,rgba(18,191,174,0.28),transparent_30%),linear-gradient(180deg,#020617_0%,#07111f_52%,#0f172a_100%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-cyan-300/10 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-lg border border-teal-300/25 bg-teal-300/10 px-3 py-2 text-sm font-semibold uppercase text-teal-100 shadow-[0_0_32px_rgba(20,184,166,0.18)]">
                Free reset plan now open
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Turn your shift schedule into a simple weekly life plan.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                ShiftPlan helps nurses and shift workers organize meals,
                workouts, errands, appointments, recovery blocks, family
                responsibilities, and personal tasks around long or irregular
                schedules.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-100">
                Private beta app: add known shifts, school, clinicals,
                appointments, and deadlines ahead of time, then generate weekly
                plans around what is already on your calendar.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href="/beta/shiftplan"
                  eventName="free_reset_cta_click"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-teal-400 px-5 py-3 text-base font-semibold text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.24)] transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                >
                  Get My Free Reset Plan
                </TrackedLink>
                <Link
                  href="#pricing"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                >
                  View Pricing
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {appSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-white">
                      {signal.value}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase text-slate-400">
                      {signal.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <HeroScheduleMockup />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(18,191,174,0.16),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            eyebrow="Built for non-normal weeks"
            title="Normal life planning breaks when your schedule is not normal."
            description="ShiftPlan keeps the practical pieces visible, so workdays stay simple and off-days do not become a pile of everything."
            dark
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problemPoints.map((point, index) => (
              <div
                key={point}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-sm backdrop-blur"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-300/15 text-sm font-semibold text-teal-200 ring-1 ring-teal-300/20">
                  {index + 1}
                </span>
                <p className="mt-5 text-base leading-7 text-slate-300">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(21,87,255,0.2),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            eyebrow="How it works"
            title="From your schedule to a usable week."
            description="Start with the week you actually have, add what needs to fit, and get a plan that keeps workdays simple."
            dark
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-sm backdrop-blur"
              >
                <p className="text-sm font-semibold uppercase text-teal-200">
                  {step.step}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p
                  className="mt-3 leading-7 text-slate-300"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,191,174,0.2),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <SectionIntro
            eyebrow="Weekly plan preview"
            title="A realistic week, not a perfect routine."
            description="A plan should make the week easier to see: what needs to happen before work, what can wait, and what belongs on a reset day."
            dark
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur sm:p-5">
            <div className="grid gap-3">
              {weeklyPlanPreview.map((item) => (
                <div
                  key={item.day}
                  className="grid gap-3 rounded-lg border border-white/10 bg-slate-950/70 p-4 sm:grid-cols-[4rem_6rem_1fr] sm:items-start"
                >
                  <p className="text-sm font-semibold text-teal-300">
                    {item.day}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {item.shift}
                  </p>
                  <p className="text-sm leading-6 text-slate-300">
                    {item.plan}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(21,87,255,0.22),transparent_38%),radial-gradient(ellipse_at_bottom_left,rgba(18,191,174,0.18),transparent_36%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionIntro
            eyebrow="Private beta app preview"
            title="A weekly planning workspace built for repeat use."
            description="The web app is becoming the place to save preferences, reuse last week's request, generate a plan, and work through a practical checklist."
            dark
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-lg border border-teal-300/20 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-teal-200">
                      Weekly plan snapshot
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Monday, May 18 - Sunday, May 24
                    </h3>
                  </div>
                  <span className="rounded-lg bg-teal-300/15 px-3 py-1 text-xs font-semibold text-teal-100">
                    Private beta
                  </span>
                </div>
                <div className="mt-4 grid gap-2">
                  {weeklyPlanPreview.slice(0, 4).map((item) => (
                    <div
                      key={item.day}
                      className="grid grid-cols-[2.6rem_4rem_1fr] gap-3 rounded-lg bg-white/[0.05] px-3 py-3 text-sm"
                    >
                      <span className="font-semibold text-teal-200">
                        {item.day}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {item.shift}
                      </span>
                      <span className="truncate text-xs text-slate-400">
                        {item.plan}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Interactive checklist
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    2 of 4 complete
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-300">
                    {appPreviewChecklist.map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                            index < 2
                              ? "border-teal-300 bg-teal-300 text-slate-950"
                              : "border-white/20 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-4">
                    <p className="text-xs font-semibold uppercase text-teal-100">
                      Saved preferences
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Remember commute, meal prep style, training goals, and
                      what to avoid after work.
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-300/20 bg-blue-300/10 p-4">
                    <p className="text-xs font-semibold uppercase text-blue-100">
                      Starting point
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Reuse last week&apos;s request, update what changed, then
                      generate a fresh plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppPreviewSection />

      <section
        id="pricing"
        className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(21,87,255,0.22),transparent_38%),radial-gradient(ellipse_at_bottom_left,rgba(18,191,174,0.18),transparent_36%)]" />
        <div className="relative z-10 mx-auto mb-14 max-w-6xl rounded-lg border border-teal-300/20 bg-white/[0.06] p-6 shadow-[0_0_60px_rgba(20,184,166,0.12)] backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-200">
                In private beta now
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                The AI weekly planner built around shift work.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Enter your shifts, priorities, meals, workouts, errands,
                appointments, and responsibilities. ShiftPlan turns them into a
                realistic weekly plan around your actual work schedule.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                ShiftPlan is for lifestyle and routine organization only. It is
                not medical advice, treatment, healthcare guidance, workplace
                safety guidance, or emergency support.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href="/beta/shiftplan"
                  eventName="waitlist_cta_click"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-teal-300 px-5 py-3 text-base font-semibold text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.18)] transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                >
                  Join the waitlist
                </TrackedLink>
                <TrackedLink
                  href="/beta/shiftplan"
                  eventName="beta_apply_cta_click"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
                >
                  Apply for private beta
                </TrackedLink>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-5">
                <h3 className="font-semibold text-teal-50">Available now</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  {appBetaFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-950/65 p-5">
                <h3 className="font-semibold text-white">Coming next</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  {comingNextFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(18,191,174,0.18),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(21,87,255,0.2),transparent_38%)]" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionIntro
            eyebrow="Beta offers"
            title="Choose the ShiftPlan that fits your schedule."
            description="Start with a free 3x12 reset template, get one custom weekly plan, or join Founding Pro for ongoing weekly planning support."
            dark
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <PricingCard
              eyebrow="Free starter"
              title="3x12 Shift Worker Reset Plan"
              price="$0"
              description="A simple weekly routine template for nurses and shift workers working three 12-hour shifts."
              cta="Get the Free Reset Plan"
              href="/beta/shiftplan"
              eventName="free_reset_cta_click"
              features={[
                "Example 3x12 weekly structure",
                "Workday routine template",
                "Post-shift reset template",
                "Off-day reset template",
                "Meal prep and workout placement ideas",
                "Weekly reset checklist",
              ]}
            />

            <PricingCard
              featured
              eyebrow="Founding Pro"
              title="ShiftPlan Founding Pro"
              price="$9/month"
              description="Ongoing weekly planning support for shift workers with changing schedules."
              cta="Join Founding Pro"
              href={foundingProPaymentLink}
              eventName="founding_pro_cta_click"
              features={[
                "Up to 4 custom weekly ShiftPlans per month",
                "Submit your schedule each week",
                "Plans built around shifts, meals, workouts, errands, recovery blocks, appointments, and personal tasks",
                "Monthly routine tune-up",
                "Copy/paste checklist version",
                "Founding member pricing while subscribed",
                "Early access to future app features",
              ]}
              note="After checkout, you&apos;ll be sent to the intake form. Please use the same email at checkout and intake."
              finePrint="Founding Pro includes up to 4 custom weekly ShiftPlans per monthly billing period. One plan covers one 7-day schedule. Unused weekly plans do not roll over."
            />

            <PricingCard
              eyebrow="One-time"
              title="Custom 7-Day ShiftPlan"
              price="$9 one-time"
              description="Send your upcoming week and get one custom routine plan built around your actual schedule."
              cta="Get My 7-Day Plan"
              href={customPlanPaymentLink}
              eventName="custom_plan_cta_click"
              features={[
                "One custom 7-day plan",
                "Workday and off-day structure",
                "Meal prep blocks",
                "Workout placement",
                "Errand and appointment batching",
                "Recovery/reset blocks",
                "Copy/paste checklist version",
              ]}
              note="After checkout, you&apos;ll be sent to the intake form. Please use the same email at checkout and intake."
            />
          </div>
          <aside className="mt-6 rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-300 shadow-sm backdrop-blur">
            <p className="font-semibold text-white">Safety note</p>
            <p className="mt-2">
              ShiftPlan is for routine and lifestyle organization only. It does
              not provide medical advice, diagnosis, treatment, or healthcare
              guidance.
            </p>
          </aside>
        </div>
      </section>

      <section
        id="faq"
        className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,191,174,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            eyebrow="FAQ"
            title="Built for planning, with clear boundaries."
            description="ShiftPlan is meant to make a complicated week easier to organize. It is not a healthcare tool."
            dark
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-sm backdrop-blur"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-300/15 text-sm font-bold text-teal-200 ring-1 ring-teal-300/20">
                  +
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {item.question}
                </h3>
                <p className="mt-3 leading-7 text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <aside className="rounded-lg border border-blue-300/20 bg-blue-300/10 p-4 text-sm leading-6 text-slate-300 shadow-sm backdrop-blur">
              <p className="font-semibold text-blue-100">
                Important health and safety note
              </p>
              <p className="mt-2">
                ShiftPlan is for lifestyle and routine organization only. It
                does not provide medical advice, diagnosis, treatment, sleep
                disorder guidance, fatigue treatment, burnout treatment,
                medication guidance, healthcare guidance, mental health
                guidance, workplace safety guidance, or emergency support.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-teal-300/20 bg-white/[0.06] p-8 text-center shadow-[0_0_60px_rgba(20,184,166,0.12)] backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase text-teal-200">
            Ready for the first reset?
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Get the Free 3x12 Shift Worker Reset Plan.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Share practical schedule details and help shape the first
            deployable ShiftPlan product.
          </p>
          <TrackedLink
            href="/beta/shiftplan"
            eventName="free_reset_cta_click"
            className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-teal-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-fit"
          >
            Get My Free Reset Plan
          </TrackedLink>
        </div>
      </section>
    </>
  );
}

function HeroScheduleMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-400/20 via-blue-500/20 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-lg border border-white/15 bg-slate-950 shadow-2xl">
        <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShiftPlanMark size={32} variant="dark" />
              <div>
                <p className="text-sm font-semibold text-white">Weekly Command</p>
                <p className="text-xs text-slate-400">May 18 - May 24</p>
              </div>
            </div>
            <span className="rounded-lg bg-teal-300/15 px-3 py-1 text-xs font-semibold text-teal-200">
              ShiftPlan
            </span>
          </div>
        </div>
        <div className="grid gap-4 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Work shifts", "3x12", "bg-blue-400"],
              ["Reset blocks", "4", "bg-teal-300"],
              ["Tasks placed", "12", "bg-cyan-300"],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-lg bg-white/[0.06] p-4">
                <p className="text-xs text-slate-400">{label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-2xl font-semibold text-white">{value}</p>
                  <span className={`h-10 w-2 rounded-full ${color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <div className="grid gap-2">
              {weeklyPlanPreview.map((item) => (
                <div
                  key={item.day}
                  className="grid grid-cols-[3rem_4rem_1fr] items-center gap-3 rounded-lg border border-white/8 bg-slate-900/80 px-3 py-3 text-sm"
                >
                  <span className="font-semibold text-teal-200">{item.day}</span>
                  <span className="text-xs font-semibold text-white">{item.shift}</span>
                  <span className="truncate text-xs text-slate-400">
                    {item.plan}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-4">
              <p className="text-sm font-semibold text-teal-100">Main goal</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Fit in two workouts, meal prep, errands, and family dinner
                without overloading workdays.
              </p>
            </div>
            <div className="rounded-lg border border-blue-300/20 bg-blue-300/10 p-4">
              <p className="text-sm font-semibold text-blue-100">
                Plan style
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Checklist-heavy, realistic, and easy to copy into the week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-sm font-semibold uppercase ${
          dark ? "text-teal-200" : "text-teal-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-semibold leading-tight sm:text-4xl ${
          dark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-lg leading-8 ${
          dark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  eyebrow,
  title,
  price,
  description,
  features,
  cta,
  href,
  eventName,
  note,
  finePrint,
  featured = false,
}: {
  eyebrow: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  eventName:
    | "free_reset_cta_click"
    | "founding_pro_cta_click"
    | "custom_plan_cta_click";
  note?: string;
  finePrint?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`relative rounded-lg p-6 shadow-sm ${
        featured
          ? "border-2 border-teal-400 bg-slate-950 text-white shadow-[0_0_50px_rgba(20,184,166,0.16)]"
          : "border border-white/10 bg-white/[0.06] text-white backdrop-blur"
      }`}
    >
      {featured ? (
        <div className="absolute right-5 top-5 rounded-lg bg-teal-300 px-3 py-1 text-sm font-semibold text-slate-950">
          Best Value
        </div>
      ) : null}
      <p
        className={`pr-24 text-sm font-semibold uppercase ${
          featured ? "text-teal-200" : "text-teal-700"
        }`}
      >
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
      <p
        className={`mt-4 text-4xl font-semibold ${
          featured ? "text-white" : "text-white"
        }`}
      >
        {price}
      </p>
      <p
        className={`mt-3 leading-7 ${
          featured ? "text-slate-300" : "text-slate-300"
        }`}
      >
        {description}
      </p>
      <ul
        className={`mt-5 space-y-3 text-sm leading-6 ${
          featured ? "text-slate-300" : "text-slate-300"
        }`}
      >
        {features.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                featured ? "bg-teal-300" : "bg-teal-500"
              }`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <TrackedLink
        href={href}
        eventName={eventName}
        className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
          featured
            ? "bg-teal-300 text-slate-950 hover:bg-teal-200 focus:ring-offset-slate-950"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15 focus:ring-offset-slate-950"
        }`}
      >
        {cta}
      </TrackedLink>
      {note ? (
        <p
          className={`mt-3 text-xs leading-5 ${
            featured ? "text-slate-400" : "text-slate-400"
          }`}
          dangerouslySetInnerHTML={{ __html: note }}
        />
      ) : null}
      {finePrint ? (
        <p className="mt-5 text-xs leading-5 text-slate-400">{finePrint}</p>
      ) : null}
    </article>
  );
}
