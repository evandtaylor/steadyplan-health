import type { Metadata } from "next";
import { siteDisclaimer } from "@/lib/content";

export const metadata: Metadata = {
  title: "Internal Manual Beta Plan Templates",
  description:
    "Internal-only SteadyPlan Health templates for manually creating early beta plans.",
};

const templates = [
  {
    name: "ShiftPlan Manual Plan Template",
    intro:
      "Use this template to organize a practical shift-work plan around schedule, recovery, meals, hydration, caffeine timing, and questions for a qualified professional.",
    accent: "teal",
    sections: [
      {
        title: "User goal summary",
        prompts: [
          "Plain-language goal:",
          "What the user wants to feel more organized around:",
          "What would make this plan useful this week:",
        ],
      },
      {
        title: "Schedule snapshot",
        prompts: [
          "Typical shift type:",
          "Shift length:",
          "Workdays this week:",
          "Commute time:",
          "Known schedule changes:",
        ],
      },
      {
        title: "Sleep plan",
        prompts: [
          "Target sleep window:",
          "Wind-down reminder:",
          "Wake-up buffer:",
          "Recovery sleep note:",
        ],
      },
      {
        title: "Meal timing plan",
        prompts: [
          "Meal or snack timing before work:",
          "Meal or snack timing during shift:",
          "Meal or snack timing after shift:",
          "Simple protein-focused ideas to consider:",
        ],
      },
      {
        title: "Hydration plan",
        prompts: [
          "Hydration reminders:",
          "Bottle or prep plan:",
          "Shift-specific note:",
        ],
      },
      {
        title: "Caffeine timing plan",
        prompts: [
          "Preferred caffeine window:",
          "Suggested cutoff to review with user's own routine:",
          "Night-shift adjustment note:",
        ],
      },
      {
        title: "Workout/recovery plan",
        prompts: [
          "Workout goal:",
          "Best-fit workout window:",
          "Recovery or mobility option:",
          "Low-energy backup plan:",
        ],
      },
      {
        title: "What to prepare before shift",
        prompts: [
          "Food or snack prep:",
          "Water bottle or hydration setup:",
          "Uniform, bag, or commute prep:",
          "Reminder checklist:",
        ],
      },
      {
        title: "Questions to ask a qualified professional",
        prompts: [
          "Questions about sleep, nutrition, training, or recovery:",
          "Questions about symptoms, health conditions, or safety concerns:",
          "Who the user should ask:",
        ],
      },
      {
        title: "Safety disclaimer",
        prompts: [
          "ShiftPlan provides organizational and educational support only. It does not diagnose, treat, prescribe, provide medical nutrition therapy, or replace medical advice from a licensed professional.",
        ],
      },
    ],
  },
  {
    name: "KinPlan Manual Plan Template",
    intro:
      "Use this template to organize family care responsibilities, appointment planning, communication, and care-team questions without replacing professional guidance.",
    accent: "blue",
    sections: [
      {
        title: "Care situation summary",
        prompts: [
          "High-level situation:",
          "Current priority:",
          "What feels most confusing right now:",
        ],
      },
      {
        title: "Key responsibilities",
        prompts: [
          "Primary caregiver tasks:",
          "Shared family tasks:",
          "Tasks that need an owner:",
        ],
      },
      {
        title: "Appointment plan",
        prompts: [
          "Upcoming appointments:",
          "Transportation or scheduling needs:",
          "Notes to bring:",
          "Follow-up tasks after appointment:",
        ],
      },
      {
        title: "Family task list",
        prompts: [
          "This week's tasks:",
          "Assigned person:",
          "Due date or reminder:",
          "Status:",
        ],
      },
      {
        title: "Caregiver communication plan",
        prompts: [
          "Best family update channel:",
          "Update rhythm:",
          "What to include in each update:",
          "What should be escalated to the care team:",
        ],
      },
      {
        title: "Questions for the care team",
        prompts: [
          "Questions about instructions:",
          "Questions about follow-up timing:",
          "Questions about daily care tasks:",
          "Questions about when to seek urgent or emergency care:",
        ],
      },
      {
        title: "Red-flag education",
        prompts: [
          "General red flags provided by the care team:",
          "When to call the care team:",
          "For emergency symptoms, call 911 or seek emergency care.",
        ],
      },
      {
        title: "Weekly family update template",
        prompts: [
          "What changed this week:",
          "Appointments completed or scheduled:",
          "Tasks completed:",
          "Open questions:",
          "Help needed:",
        ],
      },
      {
        title: "Safety disclaimer",
        prompts: [
          "KinPlan provides organizational and educational support only. It does not diagnose, treat, prescribe, or replace medical advice from the care team.",
        ],
      },
    ],
  },
  {
    name: "SuppPlan Manual Plan Template",
    intro:
      "Use this template to organize a user's existing supplement routine, timing, inventory, duplicate ingredient review, and provider questions without recommending products, peptides, research chemicals, or dosages.",
    accent: "cyan",
    sections: [
      {
        title: "Routine summary",
        prompts: [
          "User's organization goal:",
          "Routine complexity:",
          "Main consistency challenge:",
        ],
      },
      {
        title: "Supplement timing organizer",
        prompts: [
          "Morning routine:",
          "Meal-linked routine:",
          "Evening routine:",
          "Timing questions to review with a qualified professional:",
        ],
      },
      {
        title: "Inventory checklist",
        prompts: [
          "Items to track:",
          "Low inventory reminders:",
          "Reorder reminder preference:",
          "Notes about what the user already owns:",
        ],
      },
      {
        title: "Duplicate ingredient review placeholder",
        prompts: [
          "Ingredients the user wants to review:",
          "Possible duplicate ingredient areas to discuss with a qualified professional:",
          "Important: do not claim to detect interactions or determine safety.",
        ],
      },
      {
        title: "Questions to ask a qualified professional",
        prompts: [
          "Questions about timing:",
          "Questions about duplicate ingredients:",
          "Questions about whether this routine fits the user's situation:",
          "Questions about any concerns that need professional review:",
        ],
      },
      {
        title: "Consistency plan",
        prompts: [
          "Simple reminder plan:",
          "Routine anchor:",
          "Missed-routine backup:",
          "Weekly review note:",
        ],
      },
      {
        title: "Safety disclaimer",
        prompts: [
          "SuppPlan provides organizational and educational support only. It does not diagnose, treat, prescribe, recommend medications, recommend peptides or research chemicals, recommend dosages, detect interactions, or replace medical advice.",
        ],
      },
    ],
  },
] as const;

export default function TemplatesPage() {
  return (
    <section className="template-page px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="print-hide max-w-3xl">
          <p className="text-sm font-semibold uppercase text-teal-700">
            Internal templates
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            Manual beta plan templates
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            This page is internal-only and is not linked from public
            navigation. Use these templates to manually create early beta plans.
            Keep every plan focused on organization, education, routines,
            checklists, and questions to ask qualified professionals. ShiftPlan
            is the current launch focus.
          </p>
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            Do not add diagnoses, treatment instructions, medication changes,
            peptide guidance, research chemical guidance, dosage
            recommendations, disease claims, or claims that SteadyPlan detects
            interactions.
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {templates.map((template) => (
            <PlanTemplate key={template.name} {...template} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanTemplate({
  name,
  intro,
  accent,
  sections,
}: {
  name: string;
  intro: string;
  accent: "teal" | "blue" | "cyan";
  sections: readonly {
    title: string;
    prompts: readonly string[];
  }[];
}) {
  const accentClasses = {
    teal: "border-teal-200 bg-teal-50 text-teal-950",
    blue: "border-blue-200 bg-blue-50 text-blue-950",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-950",
  };

  return (
    <article className="template-sheet rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <header className={`rounded-lg border p-5 ${accentClasses[accent]}`}>
        <p className="text-sm font-semibold uppercase">SteadyPlan Health</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
          {name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">{intro}</p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.title}
            className="template-section rounded-lg border border-slate-200 p-4"
          >
            <h3 className="text-base font-semibold text-slate-950">
              {section.title}
            </h3>
            <div className="mt-4 space-y-3">
              {section.prompts.map((prompt) => (
                <div key={prompt}>
                  <p className="text-sm font-medium leading-6 text-slate-700">
                    {prompt}
                  </p>
                  <div className="mt-2 min-h-10 rounded-md border border-dashed border-slate-300 bg-slate-50" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        {siteDisclaimer}
      </footer>
    </article>
  );
}
