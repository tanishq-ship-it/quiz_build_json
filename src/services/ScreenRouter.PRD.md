# ScreenRouter Service PRD

A service that handles screen navigation, state management, layout structure, and content processing for JSON-driven screen flows.

---

## Overview

The `ScreenRouter` service separates navigation logic from screen data, allowing `App.tsx` to remain a pure JSON data container while the router handles all routing, callbacks, placeholder replacements, and the complete layout structure (app-container, screen-section, mobile-frame).

```tsx
import ScreenRouter, { useScreenRouter } from "./services/ScreenRouter";
import type { ScreenData, ScreenRouterConfig } from "./services/ScreenRouter";
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  SCREENS_JSON: ScreenData[]                              ││
│  │  PLACEHOLDERS: Record<string, string>                    ││
│  │  (Pure data - no callbacks, no layout, no logic)         ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  ScreenRouter                                            ││
│  │  - Renders layout structure (app-container, mobile-frame)││
│  │  - Manages current screen index                          ││
│  │  - Processes content (injects callbacks, placeholders)   ││
│  │  - Handles navigation (next, previous, reset)            ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Screens Component                                       ││
│  │  (Renders processed content inside mobile-frame)         ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Types

### ScreenData

Defines the structure for each screen in the flow.

```tsx
interface ScreenData {
  id: string;              // Unique screen identifier
  category?: string;       // Optional category for organizing/analytics (not used in UI rendering)
  content: ContentItem[];  // Array of content items (see Screens.PRD.md)
}
```

#### Category usage

The `category` field is a **pure metadata label** on each screen:

- It is **not read by `ScreenRouter` or `Screens`** to decide layout, navigation, or scoring.
- It is **passed through unchanged** as part of `ScreenData`, so:
  - `currentScreen.category` is available when you use `useScreenRouter`.
  - You can use it for **analytics, filtering, and management tools**.

Typical use‑cases:

- Grouping screens into high‑level buckets:
  - `"profile"` – demographic / onboarding questions (age, gender, lifestyle).
  - `"core-quiz"` – main quiz/assessment questions that drive results.
  - `"results"` – result, summary and explanation screens.
  - `"completion"` – final thank‑you / CTA screens.
  - `"system"` – error, empty, or technical screens.
- Later, product/ops can:
  - Count how many screens are in each category.
  - Build editors that **filter or sort by category**.
  - Implement flows that **skip or re‑order entire categories** (e.g. skip all `"profile"` for returning users).

**Important:** `category` is optional; existing JSON without a category continues to work exactly the same.

### ScreenRouterConfig

Configuration object for the ScreenRouter.

```tsx
interface ScreenRouterConfig {
  screens: ScreenData[];                              // Required - Array of screens
  placeholders?: Record<string, string>;              // Optional - Placeholder mappings
  onScreenChange?: (index: number, screenId: string) => void;  // Optional - Screen change callback
  onComplete?: () => void;                            // Optional - Quiz completion callback
  delayForResponseCards?: number;                     // Optional - Delay in ms (default: 2000)
}
```

---

## Components

### ScreenRouter Component

The main component that renders the complete quiz layout and handles screen navigation from JSON configuration.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `ScreenRouterConfig` | Yes | Configuration object with screens and options |

**Rendered Structure:**

The ScreenRouter renders the complete layout structure:

```html
<div class="app-container">
  <section class="screen-section">
    <div class="mobile-frame">
      <Screens content={...} />  <!-- Current screen content -->
    </div>
  </section>
</div>
```

| Element | CSS Class | Purpose |
|---------|-----------|---------|
| Outer wrapper | `app-container` | Full-page container |
| Section | `screen-section` | Centering and layout |
| Frame | `mobile-frame` | Mobile device frame styling |

**Example:**

```tsx
// App.tsx - just renders the router with config
function App() {
  return (
    <ScreenRouter
      config={{
        screens: SCREENS_JSON,
        placeholders: { "{{image}}": myImage },
        delayForResponseCards: 2000,
        onScreenChange: (index, screenId) => {
          console.log(`Screen changed to: ${index} (${screenId})`);
        },
        onComplete: () => {
          console.log("Quiz completed!");
        },
      }}
    />
  );
}
```

---

## Hooks

### useScreenRouter

A hook for external state management and custom navigation control.

```tsx
const {
  currentIndex,      // Current screen index
  currentScreen,     // Current ScreenData object
  isLastScreen,      // boolean - true if on last screen
  isFirstScreen,     // boolean - true if on first screen
  totalScreens,      // Total number of screens
  goToNext,          // () => void - Navigate to next screen
  goToPrevious,      // () => void - Navigate to previous screen
  goToScreen,        // (index: number) => void - Jump to specific index
  goToScreenById,    // (screenId: string) => void - Jump to screen by ID
  reset,             // () => void - Go back to first screen
  delayedNext,       // () => void - Navigate after delay
} = useScreenRouter(config);
```

**Example - Custom Navigation UI:**

```tsx
function CustomQuiz() {
  const router = useScreenRouter({
    screens: SCREENS_JSON,
    onComplete: () => alert("Done!"),
  });

  return (
    <div>
      <div className="progress">
        Screen {router.currentIndex + 1} of {router.totalScreens}
      </div>
      
      <Screens content={processedContent} />
      
      <div className="nav-buttons">
        <button onClick={router.goToPrevious} disabled={router.isFirstScreen}>
          Back
        </button>
        <button onClick={router.goToNext}>
          {router.isLastScreen ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
```

---

## Content Processing

The ScreenRouter automatically processes content to inject callbacks and replace placeholders.

### Placeholder Replacement

Placeholders in `src` and `imageSrc` fields are replaced with actual values.

```tsx
// Configuration
placeholders: {
  "{{image}}": "/assets/logo.svg",
  "{{hero}}": "https://example.com/hero.jpg",
}

// In JSON - before processing
{ "type": "image", "src": "{{image}}" }
{ "type": "selection", "options": [{ "imageSrc": "{{hero}}" }] }

// After processing
{ "type": "image", "src": "/assets/logo.svg" }
{ "type": "selection", "options": [{ "imageSrc": "https://example.com/hero.jpg" }] }
```

### Button Callback Injection

Buttons automatically receive `onClick` handlers:

| Screen Position | onClick Action |
|-----------------|----------------|
| Any screen except last | `goToNext()` |
| Last screen | `reset()` |

### Selection Callback Injection

Selection components automatically receive:

| Callback | Injected Action |
|----------|-----------------|
| `onChange` | Empty function (can be overridden) |
| `onComplete` | See table below |

**onComplete Behavior:**

| Mode | Has responseCards? | Action |
|------|--------------------|--------|
| `radio` | Yes | `delayedNext()` (waits for user to read feedback) |
| `radio` | No | `goToNext()` (immediate) |
| `checkbox` | Any | `goToNext()` (immediate) |

---

## Navigation Methods

### goToNext()

Navigates to the next screen. On the last screen, calls `onComplete` if provided.

```tsx
// Behavior
if (isLastScreen) {
  onComplete?.();
} else {
  setCurrentIndex(currentIndex + 1);
  onScreenChange?.(newIndex, screens[newIndex].id);
}
```

### goToPrevious()

Navigates to the previous screen. Does nothing if already on first screen.

```tsx
// Behavior
if (currentIndex > 0) {
  setCurrentIndex(currentIndex - 1);
  onScreenChange?.(newIndex, screens[newIndex].id);
}
```

### goToScreen(index)

Jumps directly to a specific screen by index.

```tsx
goToScreen(3); // Jump to 4th screen (0-indexed)
```

### goToScreenById(screenId)

Jumps directly to a specific screen by its ID.

```tsx
goToScreenById("screen-5-growth-areas");
```

### reset()

Returns to the first screen.

```tsx
// Behavior
setCurrentIndex(0);
onScreenChange?.(0, screens[0].id);
```

### delayedNext()

Navigates to the next screen after the configured delay. Used for response cards so users can read feedback before auto-advancing.

```tsx
// Behavior (default 2000ms delay)
setTimeout(() => {
  goToNext();
}, delayForResponseCards);
```

---

## Examples

### Basic Usage (App.tsx)

The `App.tsx` file becomes a pure data container - just JSON screens and placeholders:

```tsx
import ScreenRouter, { type ScreenData } from "./services/ScreenRouter";
import logoImage from "./assets/logo.svg";

// ============================================================
// SCREENS JSON - Pure JSON definition of all screens
// ============================================================
const SCREENS_JSON: ScreenData[] = [
  {
    id: "screen-1-welcome",
    content: [
      { type: "image", src: "{{logo}}", width: "50%" },
      { type: "heading", content: "Welcome!" },
      { type: "button", text: "Get Started" },
    ],
  },
  {
    id: "screen-2-name",
    content: [
      { type: "heading", content: "What's your name?" },
      { type: "selection", mode: "radio", layout: "3x1", options: [...] },
    ],
  },
  // ... more screens
];

// ============================================================
// PLACEHOLDERS - Map placeholder strings to actual assets
// ============================================================
const PLACEHOLDERS: Record<string, string> = {
  "{{logo}}": logoImage,
};

// ============================================================
// APP - Just renders ScreenRouter with config
// ============================================================
function App() {
  return (
    <ScreenRouter
      config={{
        screens: SCREENS_JSON,
        placeholders: PLACEHOLDERS,
        delayForResponseCards: 2000,
        onScreenChange: (index, screenId) => {
          console.log(`Screen changed to: ${index} (${screenId})`);
        },
        onComplete: () => {
          console.log("Quiz completed!");
        },
      }}
    />
  );
}

export default App;
```

**Key Points:**
- `App.tsx` contains only data (JSON + placeholders)
- No layout divs needed - ScreenRouter handles the complete structure
- All navigation logic is encapsulated in ScreenRouter

### With Analytics Tracking

```tsx
<ScreenRouter
  config={{
    screens: SCREENS_JSON,
    onScreenChange: (index, screenId) => {
      // Track screen view
      analytics.track("screen_view", {
        screen_index: index,
        screen_id: screenId,
      });
    },
    onComplete: () => {
      // Track completion
      analytics.track("quiz_completed");
    },
  }}
/>
```

### Custom Navigation with Hook

```tsx
function QuizWithProgress() {
  const {
    currentIndex,
    totalScreens,
    currentScreen,
    goToNext,
    goToPrevious,
    isFirstScreen,
    isLastScreen,
  } = useScreenRouter({ screens: SCREENS_JSON });

  // Process content manually
  const processedContent = processContent(currentScreen.content, ...);

  return (
    <div>
      {/* Progress bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentIndex + 1) / totalScreens) * 100}%` }}
        />
      </div>

      {/* Screen content */}
      <Screens content={processedContent} />

      {/* Custom navigation */}
      <div className="nav">
        {!isFirstScreen && (
          <button onClick={goToPrevious}>← Back</button>
        )}
        <span>{currentIndex + 1} / {totalScreens}</span>
        <button onClick={goToNext}>
          {isLastScreen ? "Finish" : "Next →"}
        </button>
      </div>
    </div>
  );
}
```

### Branching Navigation

```tsx
function BranchingQuiz() {
  const router = useScreenRouter({ screens: SCREENS_JSON });
  
  const handleSelection = (selected: string[]) => {
    // Jump to different screens based on selection
    if (selected.includes("advanced")) {
      router.goToScreenById("screen-advanced-track");
    } else {
      router.goToScreenById("screen-beginner-track");
    }
  };

  // ... render with custom onChange handlers
}
```

---

## Flow Diagram

```
┌──────────────┐
│   Screen 1   │
│   (gender)   │
└──────┬───────┘
       │ select option → goToNext()
       ▼
┌──────────────┐
│   Screen 2   │
│ (brand trust)│
└──────┬───────┘
       │ click button → goToNext()
       ▼
┌──────────────┐
│   Screen 3   │
│    (age)     │
└──────┬───────┘
       │ select option → goToNext()
       ▼
       ...
       ▼
┌──────────────┐
│  Last Screen │
│ (leadership) │
└──────┬───────┘
       │ select option → delayedNext() → onComplete()
       ▼
   [Quiz Ends]
```

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `screens` | `ScreenData[]` | Required | Array of screen definitions |
| `placeholders` | `Record<string, string>` | `{}` | Map of placeholder strings to actual values |
| `delayForResponseCards` | `number` | `2000` | Delay in ms before auto-advancing after response card |
| `onScreenChange` | `(index, id) => void` | - | Callback when screen changes |
| `onComplete` | `() => void` | - | Callback when quiz is completed |

---

## Best Practices

### 1. Keep JSON Pure

Don't add callbacks or logic to `SCREENS_JSON`. Let ScreenRouter handle all navigation.

```tsx
// ❌ Bad - callbacks in JSON
const SCREENS_JSON = [{
  content: [{ type: "button", onClick: () => navigate() }]
}];

// ✅ Good - pure data, callbacks handled by router
const SCREENS_JSON = [{
  content: [{ type: "button", text: "Continue" }]
}];
```

### 2. Use Screen IDs for Analytics

Screen IDs make analytics and debugging easier.

```tsx
// ✅ Good - descriptive IDs
{ id: "screen-5-growth-areas", content: [...] }
{ id: "screen-12-self-awareness", content: [...] }

// ❌ Bad - generic IDs
{ id: "screen-1", content: [...] }
{ id: "s2", content: [...] }
```

### 3. Use Placeholders for Assets

Keep asset references flexible with placeholders.

```tsx
// ✅ Good - placeholder allows easy swapping
{ type: "image", src: "{{hero}}" }

// Configuration can change without modifying JSON
placeholders: { "{{hero}}": isDarkMode ? darkHero : lightHero }
```

---

## Dependencies

- `Screens` component - Renders the processed content
- React `useState` and `useCallback` hooks
- CSS classes: `app-container`, `screen-section`, `mobile-frame` (defined in `index.css`)

---

## Layout CSS Classes

The ScreenRouter uses these CSS classes for the layout structure:

| Class | Purpose | Defined In |
|-------|---------|------------|
| `app-container` | Full-page wrapper, flexbox centering | `src/index.css` |
| `screen-section` | Quiz section container | `src/index.css` |
| `mobile-frame` | Mobile device frame with shadows/borders | `src/index.css` |

---

## Files

| File | Purpose |
|------|---------|
| `src/services/ScreenRouter.tsx` | Main service (component + hook + layout) |
| `src/services/ScreenRouter.PRD.md` | This documentation |
| `src/services/index.ts` | Exports |
| `src/index.css` | Layout styles (app-container, mobile-frame) |
