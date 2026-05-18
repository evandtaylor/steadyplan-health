import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Plain-English privacy information for ShiftPlan users and beta customers.",
};

export default function PrivacyPage() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.24),transparent_32%),radial-gradient(circle_at_86%_4%,rgba(96,165,250,0.18),transparent_26%),linear-gradient(180deg,#020617_0%,#08111f_48%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
      <div className="relative mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
          Privacy
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          ShiftPlan privacy
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          This page explains what ShiftPlan collects, why it is collected, and
          how to contact us about your information.
        </p>

        <div className="mt-8 grid gap-5 text-base leading-8 text-slate-300">
          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              What ShiftPlan is
            </h2>
            <p className="mt-3">
              ShiftPlan helps nurses and shift workers turn messy shift
              schedules into simple weekly life plans. It is a lifestyle and
              routine planning tool, not a medical provider, telehealth service,
              medical device, or emergency service.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              What we may collect
            </h2>
            <p className="mt-3">
              When you use ShiftPlan forms or request a plan, we may collect
              your name, email address, shift schedule details, planning
              preferences, responsibilities, goals, and form responses. If paid
              offers are used, we may also keep payment-related records needed
              to manage the request or subscription. We may use basic website
              analytics if applicable to understand how the site is being used.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Sensitive information
            </h2>
            <p className="mt-3">
              ShiftPlan does not intentionally collect medical records or
              protected health information. Please do not submit diagnoses,
              symptoms, medication details, lab values, medical record numbers,
              insurance numbers, Social Security numbers, emergency requests,
              workplace safety complaints, safety-sensitive details, or other
              private medical or safety information.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              How we use information
            </h2>
            <p className="mt-3">
              We may use submitted information to deliver reset plans, create
              custom routine plans, respond to support requests, improve the
              product, and manage paid requests or subscriptions.
            </p>
          </section>

          <section className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-teal-50">
              AI-assisted draft plans
            </h2>
            <p className="mt-3">
              ShiftPlan may use AI tools, including OpenAI, to help create draft
              routine plans for customers who request a plan. Information you
              submit through intake forms may be processed by these tools to
              create or improve a requested ShiftPlan. Some plans may be
              generated directly inside the ShiftPlan app and shown to you
              without manual review before you see them.
            </p>
            <p className="mt-3">
              AI-generated plans may contain errors, omissions, unrealistic
              suggestions, incorrect assumptions, or date and time mistakes. You
              should review and adjust any generated plan before relying on it
              in your real life.
            </p>
            <p className="mt-3">
              Please do not submit private medical information, protected health
              information, medication details, diagnoses, symptoms, emergency
              information, workplace safety complaints, or safety-sensitive
              details for AI processing. ShiftPlan is for lifestyle and routine
              planning only. It does not provide medical advice, diagnosis,
              treatment, fatigue treatment, burnout treatment, sleep disorder
              guidance, medication guidance, healthcare guidance, mental health
              guidance, workplace safety guidance, or emergency support.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Payments and storage
            </h2>
            <p className="mt-3">
              Form responses may be stored with service providers used to run
              ShiftPlan. Payment processing is handled by Stripe when paid
              checkout is used. Do not send payment card details through
              ShiftPlan forms.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Sharing and selling
            </h2>
            <p className="mt-3">
              ShiftPlan does not sell personal information. We may share
              information with service providers only as needed to operate the
              site, process payments, deliver requested plans, or respond to
              support needs.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Contact and deletion requests
            </h2>
            <p className="mt-3">
              To ask a privacy question or request deletion of information you
              submitted, contact{" "}
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
