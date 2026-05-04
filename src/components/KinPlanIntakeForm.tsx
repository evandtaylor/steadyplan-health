"use client";

import { type FormEvent, type ReactNode, useState } from "react";

type FormState = {
  name: string;
  email: string;
  relationship: string;
  mainCareSituation: string;
  caregiverCount: string;
  biggestChallenge: string;
  scatteredInfo: string;
  planNeeds: string;
  currentTools: string;
  willingnessToPay: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  relationship: "",
  mainCareSituation: "",
  caregiverCount: "",
  biggestChallenge: "",
  scatteredInfo: "",
  planNeeds: "",
  currentTools: "",
  willingnessToPay: "",
};

const relationshipOptions = [
  "Parent",
  "Grandparent",
  "Spouse",
  "Other family member",
  "Friend",
  "Other",
];

const careSituationOptions = [
  "After hospital discharge",
  "Aging parent support",
  "Multiple appointments",
  "Medication organization",
  "Mobility/fall-risk concerns",
  "Memory/cognitive concerns",
  "Other",
];

const caregiverCountOptions = [
  "Just me",
  "2 people",
  "3-4 people",
  "5+ people",
];

const willingnessOptions = ["Yes", "No", "Maybe"];

export function KinPlanIntakeForm() {
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
    if (!form.relationship) {
      nextErrors.relationship = "Choose your relationship.";
    }
    if (!form.mainCareSituation) {
      nextErrors.mainCareSituation = "Choose the main care situation.";
    }
    if (!form.caregiverCount) {
      nextErrors.caregiverCount = "Choose how many caregivers are involved.";
    }
    if (!form.biggestChallenge.trim()) {
      nextErrors.biggestChallenge = "Share the biggest challenge right now.";
    }
    if (!form.scatteredInfo.trim()) {
      nextErrors.scatteredInfo =
        "Share what information feels scattered or confusing.";
    }
    if (!form.planNeeds.trim()) {
      nextErrors.planNeeds =
        "Share what a clear family care plan would need to include.";
    }
    if (!form.currentTools.trim()) {
      nextErrors.currentTools = "Share the current tools being used.";
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
      relationship_to_care_recipient: form.relationship,
      main_care_situation: form.mainCareSituation,
      caregiver_count: form.caregiverCount,
      biggest_challenge: form.biggestChallenge.trim(),
      scattered_information: form.scatteredInfo.trim(),
      plan_needs: form.planNeeds.trim(),
      current_tools: form.currentTools.trim(),
      willingness_to_pay: form.willingnessToPay,
    };

    try {
      const response = await fetch("/api/kinplan-intakes", {
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
            "We could not save your KinPlan intake right now. Please try again.",
        );
        setErrors(mapServerErrors(result.errors));
        return;
      }

      setSubmitted(true);
      setLastSubmittedFingerprint(currentFingerprint);
      setFormMessage(
        result.message ||
          "Thanks. Your KinPlan intake was saved for manual review.",
      );
      setErrors({});
    } catch {
      setSubmitted(false);
      setFormMessage(
        "We could not reach the KinPlan intake list right now. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      {submitted ? (
        <div
          className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm"
          role="status"
        >
          <p className="text-lg font-semibold">Your KinPlan intake is saved.</p>
          <p className="mt-2 text-sm leading-6 text-blue-900">{formMessage}</p>
          <p className="mt-3 text-sm leading-6 text-blue-900">
            We will use this to understand practical family care organization
            needs. It is not used for diagnosis, treatment, prescribing, or
            medical advice.
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
          <Field id="kinplanName" label="Name" error={errors.name}>
            <input
              id="kinplanName"
              name="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="field-control"
              autoComplete="name"
              required
            />
          </Field>

          <Field id="kinplanEmail" label="Email" error={errors.email}>
            <input
              id="kinplanEmail"
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

        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          <SelectField
            id="relationship"
            label="Relationship to person receiving care"
            value={form.relationship}
            error={errors.relationship}
            options={relationshipOptions}
            onChange={(value) => updateField("relationship", value)}
          />

          <SelectField
            id="mainCareSituation"
            label="Main care situation"
            value={form.mainCareSituation}
            error={errors.mainCareSituation}
            options={careSituationOptions}
            onChange={(value) => updateField("mainCareSituation", value)}
          />

          <SelectField
            id="caregiverCount"
            label="How many caregivers are involved?"
            value={form.caregiverCount}
            error={errors.caregiverCount}
            options={caregiverCountOptions}
            onChange={(value) => updateField("caregiverCount", value)}
          />
        </div>

        <Field
          id="biggestChallenge"
          label="Biggest challenge right now"
          helpText="Please keep this practical and avoid patient names, dates of birth, diagnoses, medication names, medical record numbers, insurance numbers, lab values, or protected health information."
          error={errors.biggestChallenge}
        >
          <textarea
            id="biggestChallenge"
            name="biggestChallenge"
            value={form.biggestChallenge}
            onChange={(event) =>
              updateField("biggestChallenge", event.target.value)
            }
            className="field-control min-h-28"
            required
          />
        </Field>

        <Field
          id="scatteredInfo"
          label="What information feels scattered or confusing?"
          error={errors.scatteredInfo}
        >
          <textarea
            id="scatteredInfo"
            name="scatteredInfo"
            value={form.scatteredInfo}
            onChange={(event) => updateField("scatteredInfo", event.target.value)}
            className="field-control min-h-28"
            required
          />
        </Field>

        <Field
          id="planNeeds"
          label="What would a clear family care plan need to include?"
          error={errors.planNeeds}
        >
          <textarea
            id="planNeeds"
            name="planNeeds"
            value={form.planNeeds}
            onChange={(event) => updateField("planNeeds", event.target.value)}
            className="field-control min-h-28"
            required
          />
        </Field>

        <Field
          id="currentTools"
          label="Current tools used"
          helpText="Examples: shared notes, calendar, group text, paper folder, spreadsheet, reminders."
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

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-slate-800">
            Would you pay for this if it worked?
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {willingnessOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <input
                  type="radio"
                  name="willingnessToPay"
                  value={option}
                  checked={form.willingnessToPay === option}
                  onChange={(event) =>
                    updateField("willingnessToPay", event.target.value)
                  }
                  className="peer h-4 w-4 accent-blue-700"
                  required
                />
                <span className="peer-checked:text-blue-950">{option}</span>
              </label>
            ))}
          </div>
          {errors.willingnessToPay ? (
            <p className="mt-2 text-sm font-medium text-red-700">
              {errors.willingnessToPay}
            </p>
          ) : null}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting || isDuplicateSubmittedState}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
        >
          {isSubmitting
            ? "Saving..."
            : isDuplicateSubmittedState
              ? "Saved"
              : "Save KinPlan intake"}
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
    relationship: form.relationship,
    mainCareSituation: form.mainCareSituation,
    caregiverCount: form.caregiverCount,
    biggestChallenge: form.biggestChallenge.trim(),
    scatteredInfo: form.scatteredInfo.trim(),
    planNeeds: form.planNeeds.trim(),
    currentTools: form.currentTools.trim(),
    willingnessToPay: form.willingnessToPay,
  });
}

function mapServerErrors(errors?: Record<string, string>) {
  if (!errors) return {};

  return {
    name: errors.name,
    email: errors.email,
    relationship: errors.relationship_to_care_recipient,
    mainCareSituation: errors.main_care_situation,
    caregiverCount: errors.caregiver_count,
    biggestChallenge: errors.biggest_challenge,
    scatteredInfo: errors.scattered_information,
    planNeeds: errors.plan_needs,
    currentTools: errors.current_tools,
    willingnessToPay: errors.willingness_to_pay,
  };
}
