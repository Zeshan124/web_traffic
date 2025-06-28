import { Session } from "next-auth";
import { v4 as uuidv4 } from 'uuid';

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set",
      eventName: string,
      params?: Record<string, any>
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

// Add this function to your utils/analytics.ts file
export const generateOrGetUserId = (session?: Session | null): string => {
    if (session?.user?.email) {
      // For authenticated users, create a consistent ID based on email
      return `auth_${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    } else {
      // For guest users, use localStorage to persist across sessions
      const GUEST_ID_KEY = 'ga_guest_user_id';
      let guestId = '';
      
      if (typeof window !== 'undefined') {
        guestId = localStorage.getItem(GUEST_ID_KEY) || '';
        if (!guestId) {
          guestId = `guest_${uuidv4()}`;
          localStorage.setItem(GUEST_ID_KEY, guestId);
        }
      }
      
      return guestId;
    }
  };

  // Add this function to your utils/analytics.ts file
export const identifyUser = (session: Session) => {
    if (typeof window === "undefined" || !window.gtag) {
      return;
    }
  
    const userId = generateOrGetUserId(session);
    
    // Track user login event
    trackEvent("user_login", {
      method: "google",
      user_id: userId,
      login_timestamp: new Date().toISOString(),
    }, session);
  
    // Set user properties
    setUserProperties(session);
    
    console.log('User identified:', userId, session.user);
  };

export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {},
  session?: Session | null
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

  // Merge user data with event parameters
  const enhancedParams = {
    ...parameters,
    ...userData,
  };

  window.gtag("event", eventName, enhancedParams);
};

export const setUserProperties = (session?: Session | null) => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  if (session?.user) {
    // Set user properties for all future events
    window.gtag("config", "G-TV7JCEY4DV", {
      user_id: session.user.id || session.user.email,
      user_email: session.user.email,
      user_name: session.user.name,
      user_type: "authenticated",
    });
  } else {
    // Reset user properties for guest users
    window.gtag("config", "G-TV7JCEY4DV", {
      user_id: undefined,
      user_email: undefined,
      user_name: undefined,
      user_type: "guest",
    });
  }
};

export const trackPageView = (session?: Session | null) => {
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
    page_title: document.title,
    page_location: window.location.href,
    ...userData,
  });
};