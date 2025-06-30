"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  trackEvent,
  setUserProperties,
  trackPageView,
} from "@/utils/analytics";

export default function AnalyticsTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    // Set user properties when session changes
    setUserProperties(session as any);

    // Track page view with user data
    trackPageView(session as any);

    // Track homepage visit
    trackEvent(
      "visited_homepage",
      {
        traffic_source: "organic",
        page_title: "Homepage",
      },
      session as any
    );
  }, [session, status]);

  // This component doesn't render anything
  return null;
}
