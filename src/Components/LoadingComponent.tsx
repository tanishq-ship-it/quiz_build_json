import React, { useEffect, useRef, useState } from "react";
import { FONT_INTER } from "../styles/fonts";
import Button from "./Button";

export type LoadingPopupOption = {
  text: string;
  value: string | number;
  variant?: "primary" | "outline" | "ghost";
  bgColor?: string;
  textColor?: string;
};

export type LoadingPopupConfig = {
  triggerAtPercent: number; // 0-100
  title: string;
  description?: string;
  responseKey?: string;
  layout?: "column" | "row";
  options: LoadingPopupOption[];
};

interface LoadingComponentProps {
  message?: string;
  duration?: number;
  progressColor?: string;
  trackColor?: string;
  popup?: LoadingPopupConfig;
  onComplete?: () => void;
  onPopupResponse?: (key: string, value: string | number) => void;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  message = "Loading...",
  duration = 3000,
  progressColor = "#2563eb",
  trackColor = "#e5e5e5",
  popup,
  onComplete,
  onPopupResponse,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupResponded, setPopupResponded] = useState(false);
  const hasFiredCompleteRef = useRef(false);

  useEffect(() => {
    if (isPaused) return;

    // simpler interval approach for control
    const intervalTime = 50; // update every 50ms
    const step = (100 * intervalTime) / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        const nextProgress = prev + step;

        // Check for popup trigger
        if (popup && !popupResponded && !showPopup) {
           if (prev < popup.triggerAtPercent && nextProgress >= popup.triggerAtPercent) {
             // Trigger point crossed
             setIsPaused(true);
             setShowPopup(true);
             return popup.triggerAtPercent;
           }
        }

        return nextProgress > 100 ? 100 : nextProgress;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, isPaused, popup, popupResponded, showPopup, onComplete]);

  // Fire completion AFTER React commits the progress=100 render.
  // This avoids "Cannot update a component while rendering a different component" warnings
  // when the parent reacts to `onComplete` by setting state.
  useEffect(() => {
    if (progress < 100) return;
    if (hasFiredCompleteRef.current) return;
    hasFiredCompleteRef.current = true;
    onComplete?.();
  }, [onComplete, progress]);

  // Reset completion when key inputs change (new loading instance semantics).
  useEffect(() => {
    hasFiredCompleteRef.current = false;
    setProgress(0);
    setIsPaused(false);
    setShowPopup(false);
    setPopupResponded(false);
  }, [duration, message, popup]);

  const handleOptionClick = (option: LoadingPopupOption) => {
    // Ensure we always capture the response, defaulting the key if not provided
    const key = popup?.responseKey ?? "loading-popup-response";
    onPopupResponse?.(key, option.value);

    setPopupResponded(true);
    setShowPopup(false);
    setIsPaused(false); // Resume loading
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 400, // Limit width for better look
        padding: "8px 0", // Reduced vertical padding
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Top Row: Message and Percentage */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          width: "100%",
          marginBottom: 6 // Small gap between text and bar
        }}
      >
        <h3
          style={{
            fontFamily: FONT_INTER,
            fontSize: 15, // Slightly smaller
            fontWeight: 600,
            color: "#333",
            margin: 0,
            textAlign: "left",
          }}
        >
          {message}
        </h3>
        <span style={{ fontFamily: FONT_INTER, fontSize: 13, color: "#666", fontWeight: 500 }}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: 6, // Thinner bar
          backgroundColor: trackColor,
          borderRadius: 3, // Thinner radius
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: progressColor,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Popup Overlay */}
      {showPopup && popup && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 320,
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            padding: 24,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            border: "1px solid #e5e5e5",
          }}
        >
          <h4
            style={{
              fontFamily: FONT_INTER,
              fontSize: 18,
              fontWeight: 700,
              color: "#111",
              margin: "0 0 8px 0",
            }}
          >
            {popup.title}
          </h4>
          {popup.description && (
            <p
              style={{
                fontFamily: FONT_INTER,
                fontSize: 14,
                color: "#666",
                margin: "0 0 20px 0",
                lineHeight: 1.5,
              }}
            >
              {popup.description}
            </p>
          )}

          <div style={{ 
            display: "flex", 
            flexDirection: popup.layout === "row" ? "row" : "column", 
            gap: 8, 
            width: "100%",
            justifyContent: "center"
          }}>
            {popup.options.map((opt, idx) => {
              const isOutline = opt.variant === "outline";
              // Use custom colors if provided, otherwise fallback to variant defaults
              const defaultBg = isOutline ? "#ffffff" : "#2563eb";
              const defaultText = isOutline ? "#333333" : "#ffffff";
              
              const bgColor = opt.bgColor ?? defaultBg;
              const textColor = opt.textColor ?? defaultText;
              
              // Adjust dimensions for row layout to ensure they fit and look good
              // Container is ~320px max, minus 48px padding = 272px space.
              // Two buttons with gap=8 means max width ~132px each.
              // We'll use 130px width, and explicit height/fontSize to prevent auto-scaling weirdness.
              const isRow = popup.layout === "row";
              const width = isRow ? 130 : 280;
              const height = isRow ? 44 : undefined; // Standard height
              const fontSize = isRow ? 14 : undefined; // Standard font size
              
              return (
                <div key={idx} style={isRow ? { flex: 1, display: 'flex', justifyContent: 'center' } : {}}>
                  <Button
                    variant="flat"
                    text={opt.text}
                    bgColor={bgColor}
                    textColor={textColor}
                    width={width}
                    height={height}
                    fontSize={fontSize}
                    onClick={() => handleOptionClick(opt)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


export default LoadingComponent;
