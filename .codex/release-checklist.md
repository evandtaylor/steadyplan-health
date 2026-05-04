# Release Checklist

Use this before handing off a meaningful update or deploying the MVP.

- Run lint.

```bash
npm run lint
```

- Run build.

```bash
npm run build
```

- Check mobile layout.
- Test the general beta form.
- Test ShiftPlan, KinPlan, and SuppPlan intake forms when touched.
- Test the admin route at `/admin`.
- Verify disclaimers are visible and accurate.
- Check footer links.
- Check privacy and terms pages.
- Review for unsafe health claims.
- Confirm no service role keys or secrets are exposed in client code.
- Confirm no new unnecessary dependencies were added.
- Confirm no new database tables or API integrations were added unless the task required them.
- Summarize changed files and remaining issues.
