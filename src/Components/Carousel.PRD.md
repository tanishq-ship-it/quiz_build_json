# Carousel Component PRD

A versatile carousel component supporting Horizontal Swipe (Snap values) and Vertical Infinite Ticker modes.

---

## Overview

```tsx
import Carousel from "../Components/Carousel";
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `items` | `any[]` | `[]` | Content items to render |
| `itemWidth` | `string \| number` | `"85%"` | Width of cards (Horizontal only) |
| `height` | `string \| number` | `200` | Fixed height (Vertical only) |
| `gap` | `number` | `16` | Gap between slides |
| `autoplay` | `boolean` | `false` | Enables animation |
| `speed` | `number` | `3000` | Duration of 1 loop (Vertical) |
| `showIndicators` | `boolean` | `true` | Show dots (Horizontal only) |

---

## Behavior

### Horizontal (Default)
- **Scroll Snap:** Items snap to center.
- **Peeking:** Default width `85%` lets user see next card.
- **Indicators:** Dots track active index.

### Vertical (Ticker)
- **Infinite Loop:** Content is duplicated to create a seamless infinite scroll.
- **Animation:** CSS keyframes move content up.
- **Styling:** Fade masks at top/bottom for "News Ticker" look.

---

## Usage Examples

### 1. Reviews (Horizontal)
```json
{
  "type": "carousel",
  "direction": "horizontal",
  "itemWidth": "85%",
  "items": [
    { "type": "card", "variant": "quotation", "quote": "..." },
    { "type": "card", "variant": "quotation", "quote": "..." }
  ]
}
```

### 2. Live Feed (Vertical Infinite)
```json
{
  "type": "carousel",
  "direction": "vertical",
  "height": 150,
  "speed": 5000,
  "items": [
    { "type": "text", "content": "Start..." },
    { "type": "text", "content": "End..." }
  ]
}
```
