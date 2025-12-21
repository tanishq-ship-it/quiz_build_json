import { useState, useCallback } from "react";
import Screens from "../Screens/Screens";
import logoImage from "../assests/logo.png";

// ============================================================
// TYPES
// ============================================================
export interface ScreenData {
  id: string;
  /**
   * Optional category label for this screen.
   * Not used by the UI renderer; useful for organizing/analytics.
   */
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
}

export interface ScreenRouterConfig {
  screens: ScreenData[];
  placeholders?: Record<string, string>;
  onScreenChange?: (index: number, screenId: string) => void;
  onComplete?: () => void;
  delayForResponseCards?: number;
}

interface ScreenRouterProps {
  config: ScreenRouterConfig;
}

// ============================================================
// SCREEN ROUTER HOOK - For external state management
// ============================================================
export function useScreenRouter(config: ScreenRouterConfig) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { screens, onScreenChange, onComplete, delayForResponseCards = 2000 } = config;

  const isLastScreen = currentIndex === screens.length - 1;
  const currentScreen = screens[currentIndex];

  const goToNext = useCallback(() => {
    if (isLastScreen) {
      onComplete?.();
    } else {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onScreenChange?.(newIndex, screens[newIndex].id);
    }
  }, [currentIndex, isLastScreen, screens, onScreenChange, onComplete]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onScreenChange?.(newIndex, screens[newIndex].id);
    }
  }, [currentIndex, screens, onScreenChange]);

  const goToScreen = useCallback((index: number) => {
    if (index >= 0 && index < screens.length) {
      setCurrentIndex(index);
      onScreenChange?.(index, screens[index].id);
    }
  }, [screens, onScreenChange]);

  const goToScreenById = useCallback((screenId: string) => {
    const index = screens.findIndex(s => s.id === screenId);
    if (index !== -1) {
      setCurrentIndex(index);
      onScreenChange?.(index, screenId);
    }
  }, [screens, onScreenChange]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    onScreenChange?.(0, screens[0].id);
  }, [screens, onScreenChange]);

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
    onReset: () => void;
    onDelayedNext: () => void;
  },
  placeholders: Record<string, string> = {},
  isLast: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  const { onNext, onReset, onDelayedNext } = callbacks;

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
    if (copy.type === "button") {
      copy.onClick = isLast ? onReset : onNext;
    }

    // Selection: add callbacks
    if (copy.type === "selection") {
      copy.onChange = copy.onChange || (() => {});
      
      // If radio mode with responseCards, add delay so user can read the message
      // Otherwise go to next screen immediately
      const hasResponseCards = copy.responseCards && Object.keys(copy.responseCards).length > 0;
      const isRadio = copy.mode === "radio";
      copy.onComplete = (isRadio && hasResponseCards) ? onDelayedNext : onNext;

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

      // Process responseScreens recursively
      if (copy.responseScreens) {
        for (const key of Object.keys(copy.responseScreens)) {
          copy.responseScreens[key].content = processContent(
            copy.responseScreens[key].content,
            callbacks,
            placeholders,
            isLast
          );
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
    reset,
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
      onReset: reset,
      onDelayedNext: delayedNext,
    },
    config.placeholders,
    isLastScreen
  );

  const showCategoryHeader = categorySteps.length > 0 && Boolean(currentScreen.category);

  // In-category progress (0 at first question in category, 1 at last)
  let inCategoryProgress = 0;
  if (showCategoryHeader && activeCategoryKey) {
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
    showCategoryHeader && activeCategoryIndex >= 0
      ? activeCategoryIndex + inCategoryProgress
      : 0;

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
            Show logo + category bar ONLY when:
            - At least one screen defines a category
            - The current screen itself has a category
          */}
          {showCategoryHeader && (
            <div
              style={{
                position: "absolute",
                top: -32,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                pointerEvents: "none",
              }}
            >
              {/* Logo + category progress header */}
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
                      background:
                        "radial-gradient(circle at 50% 0%, rgba(167,139,250,0.55), transparent 60%)",
                      filter: "blur(10px)",
                      opacity: 0.9,
                    }}
                  />
                  <img
                    src={logoImage}
                    alt="Logo"
                    style={{
                      position: "relative",
                      height: 26,
                      objectFit: "contain",
                    }}
                  />
                </div>

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
                      color: "#a78bfa", // small purple color
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
              </div>
            </div>
          )}
          {/* Main screen content (layout nearly unchanged; add small top padding when header is present) */}
          <div
            style={{
              height: "100%",
              boxSizing: "border-box",
              paddingTop: showCategoryHeader ? 50 : 0,
            }}
          >
            <Screens key={currentScreen.id} content={processedContent} />
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
            backgroundColor: "#e5edff",
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
              background: "linear-gradient(90deg, #3b82f6, #6366f1)",
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
            const outerColor = isActive || isCompleted ? "#3b82f6" : "#dbe3ff";
            const innerColor = isActive ? "#1d4ed8" : isCompleted ? "#3b82f6" : "#e5edff";

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
                    ? "0 0 0 4px rgba(59,130,246,0.30)"
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
