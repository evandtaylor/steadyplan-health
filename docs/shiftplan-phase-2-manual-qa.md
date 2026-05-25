# ShiftPlan Phase 2 Manual QA Checklist

Use this checklist before inviting more private beta testers. Run it on both desktop and iPhone when possible.

## 1. /app Login QA

- [ ] Pass / [ ] Fail: `/app` loads on desktop.
- [ ] Pass / [ ] Fail: `/app` loads on iPhone Safari.
- [ ] Pass / [ ] Fail: Login page explains private beta access clearly.
- [ ] Pass / [ ] Fail: Valid email/access code opens the app.
- [ ] Pass / [ ] Fail: Invalid access shows a useful error.
- Notes:

## 2. App Access Codes Admin QA

- [ ] Pass / [ ] Fail: `/admin` loads.
- [ ] Pass / [ ] Fail: Wrong admin password is rejected.
- [ ] Pass / [ ] Fail: App Access Codes list loads after valid admin access.
- [ ] Pass / [ ] Fail: Create a clearly labeled test code.
- [ ] Pass / [ ] Fail: Deactivate the test code.
- [ ] Pass / [ ] Fail: Reactivate the test code.
- [ ] Pass / [ ] Fail: Raw access code warning remains visible.
- Notes:

## 3. Fresh Generated Plan QA

- [ ] Pass / [ ] Fail: Create one fresh weekly request.
- [ ] Pass / [ ] Fail: Exact work shifts are required and accepted.
- [ ] Pass / [ ] Fail: Freeform "Tell ShiftPlan your week" input works.
- [ ] Pass / [ ] Fail: Quick chips fill fields but do not submit automatically.
- [ ] Pass / [ ] Fail: Generate exactly one test plan.
- [ ] Pass / [ ] Fail: Usage limits update after generation.
- Notes:

## 4. Schedule Week View QA

- [ ] Pass / [ ] Fail: Schedule List is the default familiar management view.
- [ ] Pass / [ ] Fail: Week toggle opens a Monday-Sunday visual layout.
- [ ] Pass / [ ] Fail: Active events appear on the correct day cards.
- [ ] Pass / [ ] Fail: Event time, title, and category are readable.
- [ ] Pass / [ ] Fail: Empty days show "Nothing planned yet."
- [ ] Pass / [ ] Fail: iPhone layout stacks cleanly without horizontal overflow.
- [ ] Pass / [ ] Fail: Switching back to List keeps add, edit, archive, restore, quick add, bulk add, notes, and week filter usable.
- Notes:

## 5. Timeline Output QA

- [ ] Pass / [ ] Fail: Plan starts naturally and does not include robotic labels.
- [ ] Pass / [ ] Fail: Day-by-day timeline is easy to scan.
- [ ] Pass / [ ] Fail: Morning, midday, afternoon, evening, work, or reset blocks appear when useful.
- [ ] Pass / [ ] Fail: Dates and shift times match the request.
- [ ] Pass / [ ] Fail: Important note stays compact.
- [ ] Pass / [ ] Fail: No medical, treatment, or workplace safety claims appear.
- Notes:

## 6. Checklist By Day QA

- [ ] Pass / [ ] Fail: Interactive checklist appears when checklist items exist.
- [ ] Pass / [ ] Fail: Items are grouped by day.
- [ ] Pass / [ ] Fail: Day groups expand and collapse.
- [ ] Pass / [ ] Fail: Checking items works on desktop.
- [ ] Pass / [ ] Fail: Checking items works on iPhone.
- [ ] Pass / [ ] Fail: Checked state persists after refresh.
- Notes:

## 7. Calendar Export iPhone QA

- [ ] Pass / [ ] Fail: Download Calendar button is visible.
- [ ] Pass / [ ] Fail: Helper copy says it downloads an `.ics` file.
- [ ] Pass / [ ] Fail: Helper copy says to review times before relying on it.
- [ ] Pass / [ ] Fail: Helper copy says no automatic reminders are added.
- [ ] Pass / [ ] Fail: iPhone Safari downloads or opens the `.ics` file.
- [ ] Pass / [ ] Fail: Calendar event labels are clear.
- [ ] Pass / [ ] Fail: Export does not invent exact times from vague items.
- Notes:

## 8. Copy Plan / Copy Summary / Copy Checklist QA

- [ ] Pass / [ ] Fail: Copy Summary works.
- [ ] Pass / [ ] Fail: Copy Plan works and includes the original full plan.
- [ ] Pass / [ ] Fail: Copy Checklist works from the saved plan header.
- [ ] Pass / [ ] Fail: Copy Checklist works from the interactive checklist.
- [ ] Pass / [ ] Fail: Copy states show a clear success/failure label.
- Notes:

## 9. Feedback QA

- [ ] Pass / [ ] Fail: "Was this plan useful?" shortcut appears.
- [ ] Pass / [ ] Fail: Shortcut scrolls to the correct feedback form.
- [ ] Pass / [ ] Fail: Feedback fields are understandable.
- [ ] Pass / [ ] Fail: Saving feedback works.
- [ ] Pass / [ ] Fail: Updating feedback works.
- [ ] Pass / [ ] Fail: Admin App Beta view shows latest feedback.
- Notes:

## 10. Saved Preferences QA

- [ ] Pass / [ ] Fail: Saved defaults card is easy to find.
- [ ] Pass / [ ] Fail: Preference helper examples are clear.
- [ ] Pass / [ ] Fail: Save preferences works.
- [ ] Pass / [ ] Fail: Saved preferences reload after refresh.
- [ ] Pass / [ ] Fail: Weekly request explains defaults vs this week's changes.
- Notes:

## 11. Request Reuse QA

- [ ] Pass / [ ] Fail: Recent requests load.
- [ ] Pass / [ ] Fail: Use as starting point copies the prior request.
- [ ] Pass / [ ] Fail: "What changed from the last plan" field appears.
- [ ] Pass / [ ] Fail: Reused request can be edited before saving.
- Notes:

## 12. Homepage QA

- [ ] Pass / [ ] Fail: Homepage loads.
- [ ] Pass / [ ] Fail: App preview section appears.
- [ ] Pass / [ ] Fail: "Share your schedule" copy appears.
- [ ] Pass / [ ] Fail: "How it works" step 02 is clear.
- [ ] Pass / [ ] Fail: Waitlist/private beta CTAs work.
- [ ] Pass / [ ] Fail: Mobile layout is readable.
- Notes:

## 13. Stripe Link QA

- [ ] Pass / [ ] Fail: Founding Pro link is unchanged.
- [ ] Pass / [ ] Fail: Custom 7-Day link is unchanged.
- [ ] Pass / [ ] Fail: Paid intake pages load.
- [ ] Pass / [ ] Fail: Stripe CTA text still matches the offer.
- Notes:

## 14. Admin App Beta QA

- [ ] Pass / [ ] Fail: App Beta tab loads after admin access.
- [ ] Pass / [ ] Fail: Generated plans signal is easy to scan.
- [ ] Pass / [ ] Fail: Feedback count signal is easy to scan.
- [ ] Pass / [ ] Fail: Would use weekly signal appears.
- [ ] Pass / [ ] Fail: Would pay $9/month signal appears.
- [ ] Pass / [ ] Fail: Latest feedback signal appears.
- [ ] Pass / [ ] Fail: Existing detailed panels still appear.
- Notes:

## 15. Bugs / Issues Notes

| Date | Area | Device | Issue | Severity | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

## Final QA Decision

- [ ] Ready to invite 2-3 more beta testers.
- [ ] Needs fixes before more testers.
- [ ] Needs ChatGPT product decision before implementation.

Summary:
