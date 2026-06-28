"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

/**
 * PostHog analytics provider (EU region).
 *
 * Set these in .env.local (and in the Vercel project env for production):
 *   NEXT_PUBLIC_POSTHOG_KEY   your PostHog project API key (phc_...)
 *   NEXT_PUBLIC_POSTHOG_HOST  https://eu.i.posthog.com   (EU cloud)
 *
 * Until the key is set we skip init, so dev/build never breaks on a missing key.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      // Auto-captures pageviews on App Router client-side navigations.
      capture_pageview: "history_change",
      capture_pageleave: true,
      person_profiles: "identified_only",
      defaults: "2026-05-30",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
