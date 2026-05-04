export const siteDisclaimer =
  "SteadyPlan Health provides organizational and educational support only. It does not diagnose, treat, prescribe, or replace medical advice from a licensed healthcare professional. Always follow instructions from your healthcare team. For emergency symptoms, call 911 or seek emergency care.";

export const navLinks = [
  { href: "/shiftplan", label: "ShiftPlan" },
  { href: "/kinplan", label: "KinPlan" },
  { href: "/suppplan", label: "SuppPlan" },
  { href: "/beta", label: "Beta" },
];

export const productCards = [
  {
    name: "ShiftPlan",
    href: "/shiftplan",
    headline: "Your schedule is weird. Your daily routine should know that.",
    description:
      "Plan sleep, meals, workouts, hydration, caffeine timing, and recovery around real shift work.",
    label: "For shift workers",
  },
  {
    name: "KinPlan",
    href: "/kinplan",
    headline: "One clear plan when family care gets complicated.",
    description:
      "Organize appointments, discharge instructions, medication lists, caregiver tasks, and questions for the care team.",
    label: "For family caregivers",
  },
  {
    name: "SuppPlan",
    href: "/suppplan",
    headline: "Organize your supplement routine without the guesswork.",
    description:
      "Track timing, inventory, duplicate ingredients, and provider questions without hype or unsafe recommendations.",
    label: "For wellness routines",
  },
];

export const productPages = {
  shiftplan: {
    name: "ShiftPlan",
    label: "For shift workers",
    headline: "Your schedule is weird. Your daily routine should know that.",
    description:
      "ShiftPlan helps nurses, healthcare workers, first responders, and other shift workers organize daily routines around long shifts, nights, rotations, and recovery.",
    previewTitle: "Shift day checklist",
    previewItems: [
      "Review shift window",
      "Set sleep and meal reminders",
      "Save recovery notes",
    ],
    features: [
      {
        title: "Shift-aware routines",
        description:
          "Organize sleep, hydration, meals, caffeine timing, workouts, and recovery around the schedule you actually work.",
      },
      {
        title: "Simple day plans",
        description:
          "Turn messy calendars into practical checklists for work days, off days, night shifts, and transition days.",
      },
      {
        title: "Built for real life",
        description:
          "Keep the plan direct, realistic, and easy to adjust when call schedules or rotations change.",
      },
    ],
    nutritionGuidance: {
      eyebrow: "Planned nutrition guidance",
      title: "Meal direction for real shift-work days",
      description:
        "ShiftPlan can eventually help users think through protein goals, meal timing, hydration, caffeine timing, and what to eat next based on their shift schedule and workout goals. This would stay focused on general planning support, not medical nutrition therapy or exact macro prescriptions.",
      examples: [
        "You are low on protein for the day. Here are simple high-protein meal ideas to consider.",
        "You have a night shift tonight. Plan your caffeine cutoff and meal timing before work.",
        "You logged a heavier lunch. Here are lighter dinner ideas that still support your protein goal.",
      ],
      note: "This feature is planned for later beta testing.",
    },
    cta: "Join the ShiftPlan beta",
  },
  kinplan: {
    name: "KinPlan",
    label: "For family caregivers",
    headline: "One clear plan when family care gets complicated.",
    description:
      "KinPlan helps families organize the practical details of caring for aging parents, sick loved ones, or complex family care situations.",
    previewTitle: "Family care handoff",
    previewItems: [
      "Confirm next appointment",
      "Share family task update",
      "Save care team questions",
    ],
    features: [
      {
        title: "Care details in one place",
        description:
          "Organize appointments, discharge instructions, provider notes, medication lists, and family responsibilities.",
      },
      {
        title: "Questions for the care team",
        description:
          "Prepare clear questions to bring to qualified professionals without trying to replace their advice.",
      },
      {
        title: "Family-friendly updates",
        description:
          "Help caregivers share tasks and reduce confusion when several people are trying to help.",
      },
    ],
    cta: "Join the KinPlan beta",
  },
  suppplan: {
    name: "SuppPlan",
    label: "For supplement organization",
    headline: "Organize your supplement routine without the guesswork.",
    description:
      "SuppPlan helps users organize supplement routines, timing, inventory, duplicate ingredients, and provider questions without hype or unsafe recommendations.",
    previewTitle: "Supplement routine view",
    previewItems: [
      "Review current routine",
      "Check duplicate ingredients",
      "Save provider questions",
    ],
    features: [
      {
        title: "Routine organization",
        description:
          "Track timing, consistency, and inventory for supplements a user already uses.",
      },
      {
        title: "Duplicate ingredient awareness",
        description:
          "Notice repeated ingredients across products so users can ask a qualified professional better questions.",
      },
      {
        title: "No unsafe recommendations",
        description:
          "Avoid peptide, research chemical, medication, and dosage recommendations for human use.",
      },
    ],
    nutritionGuidance: {
      eyebrow: "Planned nutrition guidance",
      title: "Supplements make more sense when your meals are part of the plan",
      description:
        "SuppPlan may eventually help users align their own supplement timing with meals and daily routines. It would organize what users already use, help identify duplicate ingredients, and prepare questions for a qualified professional without recommending supplements, peptides, research chemicals, or dosages.",
      examples: [
        "Take your own routine and organize it around meals.",
        "Prepare questions for your provider about timing and duplicate ingredients.",
        "See how supplements fit into the day you already live.",
      ],
      note: "This feature is planned for later beta testing.",
    },
    cta: "Join the SuppPlan beta",
  },
} as const;

export type ProductKey = keyof typeof productPages;
