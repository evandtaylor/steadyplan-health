"use client";

import { type FormEvent, useState } from "react";

type ShiftPlanAppAccessProps = {
  initialAccess?: {
    email: string;
  } | null;
};

type AccessResponse = {
  message?: string;
  user?: {
    email: string;
    first_name: string | null;
    status: string;
    max_generations_per_month: number | null;
    max_generations_per_day: number | null;
  };
};

const safetyCopy =
  "ShiftPlan helps organize your weekly routine around your shift schedule. It is for lifestyle and routine planning only. It does not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support.";

export function ShiftPlanAppAccess({ initialAccess }: ShiftPlanAppAccessProps) {
  const [email, setEmail] = useState(initialAccess?.email || "");
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [access, setAccess] = useState<AccessResponse["user"] | null>(
    initialAccess
      ? {
          email: initialAccess.email,
          first_name: null,
          status: "Active",
          max_generations_per_month: null,
          max_generations_per_day: null,
        }
      : null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/app/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          access_code: accessCode,
        }),
      });
      const result = (await response.json()) as AccessResponse;

      if (!response.ok || !result.user) {
        setErrorMessage(
          result.message || "That email and access code did not work.",
        );
        return;
      }

      setAccess(result.user);
      setEmail(result.user.email);
      setAccessCode("");
    } catch {
      setErrorMessage(
        "We could not check ShiftPlan app access right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (access) {
    return <AppDashboard email={access.email} firstName={access.first_name} />;
  }

  return (
    <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-lg bg-teal-400/10 px-3 py-2 text-sm font-semibold uppercase text-teal-200 ring-1 ring-teal-300/20">
            ShiftPlan app preview
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Your weekly planning workspace is taking shape.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Enter your early access email and code to preview the gated
            ShiftPlan app foundation.
          </p>
          <p className="mt-5 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm leading-6 text-slate-300">
            {safetyCopy}
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-white p-5 text-slate-950 shadow-2xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase text-teal-700">
              Early access
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Open ShiftPlan app
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use the email and access code connected to your early access
              invite.
            </p>
          </div>

          {errorMessage ? (
            <div
              className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="app-email"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Email
              </label>
              <input
                id="app-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field-control"
                required
              />
            </div>

            <div>
              <label
                htmlFor="app-access-code"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Access code
              </label>
              <input
                id="app-access-code"
                name="access_code"
                type="password"
                autoComplete="one-time-code"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="field-control"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-teal-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Checking access..." : "Open app preview"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function AppDashboard({
  email,
  firstName,
}: {
  email: string;
  firstName: string | null;
}) {
  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase text-teal-700">
            ShiftPlan app
          </p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                Welcome{firstName ? `, ${firstName}` : ""}.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Signed in for app preview as {email}.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-300 px-5 py-3 text-base font-semibold text-slate-600 sm:w-fit"
            >
              Create This Week&apos;s ShiftPlan — coming next
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Plans used this month
            </h2>
            <p className="mt-4 text-4xl font-semibold text-teal-800">0 / 4</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Usage tracking will connect here in a later customer app phase.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Saved plans
            </h2>
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              Saved customer plans will appear here after the portal is
              connected. For now, plan delivery still happens through the
              manual founder workflow.
            </div>
          </article>
        </div>

        <aside className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-blue-950">Safety note</p>
          <p className="mt-2">{safetyCopy}</p>
        </aside>
      </div>
    </section>
  );
}
