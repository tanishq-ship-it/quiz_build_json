// Meta Pixel tracking service
// Pixel ID: 727882020361712

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

// Track custom events
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
};

// Track custom events (for non-standard events)
export const trackMetaCustomEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, params);
  }
};

// Quiz-specific tracking events
export const MetaQuizAnalytics = {
  // When user starts a quiz
  quizStart: (quizId: string, quizTitle?: string) => {
    trackMetaCustomEvent("QuizStart", {
      quiz_id: quizId,
      quiz_title: quizTitle,
    });
  },

  // When user completes the quiz
  quizComplete: (quizId: string, totalTimeMs: number, totalScreens: number) => {
    trackMetaEvent("CompleteRegistration", {
      content_name: quizId,
      value: totalScreens,
      currency: "USD",
    });
    trackMetaCustomEvent("QuizComplete", {
      quiz_id: quizId,
      total_time_ms: totalTimeMs,
      total_screens: totalScreens,
    });
  },

  // When user drops off (leaves quiz early)
  quizDropOff: (quizId: string, lastScreenIndex: number, totalScreens: number) => {
    trackMetaCustomEvent("QuizDropOff", {
      quiz_id: quizId,
      last_screen_index: lastScreenIndex,
      total_screens: totalScreens,
      completion_rate: Math.round((lastScreenIndex / totalScreens) * 100),
    });
  },
};

// Payment funnel tracking
export const MetaPaymentAnalytics = {
  // Email submitted (Lead event)
  emailSubmit: (quizId: string) => {
    trackMetaEvent("Lead", {
      content_name: quizId,
    });
  },

  // Payment page viewed
  paymentPageView: (quizId: string, planType?: string) => {
    trackMetaEvent("InitiateCheckout", {
      content_name: quizId,
      content_category: planType,
    });
  },

  // Plan selected / Add to cart
  planSelect: (quizId: string, planType: string, price: number) => {
    trackMetaEvent("AddToCart", {
      content_name: planType,
      content_ids: [quizId],
      value: price,
      currency: "USD",
    });
  },

  // Purchase completed
  purchase: (quizId: string, planType: string, value: number) => {
    trackMetaEvent("Purchase", {
      content_name: planType,
      content_ids: [quizId],
      value: value,
      currency: "USD",
    });
  },
};
