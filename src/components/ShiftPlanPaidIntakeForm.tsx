"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";

type PaidIntakeType = "custom_plan" | "founding_pro" | "founding_pro_weekly";

type FieldType = "text" | "email" | "date" | "textarea";

type IntakeField = {
  name: string;
  label: string;
  type?: FieldType;
  helpText?: string;
  rows?: number;
};

type ShiftPlanPaidIntakeFormProps = {
  intakeType: PaidIntakeType;
  title: string;
  description: string;
  fields: IntakeField[];
  successTitle: string;
};

type FormState = Record<string, string | boolean>;

export function ShiftPlanPaidIntakeForm({
  intakeType,
  title,
  description,
  fields,
  successTitle,
}: ShiftPlanPaidIntakeFormProps) {
  const initialState = useMemo(() => {
    return fields.reduce<FormState>(
      (state, field) => ({ ...state, [field.name]: "" }),
      { safety_acknowledged: false },
    );
  }, [fields]);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formMessage, setFormMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedFingerprint, setLastSubmittedFingerprint] = useState("");
  const currentFingerprint = getFormFingerprint(intakeType, form, fields);
  const isDuplicateSubmittedState =
    submitted && currentFingerprint === lastSubmittedFingerprint;
  const calculatedPlanEndDate =
    intakeType === "custom_plan"
      ? calculateEndDate(readRawString(form.plan_start_date))
      : "";
  const calculatedWeekEndDate =
    intakeType === "founding_pro_weekly"
      ? calculateEndDate(readRawString(form.week_start_date))
      : "";

  function updateField(name: string, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormMessage("");
    setSubmitted(false);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    for (const field of fields) {
      const value = readString(form[field.name]);
      if (!value) nextErrors[field.name] = "This field is required.";
      if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        nextErrors[field.name] = "Enter a valid email address.";
      }
    }

    if (form.safety_acknowledged !== true) {
      nextErrors.safety_acknowledged =
        "Confirm that this is lifestyle planning only.";
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

    const payload = fields.reduce<Record<string, string | boolean>>(
      (data, field) => ({
        ...data,
        [field.name]: readString(form[field.name]),
      }),
      {
        intake_type: intakeType,
        safety_acknowledged: form.safety_acknowledged === true,
      },
    );

    if (intakeType === "custom_plan" && calculatedPlanEndDate) {
      payload.plan_end_date = calculatedPlanEndDate;
    }

    if (intakeType === "founding_pro_weekly" && calculatedWeekEndDate) {
      payload.week_end_date = calculatedWeekEndDate;
    }

    try {
      const response = await fetch("/api/shiftplan-paid-intakes", {
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
            "We could not save this intake right now. Please try again.",
        );
        setErrors(result.errors || {});
        return;
      }

      setSubmitted(true);
      setLastSubmittedFingerprint(currentFingerprint);
      setFormMessage(result.message || successTitle);
      setErrors({});
    } catch {
      setSubmitted(false);
      setFormMessage(
        "We could not reach the paid intake list right now. Please try again in a moment.",
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
          <p className="text-lg font-semibold">{successTitle}</p>
          <p className="mt-2 text-sm leading-6 text-teal-900">
            {formMessage}
          </p>
          <p className="mt-3 text-sm leading-6 text-teal-900">
            Payment is checked manually during early access. We will match this
            request to the checkout email you submitted.
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

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-3 leading-7 text-slate-600">{description}</p>
        <p className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-slate-700">
          Payment is checked manually during early access. Please use the same
          email you used at checkout.
        </p>
      </div>

      <form className="grid gap-5 sm:gap-6" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <Field
              key={field.name}
              id={field.name}
              label={field.label}
              helpText={field.helpText}
              error={errors[field.name]}
              wide={field.type === "textarea"}
            >
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={readRawString(form[field.name])}
                  onChange={(event) =>
                    updateField(field.name, event.target.value)
                  }
                  className="field-control min-h-32"
                  rows={field.rows || 4}
                  required
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={readRawString(form[field.name])}
                  onChange={(event) =>
                    updateField(field.name, event.target.value)
                  }
                  className="field-control"
                  autoComplete={field.type === "email" ? "email" : undefined}
                  min={field.type === "date" ? "2024-01-01" : undefined}
                  max={field.type === "date" ? "2100-12-31" : undefined}
                  required
                />
              )}
              {field.name === "plan_start_date" ? (
                <CalculatedEndDateNote
                  startDate={readRawString(form.plan_start_date)}
                  endDate={calculatedPlanEndDate}
                  emptyText="Choose the first day of the 7-day plan. We'll automatically build the plan through the calculated end date."
                  filledText="We'll automatically build the plan through"
                />
              ) : null}
              {field.name === "week_start_date" ? (
                <CalculatedEndDateNote
                  startDate={readRawString(form.week_start_date)}
                  endDate={calculatedWeekEndDate}
                  emptyText="Choose the first day of this weekly plan. We'll automatically build through the calculated end date."
                  filledText="We'll automatically build through"
                />
              ) : null}
            </Field>
          ))}
        </div>

        <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-800">
            Safety confirmation
          </legend>
          <label className="mt-2 flex cursor-pointer gap-3 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              checked={form.safety_acknowledged === true}
              onChange={(event) =>
                updateField("safety_acknowledged", event.target.checked)
              }
              className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
              required
            />
            <span>
              I understand ShiftPlan is lifestyle and routine planning only. It
              does not provide medical advice, diagnosis, treatment, sleep
              disorder guidance, fatigue treatment, burnout treatment,
              medication guidance, healthcare advice, or emergency support.
            </span>
          </label>
          {errors.safety_acknowledged ? (
            <p className="mt-2 text-sm font-medium text-red-700">
              {errors.safety_acknowledged}
            </p>
          ) : null}
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSubmitting || isDuplicateSubmittedState}
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
          >
            {isSubmitting
              ? "Submitting..."
              : isDuplicateSubmittedState
                ? "Submitted"
                : "Submit intake"}
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
          >
            Back to homepage
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-fit"
          >
            Back to pricing
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  helpText,
  error,
  wide,
  children,
}: {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
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

function getFormFingerprint(
  intakeType: PaidIntakeType,
  form: FormState,
  fields: IntakeField[],
) {
  return JSON.stringify({
    intakeType,
    safetyAcknowledged: form.safety_acknowledged === true,
    values: fields.map((field) => [
      field.name,
      readString(form[field.name]).toLowerCase(),
    ]),
  });
}

function readString(value: string | boolean | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function readRawString(value: string | boolean | undefined) {
  return typeof value === "string" ? value : "";
}

function calculateEndDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return "";

  date.setUTCDate(date.getUTCDate() + 6);
  return formatDateInput(date);
}

function parseDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (year < 2024 || year > 2100) return null;

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDateInput(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function formatReadableDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return value;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function CalculatedEndDateNote({
  startDate,
  endDate,
  emptyText,
  filledText,
}: {
  startDate: string;
  endDate: string;
  emptyText: string;
  filledText: string;
}) {
  if (!startDate) {
    return <p className="mt-2 text-sm leading-6 text-slate-500">{emptyText}</p>;
  }

  if (!endDate) {
    return (
      <p className="mt-2 text-sm font-medium leading-6 text-red-700">
        Enter a valid start date.
      </p>
    );
  }

  return (
    <p className="mt-2 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
      {filledText}{" "}
      <span className="font-semibold">{formatReadableDate(endDate)}</span>.
    </p>
  );
}
