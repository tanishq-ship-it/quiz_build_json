import { useState, useCallback } from "react";
import Screens from "../Screens/Screens";

// ============================================================
// TYPES
// ============================================================
export interface ScreenData {
  id: string;
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
    currentScreen,
    isLastScreen,
    goToNext,
    reset,
    delayedNext,
  } = useScreenRouter(config);

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

  return (
    <div className="app-container">
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens key={currentScreen.id} content={processedContent} />
        </div>
      </section>
    </div>
  );
};

export default ScreenRouter;
