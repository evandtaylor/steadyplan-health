# ShiftPlan Feature Decision Framework

Use this framework before adding features to ShiftPlan. The private beta should teach us which improvements make the weekly plan more useful, not become a parking lot for every plausible app idea.

## Build Now Criteria

Consider building a feature now when it clearly does at least one of these:

- Makes the generated plan more useful.
- Reduces typing or setup friction.
- Improves repeat weekly use.
- Helps collect better feedback.
- Helps private beta operations.
- Makes mobile use clearer without changing risky infrastructure.
- Preserves the lifestyle/routine planning scope.

## Park Criteria

Park the idea when it asks ShiftPlan to move ahead of evidence:

- Native iOS before retention proof.
- Public accounts before beta proof.
- Supabase Auth before the access-code beta flow has enough usage signal.
- Calendar sync before `.ics` export is validated by testers.
- Push notifications before weekly usage is proven.
- Wearables or Apple Health before product-market fit.
- Community features before the core weekly plan is repeatedly useful.
- AI chat before the current request-to-plan flow is simple and reliable.
- Anything that introduces medical, treatment, fatigue, burnout, sleep disorder, medication, supplement, healthcare, mental health, workplace safety, or emergency-support claims.

## Scoring Model

Score each idea from 1-5. Higher is better for user value, beta evidence, and revenue impact. Lower is better for complexity and risk.

| Score area | 1 | 3 | 5 |
| --- | --- | --- | --- |
| User value | Nice-to-have | Helps a meaningful workflow | Clearly improves weekly usefulness |
| Build complexity | Tiny docs/copy/UI change | Moderate app work | Large system or architecture change |
| Risk | Documentation or display-only | Touches app/admin logic | Touches auth, payment, SQL, safety, or external integrations |
| Beta evidence | One-off idea | Mentioned by multiple testers or seen in use | Repeated clear demand from active users |
| Revenue impact | Unclear | Supports conversion indirectly | Directly improves willingness to pay or repeat use |

## Decision Formula

Use this lightweight calculation:

`decision score = user value + beta evidence + revenue impact - build complexity - risk`

Suggested action:

- 7 or higher: consider building soon.
- 3-6: clarify with beta feedback first or build only if very low risk.
- 2 or lower: park it.

## Example Ranking

| Feature idea | User value | Complexity | Risk | Beta evidence | Revenue impact | Decision score | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| What changed this week flow | 5 | 2 | 2 | 4 | 4 | 9 | Build or refine soon |
| Calendar export refinements | 4 | 2 | 2 | 3 | 3 | 6 | Improve after iPhone QA |
| Database-backed checklist | 4 | 4 | 3 | 3 | 3 | 3 | Wait for repeated checklist use |
| Supabase Auth | 4 | 4 | 5 | 2 | 4 | 1 | Park until beta proof |
| Native iOS | 4 | 5 | 5 | 1 | 4 | -1 | Park until weekly use is proven |
| Push notifications | 3 | 4 | 4 | 1 | 3 | -1 | Park until repeat usage exists |

## Required Questions Before Building

- What tester evidence supports this?
- Does it make the generated plan better or faster to create?
- Does it make weekly reuse more likely?
- Can it be done without SQL, auth, payment, or schema changes?
- Does it preserve `/app`, `/admin`, paid intake routes, and Stripe links?
- Does it stay inside lifestyle/routine planning?
- Can it be shipped as one focused commit?

## Final Rule

If it does not improve user value, repeat use, feedback, or beta learning, park it.
