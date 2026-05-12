"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ComponentProps } from "react";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
};

export function TrackedLink({
  eventName,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        track(eventName);
        onClick?.(event);
      }}
    />
  );
}
