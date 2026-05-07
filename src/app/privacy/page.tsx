import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Plain-English privacy information for ShiftPlan users and beta customers.",
};

export default function PrivacyPage() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Privacy"
          title="ShiftPlan privacy"
          description="This page explains what ShiftPlan collects, why it is collected, and how to contact us about your information."
        />

        <div className="mt-8 space-y-8 text-base leading-8 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              What ShiftPlan is
            </h2>
            <p className="mt-3">
              ShiftPlan helps nurses and shift workers turn messy shift
              schedules into simple weekly life plans. It is a lifestyle and
              routine planning tool, not a medical provider, telehealth service,
              medical device, or emergency service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
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

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Sensitive information
            </h2>
            <p className="mt-3">
              ShiftPlan does not intentionally collect medical records or
              protected health information. Please do not submit diagnoses,
              prescription medication lists, lab values, medical record numbers,
              insurance numbers, Social Security numbers, emergency requests, or
              other sensitive medical information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              How we use information
            </h2>
            <p className="mt-3">
              We may use submitted information to deliver reset plans, create
              custom routine plans, respond to support requests, improve the
              product, and manage paid requests or subscriptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Payments and storage
            </h2>
            <p className="mt-3">
              Form responses may be stored with service providers used to run
              ShiftPlan. Payment processing, if paid checkout is used, is
              handled by third-party payment providers such as Stripe. Do not
              send payment card details through ShiftPlan forms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Sharing and selling
            </h2>
            <p className="mt-3">
              ShiftPlan does not sell personal information. We may share
              information with service providers only as needed to operate the
              site, process payments, deliver requested plans, or respond to
              support needs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              Contact and deletion requests
            </h2>
            <p className="mt-3">
              To ask a privacy question or request deletion of information you
              submitted, contact{" "}
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
