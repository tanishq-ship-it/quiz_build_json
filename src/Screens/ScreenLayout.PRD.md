# Screen Layout System PRD

A responsive full-viewport screen layout system for displaying mobile app screens in a preview frame.

---

## Overview

The Screen Layout System provides a fixed, full-viewport container that displays screen components (like `ShowcaseScreen`) inside a responsive mobile frame. The frame adapts its width based on the device viewport while maintaining a mobile-like preview on larger screens.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  .app-container (100vw × 100vh)                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  .screen-section (fixed, 100vw × 100vh, gray bg)      │  │
│  │                                                       │  │
│  │         ┌─────────────────────────┐                   │  │
│  │         │   .mobile-frame         │                   │  │
│  │         │   (responsive width)    │                   │  │
│  │         │                         │                   │  │
│  │         │   [Screen Component]    │                   │  │
│  │         │                         │                   │  │
│  │         └─────────────────────────┘                   │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## CSS Classes

### 1. `.app-container`

The root container that takes full viewport with no scroll.

| Property | Value | Description |
|----------|-------|-------------|
| `width` | `100vw` | Full viewport width |
| `height` | `100vh` / `100dvh` | Full viewport height (dynamic for mobile) |
| `overflow` | `hidden` | No scrolling |
| `margin` | `0` | No margins |
| `padding` | `0` | No padding |

```css
.app-container {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
```

---

### 2. `.screen-section`

The full-viewport section that holds each screen. Uses `position: fixed` to cover entire viewport.

| Property | Value | Description |
|----------|-------|-------------|
| `position` | `fixed` | Fixed to viewport |
| `top` / `left` | `0` | Anchored to top-left |
| `width` | `100vw` | Full viewport width |
| `height` | `100vh` / `100dvh` | Full viewport height |
| `display` | `flex` | Flexbox for centering |
| `align-items` | `center` | Vertical center |
| `justify-content` | `center` | Horizontal center |
| `background-color` | `#e5e5e5` | Gray background |
| `overflow` | `hidden` | No scrolling |

```css
.screen-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e5e5;
  box-sizing: border-box;
  overflow: hidden;
}
```

---

### 3. `.mobile-frame`

The responsive container that holds the screen component. Width changes based on viewport.

| Property | Value | Description |
|----------|-------|-------------|
| `width` | Responsive (see breakpoints) | Width based on device |
| `height` | `80vh` / `80dvh` (desktop) or `100%` (mobile) | Height of frame |
| `overflow` | `hidden` | Content clipped to frame |

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

The mobile frame width adapts to different screen sizes:

| Device | Breakpoint | Frame Width | Frame Height |
|--------|------------|-------------|--------------|
| Desktop (large) | ≥ 1440px | `30vw` | `80vh` |
| Laptop (small) | 1024px - 1439px | `35vw` | `80vh` |
| Tablet | 768px - 1023px | `50vw` | `80vh` |
| Mobile | < 768px | `100%` | `100%` |

### Media Queries

```css
/* Desktop (large): 30% width - default */
.mobile-frame {
  width: 30vw;
  height: 80vh;
}

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

## Visual Representation

### Desktop View (≥ 1440px)
```
┌────────────────────────────────────────────────────────┐
│                     Gray (#e5e5e5)                     │
│                                                        │
│              ┌──────────────────┐                      │
│              │                  │                      │
│              │   Screen (30%)   │  ← 80vh height       │
│              │                  │                      │
│              └──────────────────┘                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Tablet View (768px - 1023px)
```
┌──────────────────────────────────┐
│          Gray (#e5e5e5)          │
│                                  │
│     ┌──────────────────────┐     │
│     │                      │     │
│     │   Screen (50%)       │     │
│     │                      │     │
│     └──────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

### Mobile View (< 768px)
```
┌────────────────────┐
│                    │
│                    │
│   Screen (100%)    │  ← Full viewport
│                    │
│                    │
└────────────────────┘
```

---

## Usage

### Basic Structure (App.tsx)

```tsx
import ShowcaseScreen from "./Screens/ShowcaseScreen";

function App() {
  return (
    <div className="app-container">
      {/* Screen 1 */}
      <section className="screen-section">
        <div className="mobile-frame">
          <ShowcaseScreen
            content={[...]}
            buttonText="Get Started"
          />
        </div>
      </section>
    </div>
  );
}
```

### Adding Multiple Screens

For multiple screens (with navigation/routing), each screen uses the same structure:

```tsx
<div className="app-container">
  {/* Each screen section covers full viewport */}
  {currentScreen === 1 && (
    <section className="screen-section">
      <div className="mobile-frame">
        <ShowcaseScreen content={[...]} />
      </div>
    </section>
  )}
  
  {currentScreen === 2 && (
    <section className="screen-section">
      <div className="mobile-frame">
        <AnotherScreen content={[...]} />
      </div>
    </section>
  )}
</div>
```

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Section Background | `#e5e5e5` | Gray backdrop behind mobile frame |
| Frame Width (Desktop) | `30vw` | Mobile preview width on large screens |
| Frame Width (Laptop) | `35vw` | Mobile preview width on laptops |
| Frame Width (Tablet) | `50vw` | Mobile preview width on tablets |
| Frame Width (Mobile) | `100%` | Full width on mobile devices |
| Frame Height (Desktop) | `80vh` / `80dvh` | Preview height on larger screens |
| Frame Height (Mobile) | `100%` | Full height on mobile devices |

---

## Key Features

1. **Full Viewport Coverage** - Section always covers 100% of viewport
2. **Dynamic Viewport Height** - Uses `dvh` unit for proper mobile browser support
3. **Responsive Mobile Frame** - Width scales from 30% to 100% based on device
4. **No Scroll** - `overflow: hidden` prevents any scrolling
5. **Fixed Position** - Screen section stays fixed, no layout shift
6. **Centered Content** - Mobile frame is always centered in viewport

---

## Files

| File | Purpose |
|------|---------|
| `src/index.css` | Contains `.app-container`, `.screen-section`, `.mobile-frame` classes |
| `src/App.tsx` | Root component using the layout structure |
| `src/Screens/*.tsx` | Screen components rendered inside `.mobile-frame` |

---

## Screen Components

Screen components should:
- Use `height: 100%` to fill the mobile frame
- Have transparent background (inherits from parent)
- Be self-contained with their own content and button

Currently available:
- `ShowcaseScreen` - Flexible content display with heading/image/text + button

---

## Notes

- The `100dvh` (dynamic viewport height) is used alongside `100vh` for mobile browser compatibility
- On mobile devices (< 768px), the gray background is hidden since the frame takes 100%
- Multiple screens should be conditionally rendered, not stacked
- For scrollable multi-screen flows, implement navigation state
