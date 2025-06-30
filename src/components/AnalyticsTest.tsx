"use client";

import { useSession } from "next-auth/react";
import { trackEvent } from "@/utils/analytics";

export default function AnalyticsTest() {
  const { data: session } = useSession();

  const testAnalytics = () => {
    trackEvent(
      "analytics_test",
      {
        test_type: "manual_test",
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      },
      session as any
    );

    alert(
      "Analytics test event sent! Check your Google Analytics Real-Time reports."
    );
  };

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Analytics Test Panel</h3>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Status:</strong> {session ? "Authenticated" : "Guest"}
        </p>
        {session && (
          <>
            <p>
              <strong>User ID:</strong>{" "}
              {(session as any).user?.id || session.user?.email}
            </p>
            <p>
              <strong>Email:</strong> {session.user?.email}
            </p>
            <p>
              <strong>Name:</strong> {session.user?.name}
            </p>
          </>
        )}
        <button
          onClick={testAnalytics}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Send Test Analytics Event
        </button>
      </div>
    </div>
  );
}
