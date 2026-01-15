import { useCallback, useEffect, useRef, useState } from "react";
import Screens from "../Screens/Screens";
import logoImage from "../assests/logo.svg";

// ============================================================
// TYPES
// ============================================================
export interface ScreenData {
  id: string;
  /**
   * Optional category label for this screen.
   * Used by ScreenRouter to optionally render a category progress header.
   * Also useful for organizing/analytics.
   */
  category?: string;
  /**
   * When true, ScreenRouter will still show the top logo but will NOT render
   * the category progress bar/label for this screen (even if `category` exists).
   */
  hideCategoryBar?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
}

export interface ScreenRouterConfig {
  screens: ScreenData[];
  placeholders?: Record<string, string>;
  onScreenChange?: (index: number, screenId: string) => void;
  onComplete?: () => void;
  delayForResponseCards?: number;
  /**
   * When enabled, ScreenRouter will:
   * - Read initial screen from the URL hash: `#<screenId>`
   * - Keep the URL hash in sync as screens change
   *
   * Defaults to true.
   */
  syncHash?: boolean;
  /**
   * Controls whether ScreenRouter writes hash changes using:
   * - `replaceState` (default): does not create history entries per screen
   * - `pushState`: creates a history entry per screen so browser back/forward navigates screens
   */
  hashHistory?: "replace" | "push";
  // Called when a screen produces a response (e.g., selection choices)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScreenResponse?: (params: { index: number; screenId: string; response: any }) => void;
}

interface ScreenRouterProps {
  config: ScreenRouterConfig;
}

// ============================================================
// SCREEN ROUTER HOOK - For external state management
// ============================================================
export function useScreenRouter(config: ScreenRouterConfig) {
  const {
    screens,
    onScreenChange,
    onComplete,
    delayForResponseCards = 2000,
    syncHash = true,
    hashHistory = "replace",
  } = config;

  const getHashScreenId = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    const raw = window.location.hash ?? "";
    const trimmed = raw.startsWith("#") ? raw.slice(1) : raw;
    if (!trimmed) return null;
    try {
      return decodeURIComponent(trimmed);
    } catch {
      return trimmed;
    }
  }, []);

  const findScreenIndexById = useCallback(
    (screenId: string): number => screens.findIndex((s) => s.id === screenId),
    [screens],
  );

  const getInitialIndex = useCallback((): number => {
    if (!syncHash) return 0;
    const hashId = getHashScreenId();
    if (!hashId) return 0;
    const idx = findScreenIndexById(hashId);
    return idx >= 0 ? idx : 0;
  }, [findScreenIndexById, getHashScreenId, syncHash]);

  const [currentIndex, setCurrentIndex] = useState<number>(() => getInitialIndex());

  const isLastScreen = currentIndex === screens.length - 1;
  const currentScreen = screens[currentIndex];

  // Ensure index is always in-bounds if screens array changes
  useEffect(() => {
    if (screens.length === 0) return;
    if (currentIndex < 0 || currentIndex >= screens.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, screens.length]);

  // One place to emit onScreenChange without duplicates
  const lastNotifiedKeyRef = useRef<string | null>(null);
  const notifyScreenChange = useCallback(
    (index: number) => {
      const screenId = screens[index]?.id;
      if (!screenId) return;
      const key = `${index}:${screenId}`;
      if (lastNotifiedKeyRef.current === key) return;
      lastNotifiedKeyRef.current = key;
      onScreenChange?.(index, screenId);
    },
    [onScreenChange, screens],
  );

  // Notify initial screen (and any changes that happen outside the navigation helpers)
  useEffect(() => {
    if (screens.length === 0) return;
    notifyScreenChange(currentIndex);
  }, [currentIndex, notifyScreenChange, screens.length]);

  // Keep URL hash in sync with the current screen id
  const isApplyingHistoryNavigationRef = useRef(false);
  useEffect(() => {
    if (!syncHash) return;
    if (typeof window === "undefined") return;
    const screenId = currentScreen?.id;
    if (!screenId) return;
    const encoded = encodeURIComponent(screenId);
    const nextHash = `#${encoded}`;
    if (window.location.hash === nextHash) return;
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;

    // If we're responding to browser navigation (back/forward/manual hash), do NOT write history again.
    if (isApplyingHistoryNavigationRef.current) {
      isApplyingHistoryNavigationRef.current = false;
      return;
    }

    // Avoid trapping the user: if there's no existing hash, always replace (even in push mode).
    const hasExistingHash = (window.location.hash ?? "").length > 1;
    const method: "replaceState" | "pushState" =
      hashHistory === "push" && hasExistingHash ? "pushState" : "replaceState";

    window.history[method](null, "", nextUrl);
  }, [currentScreen?.id, hashHistory, syncHash]);

  // Allow manual hash navigation: `#<screenId>`
  useEffect(() => {
    if (!syncHash) return;
    if (typeof window === "undefined") return;

    const applyHashToIndex = () => {
      const hashId = getHashScreenId();
      if (!hashId) return;
      const idx = findScreenIndexById(hashId);
      if (idx >= 0 && idx !== currentIndex) {
        isApplyingHistoryNavigationRef.current = true;
        setCurrentIndex(idx);
      }
    };

    window.addEventListener("hashchange", applyHashToIndex);
    window.addEventListener("popstate", applyHashToIndex);
    return () => {
      window.removeEventListener("hashchange", applyHashToIndex);
      window.removeEventListener("popstate", applyHashToIndex);
    };
  }, [currentIndex, findScreenIndexById, getHashScreenId, syncHash]);

  const goToNext = useCallback(() => {
    if (isLastScreen) {
      onComplete?.();
    } else {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      notifyScreenChange(newIndex);
    }
  }, [currentIndex, isLastScreen, notifyScreenChange, onComplete]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      notifyScreenChange(newIndex);
    }
  }, [currentIndex, notifyScreenChange]);

  const goToScreen = useCallback((index: number) => {
    if (index >= 0 && index < screens.length) {
      setCurrentIndex(index);
      notifyScreenChange(index);
    }
  }, [notifyScreenChange, screens.length]);

  const goToScreenById = useCallback((screenId: string) => {
    const index = screens.findIndex(s => s.id === screenId);
    if (index !== -1) {
      setCurrentIndex(index);
      notifyScreenChange(index);
    }
  }, [notifyScreenChange, screens]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    notifyScreenChange(0);
  }, [notifyScreenChange]);

  const delayedNext = useCallback(() => {
    setTimeout(() => {
      goToNext();
    }, delayForResponseCards);
  }, [goToNext, delayForResponseCards]);

  return {
    currentIndex,
    currentScreen,
    isLastScreen,
    isFirstScreen: currentIndex === 0,
    totalScreens: screens.length,
    goToNext,
    goToPrevious,
    goToScreen,
    goToScreenById,
    reset,
    delayedNext,
  };
}

// ============================================================
// CONTENT PROCESSOR - Injects callbacks and replaces placeholders
// ============================================================
function processContent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[],
  callbacks: {
    onNext: () => void;
    onDelayedNext: () => void;
  },
  placeholders: Record<string, string> = {},
  isLast: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  const { onNext, onDelayedNext } = callbacks;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return content.map((item: any) => {
    const copy = { ...item };

    // Replace placeholders in src and imageSrc
    if (copy.src && placeholders[copy.src]) {
      copy.src = placeholders[copy.src];
    }
    if (copy.imageSrc && placeholders[copy.imageSrc]) {
      copy.imageSrc = placeholders[copy.imageSrc];
    }

    // Button: add onClick
    // On the last screen, clicking the button triggers onNext which calls onComplete
    if (copy.type === "button") {
      copy.onClick = onNext;
    }

    // Selection: add callbacks
    if (copy.type === "selection") {
      copy.onChange = copy.onChange || (() => {});
      
      // If radio mode with responseCards, add delay so user can read the message
      // If conditionalScreens exist, DO NOT auto-navigate (wait for Continue in conditional screen)
      // Otherwise go to next screen immediately
      const hasResponseCards = copy.responseCards && Object.keys(copy.responseCards).length > 0;
      const hasConditionalScreens = copy.conditionalScreens && Object.keys(copy.conditionalScreens).length > 0;
      const isRadio = copy.mode === "radio";
      
      if (isRadio && hasConditionalScreens) {
        copy.onComplete = () => {};
      } else {
        copy.onComplete = (isRadio && hasResponseCards) ? onDelayedNext : onNext;
      }

      // Process options for placeholders
      if (copy.options) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        copy.options = copy.options.map((o: any) => {
          if (o.imageSrc && placeholders[o.imageSrc]) {
            return { ...o, imageSrc: placeholders[o.imageSrc] };
          }
          return o;
        });
      }

      // Process conditionalScreens recursively
      if (copy.conditionalScreens) {
        for (const key of Object.keys(copy.conditionalScreens)) {
          const cs = copy.conditionalScreens[key];
          if (cs && cs.content) {
            // If conditional screen has NO button, inject default Continue button
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasButton = cs.content.some((item: any) => item?.type === "button");
            if (!hasButton) {
              cs.content = [
                ...cs.content,
                { type: "button", text: isLast ? "Finish" : "Continue" },
              ];
            }

            cs.content = processContent(
              cs.content,
              callbacks,
              placeholders,
              isLast
            );
          }
        }
      }
    }

    // Card info: replace images in content
    if (copy.type === "card" && copy.variant === "info" && copy.content) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      copy.content = copy.content.map((c: any) => {
        if (c.src && placeholders[c.src]) {
          return { ...c, src: placeholders[c.src] };
        }
        return c;
      });
    }

    return copy;
  });
}

// ============================================================
// SCREEN ROUTER COMPONENT
// ============================================================
const ScreenRouter: React.FC<ScreenRouterProps> = ({ config }) => {
  const {
    currentIndex,
    currentScreen,
    isLastScreen,
    goToNext,
    delayedNext,
  } = useScreenRouter(config);

  // Derive ordered category steps from screens (first occurrence wins)
  interface CategoryStep {
    key: string;
    label: string;
  }

  const categorySteps: CategoryStep[] = (() => {
    const seen = new Set<string>();
    const steps: CategoryStep[] = [];

    for (const screen of config.screens) {
      if (!screen.category) continue;
      if (seen.has(screen.category)) continue;

      seen.add(screen.category);

      const normalized = screen.category.replace(/[-_]+/g, " ").trim();
      const label =
        normalized.length === 0
          ? screen.category
          : normalized.charAt(0).toUpperCase() + normalized.slice(1);

      steps.push({
        key: screen.category,
        label,
      });
    }

    return steps;
  })();

  // Active category is based on the current screen's category, if any
  const activeCategoryKey = currentScreen.category;
  const activeCategoryIndex =
    activeCategoryKey != null
      ? categorySteps.findIndex((step) => step.key === activeCategoryKey)
      : -1;

  const activeCategory =
    activeCategoryIndex >= 0 ? categorySteps[activeCategoryIndex] : undefined;

  // Build a map of category -> screen indices for in-category progress math
  const screensByCategory = (() => {
    const map = new Map<string, number[]>();
    config.screens.forEach((screen, index) => {
      if (!screen.category) return;
      const list = map.get(screen.category) ?? [];
      list.push(index);
      map.set(screen.category, list);
    });
    return map;
  })();

  const processedContent = processContent(
    currentScreen.content,
    {
      onNext: goToNext,
      onDelayedNext: delayedNext,
    },
    config.placeholders,
    isLastScreen
  );

  const showLogoHeader = categorySteps.length > 0 && Boolean(currentScreen.category);
  const showCategoryBar = showLogoHeader && !currentScreen.hideCategoryBar;

  // In-category progress (0 at first question in category, 1 at last)
  let inCategoryProgress = 0;
  if (showCategoryBar && activeCategoryKey) {
    const indices = screensByCategory.get(activeCategoryKey) ?? [];
    const total = indices.length;
    const positionInCategory = indices.indexOf(currentIndex);

    if (total <= 1 || positionInCategory === -1) {
      inCategoryProgress = 1;
    } else {
      inCategoryProgress = positionInCategory / (total - 1);
    }
  }

  // Overall bar fill index = previous full categories + in-category fraction
  const categoryFillIndex =
    showCategoryBar && activeCategoryIndex >= 0
      ? activeCategoryIndex + inCategoryProgress
      : 0;

  // This padding ensures the absolute-positioned header (logo + optional category label/bar)
  // never visually overlaps the first content item (e.g. heading), especially on mobile/embedded
  // where `.screen-router-header { top: 8px; }`.
  //
  // Header height calculation:
  // - Logo container: 40px
  // - Gap: 8px
  // - CategoryProgressBar (if shown): 28px (4px + 20px + 4px)
  // - Gap: 8px
  // - Category label (if shown): ~18px (fontSize 11px + line-height)
  // - Additional spacing buffer: 8px
  // Total with category bar: 40 + 8 + 28 + 8 + 18 + 8 = 110px
  // Total without category bar: 40 + 16 = 56px
  const headerPaddingTop = showLogoHeader ? (showCategoryBar ? 110 : 56) : 0;

  return (
    <div className="app-container">
      <section className="screen-section">
        <div
          className="mobile-frame"
          style={{
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* 
            Show the top logo header ONLY when:
            - At least one screen defines a category
            - The current screen itself has a category

            You can hide only the category bar/label for a specific screen with:
            `hideCategoryBar: true`
          */}
          {showLogoHeader && (
            <div
              className="screen-router-header"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                pointerEvents: "none",
              }}
            >
              {/* Logo header (optionally followed by category progress header) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {/* Logo with soft purple glow */}
                <div
                  style={{
                    position: "relative",
                    width: 300,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      filter: "blur(10px)",
                      opacity: 0.9,
                    }}
                  />
                  <img
                    src={logoImage}
                    alt="Logo"
                    style={{
                      position: "relative",
                      height: 36,
                      objectFit: "contain",
                    }}
                  />
                </div>

                {showCategoryBar && (
                  <>
                    {/* Category progress bar */}
                    <CategoryProgressBar
                      categories={categorySteps}
                      activeIndex={activeCategoryIndex}
                      fillIndex={categoryFillIndex}
                    />

                    {/* Active category label (e.g. Profile, Core quiz) */}
                    {activeCategory && (
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                          color: "#6d3be8", // purple
                          textAlign: "center",
                        }}
                      >
                        {activeCategory.label}
                        {/*
                          Future enhancement:
                          " · 1 of N" style progress within the category can be added here
                          using currentIndex + counts per category.
                        */}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {/* Main screen content (layout nearly unchanged; add small top padding when header is present) */}
          <div
            style={{
              height: "100%",
              boxSizing: "border-box",
              paddingTop: headerPaddingTop,
            }}
          >
            <Screens
              key={currentScreen.id}
              content={processedContent}
              screenIndex={currentIndex}
              screenId={currentScreen.id}
              onScreenResponse={
                config.onScreenResponse
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (response: any) =>
                      config.onScreenResponse?.({
                        index: currentIndex,
                        screenId: currentScreen.id,
                        response,
                      })
                  : undefined
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
};

interface CategoryProgressBarProps {
  categories: { key: string; label: string }[];
  activeIndex: number;
  fillIndex: number;
}

function CategoryProgressBar({ categories, activeIndex, fillIndex }: CategoryProgressBarProps) {
  if (categories.length === 0) return null;

  const stepCount = categories.length;
  const maxIndex = Math.max(stepCount - 1, 1);
  const clampedFillIndex = Math.min(Math.max(fillIndex, 0), maxIndex);

  return (
    <div
      style={{
        width: "100%",
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Base track */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 4,
            borderRadius: 999,
            backgroundColor: "#ede9fe",
          }}
        />

        {/* Filled track based on active category */}
        {activeIndex >= 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              width: `${(clampedFillIndex / maxIndex) * 100}%`,
              height: 4,
              borderRadius: 999,
              background: "linear-gradient(90deg, #6d3be8, #6d3be8)",
              transition: "width 200ms ease-out",
            }}
          />
        )}

        {/* Category steps */}
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {categories.map((cat, index) => {
            const isActive = index === activeIndex;
            const isCompleted = activeIndex > index;
            const outerColor = isActive || isCompleted ? "#6d3be8" : "#ddd6fe";
            const innerColor = isActive ? "#6d3be8" : isCompleted ? "#6d3be8" : "#ede9fe";

            return (
              <div
                key={cat.key}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "999px",
                  backgroundColor: outerColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(109,59,232,0.30)"
                    : "none",
                  transition:
                    "background-color 200ms ease-out, box-shadow 200ms ease-out",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "999px",
                    backgroundColor: innerColor,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ScreenRouter;
