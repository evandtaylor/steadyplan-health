import { siteDisclaimer } from "@/lib/content";

export function DisclaimerBox() {
  return (
    <aside className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-slate-700 shadow-sm">
      <p className="font-semibold text-blue-950">Important health and safety note</p>
      <p className="mt-2">{siteDisclaimer}</p>
    </aside>
  );
}
