"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import {
  trackEvent,
  setUserProperties,
  trackPageView,
  identifyUser,
  trackUserLogout,
  generateOrGetUserId,
} from "@/utils/analytics";

export default function Home() {
  const { data: session, status } = useSession();
  const mouseAreaRef = useRef<HTMLDivElement>(null);
  const hasTrackedSession = useRef(false);

  useEffect(() => {
    // Only run once when session is loaded
    if (status === "loading") return;

    if (session && !hasTrackedSession.current) {
      // User is logged in - identify them
      identifyUser(session as any);
      hasTrackedSession.current = true;
    } else if (!session) {
      // Set properties for guest user
      setUserProperties(null);
      hasTrackedSession.current = false;
    }

    // Track page view with user data
    trackPageView(session as any, "Homepage");

    // Track homepage visit with enhanced data
    trackEvent(
      "visited_homepage",
      {
        traffic_source: "organic",
        page_title: "Homepage",
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
      },
      session as any
    );
  }, [session, status]);

  // Example event handlers for tracking
  const handleButtonClick = () => {
    trackEvent(
      "button_click",
      {
        label: "Trackable Button",
        element_type: "button",
        click_timestamp: new Date().toISOString(),
      },
      session as any
    );
  };

  const handleLinkClick = () => {
    trackEvent(
      "link_click",
      {
        label: "Trackable Link",
        element_type: "link",
        link_url: "https://www.example.com",
        click_timestamp: new Date().toISOString(),
      },
      session as any
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;

    trackEvent(
      "form_submit",
      {
        label: "Trackable Form",
        element_type: "form",
        form_name: "email_form",
        form_email: email,
        submit_timestamp: new Date().toISOString(),
      },
      session as any
    );
    alert("Form submitted!");
  };

  const handleMouseMove = () => {
    trackEvent(
      "mouse_move",
      {
        label: "Mouse Area",
        element_type: "interactive_area",
        interaction_timestamp: new Date().toISOString(),
      },
      session as any
    );
  };

  const handleSignInClick = () => {
    trackEvent(
      "sign_in_attempt",
      {
        method: "google",
        source: "navigation",
        attempt_timestamp: new Date().toISOString(),
      },
      session as any
    );
  };

  const handleSignOutClick = () => {
    // Calculate session duration if possible
    const sessionStart = (session as any)?.user?.loginTime;
    let sessionDuration = 0;

    if (sessionStart) {
      sessionDuration = Date.now() - new Date(sessionStart).getTime();
    }

    trackUserLogout(session as any);
    trackEvent(
      "sign_out",
      {
        session_duration_ms: sessionDuration,
        signout_timestamp: new Date().toISOString(),
      },
      session as any
    );
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const currentUserId = generateOrGetUserId(session as any);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation onSignIn={handleSignInClick} onSignOut={handleSignOutClick} />
      <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Trackable Elements Demo</h1>
          {session ? (
            <div className="bg-green-900 border border-green-400 text-green-100 px-4 py-3 rounded mb-4">
              <p className="font-medium">
                Welcome back, {session.user?.name || session.user?.email}!
              </p>
              <p className="text-sm">
                You are now signed in and your interactions will be tracked with
                your account.
              </p>
              <p className="text-xs mt-2 text-green-300">
                Analytics User ID: {currentUserId}
              </p>
              <p className="text-xs text-green-300">
                Google ID: {(session as any).user?.googleId}
              </p>
              <p className="text-xs text-green-300">
                Email: {session.user?.email}
              </p>
            </div>
          ) : (
            <div className="bg-yellow-900 border border-yellow-400 text-yellow-100 px-4 py-3 rounded mb-4">
              <p className="font-medium">You are browsing as a guest</p>
              <p className="text-sm">
                Sign in to get personalized tracking and analytics.
              </p>
              <p className="text-xs mt-2 text-yellow-300">
                Guest ID: {currentUserId}
              </p>
            </div>
          )}
        </div>

        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleButtonClick}
        >
          Trackable Button
        </button>

        <a
          href="https://www.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
          onClick={handleLinkClick}
        >
          Trackable Link
        </a>

        <form className="flex flex-col gap-2 w-64" onSubmit={handleFormSubmit}>
          <label htmlFor="email">Email (Trackable Form):</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border rounded px-2 py-1 text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>

        <div
          ref={mouseAreaRef}
          onMouseMove={handleMouseMove}
          className="w-64 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center mt-4"
        >
          Move your mouse here (Trackable Area)
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            All interactions are tracked with your user data in Google Analytics
          </p>
          <div className="mt-2 text-xs">
            <p>Current User ID: {currentUserId}</p>
            <p>User Type: {session ? "Authenticated" : "Guest"}</p>
            {session && (
              <>
                <p>Email: {session.user?.email}</p>
                <p>Name: {session.user?.name}</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
