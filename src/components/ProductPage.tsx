import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeading } from "@/components/SectionHeading";
import { productPages, type ProductKey } from "@/lib/content";

type ProductPageProps = {
  product: ProductKey;
};

export function ProductPage({ product }: ProductPageProps) {
  const content = productPages[product];
  const theme = productThemes[product];
  const betaHref = productBetaHrefs[product];
  const nutritionGuidance =
    "nutritionGuidance" in content ? content.nutritionGuidance : null;

  return (
    <>
      <section className={`${theme.hero} px-4 py-14 sm:px-6 sm:py-16 lg:px-8`}>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div>
            <p className={`text-sm font-semibold uppercase ${theme.eyebrow}`}>
              {content.label}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              {content.headline}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {content.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={betaHref}
                aria-label={`Open the ${content.name} beta intake`}
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
              >
                {content.cta}
              </Link>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
              >
                Back to home
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`rounded-lg ${theme.panel} p-5`}>
              <p className={`text-sm font-semibold ${theme.panelText}`}>
                {content.previewTitle}
              </p>
              <div className="mt-5 space-y-3">
                {content.previewItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3 text-sm text-slate-700"
                  >
                    <span className="leading-6">{item}</span>
                    <span className={`h-2 w-12 shrink-0 rounded-full ${theme.bar}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <DisclaimerBox />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={content.name}
            title="Practical planning, not medical advice."
            description="The first version stays focused on routines, checklists, reminders, education, and better questions for qualified professionals."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {nutritionGuidance ? (
        <NutritionGuidanceSection
          guidance={nutritionGuidance}
          theme={theme}
        />
      ) : null}

      <CTASection
        title={`Join the ${content.name} beta.`}
        description={`Share practical details through the ${content.name} intake so early planning workflows can be shaped around real user needs.`}
        ctaLabel={content.cta}
        ctaHref={betaHref}
      />
    </>
  );
}

function NutritionGuidanceSection({
  guidance,
  theme,
}: {
  guidance: {
    eyebrow: string;
    title: string;
    description: string;
    examples: readonly string[];
    note: string;
  };
  theme: {
    hero: string;
    eyebrow: string;
    panel: string;
    panelText: string;
    bar: string;
  };
}) {
  return (
    <section className={`${theme.hero} px-4 py-16 sm:px-6 lg:px-8`}>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10">
        <div>
          <SectionHeading
            eyebrow={guidance.eyebrow}
            title={guidance.title}
            description={guidance.description}
          />
          <p
            className={`mt-6 inline-flex rounded-lg ${theme.panel} px-4 py-3 text-sm font-semibold ${theme.panelText}`}
          >
            {guidance.note}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase text-slate-500">
            Safe example prompts
          </p>
          <div className="mt-5 grid gap-3">
            {guidance.examples.map((example) => (
              <div
                key={example}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
              >
                {example}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-500">
            This is general organization and education support. It does not
            diagnose, treat, prescribe, provide disease-specific nutrition
            therapy, or tell users exactly what they need to eat or take.
          </p>
        </div>
      </div>
    </section>
  );
}

const productThemes: Record<
  ProductKey,
  {
    hero: string;
    eyebrow: string;
    panel: string;
    panelText: string;
    bar: string;
  }
> = {
  shiftplan: {
    hero: "bg-teal-50",
    eyebrow: "text-teal-700",
    panel: "bg-teal-50",
    panelText: "text-teal-950",
    bar: "bg-teal-300",
  },
  kinplan: {
    hero: "bg-blue-50",
    eyebrow: "text-blue-700",
    panel: "bg-blue-50",
    panelText: "text-blue-950",
    bar: "bg-blue-300",
  },
  suppplan: {
    hero: "bg-slate-50",
    eyebrow: "text-cyan-700",
    panel: "bg-cyan-50",
    panelText: "text-cyan-950",
    bar: "bg-cyan-300",
  },
};

const productBetaHrefs: Record<ProductKey, string> = {
  shiftplan: "/beta/shiftplan",
  kinplan: "/beta/kinplan",
  suppplan: "/beta/suppplan",
};
