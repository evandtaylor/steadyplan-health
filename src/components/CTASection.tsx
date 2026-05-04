import Link from "next/link";

type CTASectionProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function CTASection({
  title = "Help shape the first version of SteadyPlan Health.",
  description = "Join the beta list and tell us what kind of daily planning would reduce the most overwhelm.",
  ctaLabel = "Join the Beta",
  ctaHref = "/beta",
}: CTASectionProps) {
  return (
    <section className="bg-teal-900 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-teal-50">{description}</p>
        </div>
        <Link
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-base font-semibold text-teal-900 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-900 sm:w-fit"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
