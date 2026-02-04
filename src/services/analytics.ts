import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const IS_DEV = import.meta.env.DEV;

// Initialize Google Analytics
export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        debug_mode: IS_DEV, // Enable debug mode in development
      },
      gtagOptions: {
        debug_mode: IS_DEV,
      },
    });
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: title,
  });
};

// Track custom events
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Quiz-specific tracking events
export const QuizAnalytics = {
  // When user starts a quiz
  quizStart: (quizId: string, quizTitle?: string) => {
    trackEvent("Quiz", "quiz_start", quizId);
    ReactGA.event("quiz_start", {
      quiz_id: quizId,
      quiz_title: quizTitle,
    });
  },

  // When user views a screen/question
  screenView: (quizId: string, screenId: string, screenIndex: number) => {
    ReactGA.event("screen_view", {
      quiz_id: quizId,
      screen_id: screenId,
      screen_index: screenIndex,
    });
  },

  // When user answers a question
  questionAnswer: (
    quizId: string,
    screenId: string,
    screenIndex: number,
    timeSpentMs: number
  ) => {
    ReactGA.event("question_answer", {
      quiz_id: quizId,
      screen_id: screenId,
      screen_index: screenIndex,
      time_spent_ms: timeSpentMs,
    });
  },

  // When user completes the quiz
  quizComplete: (quizId: string, totalTimeMs: number, totalScreens: number) => {
    trackEvent("Quiz", "quiz_complete", quizId, totalTimeMs);
    ReactGA.event("quiz_complete", {
      quiz_id: quizId,
      total_time_ms: totalTimeMs,
      total_screens: totalScreens,
    });
  },

  // When user drops off (leaves quiz early)
  quizDropOff: (quizId: string, lastScreenIndex: number, totalScreens: number) => {
    ReactGA.event("quiz_drop_off", {
      quiz_id: quizId,
      last_screen_index: lastScreenIndex,
      total_screens: totalScreens,
      completion_rate: Math.round((lastScreenIndex / totalScreens) * 100),
    });
  },
};

// Payment funnel tracking
export const PaymentAnalytics = {
  // Email collection page viewed
  emailPageView: (quizId: string) => {
    ReactGA.event("email_page_view", {
      quiz_id: quizId,
    });
  },

  // Email submitted
  emailSubmit: (quizId: string, leadId: string) => {
    trackEvent("Payment", "email_submit", quizId);
    ReactGA.event("email_submit", {
      quiz_id: quizId,
      lead_id: leadId,
    });
  },

  // Payment page viewed
  paymentPageView: (quizId: string, planType?: string) => {
    ReactGA.event("payment_page_view", {
      quiz_id: quizId,
      plan_type: planType,
    });
  },

  // Plan selected
  planSelect: (quizId: string, planType: string, price: number) => {
    ReactGA.event("plan_select", {
      quiz_id: quizId,
      plan_type: planType,
      price: price,
    });
  },

  // Purchase completed
  purchase: (quizId: string, planType: string, value: number) => {
    trackEvent("Payment", "purchase", planType, value);
    ReactGA.event("purchase", {
      quiz_id: quizId,
      plan_type: planType,
      value: value,
      currency: "USD",
    });
  },

  // Purchase failed/cancelled
  purchaseCancel: (quizId: string) => {
    ReactGA.event("purchase_cancel", {
      quiz_id: quizId,
    });
  },
};

export default ReactGA;
