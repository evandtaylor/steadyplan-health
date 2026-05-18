import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShiftPlan",
    short_name: "ShiftPlan",
    description:
      "A weekly routine planner built around shift schedules, meals, workouts, errands, appointments, and responsibilities.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/icon.svg",
        sizes: "64x64",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
