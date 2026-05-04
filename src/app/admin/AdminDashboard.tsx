"use client";

import { type FormEvent, useMemo, useState } from "react";

type ProductFilter = "All" | "ShiftPlan" | "KinPlan" | "SuppPlan";

type BetaSignup = {
  created_at: string;
  name: string;
  email: string;
  product_interest: ProductFilter;
  biggest_problem: string;
  current_tools: string | null;
  willingness_to_pay: "Yes" | "No" | "Maybe";
  optional_details: string | null;
};

const productFilters: ProductFilter[] = ["All", "ShiftPlan", "KinPlan", "SuppPlan"];

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductFilter>("All");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredSignups = useMemo(() => {
    if (selectedProduct === "All") return signups;
    return signups.filter((signup) => signup.product_interest === selectedProduct);
  }, [selectedProduct, signups]);

  const productCounts = useMemo(() => {
    return {
      All: signups.length,
      ShiftPlan: signups.filter((signup) => signup.product_interest === "ShiftPlan")
        .length,
      KinPlan: signups.filter((signup) => signup.product_interest === "KinPlan").length,
      SuppPlan: signups.filter((signup) => signup.product_interest === "SuppPlan").length,
    };
  }, [signups]);

  async function loadSignups(nextPassword = password) {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/beta-signups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: nextPassword }),
      });
      const result = (await response.json()) as {
        message?: string;
        signups?: BetaSignup[];
      };

      if (!response.ok || !result.signups) {
        setMessage(result.message || "Unable to load beta signups.");
        setIsUnlocked(false);
        return;
      }

      setSignups(result.signups);
      setIsUnlocked(true);
    } catch {
      setMessage("Unable to reach the admin data route right now.");
      setIsUnlocked(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password.trim()) {
      setMessage("Enter the admin password.");
      return;
    }

    await loadSignups(password);
  }

  if (!isUnlocked) {
    return (
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase text-teal-700">Internal MVP</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950">
            Founder admin
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Enter the admin password to review beta waitlist submissions. This
            simple gate is for internal MVP use only and is not full
            authentication.
          </p>

          {message ? (
            <div
              className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
              role="alert"
            >
              {message}
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label
                htmlFor="adminPassword"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Admin password
              </label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-control"
                autoComplete="off"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
            >
              {isLoading ? "Checking..." : "View signups"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              Internal MVP
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Beta waitlist signups
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Review submissions for product interest and planning pain points.
              Keep this data internal and avoid collecting sensitive health
              details in future form changes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadSignups()}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 sm:w-fit"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {productFilters.map((product) => (
            <button
              key={product}
              type="button"
              onClick={() => setSelectedProduct(product)}
              aria-pressed={selectedProduct === product}
              className={`rounded-lg border p-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                selectedProduct === product
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-teal-200"
              }`}
            >
              <span className="block text-sm font-medium text-slate-500">
                {product === "All" ? "Total signups" : product}
              </span>
              <span className="mt-2 block text-3xl font-semibold text-slate-950">
                {productCounts[product]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-slate-950">
                Showing {filteredSignups.length} of {signups.length} submissions
              </p>
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 sm:flex-row sm:items-center">
                Product
                <select
                  value={selectedProduct}
                  onChange={(event) =>
                    setSelectedProduct(event.target.value as ProductFilter)
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {productFilters.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {filteredSignups.length === 0 ? (
            <div className="px-4 py-10 text-center text-slate-600">
              No signups match this filter yet.
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Biggest problem</th>
                      <th className="px-4 py-3">Tools</th>
                      <th className="px-4 py-3">Pay?</th>
                      <th className="px-4 py-3">Optional details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredSignups.map((signup) => (
                      <tr key={`${signup.email}-${signup.created_at}`} className="align-top">
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {formatDate(signup.created_at)}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-950">{signup.name}</p>
                          <p className="mt-1 break-all text-slate-600">{signup.email}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-teal-800">
                          {signup.product_interest}
                        </td>
                        <td className="max-w-md px-4 py-4 leading-6 text-slate-700">
                          {signup.biggest_problem}
                        </td>
                        <td className="max-w-xs px-4 py-4 leading-6 text-slate-700">
                          {signup.current_tools || "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                          {signup.willingness_to_pay}
                        </td>
                        <td className="max-w-xs px-4 py-4 leading-6 text-slate-700">
                          {signup.optional_details || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 lg:hidden">
                {filteredSignups.map((signup) => (
                  <article
                    key={`${signup.email}-${signup.created_at}`}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-950">{signup.name}</p>
                        <p className="mt-1 break-all text-sm text-slate-600">
                          {signup.email}
                        </p>
                      </div>
                      <span className="w-fit rounded-lg bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                        {signup.product_interest}
                      </span>
                    </div>
                    <dl className="mt-4 grid gap-4 text-sm">
                      <AdminField label="Created" value={formatDate(signup.created_at)} />
                      <AdminField label="Biggest problem" value={signup.biggest_problem} />
                      <AdminField label="Current tools" value={signup.current_tools || "-"} />
                      <AdminField label="Would pay" value={signup.willingness_to_pay} />
                      <AdminField label="Optional details" value={signup.optional_details || "-"} />
                    </dl>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AdminField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 leading-6 text-slate-800">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
