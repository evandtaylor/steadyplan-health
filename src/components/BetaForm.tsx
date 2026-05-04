"use client";

import { type FormEvent, type ReactNode, useState } from "react";

type FormState = {
  name: string;
  email: string;
  productInterest: string;
  biggestProblem: string;
  currentTools: string;
  willingness: string;
  optionalDetails: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  productInterest: "",
  biggestProblem: "",
  currentTools: "",
  willingness: "",
  optionalDetails: "",
};

const productOptions = ["ShiftPlan", "KinPlan", "SuppPlan", "All"];
const willingnessOptions = ["Yes", "No", "Maybe"];

export function BetaForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [formMessage, setFormMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedFingerprint, setLastSubmittedFingerprint] = useState("");
  const currentFingerprint = getFormFingerprint(form);
  const isDuplicateSubmittedState =
    submitted && currentFingerprint === lastSubmittedFingerprint;

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormMessage("");
    setSubmitted(false);
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.productInterest) {
      nextErrors.productInterest = "Choose a product interest.";
    }
    if (!form.biggestProblem.trim()) {
      nextErrors.biggestProblem = "Share the problem you want solved.";
    }
    if (!form.willingness) {
      nextErrors.willingness = "Choose Yes, No, or Maybe.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || isDuplicateSubmittedState) return;

    setSubmitted(false);
    setFormMessage("");

    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      product_interest: form.productInterest,
      biggest_problem: form.biggestProblem.trim(),
      current_tools: form.currentTools.trim() || null,
      willingness_to_pay: form.willingness,
      optional_details: form.optionalDetails.trim() || null,
    };

    try {
      const response = await fetch("/api/beta-signups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok) {
        setSubmitted(false);
        setFormMessage(
          result.message ||
            "We could not save your beta signup right now. Please try again.",
        );
        setErrors(mapServerErrors(result.errors));
        return;
      }

      setSubmitted(true);
      setLastSubmittedFingerprint(currentFingerprint);
      setFormMessage(
        result.message ||
          "Thanks. Your beta signup was saved. We will use your note to shape the first planning workflows.",
      );
      setErrors({});
    } catch {
      setSubmitted(false);
      setFormMessage(
        "We could not reach the beta list right now. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      {submitted ? (
        <div
          className="mb-6 rounded-lg border border-teal-200 bg-teal-50 p-5 text-teal-950 shadow-sm"
          role="status"
        >
          <p className="text-lg font-semibold">You are on the beta list.</p>
          <p className="mt-2 text-sm leading-6 text-teal-900">
            {formMessage}
          </p>
          <p className="mt-3 text-sm leading-6 text-teal-900">
            SteadyPlan will stay focused on organization, education, planning,
            reminders, and questions to ask qualified professionals.
          </p>
        </div>
      ) : null}

      {!submitted && formMessage ? (
        <div
          className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
          role="alert"
        >
          {formMessage}
        </div>
      ) : null}

      <form className="grid gap-5 sm:gap-6" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          <Field id="name" label="Name" error={errors.name}>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="field-control"
              autoComplete="name"
              required
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="field-control"
              autoComplete="email"
              required
            />
          </Field>
        </div>

        <Field
          id="productInterest"
          label="Product interest"
          error={errors.productInterest}
        >
          <select
            id="productInterest"
            name="productInterest"
            value={form.productInterest}
            onChange={(event) =>
              updateField("productInterest", event.target.value)
            }
            className="field-control"
            required
          >
            <option value="">Choose one</option>
            {productOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="biggestProblem"
          label="Biggest problem you want solved"
          helpText="Please keep this practical. Do not include diagnoses, prescription medications, lab values, or other protected health information."
          error={errors.biggestProblem}
        >
          <textarea
            id="biggestProblem"
            name="biggestProblem"
            value={form.biggestProblem}
            onChange={(event) =>
              updateField("biggestProblem", event.target.value)
            }
            className="field-control min-h-28"
            required
          />
        </Field>

        <Field
          id="currentTools"
          label="Current planning tools you use"
          helpText="Optional. Examples: calendar, notes app, spreadsheet, paper checklist, reminders."
          error={errors.currentTools}
        >
          <textarea
            id="currentTools"
            name="currentTools"
            value={form.currentTools}
            onChange={(event) => updateField("currentTools", event.target.value)}
            className="field-control min-h-24"
          />
        </Field>

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-slate-800">
            Would you pay for this if it worked?
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {willingnessOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <input
                  type="radio"
                  name="willingness"
                  value={option}
                  checked={form.willingness === option}
                  onChange={(event) =>
                    updateField("willingness", event.target.value)
                  }
                  className="peer h-4 w-4 accent-teal-700"
                  required
                />
                <span className="peer-checked:text-teal-950">{option}</span>
              </label>
            ))}
          </div>
          {errors.willingness ? (
            <p className="mt-2 text-sm font-medium text-red-700">
              {errors.willingness}
            </p>
          ) : null}
        </fieldset>

        <Field id="optionalDetails" label="Optional details">
          <textarea
            id="optionalDetails"
            name="optionalDetails"
            value={form.optionalDetails}
            onChange={(event) =>
              updateField("optionalDetails", event.target.value)
            }
            className="field-control min-h-28"
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting || isDuplicateSubmittedState}
          className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
        >
          {isSubmitting
            ? "Saving..."
            : isDuplicateSubmittedState
              ? "Saved"
              : "Join the Beta"}
        </button>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  helpText,
  error,
  children,
}: {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>
      {helpText ? (
        <p className="mb-2 text-sm leading-6 text-slate-500">{helpText}</p>
      ) : null}
      {children}
      {error ? (
        <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
      ) : null}
    </div>
  );
}

function getFormFingerprint(form: FormState) {
  return JSON.stringify({
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    productInterest: form.productInterest,
    biggestProblem: form.biggestProblem.trim(),
    currentTools: form.currentTools.trim(),
    willingness: form.willingness,
    optionalDetails: form.optionalDetails.trim(),
  });
}

function mapServerErrors(errors?: Record<string, string>) {
  if (!errors) return {};

  return {
    name: errors.name,
    email: errors.email,
    productInterest: errors.product_interest,
    biggestProblem: errors.biggest_problem,
    currentTools: errors.current_tools,
    willingness: errors.willingness_to_pay,
    optionalDetails: errors.optional_details,
  };
}
