# SelectionOptions Component PRD

A flexible selection grid component that supports radio (single-select) and checkbox (multi-select) modes with configurable layouts.

---

## Overview

The `SelectionOptions` component renders a grid of selectable options using the `Button` component variants. It handles selection state internally and supports auto-complete for radio mode.

```tsx
import SelectionOptions from "./Components/SelectionOptions";
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"radio" \| "checkbox"` | required | Single or multi-select |
| `layout` | `"ROWSxCOLS"` | required | Grid layout (e.g., `"3x3"`, `"4x1"`, `"2x2"`) |
| `options` | `OptionItem[]` | required | Array of button options |
| `selectedColor` | `string` | `"#2563eb"` | Border color for selected items |
| `selectedBorderWidth` | `number` | `2` | Border width for selection |
| `gap` | `number` | `8` | Gap between options in pixels |
| `position` | `"top" \| "middle" \| "bottom"` | varies | Where selection appears on screen |
| `labels` | `SelectionLabels` | - | Optional edge labels for rating-style rows (recommended for `"1x5"`). Renders a label under the first and last option. |
| `onChange` | `(selected) => void` | - | Called when selection changes |
| `onComplete` | `(selected) => void` | - | Called for radio auto-complete |
| `autoComplete` | `boolean` | `false` | Enable auto-complete for radio |
| `defaultSelected` | `(string \| number)[]` | `[]` | Pre-selected option IDs |

---

## Position Property

The `position` prop controls where the selection options appear on the screen:

| Position | Description | Default When |
|----------|-------------|--------------|
| `"top"` | Selection stays with heading/text at top | Button exists in content |
| `"middle"` | Selection centered between content and bottom | Never (must be explicit) |
| `"bottom"` | Selection at bottom of screen | No button in content |

**Usage:**
```tsx
{
  type: "selection",
  mode: "radio",
  layout: "1x5",
  position: "middle",  // Explicit position
  options: [...]
}
```

**Default Behavior:**
- If `position` is not specified and there's a **button** → defaults to `"top"`
- If `position` is not specified and there's **no button** → defaults to `"bottom"`

---

## Layout Format

The `layout` prop uses the format `"ROWSxCOLS"`:

| Layout | Grid | Total Options |
|--------|------|---------------|
| `"4x1"` | 4 rows, 1 column | 4 (vertical list) |
| `"2x2"` | 2 rows, 2 columns | 4 (square grid) |
| `"3x3"` | 3 rows, 3 columns | 9 (large grid) |
| `"4x2"` | 4 rows, 2 columns | 8 (tall grid) |
| `"2x3"` | 2 rows, 3 columns | 6 (wide grid) |

---

## Rating Labels (for `layout: "1x5"`)

For rating-style layouts like `"1x5"`, you can provide `labels` to show text under the **first** and **last** option (like “Not like me” → “Just like me”).

### `SelectionLabels` Type

Supported shapes:

- Object form:

```tsx
labels: {
  left: "Not like me",
  right: "Just like me",
}
```

- Object form (styled):

```tsx
labels: {
  left: { text: "Not like me", textColor: "#9ca3af", fontSize: 14, fontWeight: 500 },
  right: { text: "Just like me", textColor: "#9ca3af", fontSize: 14, fontWeight: 500 },
}
```

- Tuple form:

```tsx
labels: [
  { text: "Not like me", textColor: "#9ca3af", fontSize: 14 },
  { text: "Just like me", textColor: "#9ca3af", fontSize: 14 },
]
```

### Notes

- Labels are only rendered for `layout: "1x5"`.
- Prefer `labels`. For backward compatibility, `Screens` also accepts `scaleLabels` as an alias and maps it to `labels`.

## Option Types

Each option must specify a `variant` that matches Button variants:

### Square Option

```tsx
{
  variant: "square";
  character: string;   // Single character
  size?: number;       // Default: 60
  fontWeight?: number; // Optional: overrides square button font weight (default 600)
  fontSize?: number;   // Optional: overrides square button font size (default: size * 0.5)
  id?: string | number;
  value?: string | number;
}
```

### ImageCard Option

```tsx
{
  variant: "imageCard";
  imageSrc: string;
  text: string;           // Empty string = image-only
  width?: number;         // Default: 140
  textAlign?: "left" | "center" | "right";
  textBgColor?: string;
  textColor?: string;
  imageShape?: "none" | "circle";
  imageFill?: boolean;    // Fill entire image area
  id?: string | number;
  value?: string | number;
}
```

### Flat Option

```tsx
{
  variant: "flat";
  text: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";  // Preset size
  width?: number;         // Overrides preset
  height?: number;        // Overrides preset
  textAlign?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
  fontSize?: number;      // Overrides preset
  rightLabel?: string | { text: string; textColor?: string; fontSize?: number; fontWeight?: number };
  id?: string | number;
  value?: string | number;
}
```

#### `rightLabel` (Button Label on the Right)

Use `rightLabel` to render a small label on the **right side** of a flat option (example: “Casual / Regular / Serious / Intense”).

```json
{
  "type": "selection",
  "mode": "radio",
  "layout": "4x1",
  "options": [
    {
      "variant": "flat",
      "text": "👍 5 min/day",
      "rightLabel": { "text": "Casual", "textColor": "#9ca3af", "fontSize": 14 }
    },
    {
      "variant": "flat",
      "text": "👌 10 min/day",
      "rightLabel": { "text": "Regular", "textColor": "#9ca3af", "fontSize": 14 }
    }
  ]
}
```

**Size Presets:**

| Size | Width | Height | Font Size |
|------|-------|--------|-----------|
| `xs` | 120 | 36 | 12 |
| `sm` | 150 | 44 | 14 |
| `md` | 200 | 52 | 16 |
| `lg` | 280 | 60 | 18 |
| `xl` | 340 | 72 | 22 |

**Text Overflow:** Long text is automatically truncated with ellipsis (`...`) to prevent overlap.

---

## Grid Layout & Overflow Prevention

The selection grid uses `minmax(0, 1fr)` columns to prevent buttons from overflowing their cells:

```css
grid-template-columns: repeat(cols, minmax(0, 1fr));
```

This ensures:
- Buttons stay within their grid cells
- Long text is truncated with ellipsis
- No overlap between adjacent buttons

---

## Selection Behavior

### Radio Mode (`mode="radio"`)
- Only **one** option can be selected at a time
- Clicking a new option deselects the previous one
- If `autoComplete` is true, `onComplete` fires immediately on selection

### Checkbox Mode (`mode="checkbox"`)
- **Multiple** options can be selected
- Clicking toggles the option's selection state
- No auto-complete behavior

---

## Auto-Complete Feature

When a screen has **no button** and uses **radio mode**, clicking an option triggers completion:

**Delay Behavior:**
- With `responseCards` → **2 second delay** (so user can read the feedback message)
- Without `responseCards` → **Immediate** (no delay)

```tsx
{
  type: "selection",
  mode: "radio",
  layout: "4x1",
  options: [...],
  onComplete: (selected) => {
    // Navigate to next screen immediately
    goToNextScreen(selected[0]);
  }
}
// No button in content = auto-complete enabled
```

**Rules:**
- Only works with `mode: "radio"`
- Only when `autoComplete: true` (set automatically by Screens when no button)
- Calls `onComplete` callback with the selected option

---

## Response Cards & Screens Features

The `Screens` component supports **two response features** that react dynamically based on selection. These are configured at the `Screens` level, not directly in `SelectionOptions`.

See **Screens.PRD.md** for full documentation.

### responseCards (Inline Cards)

Shows a card on the same screen when an option is selected.

| Prop | Type | Description |
|------|------|-------------|
| `responseCards` | `Record<string \| number, ResponseCard>` | Maps option values to card configs |
| `responsePosition` | `"top" \| "bottom"` | Where to show the card |

```tsx
{
  type: "selection",
  mode: "radio",
  layout: "1x5",
  options: [
    { variant: "square", character: "1", size: 55, value: 1 },
    { variant: "square", character: "2", size: 55, value: 2 },
  ],
  responseCards: {
    1: { variant: "message", message: "😢 Sorry!", bgColor: "#fef2f2" },
    2: { variant: "quotation", quote: "Thanks!", author: "Team" },
  },
  responsePosition: "top",
}
```

### conditionalScreens (Full Screen Replacement)

Replaces the entire screen content when an option is selected. Perfect for branching flows.

| Prop | Type | Description |
|------|------|-------------|
| `responseScreens` | `Record<string \| number, ResponseScreenContent>` | Maps option values to full screen content |

```tsx
{
  type: "selection",
  mode: "radio",
  layout: "1x2",
  options: [
    { variant: "flat", text: "Yes", value: "yes" },
    { variant: "flat", text: "No", value: "no" },
  ],
  conditionalScreens: {
    "yes": {
      content: [
        { type: "heading", content: "Great! 🎉" },
        { type: "card", variant: "info", content: [...] },
        { type: "button", text: "Continue", onClick: () => {} },
      ],
    },
    "no": {
      content: [
        { type: "heading", content: "No problem!" },
        { type: "card", variant: "quotation", quote: "...", author: "..." },
        { type: "button", text: "Maybe Later", onClick: () => {} },
      ],
    },
  },
}
```

### Comparison

| Feature | `responseCards` | `conditionalScreens` |
|---------|-----------------|-------------------|
| **Behavior** | Card appears inline | Entire screen replaced |
| **Content** | Single card | Full screen with multiple items |
| **Use case** | Quick feedback | Branching flows |

**Key:** Add `value` to each option to map it to a response.

---

## Examples

### Age Selection (4x1 Radio - Vertical List)

```tsx
<SelectionOptions
  mode="radio"
  layout="4x1"
  gap={8}
  options={[
    { variant: "flat", text: "18-24", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "25-34", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "35-44", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "45+", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
  ]}
/>
```

### Interest Cards (2x2 Checkbox - Grid)

```tsx
<SelectionOptions
  mode="checkbox"
  layout="2x2"
  gap={10}
  options={[
    { variant: "imageCard", imageSrc: img1, text: "Design", width: 150, textBgColor: "#2563eb", textColor: "#fff", imageFill: true },
    { variant: "imageCard", imageSrc: img2, text: "Code", width: 150, textBgColor: "#10b981", textColor: "#fff", imageFill: true },
    { variant: "imageCard", imageSrc: img3, text: "Music", width: 150, textBgColor: "#f59e0b", textColor: "#fff", imageFill: true },
    { variant: "imageCard", imageSrc: img4, text: "Art", width: 150, textBgColor: "#ef4444", textColor: "#fff", imageFill: true },
  ]}
/>
```

### Quiz Answers (3x3 Radio - Square Buttons)

```tsx
<SelectionOptions
  mode="radio"
  layout="3x3"
  gap={6}
  options={[
    { variant: "square", character: "A", size: 70 },
    { variant: "square", character: "B", size: 70 },
    { variant: "square", character: "C", size: 70 },
    { variant: "square", character: "D", size: 70 },
    { variant: "square", character: "E", size: 70 },
    { variant: "square", character: "F", size: 70 },
    { variant: "square", character: "G", size: 70 },
    { variant: "square", character: "H", size: 70 },
    { variant: "square", character: "I", size: 70 },
  ]}
/>
```

### Growth Areas (4x2 Checkbox - Emoji Pills)

```tsx
<SelectionOptions
  mode="checkbox"
  layout="4x2"
  gap={8}
  options={[
    { variant: "flat", text: "🚀 Leadership", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "🎨 Productivity", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "💼 Career", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "💰 Finance", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "😎 Confidence", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "💕 Relationships", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "🛁 Self-care", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
    { variant: "flat", text: "🤗 Emotions", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
  ]}
/>
```

### Image-Only Gallery (3x3 Checkbox)

```tsx
<SelectionOptions
  mode="checkbox"
  layout="3x3"
  gap={8}
  options={[
    { variant: "imageCard", imageSrc: img1, text: "", width: 100 },
    { variant: "imageCard", imageSrc: img2, text: "", width: 100 },
    { variant: "imageCard", imageSrc: img3, text: "", width: 100 },
    // ... more images
  ]}
/>
```

### Yes/No with Preset Size (1x2 Radio)

```tsx
<SelectionOptions
  mode="radio"
  layout="1x2"
  gap={10}
  options={[
    { variant: "flat", text: "Yes", size: "sm", bgColor: "#fff", textColor: "#333" },
    { variant: "flat", text: "No", size: "sm", bgColor: "#fff", textColor: "#333" },
  ]}
/>
```

---

## Selection Highlight

When an option is selected:
- A colored border appears **directly on the button** (no wrapper gap)
- Border color: `selectedColor` (default: `#2563eb`)
- Border width: `selectedBorderWidth` (default: `2px`)
- Smooth transition: `0.15s ease`

**No orange focus ring** — default browser focus outline is disabled.

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Selection Border | `#2563eb` | Highlight color |
| Default Gap | `8px` | Space between options |
| Border Width | `2px` | Selection border thickness |
| Border Radius (ImageCard/Flat) | `16px` | Rounded wrapper |
| Border Radius (Square) | `8px` | Slight rounding |

---

## Files

| File | Purpose |
|------|---------|
| `src/Components/SelectionOptions.tsx` | Main component |
| `src/Components/Button.tsx` | Renders individual options |
