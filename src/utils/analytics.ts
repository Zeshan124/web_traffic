import { Session } from "next-auth";
import { v4 as uuidv4 } from "uuid";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set",
      eventName: string,
      params?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

export interface UserAnalyticsData {
  user_id?: string;
  user_email?: string;
  user_name?: string;
  user_type: "authenticated" | "guest";
  session_id?: string;
}

export type AnalyticsSession = Session | null | undefined;

export const generateOrGetUserId = (session?: AnalyticsSession): string => {
  if (session?.user?.email) {
    return `auth_${session.user.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
  } else {
    const GUEST_ID_KEY = "ga_guest_user_id";
    let guestId = "";

    if (typeof window !== "undefined") {
      guestId = localStorage.getItem(GUEST_ID_KEY) || "";
      if (!guestId) {
        guestId = `guest_${uuidv4()}`;
        localStorage.setItem(GUEST_ID_KEY, guestId);
      }
    }

    return guestId;
  }
};

export const identifyUser = (session: Session) => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  const userId = generateOrGetUserId(session);

  trackEvent(
    "user_login",
    {
      method: "google",
      user_id: userId,
      login_timestamp: new Date().toISOString(),
    },
    session
  );

  setUserProperties(session);

  console.log("User identified:", userId, session.user);
};

export const trackUserLogout = (session?: AnalyticsSession) => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  const userId = generateOrGetUserId(session);

  trackEvent(
    "user_logout",
    {
      user_id: userId,
      logout_timestamp: new Date().toISOString(),
    },
    session
  );

  setUserProperties(null);

  console.log("User logged out:", userId);
};

export const trackEvent = (
  eventName: string,
  parameters: Record<string, string | number | boolean | undefined> = {},
  session?: AnalyticsSession
) => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  const userData: UserAnalyticsData = {
    user_type: session ? "authenticated" : "guest",
  };

  if (session?.user) {
    userData.user_id = session.user.id || session.user.email || undefined;
    userData.user_email = session.user.email || undefined;
    userData.user_name = session.user.name || undefined;
    userData.session_id = session.user.id;
    if (session.user.googleId) {
      (userData as any).google_id = session.user.googleId;
    }
  }

  const enhancedParams = {
    ...parameters,
    ...userData,
  };

  window.gtag("event", eventName, enhancedParams);
};

export const setUserProperties = (session?: AnalyticsSession) => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  if (session?.user) {
    window.gtag("config", "G-TV7JCEY4DV", {
      user_id: session.user.id || session.user.email || undefined,
      user_email: session.user.email || undefined,
      user_name: session.user.name || undefined,
      user_type: "authenticated",
      google_id: session.user.googleId || undefined,
    });
  } else {
    window.gtag("config", "G-TV7JCEY4DV", {
      user_id: undefined,
      user_email: undefined,
      user_name: undefined,
      user_type: "guest",
    });
  }
};

export const trackPageView = (
  session?: AnalyticsSession,
  pageTitle?: string
) => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  const userData: UserAnalyticsData = {
    user_type: session ? "authenticated" : "guest",
  };

  if (session?.user) {
    userData.user_id = session.user.id || session.user.email || undefined;
    userData.user_email = session.user.email || undefined;
    userData.user_name = session.user.name || undefined;
    userData.session_id = session.user.id;
  }

  window.gtag("event", "page_view", {
    page_title: pageTitle || document.title,
    page_location: window.location.href,
    ...userData,
  });
};
