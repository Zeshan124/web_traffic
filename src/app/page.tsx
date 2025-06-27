"use client";

import { useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "set",
      id: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}

export default function HomePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const mouseAreaRef = useRef<HTMLDivElement>(null);

  // 🔹 Track logged-in user ID in GA4
  useEffect(() => {
    if (userId && typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-TV7JCEY4DV", {
        user_id: userId,
      });

      window.gtag("event", "logged_in", {
        method: "google",
        membership: "guest",
      });
    }
  }, [userId]);

  // 🔹 Custom event handlers
  const handleButtonClick = () => {
    window.gtag?.("event", "button_click", {
      label: "Trackable Button",
    });
  };

  const handleLinkClick = () => {
    window.gtag?.("event", "link_click", {
      label: "Trackable Link",
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.gtag?.("event", "form_submit", {
      label: "Trackable Form",
    });
    alert("Form submitted!");
  };

  const handleMouseMove = () => {
    window.gtag?.("event", "mouse_move", {
      label: "Mouse Area",
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h1 className="text-3xl font-bold">Trackable Elements Demo</h1>

      {/* 🔘 Google Auth Buttons */}
      {session ? (
        <>
          <p>Hello, {session.user?.name}</p>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Sign in with Google
        </button>
      )}

      {/* 🟦 Trackable Button */}
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleButtonClick}
      >
        Trackable Button
      </button>

      {/* 🔗 Trackable Link */}
      <a
        href="https://www.example.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline hover:text-blue-700"
        onClick={handleLinkClick}
      >
        Trackable Link
      </a>

      {/* 📩 Trackable Form */}
      <form className="flex flex-col gap-2 w-64" onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email (Trackable Form):</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>

      {/* 🖱️ Mouse Movement Tracker */}
      <div
        ref={mouseAreaRef}
        onMouseMove={handleMouseMove}
        className="w-64 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center mt-4"
      >
        Move your mouse here (Trackable Area)
      </div>
    </main>
  );
}
