"use client";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}

import { useEffect, useRef } from "react";

export default function Home() {
  const mouseAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "visited_homepage", {
        traffic_source: "organic",
        user_type: "guest",
      });
    }
  }, []);

  // Example event handlers for tracking
  const handleButtonClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "button_click", { label: "Trackable Button" });
    }
  };

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "link_click", { label: "Trackable Link" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_submit", { label: "Trackable Form" });
    }
    alert("Form submitted!");
  };

  const handleMouseMove = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "mouse_move", { label: "Mouse Area" });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h1 className="text-3xl font-bold mb-4">Trackable Elements Demo</h1>
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
        className="text-blue-500 underline hover:text-blue-700"
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
          className="border rounded px-2 py-1"
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
    </main>
  );
}
