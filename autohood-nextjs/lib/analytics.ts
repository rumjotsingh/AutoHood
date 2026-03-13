// Simple analytics tracking utility
// Replace with your actual analytics provider (Google Analytics, Mixpanel, etc.)

type EventName = 
  | "page_view"
  | "car_view"
  | "car_search"
  | "add_to_cart"
  | "remove_from_cart"
  | "add_to_wishlist"
  | "remove_from_wishlist"
  | "checkout_start"
  | "checkout_complete"
  | "booking_start"
  | "booking_complete"
  | "contact_dealer"
  | "test_drive_request"
  | "user_signup"
  | "user_login";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

class Analytics {
  private isEnabled: boolean;

  constructor() {
    // Enable analytics in production only
    this.isEnabled = process.env.NODE_ENV === "production";
  }

  // Track page views
  trackPageView(url: string, title?: string) {
    if (!this.isEnabled) return;

    // Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: url,
        page_title: title,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Page View:", { url, title });
    }
  }

  // Track custom events
  trackEvent(eventName: EventName, properties?: EventProperties) {
    if (!this.isEnabled) return;

    // Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", eventName, properties);
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Event:", eventName, properties);
    }
  }

  // Track user identification
  identifyUser(userId: string, traits?: EventProperties) {
    if (!this.isEnabled) return;

    // Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", "GA_MEASUREMENT_ID", {
        user_id: userId,
        ...traits,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Identify User:", { userId, traits });
    }
  }

  // Track e-commerce events
  trackPurchase(orderId: string, value: number, items: any[]) {
    if (!this.isEnabled) return;

    // Google Analytics 4 E-commerce
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "purchase", {
        transaction_id: orderId,
        value: value,
        currency: "INR",
        items: items,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Purchase:", { orderId, value, items });
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience functions
export const trackPageView = (url: string, title?: string) => 
  analytics.trackPageView(url, title);

export const trackEvent = (eventName: EventName, properties?: EventProperties) => 
  analytics.trackEvent(eventName, properties);

export const identifyUser = (userId: string, traits?: EventProperties) => 
  analytics.identifyUser(userId, traits);

export const trackPurchase = (orderId: string, value: number, items: any[]) => 
  analytics.trackPurchase(orderId, value, items);
