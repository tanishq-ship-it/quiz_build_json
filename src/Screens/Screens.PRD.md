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
  // Response Cards Feature
  responseCards?: Record<string | number, ResponseCard>;  // Map option values to cards
  responsePosition?: "top" | "bottom";  // Default: "top"
}
```

### Response Card Types

Response cards are shown dynamically based on which option is selected. They support all three Card variants:

```tsx
// Quotation Response Card
{
  variant: "quotation";
  quote: string;
  author?: string;
  authorAlign?: "left" | "center" | "right";
  width?: string | number;
  bgColor?: string;
  quoteColor?: string;
  authorColor?: string;
  quoteSymbolColor?: string;
  fontSize?: number;
  authorFontSize?: number;
}

// Message Response Card
{
  variant: "message";
  message: string;              // Supports markdown
  width?: string | number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: "left" | "center" | "right";
}

// Info Response Card
{
  variant: "info";
  content: InfoContentItem[];   // Array of image/text items
  width?: string | number;
  bgColor?: string;
  gap?: number;
  padding?: number;
}
```

### Button Item

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

### Card Item (Quotation)

```tsx
{
  type: "card";
  variant: "quotation";
  quote: string;              // Required - The quote text
  author?: string;            // Author attribution
  authorAlign?: "left" | "center" | "right";  // Default: "left"
  width?: string | number;    // Default: "80%"
  bgColor?: string;           // Default: "#fff"
  quoteColor?: string;        // Default: "#333"
  authorColor?: string;       // Default: "#666"
  quoteSymbolColor?: string;  // Default: "#e5e5e5"
  fontSize?: number;          // Default: 18
  authorFontSize?: number;    // Default: 14
}
```

### Card Item (Message)

```tsx
{
  type: "card";
  variant: "message";
  message: string;            // Required - Markdown text
  width?: string | number;    // Default: "80%"
  bgColor?: string;           // Default: "#fff"
  textColor?: string;         // Default: "#333"
  fontSize?: number;          // Default: 16
  align?: "left" | "center" | "right";  // Default: "left"
}
```

### Card Item (Info)

```tsx
{
  type: "card";
  variant: "info";
  content: InfoContentItem[]; // Required - Array of image/text items
  width?: string | number;    // Default: "80%"
  bgColor?: string;           // Default: "#fff"
  gap?: number;               // Default: 12
  padding?: number;           // Default: 20
}

// InfoContentItem types:
{ type: "image"; src: string; width?: string | number; shape?: "none" | "circle" | "rounded" | "blob"; align?: "left" | "center" | "right"; }
{ type: "text"; content: string; align?: "left" | "center" | "right"; fontSize?: number; color?: string; fontWeight?: number; }
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

### With Button (Selection stays with content)

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
│    │  [Button]       │      │  ← Fixed at BOTTOM
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

### Without Button (Selection moves to bottom)

```
┌─────────────────────────────┐
│         [padding]           │
│                             │
│    ┌─────────────────┐      │
│    │     Content     │      │  ← Aligned to TOP
│    │   (heading,     │      │
│    │    text)        │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │  [Selection]    │      │  ← Fixed at BOTTOM (replaces button)
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

**Key:** 
- With button: Content (including selection) is at top, button pinned to bottom
- **Without button:** Selection automatically moves to bottom position (where button would be)

---

## Response Cards Feature

Response cards allow you to show dynamic content (quotation, message, or info cards) based on which option the user selects. This is perfect for:
- Showing feedback based on rating selections
- Displaying different messages for different quiz answers
- Providing contextual information based on choices

### How It Works

1. Add `value` to each option to identify it
2. Define `responseCards` as a map of option values → card configurations
3. Set `responsePosition` to control where the card appears (`"top"` or `"bottom"`)
4. When user selects an option, the corresponding card appears

### Layout with Response Cards

#### With Button + Response Cards (responsePosition: "bottom")

```
┌─────────────────────────────┐
│        Heading              │
│        Text                 │
│                             │
│   ┌───┐  ┌───┐  ┌───┐      │
│   │ 1 │  │ 2 │  │ 3 │      │  ← Selection Options
│   └───┘  └───┘  └───┘      │
│                             │
│  ┌─────────────────────────┐│
│  │  Response Card appears  ││  ← Card (below options)
│  │  based on selection     ││
│  └─────────────────────────┘│
│                             │
│      ┌──────────────┐       │
│      │    Submit    │       │  ← Button (always at bottom)
│      └──────────────┘       │
└─────────────────────────────┘
```

#### Without Button + Response Cards (responsePosition: "top")

```
┌─────────────────────────────┐
│        Heading              │
│        Text                 │
│                             │
│  ┌─────────────────────────┐│
│  │  Response Card appears  ││  ← Card (above options)
│  │  based on selection     ││
│  └─────────────────────────┘│
│                             │
│   ┌───┐  ┌───┐  ┌───┐      │
│   │ 1 │  │ 2 │  │ 3 │      │  ← Selection (at bottom)
│   └───┘  └───┘  └───┘      │
└─────────────────────────────┘
```

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

### Quotation Card Screen

```tsx
<Screens
  content={[
    { type: "heading", content: "Words of Wisdom" },
    {
      type: "card",
      variant: "quotation",
      quote: "Stay hungry, stay foolish.",
      author: "Steve Jobs",
      authorAlign: "left",
    },
    { type: "button", text: "Continue", onClick: () => {} },
  ]}
/>
```

### Message Card Screen

```tsx
<Screens
  content={[
    { type: "heading", content: "Important" },
    {
      type: "card",
      variant: "message",
      message: "## Welcome! 👋\n\nThis is a **message card** with markdown support.\n\n- ✅ Bold and *italic*\n- ✅ Lists and headings",
      bgColor: "#fef3c7",
    },
    { type: "button", text: "Got it!", onClick: () => {} },
  ]}
/>
```

### Info Card Screen (Profile)

```tsx
<Screens
  content={[
    { type: "heading", content: "Meet Your Guide" },
    {
      type: "card",
      variant: "info",
      content: [
        { type: "image", src: avatarImg, width: "50%", shape: "circle", align: "center" },
        { type: "text", content: "**John Doe**", align: "center", fontSize: 18 },
        { type: "text", content: "Software Engineer", align: "center", color: "#666" },
      ],
    },
    { type: "button", text: "Continue", onClick: () => {} },
  ]}
/>
```

### Rating with Response Cards (No Button, Auto-Complete)

```tsx
<Screens
  content={[
    { type: "heading", content: "Rate your experience" },
    { type: "text", content: "1 = Poor, 5 = Excellent", align: "center", color: "#666" },
    {
      type: "selection",
      mode: "radio",
      layout: "1x5",
      gap: 12,
      options: [
        { variant: "square", character: "1", size: 55, value: 1 },
        { variant: "square", character: "2", size: 55, value: 2 },
        { variant: "square", character: "3", size: 55, value: 3 },
        { variant: "square", character: "4", size: 55, value: 4 },
        { variant: "square", character: "5", size: 55, value: 5 },
      ],
      responseCards: {
        1: { variant: "message", message: "😢 We're sorry! We'll improve.", bgColor: "#fef2f2" },
        2: { variant: "message", message: "🙁 Thanks for your honesty.", bgColor: "#fef3c7" },
        3: { variant: "quotation", quote: "Every journey starts with a single step.", author: "Lao Tzu", bgColor: "#f0fdf4" },
        4: { variant: "message", message: "😊 Glad you had a good experience!", bgColor: "#ecfdf5" },
        5: { variant: "info", bgColor: "#eff6ff", content: [
          { type: "text", content: "🎉 **Perfect Score!**", align: "center", fontSize: 18 },
          { type: "text", content: "Thank you so much!", align: "center", color: "#1d4ed8" },
        ]},
      },
      responsePosition: "top",
      onComplete: (selected) => { /* Navigate to next screen */ },
    },
    // No button - auto-complete on selection
  ]}
/>
```

### Quiz with Response Cards + Button

```tsx
<Screens
  content={[
    { type: "heading", content: "Choose your answer" },
    { type: "text", content: "Pick the correct option", align: "center", color: "#666" },
    {
      type: "selection",
      mode: "radio",
      layout: "3x3",
      gap: 6,
      options: [
        { variant: "square", character: "A", size: 70, value: "A" },
        { variant: "square", character: "B", size: 70, value: "B" },
        { variant: "square", character: "C", size: 70, value: "C" },
        { variant: "square", character: "D", size: 70, value: "D" },
        { variant: "square", character: "E", size: 70, value: "E" },
        { variant: "square", character: "F", size: 70, value: "F" },
        { variant: "square", character: "G", size: 70, value: "G" },
        { variant: "square", character: "H", size: 70, value: "H" },
        { variant: "square", character: "I", size: 70, value: "I" },
      ],
      responseCards: {
        "A": { variant: "message", message: "You selected **A** - First letter!", bgColor: "#dbeafe" },
        "B": { variant: "message", message: "You selected **B** - Good choice!", bgColor: "#dcfce7" },
        "C": { variant: "quotation", quote: "C is for Courage!", author: "Quiz Master", bgColor: "#fef3c7" },
        "D": { variant: "message", message: "**D** - Determined!", bgColor: "#f3e8ff" },
        "E": { variant: "message", message: "**E** - Excellent!", bgColor: "#ecfdf5" },
        "F": { variant: "message", message: "**F** - Fantastic!", bgColor: "#fef2f2" },
        "G": { variant: "message", message: "**G** - Great!", bgColor: "#f0fdf4" },
        "H": { variant: "message", message: "**H** - Heroic!", bgColor: "#eff6ff" },
        "I": { variant: "message", message: "**I** - Incredible!", bgColor: "#fdf4ff" },
      },
      responsePosition: "bottom", // Card appears after options, before button
      onChange: () => {},
    },
    { type: "button", text: "Submit", onClick: () => {} },
  ]}
/>
```

---

## Selection Option Types

See `SelectionOptions.PRD.md` for full option documentation. Quick reference:

| Variant | Key Props |
|---------|-----------|
| `square` | `character`, `size` (number) |
| `imageCard` | `imageSrc`, `text`, `width`, `textBgColor`, `imageFill`, `imageShape` |
| `flat` | `text`, `size` (xs/sm/md/lg/xl), `bgColor`, `textColor`, `textAlign` |

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
- `Card` component (quotation, message, info variants)

---

## Files

| File | Purpose |
|------|---------|
| `src/Screens/Screens.tsx` | Main component |
| `src/Screens/index.ts` | Export |
