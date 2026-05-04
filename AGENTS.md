# SteadyPlan Project Instructions

## Project Name

SteadyPlan Health

## Parent Brand

SteadyPlan Health

## Tagline

Simple plans for complicated health-life seasons.

## Core Company Idea

SteadyPlan Health is a health-adjacent AI planning company. It helps users turn complicated health-life situations into clear, simple, practical daily plans.

The company does not diagnose, treat, prescribe, or replace licensed medical advice. It provides organization, planning, education, checklists, reminders, routines, and questions to ask a qualified professional.

## Product Lines

### 1. ShiftPlan

ShiftPlan is for nurses, healthcare workers, first responders, and other shift workers.

It helps users plan around:
- 12-hour shifts
- night shifts
- rotating schedules
- call schedules
- sleep
- workouts
- recovery
- hydration
- caffeine timing
- meal timing
- work-life balance

ShiftPlan should feel practical, direct, and built for real shift workers.

### 2. KinPlan

KinPlan is for family caregivers managing aging parents, sick loved ones, or complex family care situations.

It helps users organize:
- medication lists
- appointments
- discharge instructions
- provider notes
- caregiver responsibilities
- family updates
- red-flag education
- questions to ask providers
- task sharing

KinPlan should feel warm, calm, family-friendly, and trustworthy.

### 3. SuppPlan

SuppPlan is for supplement organization and education.

It helps users organize:
- supplement routines
- supplement timing
- supplement inventory
- duplicate ingredients
- general education
- questions to ask a provider
- daily consistency

SuppPlan must not recommend peptides, research chemicals, medications, or dosages for human use. It must not tell users what to take. It may help users organize what they already use and encourage them to ask a qualified professional.

### 4. Nutrition Guidance Feature

SteadyPlan may later include meal and macro guidance, but for now this should be treated as a feature inside ShiftPlan and SuppPlan, not a separate brand.

This feature may help users think through:
- protein goals
- calorie goals
- macro targets
- meal timing
- remaining intake for the day
- shift-work eating patterns

It must not treat eating disorders, prescribe medical diets, or provide disease-specific medical nutrition therapy.

## Safety Rules

Always follow these rules:

1. Do not diagnose.
2. Do not treat disease.
3. Do not prescribe.
4. Do not recommend starting, stopping, or changing medication.
5. Do not recommend peptides or research chemicals for human use.
6. Do not recommend specific dosages for medications, peptides, or research chemicals.
7. Do not claim to replace a physician, nurse practitioner, dietitian, pharmacist, therapist, or any licensed professional.
8. Do not make disease cure claims.
9. Do not make supplement claims that imply treatment or prevention of disease.
10. Do not ask for unnecessary sensitive health data in the MVP.
11. Avoid collecting diagnoses, prescription medication lists, lab values, or protected health information unless explicitly required for a later secure version.
12. Use clear disclaimers on every page.
13. Emergency language must tell users to call 911 or seek emergency care for emergency symptoms.
14. Always frame outputs as organization, education, planning, and questions to ask a professional.

## Required Sitewide Disclaimer

Use this disclaimer across the site:

"SteadyPlan Health provides organizational and educational support only. It does not diagnose, treat, prescribe, or replace medical advice from a licensed healthcare professional. Always follow instructions from your healthcare team. For emergency symptoms, call 911 or seek emergency care."

## Brand Voice

The brand should sound:
- calm
- clear
- useful
- trustworthy
- practical
- human
- not corporate
- not scammy
- not like a supplement hype website
- not like a hospital EMR

Avoid:
- "biohack your body"
- "unlock your potential"
- "cure"
- "treat"
- "protocols that fix"
- "doctor in your pocket"
- "AI medical provider"
- "peptide recommendations"

Prefer:
- "clear plan"
- "daily routine"
- "organize"
- "simplify"
- "questions to ask your provider"
- "stay consistent"
- "reduce overwhelm"
- "built for real life"

## Visual Design

Use:
- clean modern healthcare-adjacent design
- calm teal, blue, white, and light gray
- rounded cards
- simple icons if available
- mobile-first layout
- clear CTAs
- readable spacing

Avoid:
- neon fitness influencer style
- dark crypto/startup style
- red emergency medical style
- scammy supplement landing page style

## Tech Stack

Use:
- Next.js
- TypeScript
- Tailwind CSS
- React components
- Vercel-compatible project structure

Use later:
- Supabase for waitlist database and authentication
- Stripe for payments
- Resend for emails
- OpenAI API for AI plan drafts

Do not add Supabase, Stripe, Resend, or OpenAI API until the basic landing pages and beta form are complete.

## Initial MVP Pages

Create these pages first:

- /
Main SteadyPlan Health landing page

- /shiftplan
ShiftPlan product page

- /kinplan
KinPlan product page

- /suppplan
SuppPlan product page

- /beta
Beta signup page

- /privacy
Plain-English privacy placeholder

- /terms
Plain-English terms placeholder

## Initial MVP Components

Create reusable components:

- Header
- Footer
- ProductCard
- CTASection
- DisclaimerBox
- BetaForm
- SectionHeading
- FeatureCard

## Landing Page Copy

Main hero headline:
"Simple plans for complicated health-life seasons."

Subheadline:
"SteadyPlan Health helps shift workers, caregivers, and wellness-focused users turn messy schedules, routines, and responsibilities into clear daily plans."

Primary CTA:
"Join the Beta"

Secondary CTA:
"Explore Products"

Product cards:

ShiftPlan:
"Your schedule is weird. Your health plan should know that."

KinPlan:
"One clear plan when family care gets complicated."

SuppPlan:
"Organize your supplement routine without the guesswork."

## Beta Form Fields

The beta form should include:

- Name
- Email
- Product interest: ShiftPlan, KinPlan, SuppPlan, All
- Biggest problem you want solved
- Current tools you use
- Would you pay for this if it worked? Yes, No, Maybe
- Optional details

For now, the form can use client-side state and show a success message. Do not connect to a database until the basic site is complete.

## Coding Standards

Use:
- clean TypeScript
- reusable components
- accessible buttons and forms
- semantic HTML
- mobile-first responsive design
- clear file names
- simple data arrays for repeated content
- readable Tailwind classes

Avoid:
- unnecessary dependencies
- overengineering
- complex state management
- fake backend logic
- fake testimonials
- fake medical claims
- fake clinical validation

## Workflow Rules for Codex

For every task:
1. Inspect the relevant files first.
2. Make focused changes.
3. Keep the health-safety rules in mind.
4. Run lint/build checks if available.
5. Summarize what changed.
6. Mention any files changed.
7. Mention any commands needed to run locally.
8. Suggest the next best technical step.

After creating AGENTS.md, stop and summarize what you created. Do not build the app yet.
