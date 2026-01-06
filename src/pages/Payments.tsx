import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getQuiz } from "../services/api";

type PlanId = "1-month" | "3-months" | "1-year";
type PaymentState = "idle" | "processing" | "paid";

const DISCOUNT_LABEL = "SAVE 50%";
const DISCOUNT_PERCENT_LABEL = "51%";
const DEFAULT_COUNTDOWN_SECONDS = 10 * 60; // 10 minutes

const getPaidStorageKey = (quizId: string) => `quiz:${quizId}:paid`;
const getCountdownStorageKey = (quizId: string) => `quiz:${quizId}:paywall:expiresAt`;

const formatCountdown = (seconds: number): string => {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

type Plan = {
  id: PlanId;
  duration: string;
  originalPrice: string;
  discountedPrice: string;
  perDay: string;
  strikePrice: string;
  badge: string;
  badgeColor: string;
  popular?: boolean;
};

const Payments: React.FC = () => {
  const { quizId } = useParams<{ quizId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isPreviewPlay = useMemo(
    () => location.pathname.startsWith("/preview-play/"),
    [location.pathname],
  );

  const [quizTitle, setQuizTitle] = useState<string>("Quiz");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("3-months");
  const [countdownSeconds, setCountdownSeconds] = useState<number>(DEFAULT_COUNTDOWN_SECONDS);

  const paidKey = quizId ? getPaidStorageKey(quizId) : null;
  const isPaid = useMemo(() => {
    if (!paidKey) return false;
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(paidKey) === "true";
  }, [paidKey]);

  useEffect(() => {
    if (!quizId) {
      setError("Missing quiz id.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const quiz = await getQuiz(quizId);
        if (cancelled) return;
        setQuizTitle(quiz.title || "Quiz");
      } catch {
        if (cancelled) return;
        setError("Failed to load quiz.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  useEffect(() => {
    if (isPaid) setPaymentState("paid");
  }, [isPaid]);

  // Discount countdown (persisted per quiz)
  useEffect(() => {
    if (!quizId) return;
    if (typeof window === "undefined") return;

    const key = getCountdownStorageKey(quizId);
    const stored = window.sessionStorage.getItem(key);
    const now = Date.now();
    const expiresAt =
      stored && Number.isFinite(Number(stored))
        ? Number(stored)
        : now + DEFAULT_COUNTDOWN_SECONDS * 1000;

    window.sessionStorage.setItem(key, String(expiresAt));

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setCountdownSeconds(remaining);
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [quizId]);

  const handlePay = async () => {
    if (!quizId || !paidKey) return;
    if (paymentState === "processing") return;

    // Demo paywall: persist locally. Replace this with a real checkout flow later.
    try {
      setPaymentState("processing");
      await new Promise((r) => setTimeout(r, 900));
      if (typeof window !== "undefined") {
        window.localStorage.setItem(paidKey, "true");
        window.localStorage.setItem(`${paidKey}:plan`, selectedPlan);
      }
      setPaymentState("paid");
    } catch {
      setPaymentState("idle");
    }
  };

  const handleBackToPlay = () => {
    if (!quizId) return;
    navigate(isPreviewPlay ? `/preview-play/${quizId}` : `/${quizId}`);
  };

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "1-month",
        duration: "1 month",
        originalPrice: "$25.99",
        discountedPrice: "$12.99",
        perDay: "$0.43",
        strikePrice: "$0.87",
        badge: DISCOUNT_LABEL,
        badgeColor: "text-blue-600 border-blue-600",
      },
      {
        id: "3-months",
        duration: "3 months",
        originalPrice: "$59.99",
        discountedPrice: "$29.99",
        perDay: "$0.33",
        strikePrice: "$0.67",
        badge: DISCOUNT_LABEL,
        badgeColor: "text-blue-600 border-blue-600",
        popular: true,
      },
      {
        id: "1-year",
        duration: "1 year",
        originalPrice: "$199.99",
        discountedPrice: "$99.99",
        perDay: "$0.27",
        strikePrice: "$0.55",
        badge: "BEST OFFER",
        badgeColor: "text-blue-600 border-blue-600",
      },
    ],
    [],
  );

  const selectedPlanDetails = useMemo(
    () => plans.find((p) => p.id === selectedPlan) ?? plans[0],
    [plans, selectedPlan],
  );

  const handleContinue = () => {
    if (paymentState === "paid") {
      handleBackToPlay();
      return;
    }
    void handlePay();
  };

  return (
    <div className="app-container">
      <section className="screen-section">
        <div className="mobile-frame">
          <div className="w-full h-full bg-gray-50 flex flex-col p-4 gap-3 overflow-y-auto scrollbar-hide">
            {/* Timer Banner */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {DISCOUNT_PERCENT_LABEL} discount reserved for:
                </p>
                <p className="text-2xl font-bold">{formatCountdown(countdownSeconds)}</p>
              </div>
              <button
                type="button"
                onClick={handleContinue}
                disabled={paymentState === "processing"}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>

            {/* Main Pricing Card */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-wider text-gray-400">
                  {quizTitle}
                  {isPreviewPlay ? " (preview)" : ""}
                </div>
                <h2 className="text-2xl font-bold text-center mt-2">Choose your plan</h2>
              </div>

              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600 py-10">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading…
                  </div>
                ) : error ? (
                  <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                    {error}
                  </div>
                ) : (
                  plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedPlan(plan.id);
                      }}
                      className={`relative border-2 rounded-2xl p-4 cursor-pointer transition ${
                        plan.popular
                          ? "border-blue-600 bg-blue-50"
                          : selectedPlan === plan.id
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-1.5 rounded-t-xl font-semibold text-xs">
                          MOST POPULAR
                        </div>
                      )}

                      <div
                        className={`flex items-center justify-between ${plan.popular ? "mt-6" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio Button */}
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedPlan === plan.id
                                ? "border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedPlan === plan.id && (
                              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full" />
                            )}
                          </div>

                          <div>
                            <h3 className="text-xl font-bold mb-1">{plan.duration}</h3>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-gray-400 line-through">
                                {plan.originalPrice}
                              </span>
                              <span className="font-semibold">{plan.discountedPrice}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 border-2 ${plan.badgeColor} rounded-lg text-xs font-bold mb-2`}
                          >
                            {plan.badge}
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-gray-400 line-through text-[11px]">
                              {plan.strikePrice}
                            </span>
                            <span className="text-3xl font-bold">{plan.perDay}</span>
                          </div>
                          <p className="text-xs text-gray-600">per day</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={paymentState === "processing"}
                className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-base mt-5 hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {paymentState === "processing" ? "PROCESSING…" : "CONTINUE"}
              </button>

              {/* Terms and Conditions */}
              <div className="mt-5 text-center text-xs text-gray-500 leading-relaxed">
                <p>
                  We&apos;ve applied a discount to your first subscription. Your plan will renew at
                  the full price of {selectedPlanDetails.originalPrice} after the current term. You
                  can manage your subscription in your account.
                </p>
                <p className="mt-2">
                  By continuing, you agree to our{" "}
                  <a
                    href="#"
                    className="text-gray-700 underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms&amp;Privacy
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-gray-700 underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Refund Policy.
                  </a>
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleBackToPlay}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payments;


