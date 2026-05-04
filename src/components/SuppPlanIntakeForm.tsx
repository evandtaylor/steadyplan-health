"use client";

import { type FormEvent, type ReactNode, useState } from "react";

type FormState = {
  name: string;
  email: string;
  mainGoal: string;
  routineComplexity: string;
  biggestProblem: string;
  currentTools: string;
  usefulPlannerDetails: string;
  wantsInventoryReminders: string;
  willingnessToPay: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  mainGoal: "",
  routineComplexity: "",
  biggestProblem: "",
  currentTools: "",
  usefulPlannerDetails: "",
  wantsInventoryReminders: "",
  willingnessToPay: "",
};

const mainGoalOptions = [
  "Remembering supplements",
  "Organizing timing",
  "Avoiding duplicate ingredients",
  "Inventory tracking",
  "Questions to ask a provider",
  "General supplement education",
  "Other",
];

const routineComplexityOptions = [
  "1-2 products",
  "3-5 products",
  "6-10 products",
  "10+ products",
];

const yesNoMaybeOptions = ["Yes", "No", "Maybe"];

export function SuppPlanIntakeForm() {
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
    if (!form.mainGoal) {
      nextErrors.mainGoal = "Choose your main goal for using SuppPlan.";
    }
    if (!form.routineComplexity) {
      nextErrors.routineComplexity = "Choose your routine complexity.";
    }
    if (!form.biggestProblem.trim()) {
      nextErrors.biggestProblem =
        "Share the biggest supplement organization problem.";
    }
    if (!form.currentTools.trim()) {
      nextErrors.currentTools = "Share the current tools being used.";
    }
    if (!form.usefulPlannerDetails.trim()) {
      nextErrors.usefulPlannerDetails =
        "Share what would make a supplement planner useful.";
    }
    if (!form.wantsInventoryReminders) {
      nextErrors.wantsInventoryReminders = "Choose Yes, No, or Maybe.";
    }
    if (!form.willingnessToPay) {
      nextErrors.willingnessToPay = "Choose Yes, No, or Maybe.";
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
      main_goal: form.mainGoal,
      routine_complexity: form.routineComplexity,
      biggest_organization_problem: form.biggestProblem.trim(),
      current_tools: form.currentTools.trim(),
      useful_planner_details: form.usefulPlannerDetails.trim(),
      wants_inventory_reminders: form.wantsInventoryReminders,
      willingness_to_pay: form.willingnessToPay,
    };

    try {
      const response = await fetch("/api/suppplan-intakes", {
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
            "We could not save your SuppPlan intake right now. Please try again.",
        );
        setErrors(mapServerErrors(result.errors));
        return;
      }

      setSubmitted(true);
      setLastSubmittedFingerprint(currentFingerprint);
      setFormMessage(
        result.message ||
          "Thanks. Your SuppPlan intake was saved for manual review.",
      );
      setErrors({});
    } catch {
      setSubmitted(false);
      setFormMessage(
        "We could not reach the SuppPlan intake list right now. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      {submitted ? (
        <div
          className="mb-6 rounded-lg border border-cyan-200 bg-cyan-50 p-5 text-cyan-950 shadow-sm"
          role="status"
        >
          <p className="text-lg font-semibold">
            Your SuppPlan intake is saved.
          </p>
          <p className="mt-2 text-sm leading-6 text-cyan-900">
            {formMessage}
          </p>
          <p className="mt-3 text-sm leading-6 text-cyan-900">
            We will use this to understand practical organization needs around
            timing, inventory, duplicate ingredients, and provider questions. It
            is not used to suggest what to take, recommend peptides or research
            chemicals, diagnose, treat, prescribe, or provide medical advice.
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
          <Field id="suppplanName" label="Name" error={errors.name}>
            <input
              id="suppplanName"
              name="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="field-control"
              autoComplete="name"
              required
            />
          </Field>

          <Field id="suppplanEmail" label="Email" error={errors.email}>
            <input
              id="suppplanEmail"
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

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          <SelectField
            id="mainGoal"
            label="Main goal for using SuppPlan"
            value={form.mainGoal}
            error={errors.mainGoal}
            options={mainGoalOptions}
            onChange={(value) => updateField("mainGoal", value)}
          />

          <SelectField
            id="routineComplexity"
            label="Current supplement routine complexity"
            value={form.routineComplexity}
            error={errors.routineComplexity}
            options={routineComplexityOptions}
            onChange={(value) => updateField("routineComplexity", value)}
          />
        </div>

        <Field
          id="biggestProblem"
          label="Biggest supplement organization problem"
          helpText="Keep this focused on organization. Please do not include peptide use, research chemical use, injection details, prescriptions, diagnoses, lab values, dosing instructions, or sensitive medical information."
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
          label="Current tools used"
          helpText="Examples: notes app, calendar, spreadsheet, bottle labels, reminders, paper checklist."
          error={errors.currentTools}
        >
          <input
            id="currentTools"
            name="currentTools"
            value={form.currentTools}
            onChange={(event) => updateField("currentTools", event.target.value)}
            className="field-control"
            required
          />
        </Field>

        <Field
          id="usefulPlannerDetails"
          label="What would make a supplement planner useful?"
          helpText="Examples: track timing, organize inventory, identify duplicate ingredients, or prepare questions for a qualified professional."
          error={errors.usefulPlannerDetails}
        >
          <textarea
            id="usefulPlannerDetails"
            name="usefulPlannerDetails"
            value={form.usefulPlannerDetails}
            onChange={(event) =>
              updateField("usefulPlannerDetails", event.target.value)
            }
            className="field-control min-h-28"
            required
          />
        </Field>

        <RadioGroup
          legend="Would you want inventory/reorder reminders?"
          name="wantsInventoryReminders"
          value={form.wantsInventoryReminders}
          error={errors.wantsInventoryReminders}
          onChange={(value) => updateField("wantsInventoryReminders", value)}
        />

        <RadioGroup
          legend="Would you pay for this if it worked?"
          name="willingnessToPay"
          value={form.willingnessToPay}
          error={errors.willingnessToPay}
          onChange={(value) => updateField("willingnessToPay", value)}
        />

        <button
          type="submit"
          disabled={isSubmitting || isDuplicateSubmittedState}
          className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
        >
          {isSubmitting
            ? "Saving..."
            : isDuplicateSubmittedState
              ? "Saved"
              : "Save SuppPlan intake"}
        </button>
      </form>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  error,
  onChange,
}: {
  id: keyof FormState;
  label: string;
  value: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field id={id} label={label} error={error}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-control"
        required
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function RadioGroup({
  legend,
  name,
  value,
  error,
  onChange,
}: {
  legend: string;
  name: keyof FormState;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-semibold text-slate-800">
        {legend}
      </legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {yesNoMaybeOptions.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={(event) => onChange(event.target.value)}
              className="peer h-4 w-4 accent-cyan-700"
              required
            />
            <span className="peer-checked:text-cyan-950">{option}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
      ) : null}
    </fieldset>
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
    mainGoal: form.mainGoal,
    routineComplexity: form.routineComplexity,
    biggestProblem: form.biggestProblem.trim(),
    currentTools: form.currentTools.trim(),
    usefulPlannerDetails: form.usefulPlannerDetails.trim(),
    wantsInventoryReminders: form.wantsInventoryReminders,
    willingnessToPay: form.willingnessToPay,
  });
}

function mapServerErrors(errors?: Record<string, string>) {
  if (!errors) return {};

  return {
    name: errors.name,
    email: errors.email,
    mainGoal: errors.main_goal,
    routineComplexity: errors.routine_complexity,
    biggestProblem: errors.biggest_organization_problem,
    currentTools: errors.current_tools,
    usefulPlannerDetails: errors.useful_planner_details,
    wantsInventoryReminders: errors.wants_inventory_reminders,
    willingnessToPay: errors.willingness_to_pay,
  };
}
