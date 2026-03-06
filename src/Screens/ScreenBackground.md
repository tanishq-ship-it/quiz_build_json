# Screen Background Reference

Add an optional `background` field to any screen JSON to set its background color or gradient. The background fills the **entire viewport** (not just the mobile frame).

---

## Field Location

```json
{
  "id": "screen-id",
  "background": { ... },
  "content": [...]
}
```

`background` sits at the same level as `id`, `content`, `category`, `gap`, `padding`.

If `background` is **omitted**, the screen uses the default gray background (`#f5f6f8`).

---

## Types

### 1. Solid Color

Single flat color.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `"solid"` | Yes | |
| `color` | `string` | Yes | Any CSS color — hex, rgb, hsl, named |

```json
"background": { "type": "solid", "color": "#1a1a2e" }
```

```json
"background": { "type": "solid", "color": "rgb(26, 26, 46)" }
```

**CSS output:** `background-color: #1a1a2e`

---

### 2. Linear Gradient

Straight-line gradient between 2+ colors.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `"linear-gradient"` | Yes | | |
| `angle` | `number` | No | `180` | Direction in degrees. `0` = bottom-to-top, `90` = left-to-right, `180` = top-to-bottom, `270` = right-to-left |
| `colors` | `string[]` | Yes | | 2 or more CSS colors |
| `stops` | `number[]` | No | evenly spaced | Percentage positions matching each color (0–100) |

**2 colors, top to bottom (default angle):**
```json
"background": {
  "type": "linear-gradient",
  "colors": ["#667eea", "#764ba2"]
}
```

**Diagonal, 3 colors with custom stops:**
```json
"background": {
  "type": "linear-gradient",
  "angle": 135,
  "colors": ["#f093fb", "#f5576c", "#4facfe"],
  "stops": [0, 50, 100]
}
```

**Left to right:**
```json
"background": {
  "type": "linear-gradient",
  "angle": 90,
  "colors": ["#00c6ff", "#0072ff"]
}
```

**CSS output:** `background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)`

---

### 3. Radial Gradient

Circular or elliptical gradient radiating from a point.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `"radial-gradient"` | Yes | | |
| `shape` | `"circle"` or `"ellipse"` | No | `"circle"` | Shape of the gradient |
| `position` | `string` | No | `"center"` | CSS position — `"center"`, `"top left"`, `"50% 30%"`, etc. |
| `colors` | `string[]` | Yes | | 2 or more CSS colors |
| `stops` | `number[]` | No | evenly spaced | Percentage positions (0–100) |

**Circle from center:**
```json
"background": {
  "type": "radial-gradient",
  "colors": ["#ffecd2", "#fcb69f"]
}
```

**Ellipse from top-left, 3 colors:**
```json
"background": {
  "type": "radial-gradient",
  "shape": "ellipse",
  "position": "top left",
  "colors": ["#a18cd1", "#fbc2eb", "#ffffff"],
  "stops": [0, 60, 100]
}
```

**Circle from bottom-right:**
```json
"background": {
  "type": "radial-gradient",
  "shape": "circle",
  "position": "bottom right",
  "colors": ["#ffd89b", "#19547b"]
}
```

**CSS output:** `background: radial-gradient(ellipse at top left, #a18cd1 0%, #fbc2eb 60%, #ffffff 100%)`

---

### 4. Conic Gradient

Color transitions rotated around a center point (like a color wheel or pie chart).

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `"conic-gradient"` | Yes | | |
| `fromAngle` | `number` | No | `0` | Starting angle in degrees |
| `position` | `string` | No | `"center"` | CSS position |
| `colors` | `string[]` | Yes | | 2 or more CSS colors |
| `stops` | `number[]` | No | evenly spaced | Positions in **degrees** (0–360) |

**Color wheel:**
```json
"background": {
  "type": "conic-gradient",
  "colors": ["#ff6b6b", "#feca57", "#48dbfb", "#ff6b6b"],
  "stops": [0, 120, 240, 360]
}
```

**Rotated start, from top-left:**
```json
"background": {
  "type": "conic-gradient",
  "fromAngle": 45,
  "position": "top left",
  "colors": ["#667eea", "#764ba2", "#667eea"]
}
```

**CSS output:** `background: conic-gradient(from 0deg at center, #ff6b6b 0deg, #feca57 120deg, #48dbfb 240deg, #ff6b6b 360deg)`

---

## Angle Reference (for linear-gradient)

```
        0°
        ↑
  315°  |  45°
     \  |  /
270° ←--+-→ 90°
     /  |  \
  225°  |  135°
        ↓
       180°
```

| Angle | Direction |
|-------|-----------|
| `0` | Bottom → Top |
| `45` | Bottom-left → Top-right |
| `90` | Left → Right |
| `135` | Top-left → Bottom-right |
| `180` | Top → Bottom (default) |
| `270` | Right → Left |

---

## Position Reference (for radial/conic)

| Value | Meaning |
|-------|---------|
| `"center"` | Center of the screen (default) |
| `"top"` | Top center |
| `"bottom"` | Bottom center |
| `"left"` | Left center |
| `"right"` | Right center |
| `"top left"` | Top-left corner |
| `"top right"` | Top-right corner |
| `"bottom left"` | Bottom-left corner |
| `"bottom right"` | Bottom-right corner |
| `"50% 30%"` | Custom position (x% y%) |

---

## Full Screen Examples

### Dark solid
```json
{
  "id": "intro",
  "background": { "type": "solid", "color": "#0f0f23" },
  "content": [
    { "type": "heading", "content": "Welcome", "color": "#ffffff" },
    { "type": "button", "text": "Start" }
  ]
}
```

### Sunset gradient
```json
{
  "id": "results",
  "background": {
    "type": "linear-gradient",
    "angle": 135,
    "colors": ["#fa709a", "#fee140"]
  },
  "content": [
    { "type": "heading", "content": "Your Results", "color": "#ffffff" },
    { "type": "text", "content": "Here's what we found.", "color": "#fff8" }
  ]
}
```

### Spotlight effect
```json
{
  "id": "focus",
  "background": {
    "type": "radial-gradient",
    "shape": "circle",
    "position": "center",
    "colors": ["#ffffff", "#e0e0e0", "#9e9e9e"],
    "stops": [0, 50, 100]
  },
  "content": [
    { "type": "heading", "content": "Focus Here" }
  ]
}
```

---

## Where It's Implemented

- **Type definition:** `ScreenRouter.tsx` → `ScreenBackground` type (exported)
- **CSS converter:** `ScreenRouter.tsx` → `screenBackgroundToCSS()` function
- **Applied on:** `ScreenRouter.tsx` → `<section className="screen-section">` inline style
- **Interface:** `ScreenRouter.tsx` → `ScreenData.background` field

The background is applied to `.screen-section` which is the full-viewport container, so it covers the entire screen on desktop, tablet, and mobile.
