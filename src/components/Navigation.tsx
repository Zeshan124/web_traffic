"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { trackEvent } from "@/utils/analytics";

interface NavigationProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export default function Navigation({ onSignIn, onSignOut }: NavigationProps) {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    trackEvent(
      "sign_in_attempt",
      {
        method: "google",
        source: "navigation",
      },
      session as any
    );
    onSignIn?.();
    signIn("google");
  };

  const handleSignOut = () => {
    trackEvent(
      "sign_out",
      {
        session_duration: "tracked_in_analytics",
      },
      session as any
    );
    onSignOut?.();
    signOut();
  };

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Web Traffic App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-gray-400">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
