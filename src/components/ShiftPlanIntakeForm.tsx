"use client";

import { type FormEvent, type ReactNode, useState } from "react";

type FormState = {
  name: string;
  email: string;
  role: string;
  typicalShiftType: string;
  shiftLength: string;
  workdaysThisWeek: string;
  commuteTime: string;
  sleepGoal: string;
  workoutGoal: string;
  nutritionGoal: string;
  biggestShiftWorkStruggle: string;
  usefulPlanDetails: string;
  willingnessToPay: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  role: "",
  typicalShiftType: "",
  shiftLength: "",
  workdaysThisWeek: "",
  commuteTime: "",
  sleepGoal: "",
  workoutGoal: "",
  nutritionGoal: "",
  biggestShiftWorkStruggle: "",
  usefulPlanDetails: "",
  willingnessToPay: "",
};

const roleOptions = [
  "Nurse",
  "First responder",
  "Healthcare worker",
  "Student",
  "Other shift worker",
];

const shiftTypeOptions = [
  "Day shift",
  "Night shift",
  "Rotating shifts",
  "Call schedule",
  "Mixed/varies",
];

const shiftLengthOptions = [
  "8 hours",
  "10 hours",
  "12 hours",
  "16+ hours",
  "Varies",
];

const willingnessOptions = ["Yes", "No", "Maybe"];

export function ShiftPlanIntakeForm() {
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
    if (!form.role) nextErrors.role = "Choose your role.";
    if (!form.typicalShiftType) {
      nextErrors.typicalShiftType = "Choose a typical shift type.";
    }
    if (!form.shiftLength) nextErrors.shiftLength = "Choose a shift length.";
    if (!form.workdaysThisWeek.trim()) {
      nextErrors.workdaysThisWeek = "Share your workdays this week.";
    }
    if (!form.commuteTime.trim()) {
      nextErrors.commuteTime = "Share your commute time.";
    }
    if (!form.sleepGoal.trim()) nextErrors.sleepGoal = "Share your sleep goal.";
    if (!form.workoutGoal.trim()) {
      nextErrors.workoutGoal = "Share your workout goal.";
    }
    if (!form.nutritionGoal.trim()) {
      nextErrors.nutritionGoal = "Share your nutrition goal.";
    }
    if (!form.biggestShiftWorkStruggle.trim()) {
      nextErrors.biggestShiftWorkStruggle =
        "Share the shift-work struggle you want help organizing around.";
    }
    if (!form.usefulPlanDetails.trim()) {
      nextErrors.usefulPlanDetails =
        "Share what would make this plan useful.";
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
      role: form.role,
      typical_shift_type: form.typicalShiftType,
      shift_length: form.shiftLength,
      workdays_this_week: form.workdaysThisWeek.trim(),
      commute_time: form.commuteTime.trim(),
      sleep_goal: form.sleepGoal.trim(),
      workout_goal: form.workoutGoal.trim(),
      nutrition_goal: form.nutritionGoal.trim(),
      biggest_shift_work_struggle: form.biggestShiftWorkStruggle.trim(),
      useful_plan_details: form.usefulPlanDetails.trim(),
      willingness_to_pay: form.willingnessToPay,
    };

    try {
      const response = await fetch("/api/shiftplan-intakes", {
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
            "We could not save your ShiftPlan intake right now. Please try again.",
        );
        setErrors(mapServerErrors(result.errors));
        return;
      }

      setSubmitted(true);
      setLastSubmittedFingerprint(currentFingerprint);
      setFormMessage(
        result.message ||
          "Thanks. Your ShiftPlan intake was saved for manual review.",
      );
      setErrors({});
    } catch {
      setSubmitted(false);
      setFormMessage(
        "We could not reach the ShiftPlan intake list right now. Please try again in a moment.",
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
          <p className="text-lg font-semibold">Your ShiftPlan intake is saved.</p>
          <p className="mt-2 text-sm leading-6 text-teal-900">
            {formMessage}
          </p>
          <p className="mt-3 text-sm leading-6 text-teal-900">
            We will use this to understand practical planning needs around
            shifts, sleep, meals, workouts, and recovery. It is not used for
            diagnosis, treatment, or medical advice.
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
          <Field id="shiftplanName" label="Name" error={errors.name}>
            <input
              id="shiftplanName"
              name="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="field-control"
              autoComplete="name"
              required
            />
          </Field>

          <Field id="shiftplanEmail" label="Email" error={errors.email}>
            <input
              id="shiftplanEmail"
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
            id="role"
            label="Role"
            value={form.role}
            error={errors.role}
            options={roleOptions}
            onChange={(value) => updateField("role", value)}
          />

          <SelectField
            id="typicalShiftType"
            label="Typical shift type"
            value={form.typicalShiftType}
            error={errors.typicalShiftType}
            options={shiftTypeOptions}
            onChange={(value) => updateField("typicalShiftType", value)}
          />

          <SelectField
            id="shiftLength"
            label="Shift length"
            value={form.shiftLength}
            error={errors.shiftLength}
            options={shiftLengthOptions}
            onChange={(value) => updateField("shiftLength", value)}
          />
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          <Field
            id="workdaysThisWeek"
            label="Workdays this week"
            helpText="Example: Mon, Tue, Fri nights. Keep this to schedule details only."
            error={errors.workdaysThisWeek}
          >
            <input
              id="workdaysThisWeek"
              name="workdaysThisWeek"
              value={form.workdaysThisWeek}
              onChange={(event) =>
                updateField("workdaysThisWeek", event.target.value)
              }
              className="field-control"
              required
            />
          </Field>

          <Field
            id="commuteTime"
            label="Commute time"
            helpText="Example: 25 minutes each way."
            error={errors.commuteTime}
          >
            <input
              id="commuteTime"
              name="commuteTime"
              value={form.commuteTime}
              onChange={(event) => updateField("commuteTime", event.target.value)}
              className="field-control"
              required
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          <Field id="sleepGoal" label="Sleep goal" error={errors.sleepGoal}>
            <textarea
              id="sleepGoal"
              name="sleepGoal"
              value={form.sleepGoal}
              onChange={(event) => updateField("sleepGoal", event.target.value)}
              className="field-control min-h-32"
              required
            />
          </Field>

          <Field
            id="workoutGoal"
            label="Workout goal"
            error={errors.workoutGoal}
          >
            <textarea
              id="workoutGoal"
              name="workoutGoal"
              value={form.workoutGoal}
              onChange={(event) => updateField("workoutGoal", event.target.value)}
              className="field-control min-h-32"
              required
            />
          </Field>

          <Field
            id="nutritionGoal"
            label="Nutrition goal"
            helpText="Keep this to planning goals, meal timing, and consistency. Do not include medical diets or eating disorder concerns."
            error={errors.nutritionGoal}
          >
            <textarea
              id="nutritionGoal"
              name="nutritionGoal"
              value={form.nutritionGoal}
              onChange={(event) =>
                updateField("nutritionGoal", event.target.value)
              }
              className="field-control min-h-32"
              required
            />
          </Field>
        </div>

        <Field
          id="biggestShiftWorkStruggle"
          label="Biggest shift-work struggle"
          helpText="Please do not include diagnoses, prescriptions, lab values, detailed medical history, date of birth, Social Security number, or protected health information."
          error={errors.biggestShiftWorkStruggle}
        >
          <textarea
            id="biggestShiftWorkStruggle"
            name="biggestShiftWorkStruggle"
            value={form.biggestShiftWorkStruggle}
            onChange={(event) =>
              updateField("biggestShiftWorkStruggle", event.target.value)
            }
            className="field-control min-h-28"
            required
          />
        </Field>

        <Field
          id="usefulPlanDetails"
          label="What would make this plan useful?"
          error={errors.usefulPlanDetails}
        >
          <textarea
            id="usefulPlanDetails"
            name="usefulPlanDetails"
            value={form.usefulPlanDetails}
            onChange={(event) =>
              updateField("usefulPlanDetails", event.target.value)
            }
            className="field-control min-h-28"
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
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <input
                  type="radio"
                  name="willingnessToPay"
                  value={option}
                  checked={form.willingnessToPay === option}
                  onChange={(event) =>
                    updateField("willingnessToPay", event.target.value)
                  }
                  className="peer h-4 w-4 accent-teal-700"
                  required
                />
                <span className="peer-checked:text-teal-950">{option}</span>
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
          className="inline-flex w-full items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-base font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
        >
          {isSubmitting
            ? "Saving..."
            : isDuplicateSubmittedState
              ? "Saved"
              : "Save ShiftPlan intake"}
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
    role: form.role,
    typicalShiftType: form.typicalShiftType,
    shiftLength: form.shiftLength,
    workdaysThisWeek: form.workdaysThisWeek.trim(),
    commuteTime: form.commuteTime.trim(),
    sleepGoal: form.sleepGoal.trim(),
    workoutGoal: form.workoutGoal.trim(),
    nutritionGoal: form.nutritionGoal.trim(),
    biggestShiftWorkStruggle: form.biggestShiftWorkStruggle.trim(),
    usefulPlanDetails: form.usefulPlanDetails.trim(),
    willingnessToPay: form.willingnessToPay,
  });
}

function mapServerErrors(errors?: Record<string, string>) {
  if (!errors) return {};

  return {
    name: errors.name,
    email: errors.email,
    role: errors.role,
    typicalShiftType: errors.typical_shift_type,
    shiftLength: errors.shift_length,
    workdaysThisWeek: errors.workdays_this_week,
    commuteTime: errors.commute_time,
    sleepGoal: errors.sleep_goal,
    workoutGoal: errors.workout_goal,
    nutritionGoal: errors.nutrition_goal,
    biggestShiftWorkStruggle: errors.biggest_shift_work_struggle,
    usefulPlanDetails: errors.useful_plan_details,
    willingnessToPay: errors.willingness_to_pay,
  };
}
