import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FeatureCard } from "@/components/FeatureCard";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { productCards } from "@/lib/content";

const builtForGroups = [
  {
    title: "Shift workers",
    description:
      "For nurses, first responders, healthcare workers, students, and others trying to plan around long shifts, nights, rotations, and recovery.",
  },
  {
    title: "Family caregivers",
    description:
      "For people coordinating appointments, tasks, notes, provider questions, and family updates when care gets complicated.",
  },
  {
    title: "Supplement routine users",
    description:
      "For people who want to organize timing, inventory, duplicate ingredients, and provider questions without unsafe recommendations.",
  },
];

const howItWorksSteps = [
  {
    step: "Step 1",
    title: "Tell us what is complicated",
    description:
      "Share the schedule, routine, or responsibility that feels hard to keep straight. The MVP avoids unnecessary sensitive health data.",
  },
  {
    step: "Step 2",
    title: "Get a clear plan",
    description:
      "Early beta plans are built around practical routines, reminders, checklists, and questions to ask qualified professionals.",
  },
  {
    step: "Step 3",
    title: "Adjust as life changes",
    description:
      "Plans should be easy to revise when shifts rotate, care tasks move, or routines need a simpler version.",
  },
];

const differenceFeatures = [
  {
    title: "Built around real-life schedules",
    description:
      "SteadyPlan starts with messy calendars, handoffs, routines, and recovery needs instead of assuming every day looks the same.",
  },
  {
    title: "Planning first, not generic tracking",
    description:
      "The focus is turning information into a usable next step, not asking users to log more data for its own sake.",
  },
  {
    title: "Safety-first health education",
    description:
      "The product stays in the lane of organization, education, and questions for qualified professionals.",
  },
  {
    title: "Designed for low-friction use",
    description:
      "The MVP favors plain language, short forms, mobile-friendly layouts, and plans that are easy to scan.",
  },
];

export default function Home() {
  return (
    <>
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div>
            <p className="inline-flex rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold uppercase text-teal-800 ring-1 ring-teal-100">
              Beta intake now open
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Simple plans for complicated health-life seasons.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              SteadyPlan Health helps shift workers, caregivers, and
              wellness-focused users turn messy schedules, routines, and
              responsibilities into clear daily plans.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-medium text-slate-700 sm:grid-cols-3">
              {["Shift schedules", "Family care", "Supplement routines"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/beta"
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
              >
                Join the Beta
              </Link>
              <Link
                href="#products"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
              >
                Explore Products
              </Link>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Early beta submissions help shape manual planning workflows before
              payments, email automation, or AI plan drafts are added.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="rounded-lg bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Today&apos;s plan
                  </p>
                  <p className="text-sm text-slate-500">
                    Practical next steps
                  </p>
                </div>
                <span className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
                  Beta
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  "Review what changed this week",
                  "Choose the next routine checkpoint",
                  "Save questions for a qualified professional",
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
              {["Organize", "Plan", "Adjust"].map((item) => (
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
            eyebrow="Built for"
            title="Planning help for people carrying the complicated parts."
            description="SteadyPlan is designed for users who need practical organization around real schedules, care responsibilities, and daily routines."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {builtForGroups.map((group) => (
              <FeatureCard key={group.title} {...group} />
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Products"
            title="Three planning tools under one safety-first brand."
            description="Each product is designed for organization, education, and practical daily planning. None of them diagnose, treat, prescribe, or replace licensed care."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {productCards.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How it works"
            title="A simple path from messy to manageable."
            description="The beta is intentionally lightweight: tell us what feels complicated, then help shape clear planning workflows for real life."
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

      <section className="bg-blue-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why SteadyPlan is different"
            title="Built for planning, not pretending to be care."
            description="The MVP is intentionally scoped around daily organization and safety-first education, so the product can earn trust before more advanced workflows are added."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {differenceFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Join the beta and help shape SteadyPlan Health."
        description="Tell us what planning problem you want solved first. We will keep the MVP focused on clear routines, safer organization, and practical next steps."
        ctaLabel="Join the Beta"
        ctaHref="/beta"
      />
    </>
  );
}
