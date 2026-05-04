import Link from "next/link";

type ProductCardProps = {
  name: string;
  href: string;
  label: string;
  headline: string;
  description: string;
};

export function ProductCard({
  name,
  href,
  label,
  headline,
  description,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
      <p className="text-sm font-semibold uppercase text-teal-700">
        {label}
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-slate-950">{name}</h3>
      <p className="mt-3 text-lg font-medium leading-7 text-slate-900">
        {headline}
      </p>
      <p className="mt-4 flex-1 leading-7 text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
      >
        Learn more
      </Link>
    </article>
  );
}
