# ShiftPlan iOS Prototype Brief

This brief prepares for a possible future iOS app without starting native development yet. ShiftPlan should stay focused on the web/PWA beta until weekly usage, checklist value, and willingness to pay are clearer.

## Trigger Conditions Before Building

Do not start a native iOS build until most of these are true:

- 10-20 beta users have tried the private beta.
- Multiple users show interest in using ShiftPlan weekly.
- Feedback patterns repeat across testers.
- Checklist value is proven through real use.
- Calendar export value is proven through iPhone testing.
- Users understand the saved preferences plus weekly changes flow.
- There is evidence of willingness to pay.
- The web app/PWA experience has no obvious blocking issues.

## First iOS MVP Scope

If the iOS app becomes justified, keep the first version narrow:

- Login.
- Saved preferences.
- Create weekly request.
- Generate plan.
- View plan.
- Interactive checklist.
- Feedback.
- Use last week as a starting point.

## Not Included In First iOS MVP

The first iOS version should not include:

- Apple Health.
- Wearables.
- Push notifications.
- Widgets.
- Community.
- Full calendar sync.
- AI chat.
- Public account creation before the account model is proven on web.
- Medical, treatment, fatigue, burnout, sleep disorder, medication, supplement, healthcare, mental health, workplace safety, or emergency-support guidance.

## Suggested Technical Paths

### Path 1: PWA First

Use the current web app as the primary beta surface. Improve Add to Home Screen guidance, mobile layout, plan readability, and `.ics` export before committing to native.

Best when:

- Beta users are still low volume.
- The main risks are product clarity and weekly usefulness.
- The team needs fast iteration.

### Path 2: React Native / Expo Later

Consider Expo if the app needs a dedicated App Store presence but the product still benefits from web-style iteration and shared React thinking.

Best when:

- Weekly use is proven.
- Users expect a home-screen app.
- The first native scope is mostly forms, generated plans, checklist, and feedback.

### Path 3: Swift Later

Consider Swift only if native platform depth becomes central to the product.

Best when:

- The app needs deep iOS behavior.
- Product-market fit is stronger.
- The team is ready to maintain a native codebase.

## App Store Asset Needs

Prepare these only after the trigger conditions are met:

- App name.
- Subtitle.
- Short description.
- Full description.
- App screenshots.
- Privacy URL.
- Support URL.
- Onboarding screenshots.
- App icon.
- Age rating answers.
- Data collection summary.

## Prototype Screens

The first prototype should map to the current proven web flow:

1. Access / login.
2. Saved defaults.
3. This week's request.
4. Plan generation status.
5. Saved plan timeline.
6. Today / Next up.
7. Checklist by day.
8. Calendar export / copy actions.
9. Feedback.

## Risks

- Splitting focus too early.
- Building the app before retention is proven.
- Creating two product surfaces to maintain.
- App Store review and release friction.
- Slower iteration on wording, prompts, and beta flow.
- Overbuilding native features before knowing which weekly workflows matter.

## Recommendation

Keep improving the web/PWA beta until testers repeatedly use ShiftPlan week to week. Native iOS becomes a good next step only after the current app proves that the generated plan, checklist, and weekly reuse loop are worth carrying into a dedicated app.
