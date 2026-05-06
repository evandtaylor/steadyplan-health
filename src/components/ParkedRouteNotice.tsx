import Link from "next/link";
import { DisclaimerBox } from "@/components/DisclaimerBox";

type ParkedRouteNoticeProps = {
  title: string;
  description: string;
};

export function ParkedRouteNotice({
  title,
  description,
}: ParkedRouteNoticeProps) {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-teal-700">
          Parked future concept
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 leading-7 text-slate-600">{description}</p>
        <p className="mt-4 leading-7 text-slate-600">
          ShiftPlan is the current launch focus. These routes are kept available
          for internal continuity, but they are not promoted in public
          navigation for the first deployable MVP.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
          >
            Go to ShiftPlan
          </Link>
          <Link
            href="/beta/shiftplan"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
          >
            Get My Free Reset Plan
          </Link>
        </div>
        <div className="mt-6">
          <DisclaimerBox />
        </div>
      </div>
    </section>
  );
}
