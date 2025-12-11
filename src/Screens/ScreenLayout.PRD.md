# Screen Layout System PRD

A responsive full-viewport screen layout system for displaying mobile app screens in a scrollable preview.

---

## Overview

The Screen Layout System provides a scrollable container that displays screen components inside responsive mobile frames. Multiple screens stack vertically with scroll-snap for smooth navigation.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  .app-container (100vw, scrollable, snap-y)                 │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  .screen-section (100vh, relative)                    │  │
│  │                                                       │  │
│  │         ┌─────────────────────────┐                   │  │
│  │         │   .mobile-frame         │                   │  │
│  │         │   (responsive width)    │                   │  │
│  │         │   [Screen Component]    │                   │  │
│  │         └─────────────────────────┘                   │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  .screen-section (next screen...)                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## CSS Classes

### 1. `.app-container`

Root container with vertical scrolling and scroll-snap.

| Property | Value | Description |
|----------|-------|-------------|
| `width` | `100vw` | Full viewport width |
| `min-height` | `100vh` / `100dvh` | At least full viewport |
| `overflow-y` | `auto` | Vertical scrolling |
| `overflow-x` | `hidden` | No horizontal scroll |
| `scroll-snap-type` | `y mandatory` | Snap to each screen |

```css
.app-container {
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  scroll-snap-type: y mandatory;
}
```

---

### 2. `.screen-section`

Each full-viewport section that holds a screen.

| Property | Value | Description |
|----------|-------|-------------|
| `position` | `relative` | Normal flow (scrollable) |
| `width` | `100vw` | Full viewport width |
| `height` | `100vh` / `100dvh` | Full viewport height |
| `display` | `flex` | Flexbox for centering |
| `align-items` | `center` | Vertical center |
| `justify-content` | `center` | Horizontal center |
| `background-color` | `#e5e5e5` | Gray background |
| `scroll-snap-align` | `start` | Snap point at top |

```css
.screen-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e5e5;
  box-sizing: border-box;
  overflow: hidden;
  scroll-snap-align: start;
}

/* Alternate background for visual distinction */
.screen-section:nth-child(even) {
  background-color: #f0f0f0;
}
```

---

### 3. `.mobile-frame`

Responsive container holding the screen component.

| Property | Value | Description |
|----------|-------|-------------|
| `width` | Responsive | Based on viewport |
| `height` | `80vh` / `100%` | Frame height |
| `overflow` | `hidden` | Content clipped |

```css
.mobile-frame {
  width: 30vw;
  height: 80vh;
  height: 80dvh;
  overflow: hidden;
}
```

---

## Responsive Breakpoints

| Device | Breakpoint | Frame Width | Frame Height |
|--------|------------|-------------|--------------|
| Desktop (large) | ≥ 1440px | `30vw` | `80vh` |
| Laptop (small) | 1024px - 1439px | `35vw` | `80vh` |
| Tablet | 768px - 1023px | `50vw` | `80vh` |
| Mobile | < 768px | `100%` | `100%` |

```css
/* Laptop (small): 35% width */
@media (max-width: 1439px) {
  .mobile-frame { width: 35vw; }
}

/* Tablet: 50% width */
@media (max-width: 1023px) {
  .mobile-frame { width: 50vw; }
}

/* Mobile: Full width and height */
@media (max-width: 767px) {
  .mobile-frame {
    width: 100%;
    height: 100%;
  }
}
```

---

## Scroll Snap Navigation

The layout uses CSS scroll-snap for smooth full-screen scrolling:

- **Container:** `scroll-snap-type: y mandatory`
- **Each Section:** `scroll-snap-align: start`

**Result:** Scrolling snaps to each screen, one at a time.

---

## Visual Representation

### Desktop View (Multiple Screens)

```
Screen 1 (visible)
┌────────────────────────────────────────────────────────┐
│                     Gray (#e5e5e5)                     │
│              ┌──────────────────┐                      │
│              │   Screen (30%)   │                      │
│              └──────────────────┘                      │
└────────────────────────────────────────────────────────┘
                        ↓ scroll
Screen 2
┌────────────────────────────────────────────────────────┐
│                   Light Gray (#f0f0f0)                 │
│              ┌──────────────────┐                      │
│              │   Screen (30%)   │                      │
│              └──────────────────┘                      │
└────────────────────────────────────────────────────────┘
                        ↓ scroll
Screen 3 ...
```

---

## Usage

### Basic Structure (App.tsx)

```tsx
import Screens from "./Screens/Screens";

function App() {
  return (
    <div className="app-container">
      {/* Screen 1 */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Welcome!" },
              { type: "button", text: "Get Started" },
            ]}
          />
        </div>
      </section>

      {/* Screen 2 */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Select your age" },
              { type: "selection", mode: "radio", layout: "4x1", options: [...] },
            ]}
          />
        </div>
      </section>

      {/* Screen 3 - Card Example */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Words of Wisdom" },
              { type: "card", variant: "quotation", quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
              { type: "button", text: "Continue" },
            ]}
          />
        </div>
      </section>

      {/* More screens... */}
    </div>
  );
}
```

---

## Key Features

1. **Scrollable Screens** — Multiple screens stack vertically
2. **Scroll Snap** — Smooth full-screen transitions
3. **Responsive Frame** — Width scales 30% → 100% based on device
4. **Dynamic Viewport** — Uses `dvh` for mobile browser compatibility
5. **Alternating Backgrounds** — Even screens have slightly different color
6. **No Focus Outline** — Browser focus ring disabled on buttons

---

## Body & Root Styles

```css
body {
  margin: 0;
  padding: 0;
  min-width: 320px;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

#root {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

/* No focus outline on buttons */
button:focus,
button:focus-visible {
  outline: none;
}
```

---

## Files

| File | Purpose |
|------|---------|
| `src/index.css` | Layout classes and responsive styles |
| `src/App.tsx` | Root component with screen sections |
| `src/Screens/Screens.tsx` | Screen component |
