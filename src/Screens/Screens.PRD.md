# Screens Component PRD

A JSON-driven screen component that renders content items (headings, images, text, selections) with an optional bottom action button.

---

## Overview

The `Screens` component renders an array of content items in the order provided. The button is now **part of the content data** — if included, it renders at the bottom; if not, no button appears.

```tsx
import Screens from "./Screens/Screens";
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ContentItem[]` | required | Array of content items (including button) |
| `gap` | `number` | `16` | Gap between content items |
| `padding` | `number` | `24` | Screen padding |

---

## Content Item Types

### Image Item

```tsx
{
  type: "image";
  src: string;              // Required - Image URL
  alt?: string;
  width?: string | number;  // Default: "80%"
  shape?: "none" | "circle" | "rounded" | "blob";
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  align?: "left" | "center" | "right";
}
```

### Text Item

```tsx
{
  type: "text";
  content: string;          // Markdown supported
  align?: "left" | "center" | "right";
  fontSize?: number;        // Default: 16
  color?: string;           // Default: "#333"
  fontWeight?: number;      // Default: 400
  lineHeight?: number;      // Default: 1.5
}
```

### Heading Item

```tsx
{
  type: "heading";
  content: string;
  align?: "left" | "center" | "right";  // Default: "center"
  fontSize?: number;        // Default: 28
  color?: string;           // Default: "#333"
  fontWeight?: number;      // Default: 700
}
```

### Selection Item

```tsx
{
  type: "selection";
  mode: "radio" | "checkbox";
  layout: `${number}x${number}`;  // e.g., "3x3", "4x1", "2x2"
  options: SelectionOptionItem[];
  selectedColor?: string;         // Default: "#2563eb"
  selectedBorderWidth?: number;   // Default: 2
  gap?: number;                   // Default: 8
  onChange?: (selected: (string | number)[]) => void;
  onComplete?: (selected: (string | number)[]) => void;  // Auto-fires for radio without button
  defaultSelected?: (string | number)[];
}
```

### Button Item (NEW - Data-Driven)

```tsx
{
  type: "button";
  text: string;             // Required - Button label
  onClick?: () => void;
  bgColor?: string;         // Default: "#2563eb"
  textColor?: string;       // Default: "#fff"
  width?: number;           // Default: 300
}
```

---

## Button Behavior

The button is now **part of the content array**, giving full JSON control:

| Content Has Button? | Result |
|---------------------|--------|
| Yes (`type: "button"` in content) | Button renders at bottom |
| No | No button rendered |

### Auto-Complete for Radio (No Button)

When a screen has:
- `type: "selection"` with `mode: "radio"`
- **No** `type: "button"` in content

Then selecting an option **automatically calls `onComplete`**. Perfect for quick single-choice screens.

```tsx
// No button = auto-complete on radio select
content={[
  { type: "heading", content: "What's your age?" },
  {
    type: "selection",
    mode: "radio",
    layout: "4x1",
    options: [...],
    onComplete: (selected) => goToNextScreen()
  }
  // No button here!
]}
```

---

## Layout Structure

```
┌─────────────────────────────┐
│         [padding]           │
│                             │
│    ┌─────────────────┐      │
│    │     Content     │      │  ← Aligned to TOP
│    │   (heading,     │      │
│    │    text,        │      │
│    │    selection)   │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │  [Button]       │      │  ← Fixed at BOTTOM (if exists)
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

**Key:** Content is at the top, button is always pinned to the bottom (using `justify-content: space-between`).

---

## Examples

### Showcase Screen (Images + Text + Button)

```tsx
<Screens
  content={[
    { type: "image", src: heroImg, width: "50%", shape: "rounded" },
    { type: "heading", content: "Welcome to the App!" },
    { type: "text", content: "Start your journey with us.", align: "center", color: "#666" },
    { type: "image", src: iconImg, width: "30%", shape: "circle" },
    { type: "button", text: "Get Started" },
  ]}
/>
```

### Selection Screen (2x2 Image Cards)

```tsx
<Screens
  content={[
    { type: "heading", content: "What interests you?" },
    { type: "text", content: "Select all that apply", align: "center", color: "#666" },
    {
      type: "selection",
      mode: "checkbox",
      layout: "2x2",
      gap: 10,
      options: [
        { variant: "imageCard", imageSrc: img1, text: "Design", width: 150, textBgColor: "#2563eb", textColor: "#fff", imageFill: true },
        { variant: "imageCard", imageSrc: img2, text: "Code", width: 150, textBgColor: "#10b981", textColor: "#fff", imageFill: true },
        { variant: "imageCard", imageSrc: img3, text: "Music", width: 150, textBgColor: "#f59e0b", textColor: "#fff", imageFill: true },
        { variant: "imageCard", imageSrc: img4, text: "Art", width: 150, textBgColor: "#ef4444", textColor: "#fff", imageFill: true },
      ],
    },
    { type: "button", text: "Continue" },
  ]}
/>
```

### Age Selection (Radio, Auto-Complete, No Button)

```tsx
<Screens
  content={[
    { type: "heading", content: "What's your age?" },
    { type: "text", content: "We use this to personalize your experience", align: "center", color: "#666" },
    {
      type: "selection",
      mode: "radio",
      layout: "4x1",
      gap: 8,
      options: [
        { variant: "flat", text: "18-24", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
        { variant: "flat", text: "25-34", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
        { variant: "flat", text: "35-44", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
        { variant: "flat", text: "45+", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
      ],
      onComplete: (selected) => { /* Navigate immediately */ },
    },
    // No button - auto-complete on selection
  ]}
/>
```

### Role Models (3x3 Image Grid)

```tsx
<Screens
  content={[
    { type: "heading", content: "Who stands out to you as a role model?", fontSize: 24 },
    {
      type: "selection",
      mode: "checkbox",
      layout: "3x3",
      gap: 8,
      options: [
        { variant: "imageCard", imageSrc: person1, text: "Person 1", width: 105, imageShape: "circle" },
        { variant: "imageCard", imageSrc: person2, text: "Person 2", width: 105, imageShape: "circle" },
        // ... 7 more
      ],
    },
    { type: "button", text: "Continue" },
  ]}
/>
```

### Image-Only Gallery (3x3, No Text Labels)

```tsx
<Screens
  content={[
    { type: "heading", content: "Pick your favorites", fontSize: 24 },
    { type: "text", content: "Select the images you like", align: "center", color: "#666" },
    {
      type: "selection",
      mode: "checkbox",
      layout: "3x3",
      gap: 8,
      options: [
        { variant: "imageCard", imageSrc: img1, text: "", width: 100 },
        { variant: "imageCard", imageSrc: img2, text: "", width: 100 },
        // ... 7 more (text: "" makes them image-only squares)
      ],
    },
    { type: "button", text: "Continue" },
  ]}
/>
```

---

## Selection Option Types

See `SelectionOptions.PRD.md` for full option documentation. Quick reference:

| Variant | Key Props |
|---------|-----------|
| `square` | `character`, `size` |
| `imageCard` | `imageSrc`, `text`, `width`, `textBgColor`, `imageFill`, `imageShape` |
| `flat` | `text`, `width`, `bgColor`, `textColor`, `textAlign` |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Default Gap | `16px` | Between content items |
| Default Padding | `24px` | Screen edges |
| Max Content Width | `500px` | Content area limit |
| Button Default Width | `300px` | CTA button |
| Selection Border | `#2563eb` | Selected option highlight |

---

## Dependencies

- `Image` component
- `Text` component (markdown support)
- `Button` component
- `SelectionOptions` component

---

## Files

| File | Purpose |
|------|---------|
| `src/Screens/Screens.tsx` | Main component |
| `src/Screens/index.ts` | Export |
